import { db } from '../firebase.ts';
import { doc, getDoc, setDoc, collection, getDocs, query, orderBy, limit, updateDoc, deleteDoc, onSnapshot, DocumentSnapshot, QueryDocumentSnapshot } from 'firebase/firestore';
import type { Question } from '../types/trivia'; // Import Question interface

// Define Quest interface (moved from userServices or similar)
export interface Quest {
  id: string;
  name: string;
  description: string;
  category: string;
  theme: string;
  type: 'daily' | 'weekly' | 'monthly';
  difficulty: 'easy' | 'medium' | 'hard';
  conditions: { stat: keyof UserStats; operator: '>=' | '<=' | '=='; value: number; }[];
  reward: number;
}

// Define UserStats interface (moved from userServices or similar)
export interface UserStats {
  totalQuizzes: number;
  totalScore: number;
  bestScore: number;
  averageAccuracy: number;
  longestStreak: number;
  // Add other stats as needed
}

// Define UserProfile interface
export interface UserProfile {
  username: string;
  avatar: string;
  bio: string;
  // Add other profile fields as needed
}

// Define QuestWithDefinition interface
export interface QuestWithDefinition extends Quest {
  definition: {
    name: string;
    description: string;
    icon: string;
    color: string;
  };
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
  getGameDocRef: (gameId: string) => doc(db, 'multiplayerGames', gameId),

  // User Data Functions
  getUserData: async (userId: string) => {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      return userSnap.data();
    } else {
      // Initialize user data if it doesn't exist
      const initialUserData = {
        username: 'New User', // Default username
        stats: {
          totalQuizzes: 0,
          totalScore: 0,
          bestScore: 0,
          averageAccuracy: 0,
          longestStreak: 0,
        },
        profile: { // Initialize profile
          username: 'New User',
          avatar: '',
          bio: '',
        },
        quests: [],
        generatedQuests: [],
      };
      await setDoc(userRef, initialUserData);
      return initialUserData;
    }
  },

  updateUserData: async (userId: string, data: Partial<{ stats: UserStats; profile: UserProfile }>): Promise<void> => {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, data);
  },

  // Quest Functions
  assignGeneratedQuestToUser: async (userId: string, quest: Quest): Promise<void> => {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const userData = userSnap.data();
      const currentGeneratedQuests = userData.generatedQuests || [];
      const newGeneratedQuests = [...currentGeneratedQuests, { ...quest, progress: 0, completed: false }];
      await updateDoc(userRef, { generatedQuests: newGeneratedQuests });
    } else {
      throw new Error('User not found.');
    }
  },

  getUserQuests: async (userId: string): Promise<Quest[]> => {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      return userSnap.data().quests || [];
    }
    return [];
  },

  getUserGeneratedQuests: async (userId: string): Promise<Quest[]> => {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      return userSnap.data().generatedQuests || [];
    }
    return [];
  },

  updateUserQuest: async (userId: string, updatedQuest: Quest & { progress: number; completed: boolean }): Promise<void> => {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const userData = userSnap.data();
      const currentQuests = userData.quests || [];
      const updatedQuests = currentQuests.map((q: Quest) => q.id === updatedQuest.id ? updatedQuest : q);
      await updateDoc(userRef, { quests: updatedQuests });
    } else {
      throw new Error('User not found.');
    }
  },

  updateGeneratedUserQuest: async (userId: string, updatedQuest: Quest & { progress: number; completed: boolean }): Promise<void> => {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const userData = userSnap.data();
      const currentGeneratedQuests = userData.generatedQuests || [];
      const updatedGeneratedQuests = currentGeneratedQuests.map((q: Quest) => q.id === updatedQuest.id ? updatedQuest : q);
      await updateDoc(userRef, { generatedQuests: updatedGeneratedQuests });
    } else {
      throw new Error('User not found.');
    }
  },

  // Get leaderboard data
  getLeaderboardData: async (topN: number = 10): Promise<LeaderboardEntry[]> => {
    const usersCol = collection(db, 'users');
    const q = query(usersCol, orderBy('stats.totalScore', 'desc'), limit(topN));
    const userSnapshot = await getDocs(q);
    const leaderboardData: LeaderboardEntry[] = userSnapshot.docs.map((doc: QueryDocumentSnapshot, index: number) => ({
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
        [`players.${userId}.score`]: newScore
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
    const unsubscribe = onSnapshot(gameRef, (docSnap: DocumentSnapshot) => {
      if (docSnap.exists()) {
        callback(docSnap.data() as MultiplayerGameSession);
      } else {
        callback(null);
      }
    });
    return unsubscribe;
  },
};