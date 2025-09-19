// Profile Types
import { UserQuest, Quest } from '../quests';
export interface UserStats {
  totalQuizzes: number;
  totalScore: number;
  bestScore: number;
  averageAccuracy: number;
  longestStreak: number;
  correctAnswers: number;
}

export interface UserProfile {
  avatar: string;
  bio: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  condition: {
    stat: 'totalQuizzes' | 'totalScore' | 'bestScore' | 'averageAccuracy' | 'longestStreak' | 'correctAnswers';
    operator: '>=' | '<=' | '==';
    value: number;
  };
  reward: number;
  unlocked?: boolean;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  unlocked?: boolean;
}

export interface LeaderboardEntry {
  id: string;
  username: string;
  points: number;
  rank: number;
}

export interface UserData {
  username: string;
  createdAt: Date;
  stats: UserStats;
  profile: UserProfile;
  achievements: string[];
  quests: UserQuest[];
  generatedQuests: Quest[];
  badges: string[];
  lastQuestGeneration: {
    daily: number; // timestamp
    weekly: number; // timestamp
    monthly: number; // timestamp
  };
}
