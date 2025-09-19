import { useQuestManager } from '../hooks/useQuestManager';
import { useAuth } from '../hooks/useAuth';
import { firestoreService, QuestWithDefinition } from '../services/firestoreService';
import { ClipboardList, Check, Award } from 'lucide-react';
import { motion } from 'framer-motion';

const QuestCard = ({ quest, onClaim }: { quest: QuestWithDefinition, onClaim: (quest: QuestWithDefinition) => void }) => {
  const progressPercentage = quest.progress * 100;

  return (
    <motion.div
      className={`card flex flex-col space-y-4 animate-enter p-4 rounded-lg backdrop-blur-sm ${
        quest.completed ? 'bg-green-500/10 border-2 border-green-500' : 'bg-white/10 border-2 border-transparent'
      }`}
      whileHover={{ scale: 1.02,
        borderColor: quest.completed ? '#22c55e' : '#ffcc00'
       }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-center space-x-4">
        <div className="relative">
          <ClipboardList
            className={`w-12 h-12 transition-colors duration-500 ${
              quest.completed ? 'text-green-400' : 'text-trivia-gold'
            }`}
          />
          {quest.completed && (
            <div className="absolute -top-2 -right-2 bg-green-500 rounded-full p-1">
              <Check className="w-4 h-4 text-white" />
            </div>
          )}
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">{quest.definition.name}</h3>
          <p className="text-trivia-gray-light">{quest.definition.description}</p>
        </div>
      </div>
      <div className="w-full bg-gray-700/50 rounded-full h-2.5">
        <div
          className="bg-trivia-neon h-2.5 rounded-full"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
      {quest.completed && !quest.claimed && (
        <motion.button
          onClick={() => onClaim(quest)}
          className="flex items-center justify-center px-4 py-2 bg-trivia-gold text-black font-bold rounded-md"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        >
          <Award className="w-5 h-5 mr-2" />
          Claim Reward (+{quest.definition.reward} points)
        </motion.button>
      )}
      {quest.claimed && (
        <p className="text-center text-gray-400">Reward Claimed</p>
      )}
    </motion.div>
  );
};


const Quests = () => {
  const { quests, loading } = useQuestManager();
  const { currentUser } = useAuth();

  const handleClaimReward = async (quest: QuestWithDefinition) => {
    if (!currentUser) return;
    await firestoreService.claimQuestReward(currentUser.uid, quest);
  };

  const groupedQuests = quests.reduce((acc, quest) => {
    const category = quest.definition.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(quest);
    return acc;
  }, {} as { [key: string]: QuestWithDefinition[] });

  if (loading) {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <div className="w-12 h-12 border-4 border-trivia-neon border-t-transparent rounded-full mx-auto mb-4 animate-spin" />
                <p className="text-white text-xl font-semibold">Loading Quests...</p>
            </div>
        </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto mt-10 p-4">
      <h2 className="text-4xl font-bold text-trivia-gold mb-6 animate-pulse-glow">Quests</h2>
      {Object.entries(groupedQuests).map(([category, questsInCategory]) => (
        <div key={category} className="mb-10">
          <h3 className="text-2xl font-bold text-white mb-4">{category}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {questsInCategory.map((quest) => (
              <QuestCard key={quest.questId} quest={quest} onClaim={handleClaimReward} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Quests;
