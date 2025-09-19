# Phase 4: Configuration and Type Consolidation
# This script consolidates configuration files and TypeScript types

# Create backup directory
$backupDir = "c:\Users\devin\Projects\MainDirForTriviaQuizGamePlan\trivia-quiz-app\trivia-quest-advanced\refactor-backups\phase4"
New-Item -ItemType Directory -Path $backupDir -Force | Out-Null
Write-Host "Created backup directory: $backupDir" -ForegroundColor Green

# Define the root directory
$rootDir = "c:\Users\devin\Projects\MainDirForTriviaQuizGamePlan\trivia-quiz-app\trivia-quest-advanced"

# Backup original files
Write-Host "Backing up original files..." -ForegroundColor Yellow
Copy-Item -Path "$rootDir\src\types\*" -Destination $backupDir -Force
Copy-Item -Path "$rootDir\src\config\*" -Destination $backupDir -Force
Write-Host "Backup completed." -ForegroundColor Green

# Step 1: Create the new directory structure
Write-Host "Creating new directory structure..." -ForegroundColor Yellow

# Create type directories
$typeDirs = @(
    "src/types/auth",
    "src/types/quests",
    "src/types/quiz",
    "src/types/profile",
    "src/types/multiplayer",
    "src/types/planetary-system",
    "src/types/common"
)

foreach ($dir in $typeDirs) {
    New-Item -ItemType Directory -Path "$rootDir\$dir" -Force | Out-Null
}

# Create config directories
$configDirs = @(
    "src/config/api",
    "src/config/firebase",
    "src/config/theme",
    "src/config/routes",
    "src/config/constants"
)

foreach ($dir in $configDirs) {
    New-Item -ItemType Directory -Path "$rootDir\$dir" -Force | Out-Null
}

Write-Host "Created new directory structure." -ForegroundColor Green

# Step 2: Create consolidated type files
Write-Host "Creating consolidated type files..." -ForegroundColor Yellow

# Create auth types
$authTypesContent = @"
// Auth Types
export interface User {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  emailVerified: boolean;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface AuthResult {
  success: boolean;
  message?: string;
  user?: User;
}
"@
Set-Content -Path "$rootDir\src\types\auth\index.ts" -Value $authTypesContent

# Create quest types
$questTypesContent = @"
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
  stat: keyof UserStats;
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
"@
Set-Content -Path "$rootDir\src\types\quests\index.ts" -Value $questTypesContent

# Create quiz types
$quizTypesContent = @"
// Quiz Types
export interface Question {
  category: string;
  type: string;
  difficulty: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
  allAnswers?: string[]; // Combined and shuffled answers
}

export interface Answer {
  questionIndex: number;
  answer: string;
  isCorrect: boolean;
  points: number;
}

export interface QuizState {
  questions: Question[];
  currentQuestionIndex: number;
  score: number;
  streak: number;
  gameState: 'idle' | 'loading' | 'playing' | 'completed';
  answers: Answer[];
  loading: boolean;
  error: string | null;
}

export interface QuizSettings {
  category: string;
  difficulty: string;
  amount: number;
  timeLimit?: number;
}
"@
Set-Content -Path "$rootDir\src\types\quiz\index.ts" -Value $quizTypesContent

# Create profile types
$profileTypesContent = @"
// Profile Types
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
    stat: keyof UserStats;
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
"@
Set-Content -Path "$rootDir\src\types\profile\index.ts" -Value $profileTypesContent

# Create multiplayer types
$multiplayerTypesContent = @"
// Multiplayer Types
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

export interface MultiplayerGameSettings {
  category: string;
  difficulty: string;
  questionCount: number;
  timePerQuestion: number;
  isPrivate: boolean;
}

export interface MultiplayerState {
  gameId: string | null;
  isHost: boolean;
  players: string[];
  gameStatus: 'waiting' | 'playing' | 'completed';
  loading: boolean;
  error: string | null;
}
"@
Set-Content -Path "$rootDir\src\types\multiplayer\index.ts" -Value $multiplayerTypesContent

# Create planetary system types
$planetaryTypesContent = @"
// Planetary System Types
export interface Planet {
  id: string;
  name: string;
  description: string;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
  color: string;
  texture: string;
  questId?: string;
  unlocked: boolean;
}

export interface PlanetarySystemState {
  planets: Planet[];
  activePlanet: Planet | null;
  cameraPosition: [number, number, number];
  cameraTarget: [number, number, number];
  isAnimating: boolean;
  isZoomedIn: boolean;
}
"@
Set-Content -Path "$rootDir\src\types\planetary-system\index.ts" -Value $planetaryTypesContent

# Create common types
$commonTypesContent = @"
// Common Types
export interface AppState {
  loading: boolean;
  error: string | null;
}

export interface Notification {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  duration?: number;
}

export interface Theme {
  name: 'light' | 'dark';
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    error: string;
    warning: string;
    info: string;
    success: string;
  };
}

// Re-export all types for convenience
export * from '../auth';
export * from '../quests';
export * from '../quiz';
export * from '../profile';
export * from '../multiplayer';
export * from '../planetary-system';
"@
Set-Content -Path "$rootDir\src\types\common\index.ts" -Value $commonTypesContent

# Create index.ts in types directory
$typesIndexContent = @"
// Types index file
export * from './auth';
export * from './quests';
export * from './quiz';
export * from './profile';
export * from './multiplayer';
export * from './planetary-system';
export * from './common';
"@
Set-Content -Path "$rootDir\src\types\index.ts" -Value $typesIndexContent

Write-Host "Created consolidated type files." -ForegroundColor Green

# Step 3: Create consolidated config files
Write-Host "Creating consolidated config files..." -ForegroundColor Yellow

# Create API config
$apiConfigContent = @"
// API Configuration
export const API_CONFIG = {
  trivia: {
    baseUrl: 'https://opentdb.com/api.php',
    defaultParams: {
      amount: 10,
      type: 'multiple'
    },
    categories: {
      generalKnowledge: 9,
      books: 10,
      film: 11,
      music: 12,
      musicals: 13,
      television: 14,
      videoGames: 15,
      boardGames: 16,
      science: 17,
      computers: 18,
      mathematics: 19,
      mythology: 20,
      sports: 21,
      geography: 22,
      history: 23,
      politics: 24,
      art: 25,
      celebrities: 26,
      animals: 27,
      vehicles: 28,
      comics: 29,
      gadgets: 30,
      anime: 31,
      cartoons: 32
    },
    difficulties: ['easy', 'medium', 'hard']
  }
};

export const buildTriviaApiUrl = (category: number, difficulty: string, amount: number) => {
  return `\${API_CONFIG.trivia.baseUrl}?amount=\${amount}&category=\${category}&difficulty=\${difficulty}&type=\${API_CONFIG.trivia.defaultParams.type}`;
};
"@
Set-Content -Path "$rootDir\src\config\api\trivia.ts" -Value $apiConfigContent

# Create Firebase config
$firebaseConfigContent = @"
// Firebase Configuration
export const FIREBASE_CONFIG = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

export const FIRESTORE_COLLECTIONS = {
  users: 'users',
  quests: 'quests',
  questProgress: 'questProgress',
  achievements: 'achievements',
  leaderboard: 'leaderboard',
  multiplayerGames: 'multiplayerGames'
};
"@
Set-Content -Path "$rootDir\src\config\firebase\index.ts" -Value $firebaseConfigContent

# Create Theme config
$themeConfigContent = @"
// Theme Configuration
import { Theme } from '../../types/common';

export const LIGHT_THEME: Theme = {
  name: 'light',
  colors: {
    primary: '#6200ee',
    secondary: '#03dac6',
    background: '#f5f5f5',
    surface: '#ffffff',
    text: '#000000',
    error: '#b00020',
    warning: '#ff9800',
    info: '#2196f3',
    success: '#4caf50'
  }
};

export const DARK_THEME: Theme = {
  name: 'dark',
  colors: {
    primary: '#bb86fc',
    secondary: '#03dac6',
    background: '#121212',
    surface: '#1e1e1e',
    text: '#ffffff',
    error: '#cf6679',
    warning: '#ffb74d',
    info: '#64b5f6',
    success: '#81c784'
  }
};

export const getTheme = (themeName: 'light' | 'dark'): Theme => {
  return themeName === 'light' ? LIGHT_THEME : DARK_THEME;
};
"@
Set-Content -Path "$rootDir\src\config\theme\index.ts" -Value $themeConfigContent

# Create Routes config
$routesConfigContent = @"
// Routes Configuration
export const ROUTES = {
  home: '/',
  login: '/login',
  register: '/register',
  profile: '/profile',
  quests: '/quests',
  questDetails: '/quests/:questId',
  quiz: '/quiz/:questId',
  leaderboard: '/leaderboard',
  achievements: '/achievements',
  multiplayer: '/multiplayer',
  multiplayerGame: '/multiplayer/:gameId',
  settings: '/settings',
  notFound: '*'
};

export const getQuestDetailsRoute = (questId: string) => {
  return ROUTES.questDetails.replace(':questId', questId);
};

export const getQuizRoute = (questId: string) => {
  return ROUTES.quiz.replace(':questId', questId);
};

export const getMultiplayerGameRoute = (gameId: string) => {
  return ROUTES.multiplayerGame.replace(':gameId', gameId);
};
"@
Set-Content -Path "$rootDir\src\config\routes\index.ts" -Value $routesConfigContent

# Create Constants config
$constantsConfigContent = @"
// Application Constants
export const APP_CONSTANTS = {
  appName: 'Trivia Quest Advanced',
  version: '1.0.0',
  maxQuizQuestions: 20,
  defaultQuizTime: 30, // seconds per question
  maxMultiplayerPlayers: 8,
  leaderboardLimit: 100,
  questTypes: ['daily', 'weekly', 'monthly', 'main'],
  questDifficulties: ['easy', 'medium', 'hard'],
  defaultAvatar: '😊',
  storageKeys: {
    theme: 'trivia-quest-theme',
    lastLogin: 'trivia-quest-last-login',
    cachedQuizzes: 'trivia-quest-cached-quizzes',
    userSettings: 'trivia-quest-user-settings'
  }
};

export const ACHIEVEMENT_THRESHOLDS = {
  quizCompleted: 1,
  quizMaster: 10,
  quizChampion: 50,
  perfectScore: 100,
  streakMaster: 5,
  streakChampion: 10
};

export const BADGE_RARITIES = {
  common: 'common',
  uncommon: 'uncommon',
  rare: 'rare',
  epic: 'epic',
  legendary: 'legendary'
};
"@
Set-Content -Path "$rootDir\src\config\constants\index.ts" -Value $constantsConfigContent

# Create index.ts in config directory
$configIndexContent = @"
// Config index file
export * from './api/trivia';
export * from './firebase';
export * from './theme';
export * from './routes';
export * from './constants';
"@
Set-Content -Path "$rootDir\src\config\index.ts" -Value $configIndexContent

Write-Host "Created consolidated config files." -ForegroundColor Green

# Step 4: Create an example of updated imports
Write-Host "Creating an example of updated imports..." -ForegroundColor Yellow

$exampleImportsContent = @"
// Example of updated imports
// Before:
// import { Question, Answer } from '../types/trivia';
// import { UserStats } from '../types/user';
// import { Quest } from '../types/quest';

// After:
import { Question, Answer } from '../types/quiz';
import { UserStats } from '../types/profile';
import { Quest } from '../types/quests';

// Or use the consolidated imports:
import { Question, Answer, UserStats, Quest } from '../types';

// Before:
// import { API_URL } from '../config/api';
// import { FIREBASE_CONFIG } from '../config/firebase';
// import { ROUTES } from '../config/routes';

// After:
import { API_CONFIG, FIREBASE_CONFIG, ROUTES } from '../config';

// Before:
// const apiUrl = 'https://opentdb.com/api.php';
// const category = 9;
// const difficulty = 'medium';
// const amount = 10;

// After:
import { API_CONFIG, buildTriviaApiUrl } from '../config';
const category = API_CONFIG.trivia.categories.generalKnowledge;
const difficulty = 'medium';
const amount = 10;
const apiUrl = buildTriviaApiUrl(category, difficulty, amount);

// Before:
// const theme = {
//   primary: '#6200ee',
//   secondary: '#03dac6',
//   background: '#f5f5f5',
//   text: '#000000'
// };

// After:
import { getTheme } from '../config';
const theme = getTheme('light');
"@

New-Item -ItemType Directory -Path "$rootDir\src\examples" -Force | Out-Null
Set-Content -Path "$rootDir\src\examples\UpdatedTypeConfigImportsExample.tsx" -Value $exampleImportsContent

Write-Host "Created example of updated imports at src/examples/UpdatedTypeConfigImportsExample.tsx." -ForegroundColor Green

Write-Host "Phase 4 completed. Configuration and types have been consolidated." -ForegroundColor Green
Write-Host "The following directories have been created:" -ForegroundColor Cyan
Write-Host "- src/types/auth" -ForegroundColor Cyan
Write-Host "- src/types/quests" -ForegroundColor Cyan
Write-Host "- src/types/quiz" -ForegroundColor Cyan
Write-Host "- src/types/profile" -ForegroundColor Cyan
Write-Host "- src/types/multiplayer" -ForegroundColor Cyan
Write-Host "- src/types/planetary-system" -ForegroundColor Cyan
Write-Host "- src/types/common" -ForegroundColor Cyan
Write-Host "- src/config/api" -ForegroundColor Cyan
Write-Host "- src/config/firebase" -ForegroundColor Cyan
Write-Host "- src/config/theme" -ForegroundColor Cyan
Write-Host "- src/config/routes" -ForegroundColor Cyan
Write-Host "- src/config/constants" -ForegroundColor Cyan

Write-Host "`nNext steps:" -ForegroundColor Yellow
Write-Host "1. Test the application to ensure it still works with the new type and config structure." -ForegroundColor Yellow
Write-Host "2. Update imports in components to use the new consolidated types and configs." -ForegroundColor Yellow
Write-Host "3. Once all imports are updated, you can remove the original type and config files." -ForegroundColor Yellow

Write-Host "`nTo rollback changes, restore files from: $backupDir" -ForegroundColor Magenta