# Phase 1: Service and Hook Consolidation
# This script consolidates related services and hooks into domain-specific files

# Create backup directory
$backupDir = "c:\Users\devin\Projects\MainDirForTriviaQuizGamePlan\trivia-quiz-app\trivia-quest-advanced\refactor-backups\phase1"
New-Item -ItemType Directory -Path $backupDir -Force | Out-Null
Write-Host "Created backup directory: $backupDir" -ForegroundColor Green

# Define the root directory
$rootDir = "c:\Users\devin\Projects\MainDirForTriviaQuizGamePlan\trivia-quiz-app\trivia-quest-advanced"
$servicesDir = Join-Path $rootDir "src\services"
$authServicePath = Join-Path $servicesDir "authService.ts"
$firestoreServicePath = Join-Path $servicesDir "firestoreService.ts"
$userServicesPath = Join-Path $servicesDir "userServices.ts"

# Backup original files
Write-Host "Backing up original files..." -ForegroundColor Yellow
Copy-Item -Path "$servicesDir\*" -Destination $backupDir -Force
Write-Host "Backup completed." -ForegroundColor Green

Write-Host "Starting Phase 1: Service and Hook Consolidation..." -ForegroundColor Yellow

# 1. Create src/services/userServices.ts
Write-Host "Creating userServices.ts..."
$userServicesContent = @"
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
"@

Set-Content -Path $userServicesPath -Value $userServicesContent -Encoding UTF8

# 2. Modify src/services/firestoreService.ts
Write-Host "Modifying firestoreService.ts..."
$firestoreServiceContent = @"
import { db } from '../firebase.ts';
import { doc, getDoc, setDoc, collection, getDocs, query, orderBy, limit, updateDoc, arrayUnion, deleteDoc, onSnapshot } from 'firebase/firestore';
import { Question } from '../types/trivia'; // Import Question interface

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
    $gameRef = firestoreService.getGameDocRef(gameId);
    $gameSnap = await getDoc(gameRef);

    if (!$gameSnap.exists()) {
      throw new Error('Game not found.');
    }

    $gameData = $gameSnap.data() as MultiplayerGameSession;

    if (!$gameData.players[userId]) {
      throw new Error('You are not in this game.');
    }

    // Remove player from the game
    $updatedPlayers = { ...$gameData.players };
    Remove-Variable updatedPlayers[$userId];

    if ($updatedPlayers.Count -eq 0) {
        # If no players left, delete the game
        await deleteDoc(gameRef);
      } else {
        # If host leaves, assign new host if other players exist
        if ($gameData.hostId -eq $userId) {
          $newHostId = (Object.keys($updatedPlayers))[0];
          await updateDoc(gameRef, { players: $updatedPlayers, hostId: $newHostId });
        } else {
          await updateDoc(gameRef, { players: $updatedPlayers });
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
"@

Set-Content -Path $firestoreServicePath -Value $firestoreServiceContent -Encoding UTF8

# 3. Delete src/services/authService.ts if it exists
Write-Host "Checking for authService.ts..." -ForegroundColor Yellow
if (Test-Path $authServicePath) {
    Write-Host "Deleting authService.ts..." -ForegroundColor Yellow
    Remove-Item $authServicePath -Force
    Write-Host "authService.ts deleted." -ForegroundColor Green
} else {
    Write-Host "authService.ts not found (may have been deleted already)." -ForegroundColor Cyan
}

Write-Host "Phase 1 completed. Services have been consolidated." -ForegroundColor Green
Write-Host "The following files have been created or modified:" -ForegroundColor Cyan
Write-Host "- src/services/userServices.ts (created)" -ForegroundColor Cyan
Write-Host "- src/services/firestoreService.ts (modified)" -ForegroundColor Cyan
Write-Host "- src/services/authService.ts (deleted)" -ForegroundColor Cyan

Write-Host "`nNext steps:" -ForegroundColor Yellow
Write-Host "1. Test the application to ensure it still works with the consolidated services." -ForegroundColor Yellow
Write-Host "2. Update imports in components to use the new userServices instead of authService." -ForegroundColor Yellow
Write-Host "3. Proceed to Phase 2 for context consolidation." -ForegroundColor Yellow

Write-Host "`nTo rollback changes, restore files from: $backupDir" -ForegroundColor Magenta
