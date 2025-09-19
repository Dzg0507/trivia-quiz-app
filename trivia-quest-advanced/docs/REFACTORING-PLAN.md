# Trivia Quest Advanced Refactoring Plan

This document outlines a comprehensive plan for refactoring the Trivia Quest Advanced application to simplify its structure and improve code organization without losing any functionality.

## Phase 1: Service and Hook Consolidation

### Services Consolidation

#### 1. Create User Services (`src/services/userServices.ts`)

Combine:
- `authService.ts`
- User-related functions from `firestoreService.ts`

```typescript
// src/services/userServices.ts
import { auth, firestore } from '../firebase';
// Import existing functions from authService.ts and firestoreService.ts

// Auth functions
export const signIn = async (email: string, password: string) => { /* ... */ };
export const signOut = async () => { /* ... */ };
export const registerUser = async (email: string, password: string) => { /* ... */ };
export const resetPassword = async (email: string) => { /* ... */ };
export const getCurrentUser = () => { /* ... */ };

// User data functions
export const getUserProfile = async (userId: string) => { /* ... */ };
export const updateUserProfile = async (userId: string, data: any) => { /* ... */ };
export const getUserStats = async (userId: string) => { /* ... */ };
export const updateUserStats = async (userId: string, stats: any) => { /* ... */ };
```

#### 2. Create Game Services (`src/services/gameServices.ts`)

Combine:
- `triviaApi.ts`
- Game-related functions from `firestoreService.ts`

```typescript
// src/services/gameServices.ts
import { firestore } from '../firebase';
// Import existing functions from triviaApi.ts and firestoreService.ts

// Trivia API functions
export const fetchTriviaQuestions = async (category: string, difficulty: string, amount: number) => { /* ... */ };

// Quest functions
export const getQuestData = async (questId: string) => { /* ... */ };
export const updateQuestProgress = async (userId: string, questId: string, progress: any) => { /* ... */ };

// Leaderboard functions
export const getLeaderboard = async () => { /* ... */ };
export const updateLeaderboardEntry = async (userId: string, score: number) => { /* ... */ };

// Multiplayer functions
export const createMultiplayerGame = async (hostId: string, settings: any) => { /* ... */ };
export const joinMultiplayerGame = async (gameId: string, userId: string) => { /* ... */ };
export const updateMultiplayerGameState = async (gameId: string, state: any) => { /* ... */ };
```

#### 3. Create UI Services (`src/services/uiServices.ts`)

Combine:
- `notificationService.ts`
- `shareService.ts`
- `localDataStorage.ts`

```typescript
// src/services/uiServices.ts
// Import existing functions from notificationService.ts, shareService.ts, and localDataStorage.ts

// Notification functions
export const showNotification = (message: string, type: string) => { /* ... */ };
export const hideNotification = () => { /* ... */ };

// Share functions
export const shareAchievement = (achievement: any) => { /* ... */ };
export const shareScore = (score: number) => { /* ... */ };

// Local storage functions
export const saveToLocalStorage = (key: string, data: any) => { /* ... */ };
export const getFromLocalStorage = (key: string) => { /* ... */ };
export const removeFromLocalStorage = (key: string) => { /* ... */ };
```

### Hooks Consolidation

#### 1. Create User Hooks (`src/hooks/useUser.ts`)

Combine:
- `useAuth.ts`
- `useUserFirestoreData.tsx`
- `useUserStats.tsx`

```typescript
// src/hooks/useUser.ts
import { useState, useEffect } from 'react';
import { getCurrentUser, getUserProfile, getUserStats } from '../services/userServices';

export const useUser = () => {
  // Combine logic from useAuth, useUserFirestoreData, and useUserStats
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Authentication functions
  const signIn = async (email, password) => { /* ... */ };
  const signOut = async () => { /* ... */ };
  const register = async (email, password) => { /* ... */ };
  
  // Profile functions
  const updateProfile = async (data) => { /* ... */ };
  
  // Stats functions
  const updateStats = async (newStats) => { /* ... */ };

  // Effect to load user data
  useEffect(() => {
    // Load user, profile, and stats
  }, []);

  return {
    user,
    profile,
    stats,
    loading,
    error,
    signIn,
    signOut,
    register,
    updateProfile,
    updateStats
  };
};
```

#### 2. Create Quest Hooks (`src/hooks/useQuest.ts`)

Combine:
- `useQuestManager.tsx`
- `useQuestGenerator.tsx`

```typescript
// src/hooks/useQuest.ts
import { useState, useEffect } from 'react';
import { getQuestData, updateQuestProgress } from '../services/gameServices';

export const useQuest = (userId) => {
  // Combine logic from useQuestManager and useQuestGenerator
  const [quests, setQuests] = useState([]);
  const [activeQuest, setActiveQuest] = useState(null);
  const [questProgress, setQuestProgress] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Quest management functions
  const selectQuest = (questId) => { /* ... */ };
  const completeQuest = async (questId) => { /* ... */ };
  const generateNewQuests = async () => { /* ... */ };

  // Effect to load quests
  useEffect(() => {
    // Load quests and progress
  }, [userId]);

  return {
    quests,
    activeQuest,
    questProgress,
    loading,
    error,
    selectQuest,
    completeQuest,
    generateNewQuests
  };
};
```

#### 3. Create Game Hooks (`src/hooks/useGame.ts`)

Combine:
- `useQuizFlow.tsx`
- `useQuizProgress.ts`
- `useStreakTracker.tsx`
- `useMultiplayerGame.ts`

```typescript
// src/hooks/useGame.ts
import { useState, useEffect } from 'react';
import { fetchTriviaQuestions } from '../services/gameServices';

export const useGame = (questId, userId) => {
  // Combine logic from useQuizFlow, useQuizProgress, and useStreakTracker
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [gameState, setGameState] = useState('idle'); // idle, loading, playing, completed
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Game functions
  const startGame = async () => { /* ... */ };
  const answerQuestion = (answer) => { /* ... */ };
  const nextQuestion = () => { /* ... */ };
  const endGame = async () => { /* ... */ };

  // Multiplayer functions
  const createMultiplayerGame = async () => { /* ... */ };
  const joinMultiplayerGame = async (gameId) => { /* ... */ };
  const submitMultiplayerAnswer = async (answer) => { /* ... */ };

  // Effect to initialize game
  useEffect(() => {
    // Initialize game state
  }, [questId, userId]);

  return {
    questions,
    currentQuestionIndex,
    score,
    streak,
    gameState,
    loading,
    error,
    startGame,
    answerQuestion,
    nextQuestion,
    endGame,
    createMultiplayerGame,
    joinMultiplayerGame,
    submitMultiplayerAnswer
  };
};
```

#### 4. Create UI Hooks (`src/hooks/useUI.ts`)

Combine:
- `useLoading.ts`
- `useNotifications.ts`
- `useTheme.ts`

```typescript
// src/hooks/useUI.ts
import { useState, useCallback } from 'react';
import { showNotification, hideNotification } from '../services/uiServices';

export const useUI = () => {
  // Combine logic from useLoading, useNotifications, and useTheme
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [theme, setTheme] = useState('light');

  // Loading functions
  const startLoading = () => setLoading(true);
  const stopLoading = () => setLoading(false);

  // Notification functions
  const notify = useCallback((message, type = 'info') => {
    showNotification(message, type);
    setNotification({ message, type });
    setTimeout(() => {
      hideNotification();
      setNotification(null);
    }, 3000);
  }, []);

  // Theme functions
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  return {
    loading,
    startLoading,
    stopLoading,
    notification,
    notify,
    theme,
    toggleTheme
  };
};
```

### Update Imports

After creating the consolidated files, update imports throughout the codebase to use the new files.

## Phase 2: Context Consolidation

### Create New Context Structure

#### 1. Create UI Context (`src/context/UIContext.tsx`)

Combine:
- `LoadingContext.tsx`
- `NotificationContext.tsx`
- `ThemeContext.tsx`

```typescript
// src/context/UIContext.tsx
import React, { createContext, useContext } from 'react';
import { useUI } from '../hooks/useUI';

const UIContext = createContext(null);

export const UIProvider = ({ children }) => {
  const ui = useUI();
  
  return (
    <UIContext.Provider value={ui}>
      {children}
    </UIContext.Provider>
  );
};

export const useUIContext = () => {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error('useUIContext must be used within a UIProvider');
  }
  return context;
};
```

#### 2. Create User Context (`src/context/UserContext.tsx`)

Combine:
- `AuthContext.tsx`
- User profile and stats context

```typescript
// src/context/UserContext.tsx
import React, { createContext, useContext } from 'react';
import { useUser } from '../hooks/useUser';

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const user = useUser();
  
  return (
    <UserContext.Provider value={user}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
};
```

#### 3. Create Game Context (`src/context/GameContext.tsx`)

Combine:
- `QuizProgressContext.tsx`
- Game state context

```typescript
// src/context/GameContext.tsx
import React, { createContext, useContext } from 'react';
import { useGame } from '../hooks/useGame';

const GameContext = createContext(null);

export const GameProvider = ({ children, questId, userId }) => {
  const game = useGame(questId, userId);
  
  return (
    <GameContext.Provider value={game}>
      {children}
    </GameContext.Provider>
  );
};

export const useGameContext = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGameContext must be used within a GameProvider');
  }
  return context;
};
```

#### 4. Create App Context Provider (`src/context/AppProvider.tsx`)

Combine all contexts into a single provider:

```typescript
// src/context/AppProvider.tsx
import React from 'react';
import { UIProvider } from './UIContext';
import { UserProvider } from './UserContext';
import { GameProvider } from './GameContext';

export const AppProvider = ({ children }) => {
  return (
    <UIProvider>
      <UserProvider>
        <GameProvider>
          {children}
        </GameProvider>
      </UserProvider>
    </UIProvider>
  );
};
```

### Update App.tsx

Update the App component to use the new AppProvider:

```typescript
// src/App.tsx
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AppProvider } from './context/AppProvider';
import Routes from './config/routes';

const App = () => {
  return (
    <Router>
      <AppProvider>
        <Routes />
      </AppProvider>
    </Router>
  );
};

export default App;
```

### Migrate Components

Update components to use the new context hooks:

```typescript
// Example component using the new contexts
import React from 'react';
import { useUIContext } from '../context/UIContext';
import { useUserContext } from '../context/UserContext';
import { useGameContext } from '../context/GameContext';

const ExampleComponent = () => {
  const { loading, notify, theme } = useUIContext();
  const { user, signOut } = useUserContext();
  const { score, answerQuestion } = useGameContext();

  // Component logic...

  return (
    // JSX...
  );
};
```

## Phase 3: Component Reorganization

### Create Feature-Based Structure

1. Create the new directory structure:

```
src/
├── features/
│   ├── auth/
│   ├── quests/
│   ├── quiz/
│   ├── profile/
│   ├── multiplayer/
│   └── planetary-system/
├── shared/
│   ├── components/
│   ├── hooks/
│   ├── utils/
│   └── services/
```

2. Move components to their respective feature directories:

#### Auth Feature

```
src/features/auth/
├── components/
│   ├── Login.tsx
│   └── Register.tsx
├── hooks/
│   └── useAuth.ts (if still needed)
└── services/
    └── authService.ts (if still needed)
```

#### Quests Feature

```
src/features/quests/
├── components/
│   ├── QuestMenu.tsx
│   └── QuestWorld.tsx
├── hooks/
│   └── useQuest.ts (if still needed)
└── services/
    └── questService.ts (if still needed)
```

#### Quiz Feature

```
src/features/quiz/
├── components/
│   ├── Quiz.tsx
│   └── QuizPage.tsx
├── hooks/
│   └── useQuiz.ts (if still needed)
└── services/
    └── quizService.ts (if still needed)
```

#### Profile Feature

```
src/features/profile/
├── components/
│   ├── Profile.tsx
│   ├── Achievements.tsx
│   └── Leaderboard.tsx
├── hooks/
│   └── useProfile.ts (if still needed)
└── services/
    └── profileService.ts (if still needed)
```

#### Multiplayer Feature

```
src/features/multiplayer/
├── components/
│   ├── MultiplayerGame.tsx
│   └── MultiplayerLobby.tsx
├── hooks/
│   └── useMultiplayer.ts (if still needed)
└── services/
    └── multiplayerService.ts (if still needed)
```

#### Planetary System Feature

```
src/features/planetary-system/
├── components/
│   ├── PlanetaryApp.tsx
│   ├── Scene.tsx
│   └── SolarSystem.tsx
├── planets/
│   └── [Planet components]
├── shaders/
│   └── [Shader components]
└── store/
    └── planetaryStore.ts
```

### Shared Components

```
src/shared/components/
├── ErrorBoundary.tsx
├── GlobalLoadingIndicator.tsx
├── NotificationToast.tsx
└── Settings.tsx
```

### Update Imports

Update all import statements throughout the codebase to reflect the new file locations.

## Phase 4: Configuration and Type Consolidation

### Consolidate Configuration Files

#### 1. Create Game Configuration (`src/config/gameConfig.ts`)

Combine:
- `gameConfig.ts`
- `physicsConfig.ts`
- `questDefinitions.ts`

```typescript
// src/config/gameConfig.ts
// Import and combine content from gameConfig.ts, physicsConfig.ts, and questDefinitions.ts

// Game settings
export const gameSettings = {
  // Settings from gameConfig.ts
};

// Physics settings
export const physicsSettings = {
  // Settings from physicsConfig.ts
};

// Quest definitions
export const questDefinitions = {
  // Definitions from questDefinitions.ts
};
```

#### 2. Create Planetary Configuration (`src/config/planetaryConfig.ts`)

Combine:
- `planetData.ts`
- `questAreaData.ts`

```typescript
// src/config/planetaryConfig.ts
// Import and combine content from planetData.ts and questAreaData.ts

// Planet data
export const planetData = {
  // Data from planetData.ts
};

// Quest area data
export const questAreaData = {
  // Data from questAreaData.ts
};
```

### Consolidate Type Definitions

#### 1. Create User Types (`src/types/userTypes.ts`)

```typescript
// src/types/userTypes.ts
// User-related types

export interface User {
  // User type definition
}

export interface UserProfile {
  // User profile type definition
}

export interface UserStats {
  // User stats type definition
}

export interface Achievement {
  // Achievement type definition
}
```

#### 2. Create Game Types (`src/types/gameTypes.ts`)

```typescript
// src/types/gameTypes.ts
// Game-related types

export interface Quest {
  // Quest type definition
}

export interface Question {
  // Question type definition
}

export interface QuizProgress {
  // Quiz progress type definition
}

export interface MultiplayerGame {
  // Multiplayer game type definition
}
```

#### 3. Create UI Types (`src/types/uiTypes.ts`)

```typescript
// src/types/uiTypes.ts
// UI-related types

export interface Notification {
  // Notification type definition
}

export interface LoadingState {
  // Loading state type definition
}

export interface ThemeSettings {
  // Theme settings type definition
}
```

### Update Imports

Update all import statements throughout the codebase to use the new consolidated type and configuration files.

## Implementation Strategy

For each phase:

1. Create the new files first
2. Copy and adapt the content from the original files
3. Update imports in a few components to test the changes
4. Once confirmed working, update all imports
5. Remove the original files only after thorough testing

This approach minimizes risk and allows for incremental testing throughout the refactoring process.

## Testing Strategy

After each phase:

1. Run the application locally
2. Verify that all features still work
3. Run automated tests if available
4. Fix any issues before proceeding to the next phase

## Rollback Strategy

Before starting each phase:

1. Commit the current state of the codebase
2. Create a branch for the refactoring phase
3. If issues arise, you can easily revert to the previous state

## Conclusion

This refactoring plan provides a structured approach to simplifying the Trivia Quest Advanced codebase while maintaining all functionality. By consolidating related files and organizing components by feature, the codebase will be more maintainable, easier to navigate, and better structured for future development.