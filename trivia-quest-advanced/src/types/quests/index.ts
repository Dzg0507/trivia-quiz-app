// Quest Types
export interface Quest {
  id: string;
  name: string;
  description: string;
  category: string;
  theme: string;
  type: 'daily' | 'weekly' | 'monthly' | 'main';
  difficulty: 'easy' | 'medium' | 'hard';
  conditions: QuestCondition[];
  reward: number;
  planetName?: string;
  position?: [number, number, number];
  completed?: boolean;
  progress?: number;
}

export interface QuestCondition {
  stat: 'totalQuizzes' | 'totalScore' | 'bestScore' | 'averageAccuracy' | 'longestStreak' | 'correctAnswers';
  operator: '>=' | '<=' | '==';
  value: number;
}

export interface UserQuest {
  questId: string;
  progress: number;
  completed: boolean;
  claimed: boolean;
}

export interface QuestWithDefinition extends UserQuest {
  definition: Quest;
}

export interface QuestState {
  quests: Quest[];
  activeQuest: Quest | null;
  questProgress: Record<string, any>;
  loading: boolean;
  error: string | null;
}
