import { db } from '../firebase.ts';
import { doc, getDoc, setDoc, collection, getDocs, query, orderBy, limit, updateDoc, arrayUnion, deleteDoc, onSnapshot } from 'firebase/firestore';
import { Question } from '../types/trivia'; // Import Question interface

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
  type: 'daily' | 'weekly' | 'monthly';
  conditions: {
    stat: keyof UserStats;
    operator: '>=' | '<=' | '==';
    value: number;
  }[];
  reward: number;
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
  badges: string[];
  lastQuestGeneration: {
    daily: number; // timestamp
    weekly: number; // timestamp
    monthly: number; // timestamp
  };
  // Add other fields as they appear in your user documents
}

export interface LeaderboardEntry {
  id: string;
  username: string;
  points: number;
  rank: number;
}

export interface MultiplayerGameSession {
  gameId: string;
  status: 'waiting' | 'playing' | 'completed';
  players: {
    [userId: string]: {
      username: string;
      score: number;
    };
  };
  hostId: string;
  currentQuestionIndex: number;
  questions: Question[];
  currentQuestionStartTime: number;
  questionDuration: number;
  createdAt: number; // Timestamp
}

export const firestoreService = {
  // Helper to get a document reference
  getUserDocRef: (userId: string) => doc(db, 'users', userId),
  getGameDocRef: (gameId: string) => doc(db, 'multiplayerGames', gameId),

  // Initialize user document on signup/login
  initializeUserDoc: async (userId: string, initialData: Partial<UserData> = {}) => {
    const userRef = firestoreService.getUserDocRef(userId);
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
          avatar: '😊',
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
    const docRef = firestoreService.getUserDocRef(userId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? (docSnap.data() as UserData) : null;
  },

  // Update user data
  updateUserData: async (userId: string, dataToUpdate: Partial<UserData>) => {
    if (!userId) return;
    const docRef = firestoreService.getUserDocRef(userId);
    await updateDoc(docRef, dataToUpdate);
  },

  // Get user stats
  getUserStats: async (userId: string): Promise<UserStats | null> => {
    const userData = await firestoreService.getUserData(userId);
    return userData ? userData.stats : null;
  },

  // Update user stats
  updateUserStats: async (userId: string, newStats: Partial<UserStats>) => {
    const userRef = firestoreService.getUserDocRef(userId);
    await updateDoc(userRef, { stats: newStats });
  },

  // Get profile settings
  getProfileSettings: async (userId: string): Promise<UserProfile | null> => {
    const userData = await firestoreService.getUserData(userId);
    return userData ? userData.profile : null;
  },

  // Update profile settings
  updateProfileSettings: async (userId: string, newSettings: Partial<UserProfile>) => {
    const userRef = firestoreService.getUserDocRef(userId);
    await updateDoc(userRef, { profile: newSettings });
  },

  // Get user achievements
  getUserAchievements: async (userId: string): Promise<string[]> => {
    const userData = await firestoreService.getUserData(userId);
    return userData ? userData.achievements : [];
  },

  // Add achievement to user
  addAchievementToUser: async (userId: string, achievementId: string) => {
    const userRef = firestoreService.getUserDocRef(userId);
    await updateDoc(userRef, {
      achievements: arrayUnion(achievementId)
    });
  },

  // Get user quests
  getUserQuests: async (userId: string): Promise<UserQuest[]> => {
    const userData = await firestoreService.getUserData(userId);
    return userData ? userData.quests : [];
  },

  // Assign a quest to a user
  assignQuestToUser: async (userId: string, quest: Quest) => {
    const userRef = firestoreService.getUserDocRef(userId);
    const newQuest: UserQuest = {
      questId: quest.id,
      progress: 0,
      completed: false,
      claimed: false,
    };
    await updateDoc(userRef, {
      quests: arrayUnion(newQuest)
    });
  },

  // Update a specific quest in the user's quests array
  updateUserQuest: async (userId: string, updatedQuest: UserQuest) => {
    const userRef = firestoreService.getUserDocRef(userId);
    const userData = await firestoreService.getUserData(userId);
    if (userData) {
      const updatedQuests = userData.quests.map(q =>
        q.questId === updatedQuest.questId ? updatedQuest : q
      );
      await updateDoc(userRef, { quests: updatedQuests });
    }
  },

  // Claim reward for a completed quest
  claimQuestReward: async (userId: string, quest: QuestWithDefinition) => {
    const userRef = firestoreService.getUserDocRef(userId);
    const userData = await firestoreService.getUserData(userId);
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

  // Get leaderboard data
  getLeaderboardData: async (topN: number = 10): Promise<LeaderboardEntry[]> => {
    const usersCol = collection(db, 'users');
    const q = query(usersCol, orderBy('stats.totalScore', 'desc'), limit(topN));
    const userSnapshot = await getDocs(q);
    const leaderboardData: LeaderboardEntry[] = userSnapshot.docs.map((doc, index) => ({
      id: doc.id,
      username: doc.data().username || doc.id,
      points: doc.data().stats.totalScore,
      rank: index + 1, // Add rank based on the sorted order
    }));
    return leaderboardData;
  },

  // Multiplayer Game Functions
  createGame: async (hostId: string, username: string): Promise<MultiplayerGameSession> => {
    const gameRef = doc(collection(db, 'multiplayerGames'));
    const gameId = gameRef.id;
    const newGame: MultiplayerGameSession = {
      gameId,
      status: 'waiting',
      players: {
        [hostId]: { username, score: 0 },
      },
      hostId,
      currentQuestionIndex: -1,
      questions: [],
      currentQuestionStartTime: 0,
      questionDuration: 30, // Default to 30 seconds per question
      createdAt: Date.now(),
    };
    await setDoc(gameRef, newGame);
    return newGame;
  },

  joinGame: async (gameId: string, userId: string, username: string): Promise<void> => {
    const gameRef = firestoreService.getGameDocRef(gameId);
    const gameSnap = await getDoc(gameRef);

    if (!gameSnap.exists()) {
      throw new Error('Game not found.');
    }

    const gameData = gameSnap.data() as MultiplayerGameSession;

    if (gameData.status !== 'waiting') {
      throw new Error('Cannot join a game that is not in waiting status.');
    }

    if (gameData.players[userId]) {
      throw new Error('You are already in this game.');
    }

    // Add player to the game
    await updateDoc(gameRef, {
      [`players.${userId}`]: { username, score: 0 },
    });
  },

  leaveGame: async (gameId: string, userId: string): Promise<void> => {
    const gameRef = firestoreService.getGameDocRef(gameId);
    const gameSnap = await getDoc(gameRef);

    if (!gameSnap.exists()) {
      throw new Error('Game not found.');
    }

    const gameData = gameSnap.data() as MultiplayerGameSession;

    if (!gameData.players[userId]) {
      throw new Error('You are not in this game.');
    }

    // Remove player from the game
    const updatedPlayers = { ...gameData.players };
    delete updatedPlayers[userId];

    if (Object.keys(updatedPlayers).length === 0) {
        // If no players left, delete the game
        await deleteDoc(gameRef);
      } else {
        // If host leaves, assign new host if other players exist
        if (gameData.hostId === userId) {
          const newHostId = Object.keys(updatedPlayers)[0];
          await updateDoc(gameRef, { players: updatedPlayers, hostId: newHostId });
        } else {
          await updateDoc(gameRef, { players: updatedPlayers });
        }
      }
    },

  startGame: async (gameId: string, questions: Question[]): Promise<void> => {
    const gameRef = firestoreService.getGameDocRef(gameId);
    await updateDoc(gameRef, {
      status: 'playing',
      questions: questions,
      currentQuestionIndex: 0,
      currentQuestionStartTime: Date.now(),
    });
  },

  submitAnswer: async (gameId: string, userId: string, questionIndex: number, isCorrect: boolean): Promise<void> => {
    const gameRef = firestoreService.getGameDocRef(gameId);
    const gameSnap = await getDoc(gameRef);

    if (!gameSnap.exists()) {
      throw new Error('Game not found.');
    }

    const gameData = gameSnap.data() as MultiplayerGameSession;

    if (gameData.currentQuestionIndex !== questionIndex) {
      // Answer for a different question, ignore or handle as error
      return;
    }

    const player = gameData.players[userId];
    if (player) {
      const newScore = isCorrect ? player.score + 1 : player.score;
      await updateDoc(gameRef, {
        [`players.${userId}.score`]: newScore,
      });
    }
  },

  nextQuestion: async (gameId: string): Promise<void> => {
    const gameRef = firestoreService.getGameDocRef(gameId);
    const gameSnap = await getDoc(gameRef);

    if (!gameSnap.exists()) {
      throw new Error('Game not found.');
    }

    const gameData = gameSnap.data() as MultiplayerGameSession;

    const nextIndex = gameData.currentQuestionIndex + 1;

    if (nextIndex < gameData.questions.length) {
      await updateDoc(gameRef, {
        currentQuestionIndex: nextIndex,
        currentQuestionStartTime: Date.now(),
      });
    } else {
      await updateDoc(gameRef, {
        status: 'completed',
      });
    }
  },

  listenToGameChanges: (gameId: string, callback: (_session: MultiplayerGameSession | null) => void): () => void => {
    const gameRef = firestoreService.getGameDocRef(gameId);
    const unsubscribe = onSnapshot(gameRef, (docSnap) => {
      if (docSnap.exists()) {
        callback(docSnap.data() as MultiplayerGameSession);
      } else {
        callback(null);
      }
    });
    return unsubscribe;
  },
};
