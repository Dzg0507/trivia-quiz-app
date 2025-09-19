import { auth, db } from '../firebase.ts';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, User } from 'firebase/auth';
import { doc, getDoc, setDoc, collection, getDocs, query, orderBy, limit, updateDoc, arrayUnion, deleteDoc, onSnapshot } from 'firebase/firestore';
import { Question } from '../types/trivia'; // Import Question interface

interface AuthResult {
  success: boolean;
  message?: string;
  user?: User;
}

// Define interfaces for data structures
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

export interface Quest {
  id: string;
  name: string;
  description: string;
  category: string;
  theme: string;
  type: 'daily' | 'weekly' | 'monthly' | 'main';
  difficulty: 'easy' | 'medium' | 'hard';
  conditions: {
    stat: keyof UserStats;
    operator: '>=' | '<=' | '==';
    value: number;
  }[];
  reward: number;
  planetName?: string;
  position?: [number, number, number];
  completed?: boolean;
  progress?: number;
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
  // Add other fields as they appear in your user documents
}

export const userServices = {
  // Auth Service Functions
  signup: async (email: string, password: string): Promise<AuthResult> => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      return { success: true, message: 'Signup successful!', user: userCredential.user };
    } catch (error: unknown) {
      return { success: false, message: (error as Error).message };
    }
  },

  login: async (email: string, password: string): Promise<AuthResult> => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return { success: true, message: 'Login successful!', user: userCredential.user };
    } catch (error: unknown) {
      return { success: false, message: (error as Error).message };
    }
    },

  logout: async (): Promise<{ success: boolean; message?: string }> => {
    try {
      await signOut(auth);
      return { success: true, message: 'Logout successful!' };
    } catch (error: unknown) {
      return { success: false, message: (error as Error).message };
    }
  },

  getCurrentUser: (): User | null => {
    return auth.currentUser;
  },

  // Firestore User Data Functions
  // Helper to get a document reference
  getUserDocRef: (userId: string) => doc(db, 'users', userId),

  // Initialize user document on signup/login
  initializeUserDoc: async (userId: string, initialData: Partial<UserData> = {}) => {
    const userRef = userServices.getUserDocRef(userId);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) {
      await setDoc(userRef, {
        username: userId, // Or a default display name
        createdAt: new Date(),
        stats: {
          totalQuizzes: 0,
          totalScore: 0,
          bestScore: 0,
          averageAccuracy: 0,
          longestStreak: 0,
          correctAnswers: 0,
        },
        profile: {
          avatar: 'ðŸ˜Š',
          bio: '',
        },
        achievements: [],
        quests: [],
        lastQuestGeneration: {
          daily: 0,
          weekly: 0,
          monthly: 0,
        },
        ...initialData
      }, { merge: true });
    }
  },

  // Get user data
  getUserData: async (userId: string): Promise<UserData | null> => {
    if (!userId) return null;
    const docRef = userServices.getUserDocRef(userId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? (docSnap.data() as UserData) : null;
  },

  // Update user data
  updateUserData: async (userId: string, dataToUpdate: Partial<UserData>) => {
    if (!userId) return;
    const userRef = userServices.getUserDocRef(userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      await updateDoc(userRef, dataToUpdate);
    } else {
      await setDoc(userRef, { ...dataToUpdate }, { merge: true });
    }
  },

  // Get user stats
  getUserStats: async (userId: string): Promise<UserStats | null> => {
    const userData = await userServices.getUserData(userId);
    return userData ? userData.stats : null;
  },

  // Update user stats
  updateUserStats: async (userId: string, newStats: Partial<UserStats>) => {
    const userRef = userServices.getUserDocRef(userId);
    await updateDoc(userRef, { stats: newStats });
  },

  // Get profile settings
  getProfileSettings: async (userId: string): Promise<UserProfile | null> => {
    const userData = await userServices.getUserData(userId);
    return userData ? userData.profile : null;
  },

  // Update profile settings
  updateProfileSettings: async (userId: string, newSettings: Partial<UserProfile>) => {
    const userRef = userServices.getUserDocRef(userId);
    await updateDoc(userRef, { profile: newSettings });
  },

  // Get user achievements
  getUserAchievements: async (userId: string): Promise<string[]> => {
    const userData = await userServices.getUserData(userId);
    return userData ? userData.achievements : [];
  },

  // Add achievement to user
  addAchievementToUser: async (userId: string, achievementId: string) => {
    const userRef = userServices.getUserDocRef(userId);
    await updateDoc(userRef, {
      achievements: arrayUnion(achievementId)
    });
  },

  // Get user quests
  getUserQuests: async (userId: string): Promise<UserQuest[]> => {
    const userData = await userServices.getUserData(userId);
    return userData ? userData.quests : [];
  },

  // Get user generated quests
  getUserGeneratedQuests: async (userId: string): Promise<Quest[]> => {
    const userData = await userServices.getUserData(userId);
    return userData ? userData.generatedQuests : [];
  },

  // Assign a quest to a user
  assignQuestToUser: async (userId: string, quest: Quest) => {
    const userRef = userServices.getUserDocRef(userId);
    const newQuest: UserQuest = {
      questId: quest.id,
      progress: 0,
      completed: false,
      claimed: false,
    };
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      await updateDoc(userRef, {
        quests: arrayUnion(newQuest)
      });
    } else {
      await setDoc(userRef, { quests: arrayUnion(newQuest) }, { merge: true });
    }
  },

  // Assign a generated quest to a user
  assignGeneratedQuestToUser: async (userId: string, quest: Quest) => {
    const userRef = userServices.getUserDocRef(userId);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      await updateDoc(userRef, {
        generatedQuests: arrayUnion(quest)
      });
    } else {
      await setDoc(userRef, { generatedQuests: arrayUnion(quest) }, { merge: true });
    }
  },

  // Update a specific quest in the user's quests array
  updateUserQuest: async (userId: string, updatedQuest: UserQuest) => {
    const userRef = userServices.getUserDocRef(userId);
    const userData = await userServices.getUserData(userId);
    if (userData) {
      const updatedQuests = userData.quests.map(q =>
        q.questId === updatedQuest.questId ? updatedQuest : q
      );
      await updateDoc(userRef, { quests: updatedQuests });
    }
  },

  // Update a specific generated quest in the user's generated quests array
  updateGeneratedUserQuest: async (userId: string, updatedQuest: Quest) => {
    const userRef = userServices.getUserDocRef(userId);
    const userData = await userServices.getUserData(userId);
    if (userData) {
      const updatedQuests = userData.generatedQuests.map(q =>
        q.id === updatedQuest.id ? updatedQuest : q
      );
      await updateDoc(userRef, { generatedQuests: updatedQuests });
    }
  },

  // Claim reward for a completed quest
  claimQuestReward: async (userId: string, quest: QuestWithDefinition) => {
    const userRef = userServices.getUserDocRef(userId);
    const userData = await userServices.getUserData(userId);
    if (userData) {
      const updatedQuest: UserQuest = {
        questId: quest.questId,
        progress: quest.progress,
        completed: quest.completed,
        claimed: true,
      };
      const updatedQuests = userData.quests.map(q =>
        q.questId === quest.questId ? updatedQuest : q
      );
      const newTotalScore = userData.stats.totalScore + quest.definition.reward;

      await updateDoc(userRef, {
        quests: updatedQuests,
        'stats.totalScore': newTotalScore,
      });
    }
  },
};
