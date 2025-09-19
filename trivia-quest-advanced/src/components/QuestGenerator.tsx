import { useState, useEffect } from 'react';
import { Calendar, Clock, Trophy, Star, ChevronRight, RefreshCw, CheckCircle, Timer, TrendingUp, Sparkles } from 'lucide-react';
import { useQuestManager } from '../hooks/useQuestManager';
import { Quest, UserStats } from '../services/firestoreService';
import { useQuiz } from '../context/QuizContext'; // Import useQuiz

interface DisplayQuest {
  questId: string;
  progress: number;
  completed: boolean;
  definition: Quest & { type: string; reward: number; };
}

// Quest type definitions
const QUEST_TYPES = {
  DAILY: 'daily',
  WEEKLY: 'weekly',
  MONTHLY: 'monthly'
};

const DIFFICULTY = {
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard'
};

// Quest templates for generation
const QUEST_TEMPLATES = {
  [QUEST_TYPES.DAILY]: {
    [DIFFICULTY.EASY]: [
      { name: 'Quick Learner', description: 'Answer {count} questions correctly', target: 5, points: 50, icon: '🎯', type: QUEST_TYPES.DAILY, difficulty: DIFFICULTY.EASY, conditions: [{ stat: 'correctAnswers', operator: '>=', value: 5 }] },
      { name: 'Planet Visitor', description: 'Visit {count} different planets', target: 2, points: 30, icon: '🪐', type: QUEST_TYPES.DAILY, difficulty: DIFFICULTY.EASY, conditions: [{ stat: 'totalQuizzes', operator: '>=', value: 2 }] },
      { name: 'Streak Starter', description: 'Get a {count} answer streak', target: 3, points: 40, icon: '⚡', type: QUEST_TYPES.DAILY, difficulty: DIFFICULTY.EASY, conditions: [{ stat: 'longestStreak', operator: '>=', value: 3 }] },
      { name: 'Category Explorer', description: 'Play {count} different categories', target: 2, points: 35, icon: '🗂️', type: QUEST_TYPES.DAILY, difficulty: DIFFICULTY.EASY, conditions: [{ stat: 'totalQuizzes', operator: '>=', value: 2 }] }
    ],
    [DIFFICULTY.MEDIUM]: [
      { name: 'Knowledge Seeker', description: 'Score {count} points in a single game', target: 200, points: 100, icon: '📚', type: QUEST_TYPES.DAILY, difficulty: DIFFICULTY.MEDIUM, conditions: [{ stat: 'bestScore', operator: '>=', value: 200 }] },
      { name: 'Speed Runner', description: 'Complete {count} quizzes in under 2 minutes', target: 3, points: 120, icon: '⏱️', type: QUEST_TYPES.DAILY, difficulty: DIFFICULTY.MEDIUM, conditions: [{ stat: 'totalQuizzes', operator: '>=', value: 3 }] },
      { name: 'Perfect Round', description: 'Get {count}% accuracy in a quiz', target: 80, points: 110, icon: '✨', type: QUEST_TYPES.DAILY, difficulty: DIFFICULTY.MEDIUM, conditions: [{ stat: 'averageAccuracy', operator: '>=', value: 80 }] },
      { name: 'Multi-Tasker', description: 'Complete quests on {count} planets', target: 3, points: 90, icon: '🌌', type: QUEST_TYPES.DAILY, difficulty: DIFFICULTY.MEDIUM, conditions: [{ stat: 'totalQuizzes', operator: '>=', value: 3 }] }
    ],
    [DIFFICULTY.HARD]: [
      { name: 'Master Mind', description: 'Answer {count} hard questions correctly', target: 10, points: 200, icon: '🧠', type: QUEST_TYPES.DAILY, difficulty: DIFFICULTY.HARD, conditions: [{ stat: 'correctAnswers', operator: '>=', value: 10 }] },
      { name: 'Flawless Victory', description: 'Complete {count} perfect games', target: 2, points: 250, icon: '💎', type: QUEST_TYPES.DAILY, difficulty: DIFFICULTY.HARD, conditions: [{ stat: 'totalQuizzes', operator: '>=', value: 2 }] },
      { name: 'Marathon Runner', description: 'Play for {count} minutes straight', target: 30, points: 220, icon: '🏃', type: QUEST_TYPES.DAILY, difficulty: DIFFICULTY.HARD, conditions: [{ stat: 'totalQuizzes', operator: '>=', value: 1 }] },
      { name: 'Elite Performer', description: 'Achieve top {count} on leaderboard', target: 10, points: 300, icon: '🏆', type: QUEST_TYPES.DAILY, difficulty: DIFFICULTY.HARD, conditions: [{ stat: 'totalScore', operator: '>=', value: 1000 }] }
    ]
  },

  [QUEST_TYPES.WEEKLY]: {
    [DIFFICULTY.EASY]: [
      { name: 'Consistent Player', description: 'Play on {count} different days', target: 4, points: 200, icon: '📅', type: QUEST_TYPES.WEEKLY, difficulty: DIFFICULTY.EASY, conditions: [{ stat: 'totalQuizzes', operator: '>=', value: 4 }] },
      { name: 'Solar Explorer', description: 'Visit all {count} planets', target: 7, points: 250, icon: '🚀', type: QUEST_TYPES.WEEKLY, difficulty: DIFFICULTY.EASY, conditions: [{ stat: 'totalQuizzes', operator: '>=', value: 7 }] },
      { name: 'Knowledge Builder', description: 'Answer {count} questions', target: 50, points: 180, icon: '📊', type: QUEST_TYPES.WEEKLY, difficulty: DIFFICULTY.EASY, conditions: [{ stat: 'correctAnswers', operator: '>=', value: 50 }] }
    ],
    [DIFFICULTY.MEDIUM]: [
      { name: 'Weekly Champion', description: 'Score {count} total points', target: 2000, points: 500, icon: '🌟', type: QUEST_TYPES.WEEKLY, difficulty: DIFFICULTY.MEDIUM, conditions: [{ stat: 'totalScore', operator: '>=', value: 2000 }] },
      { name: 'Category Master', description: 'Complete {count} different categories', target: 10, points: 450, icon: '🎓', type: QUEST_TYPES.WEEKLY, difficulty: DIFFICULTY.MEDIUM, conditions: [{ stat: 'totalQuizzes', operator: '>=', value: 10 }] },
      { name: 'Streak Master', description: 'Maintain a {count} day streak', target: 5, points: 400, icon: '🔥', type: QUEST_TYPES.WEEKLY, difficulty: DIFFICULTY.MEDIUM, conditions: [{ stat: 'longestStreak', operator: '>=', value: 5 }] }
    ],
    [DIFFICULTY.HARD]: [
      { name: 'Weekly Legend', description: 'Score {count} points without errors', target: 1000, points: 800, icon: '⚔️', type: QUEST_TYPES.WEEKLY, difficulty: DIFFICULTY.HARD, conditions: [{ stat: 'totalScore', operator: '>=', value: 1000 }] },
      { name: 'Perfectionist', description: 'Get {count}% average accuracy', target: 90, points: 750, icon: '🎯', type: QUEST_TYPES.WEEKLY, difficulty: DIFFICULTY.HARD, conditions: [{ stat: 'averageAccuracy', operator: '>=', value: 90 }] },
      { name: 'Speed Demon', description: 'Complete {count} speed runs', target: 15, points: 700, icon: '💨', type: QUEST_TYPES.WEEKLY, difficulty: DIFFICULTY.HARD, conditions: [{ stat: 'totalQuizzes', operator: '>=', value: 15 }] }
    ]
  },
  [QUEST_TYPES.MONTHLY]: {
    [DIFFICULTY.EASY]: [
      { name: 'Monthly Regular', description: 'Play on {count} days', target: 15, points: 500, icon: '🌙', type: QUEST_TYPES.MONTHLY, difficulty: DIFFICULTY.EASY, conditions: [{ stat: 'totalQuizzes', operator: '>=', value: 15 }] },
      { name: 'Galactic Tourist', description: 'Complete {count} planet quests', target: 20, points: 600, icon: '🛸', type: QUEST_TYPES.MONTHLY, difficulty: DIFFICULTY.EASY, conditions: [{ stat: 'totalQuizzes', operator: '>=', value: 20 }] }
    ],
    [DIFFICULTY.MEDIUM]: [
      { name: 'Monthly Achiever', description: 'Earn {count} achievements', target: 10, points: 1200, icon: '🏅', type: QUEST_TYPES.MONTHLY, difficulty: DIFFICULTY.MEDIUM, conditions: [{ stat: 'totalQuizzes', operator: '>=', value: 10 }] },
      { name: 'Point Collector', description: 'Score {count} total points', target: 10000, points: 1500, icon: '💰', type: QUEST_TYPES.MONTHLY, difficulty: DIFFICULTY.MEDIUM, conditions: [{ stat: 'totalScore', operator: '>=', value: 10000 }] }
    ],
    [DIFFICULTY.HARD]: [
      { name: 'Ultimate Champion', description: 'Reach rank {count} globally', target: 100, points: 3000, icon: '👑', type: QUEST_TYPES.MONTHLY, difficulty: DIFFICULTY.HARD, conditions: [{ stat: 'totalScore', operator: '>=', value: 100 }] },
      { name: 'Grand Master', description: 'Complete {count} perfect games', target: 25, points: 2500, icon: '🌠', type: QUEST_TYPES.MONTHLY, difficulty: DIFFICULTY.HARD, conditions: [{ stat: 'totalQuizzes', operator: '>=', value: 25 }] }
    ]
  }
};

const QuestGenerator = () => {
  const { quests, addGeneratedQuest } = useQuestManager();
  const [selectedType, setSelectedType] = useState(QUEST_TYPES.DAILY);
  const [generatedQuests, setGeneratedQuests] = useState<Record<string, Record<string, Quest & { icon: string; points: number; }>>>({});
  const [refreshing, setRefreshing] = useState(false);
  const [selectedQuest, setSelectedQuest] = useState<string | null>(null);

  // Generate random quests for each difficulty
  const generateQuests = (type: string): Record<string, Quest & { icon: string; points: number; }> => {
    const quests: Record<string, Quest & { icon: string; points: number; }> = {};
    Object.values(DIFFICULTY).forEach((diff) => {
      const templates = QUEST_TEMPLATES[type][diff];
      const randomIndex = Math.floor(Math.random() * templates.length);
      const template = templates[randomIndex];
      
      // Add some randomization to the target
      const variance = diff === DIFFICULTY.EASY ? 0.8 : diff === DIFFICULTY.MEDIUM ? 0.9 : 1;
      const adjustedTarget = Math.ceil(template.target * (variance + Math.random() * 0.2));
      
      quests[diff] = {
        ...template,
        id: `${type}-${diff}-${Date.now()}-${Math.random()}`,
        name: template.name,
        description: template.description.replace('{count}', String(adjustedTarget)),
        difficulty: diff as 'easy' | 'medium' | 'hard',
        type: type as 'daily' | 'weekly' | 'monthly',
        conditions: 'conditions' in template && template.conditions ? (template.conditions as { stat: keyof UserStats; operator: '>=' | '<=' | '=='; value: number; }[]).map(c => ({...c, value: adjustedTarget})) : [],
        category: '',
        theme: '',
        reward: template.points,
      };
    });
    return quests;
  };

  // Initialize quests
  useEffect(() => {
    const allQuests: Record<string, Record<string, Quest & { icon: string; points: number; }>> = {};
    Object.values(QUEST_TYPES).forEach((type: string) => {
      allQuests[type] = generateQuests(type);
    });
    setGeneratedQuests(allQuests);
  }, []);

  // Refresh quests
  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setGeneratedQuests((prev) => ({
        ...prev,
        [selectedType]: generateQuests(selectedType)
      }));
      setRefreshing(false);
    }, 500);
  };

  // Get time remaining for quest type
  const getTimeRemaining = (type: string) => {
    const now = new Date();
    let endTime = new Date();
    
    switch(type) {
      case QUEST_TYPES.DAILY:
        endTime.setHours(24, 0, 0, 0);
        break;
      case QUEST_TYPES.WEEKLY: {
        const daysUntilSunday = 7 - now.getDay();
        endTime.setDate(now.getDate() + daysUntilSunday);
        endTime.setHours(0, 0, 0, 0);
        break;
      }
      case QUEST_TYPES.MONTHLY:
        endTime = new Date(now.getFullYear(), now.getMonth() + 1, 1);
        break;
    }
    
    const diff = endTime.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days}d ${hours % 24}h`;
    }
    return `${hours}h ${minutes}m`;
  };

  const typeConfig = {
    [QUEST_TYPES.DAILY]: { icon: Calendar, color: 'from-blue-500 to-cyan-500', bgGlow: 'bg-blue-500/20' },
    [QUEST_TYPES.WEEKLY]: { icon: Clock, color: 'from-purple-500 to-pink-500', bgGlow: 'bg-purple-500/20' },
    [QUEST_TYPES.MONTHLY]: { icon: Trophy, color: 'from-amber-500 to-orange-500', bgGlow: 'bg-amber-500/20' }
  };

  const difficultyConfig = {
    [DIFFICULTY.EASY]: { color: 'from-green-400 to-emerald-500', border: 'border-green-500/30', glow: 'shadow-green-500/20', multiplier: 1 },
    [DIFFICULTY.MEDIUM]: { color: 'from-blue-400 to-indigo-500', border: 'border-blue-500/30', glow: 'shadow-blue-500/20', multiplier: 1.5 },
    [DIFFICULTY.HARD]: { color: 'from-red-400 to-rose-600', border: 'border-red-500/30', glow: 'shadow-red-500/20', multiplier: 2 }
  };

  const currentQuests = generatedQuests[selectedType] || {};

  const handleStartQuest = (quest: Quest & { icon: string; points: number; }) => {
    const questForDb: Quest = {
      id: quest.id,
      name: quest.name,
      description: quest.description,
      category: '',
      theme: '',
      type: quest.type,
      difficulty: quest.difficulty,
      conditions: quest.conditions,
      reward: quest.reward,
    };
    addGeneratedQuest(questForDb);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse animation-delay-4000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 mb-4 animate-pulse">
            Quest Generator
          </h1>
          <p className="text-gray-300 text-lg">Complete quests to earn points and climb the leaderboard</p>
        </div>

        {/* Quest Type Selector */}
        <div className="flex justify-center gap-4 mb-8">
          {Object.entries(typeConfig).map(([type, config]) => {
            const Icon = config.icon;
            const isSelected = selectedType === type;
            return (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`relative group px-6 py-4 rounded-2xl transition-all duration-300 transform hover:scale-105 ${
                  isSelected 
                    ? `bg-gradient-to-r ${config.color} text-white shadow-2xl scale-105` 
                    : 'bg-gray-800/50 backdrop-blur-sm text-gray-300 hover:bg-gray-700/50'
                }`}
              >
                {isSelected && (
                  <div className={`absolute inset-0 rounded-2xl ${config.bgGlow} blur-xl`}></div>
                )}
                <div className="relative flex items-center gap-3">
                  <Icon className="w-6 h-6" />
                  <div className="text-left">
                    <div className="font-semibold capitalize">{type}</div>
                    <div className="text-xs opacity-75 flex items-center gap-1">
                      <Timer className="w-3 h-3" />
                      {getTimeRemaining(type)}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Refresh Button */}
        <div className="flex justify-end mb-6">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 flex items-center gap-2 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh Quests
          </button>
        </div>

        {/* Quest Cards Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {Object.entries(DIFFICULTY).map(([_key, diff]) => {
            const quest = currentQuests[diff];
            const config = difficultyConfig[diff];
            if (!quest) return null;
            const activeQuest = quests.find((q: DisplayQuest) => q.questId === quest.id);
            const isCompleted = activeQuest?.completed;
            const progress = activeQuest?.progress || 0;
            
            return (
              <div
                key={quest.id}
                className={`relative group ${refreshing ? 'animate-pulse' : ''}`}
                onMouseEnter={() => setSelectedQuest(quest.id)}
                onMouseLeave={() => setSelectedQuest(null)}
              >
                {/* Glow effect */}
                <div className={`absolute inset-0 bg-gradient-to-r ${config.color} opacity-20 blur-xl rounded-3xl transition-all duration-300 ${
                  selectedQuest === quest.id ? 'opacity-40 scale-110' : ''
                }`}></div>
                
                {/* Card */}
                <div className={`relative bg-gray-900/80 backdrop-blur-sm border ${config.border} rounded-2xl p-6 transition-all duration-300 transform ${
                  selectedQuest === quest.id ? 'scale-105 shadow-2xl' : ''
                } ${isCompleted ? 'opacity-75' : ''}`}>
                  
                  {/* Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`text-3xl ${selectedQuest === quest.id ? 'animate-bounce' : ''}`}>
                        {quest.icon}
                      </div>
                      <div>
                        <div className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${config.color} text-white uppercase`}>
                          {diff}
                        </div>
                      </div>
                    </div>
                    {isCompleted && (
                      <CheckCircle className="w-6 h-6 text-green-400 animate-pulse" />
                    )}
                  </div>

                  {/* Quest Info */}
                  <h3 className="text-xl font-bold text-white mb-2">{quest.name}</h3>
                  <p className="text-gray-400 text-sm mb-4">{quest.description}</p>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                      <span>Progress</span>
                      <span>{Math.floor(progress * 100)}%</span>
                    </div>
                    <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${config.color} transition-all duration-500 relative overflow-hidden`}
                        style={{ width: `${Math.min(progress * 100, 100)}%` }}
                      >
                        <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                      </div>
                    </div>
                  </div>

                  {/* Points & Multiplier */}
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-400" />
                      <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
                        {quest.points}
                      </span>
                      <span className="text-gray-400 text-sm">pts</span>
                    </div>
                    {config.multiplier > 1 && (
                      <div className="flex items-center gap-1 text-sm">
                        <TrendingUp className="w-4 h-4 text-purple-400" />
                        <span className="text-purple-400 font-semibold">{config.multiplier}x</span>
                      </div>
                    )}
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => !activeQuest && handleStartQuest(quest)}
                    disabled={!!activeQuest}
                    className={`mt-4 w-full py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                      isCompleted
                        ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                        : activeQuest ? 'bg-gray-500 text-gray-300 cursor-not-allowed' : `bg-gradient-to-r ${config.color} text-white hover:shadow-lg transform hover:scale-105`
                    }`}
                  >
                    {isCompleted ? (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        Completed
                      </>
                    ) : activeQuest ? (
                        <>
                          Quest Started
                        </>
                    ) : (
                      <>
                        Start Quest
                        <ChevronRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>

                {/* Sparkle effects on hover */}
                {selectedQuest === quest.id && !isCompleted && (
                  <>
                    <Sparkles className="absolute top-2 right-2 w-4 h-4 text-yellow-300 animate-pulse" />
                    <Sparkles className="absolute bottom-2 left-2 w-4 h-4 text-cyan-300 animate-pulse animation-delay-200" />
                  </>
                )}
              </div>
            );
          })}
        </div>

        {/* Stats Summary */}
        <div className="mt-10 bg-gradient-to-r from-purple-900/50 to-pink-900/50 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/20">
          <div className="grid grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                {quests.filter((q: DisplayQuest) => q.completed).length}
              </div>
              <div className="text-gray-400 text-sm">Completed</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                {quests.reduce((sum: number, q: DisplayQuest) => sum + (q.completed ? q.definition.reward : 0), 0)}
              </div>
              <div className="text-gray-400 text-sm">Points Earned</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">
                {Object.keys(currentQuests).length - quests.filter((q: DisplayQuest) => q.completed && q.definition.type === selectedType).length}
              </div>
              <div className="text-gray-400 text-sm">Available</div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes animation-delay-200 {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        @keyframes animation-delay-2000 {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.1; }
        }
        
        @keyframes animation-delay-4000 {
          0%, 100% { opacity: 0.1; }
          50% { opacity: 0.05; }
        }

        .animation-delay-200 {
          animation-delay: 200ms;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default QuestGenerator;