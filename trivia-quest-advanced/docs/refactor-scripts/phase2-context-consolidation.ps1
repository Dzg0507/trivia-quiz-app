# Phase 2: Context Consolidation
# This script consolidates related contexts into domain-specific providers

# Create backup directory
$backupDir = "c:\Users\devin\Projects\MainDirForTriviaQuizGamePlan\trivia-quiz-app\trivia-quest-advanced\refactor-backups\phase2"
New-Item -ItemType Directory -Path $backupDir -Force | Out-Null
Write-Host "Created backup directory: $backupDir" -ForegroundColor Green

# Define the root directory
$rootDir = "c:\Users\devin\Projects\MainDirForTriviaQuizGamePlan\trivia-quiz-app\trivia-quest-advanced"

# Backup original files
Write-Host "Backing up original files..." -ForegroundColor Yellow
Copy-Item -Path "$rootDir\src\context\*.ts" -Destination $backupDir -Force
Copy-Item -Path "$rootDir\src\context\*.tsx" -Destination $backupDir -Force
Copy-Item -Path "$rootDir\src\App.tsx" -Destination $backupDir -Force
Write-Host "Backup completed." -ForegroundColor Green

# Step 1: Create consolidated context files
Write-Host "Creating consolidated context files..." -ForegroundColor Yellow

# Create UIContext.tsx
$uiContextContent = @"
// Consolidated UI Context
import React, { createContext, useContext, ReactNode } from 'react';
import { useUI } from '../hooks/useUI';

// Define the context type
interface UIContextType {
  loading: boolean;
  startLoading: () => void;
  stopLoading: () => void;
  notification: { message: string; type: string } | null;
  notify: (message: string, type?: string) => void;
  theme: string;
  toggleTheme: () => void;
}

// Create the context with a default value
const UIContext = createContext<UIContextType | null>(null);

// Provider component
interface UIProviderProps {
  children: ReactNode;
}

export const UIProvider: React.FC<UIProviderProps> = ({ children }) => {
  const ui = useUI();
  
  return (
    <UIContext.Provider value={ui}>
      {children}
    </UIContext.Provider>
  );
};

// Custom hook to use the context
export const useUIContext = (): UIContextType => {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error('useUIContext must be used within a UIProvider');
  }
  return context;
};
"@

# Create UserContext.tsx
$userContextContent = @"
// Consolidated User Context
import React, { createContext, useContext, ReactNode } from 'react';
import { useUser } from '../hooks/useUser';
import { User } from 'firebase/auth';

// Define the context type
interface UserContextType {
  user: User | null;
  profile: any | null;
  stats: any | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<User>;
  signOut: () => Promise<void>;
  register: (email: string, password: string) => Promise<User>;
  updateProfile: (data: any) => Promise<boolean>;
  updateStats: (newStats: any) => Promise<boolean>;
}

// Create the context with a default value
const UserContext = createContext<UserContextType | null>(null);

// Provider component
interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const user = useUser();
  
  return (
    <UserContext.Provider value={user}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the context
export const useUserContext = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
};
"@

# Create GameContext.tsx
$gameContextContent = @"
// Consolidated Game Context
import React, { createContext, useContext, ReactNode } from 'react';
import { useGame } from '../hooks/useGame';

// Define the context type
interface GameContextType {
  questions: any[];
  currentQuestionIndex: number;
  currentQuestion: any;
  score: number;
  streak: number;
  gameState: string;
  answers: any[];
  loading: boolean;
  error: string | null;
  startGame: (category: string, difficulty: string, amount?: number) => Promise<any[]>;
  answerQuestion: (answer: string) => boolean;
  nextQuestion: () => boolean;
  endGame: () => Promise<any>;
  createMultiplayerGame: (settings: any) => Promise<string>;
  joinMultiplayerGame: (gameId: string) => Promise<boolean>;
  submitMultiplayerAnswer: (answer: string) => Promise<boolean>;
  multiplayerGameId: string | null;
}

// Create the context with a default value
const GameContext = createContext<GameContextType | null>(null);

// Provider component
interface GameProviderProps {
  children: ReactNode;
  questId?: string;
  userId?: string;
}

export const GameProvider: React.FC<GameProviderProps> = ({ children, questId, userId }) => {
  const game = useGame(questId, userId);
  
  return (
    <GameContext.Provider value={game}>
      {children}
    </GameContext.Provider>
  );
};

// Custom hook to use the context
export const useGameContext = (): GameContextType => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGameContext must be used within a GameProvider');
  }
  return context;
};
"@

# Create AppProvider.tsx
$appProviderContent = @"
// App Context Provider
import React, { ReactNode } from 'react';
import { UIProvider } from './UIContext';
import { UserProvider } from './UserContext';
import { GameProvider } from './GameContext';

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
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
"@

# Create directories if they don't exist
New-Item -ItemType Directory -Path "$rootDir\src\context" -Force | Out-Null

# Write the consolidated context files
Set-Content -Path "$rootDir\src\context\UIContext.tsx" -Value $uiContextContent
Set-Content -Path "$rootDir\src\context\UserContext.tsx" -Value $userContextContent
Set-Content -Path "$rootDir\src\context\GameContext.tsx" -Value $gameContextContent
Set-Content -Path "$rootDir\src\context\AppProvider.tsx" -Value $appProviderContent

Write-Host "Created consolidated context files." -ForegroundColor Green

# Step 2: Update App.tsx to use the new AppProvider
Write-Host "Updating App.tsx..." -ForegroundColor Yellow

# Define the App.tsx path
$appTsxPath = "$rootDir\src\App.tsx"

# Create the updated App.tsx content
$updatedAppTsxContent = @"
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AppProvider } from './context/AppProvider';
import Routes from './config/routes';
import './app.css';

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
"@

# Write the updated App.tsx content
Set-Content -Path $appTsxPath -Value $updatedAppTsxContent

Write-Host "Updated App.tsx." -ForegroundColor Green

# Step 3: Create an example component using the new contexts
Write-Host "Creating an example component using the new contexts..." -ForegroundColor Yellow

$exampleComponentContent = @"
// Example component using the new contexts
import React from 'react';
import { useUIContext } from '../context/UIContext';
import { useUserContext } from '../context/UserContext';
import { useGameContext } from '../context/GameContext';

const ExampleComponent = () => {
  const { loading, notify, theme, toggleTheme } = useUIContext();
  const { user, signOut, profile } = useUserContext();
  const { score, answerQuestion, gameState } = useGameContext();

  const handleSignOut = async () => {
    try {
      await signOut();
      notify('Signed out successfully', 'success');
    } catch (error) {
      notify('Error signing out', 'error');
    }
  };

  const handleToggleTheme = () => {
    toggleTheme();
    notify(`Switched to ${theme === 'light' ? 'dark' : 'light'} theme`, 'info');
  };

  return (
    <div className={`example-component theme-${theme}`}>
      {loading && <div className="loading-indicator">Loading...</div>}
      
      <div className="user-info">
        {user ? (
          <>
            <h2>Welcome, {profile?.username || user.email}</h2>
            <button onClick={handleSignOut}>Sign Out</button>
          </>
        ) : (
          <h2>Please sign in</h2>
        )}
      </div>
      
      <div className="game-info">
        {gameState === 'playing' && (
          <>
            <h3>Current Score: {score}</h3>
            <button onClick={() => answerQuestion('Sample answer')}>
              Submit Answer
            </button>
          </>
        )}
      </div>
      
      <button onClick={handleToggleTheme}>
        Switch to {theme === 'light' ? 'Dark' : 'Light'} Theme
      </button>
    </div>
  );
};

export default ExampleComponent;
"@

# Create the example component directory if it doesn't exist
New-Item -ItemType Directory -Path "$rootDir\src\components\examples" -Force | Out-Null

# Write the example component
Set-Content -Path "$rootDir\src\components\examples\ContextExample.tsx" -Value $exampleComponentContent

Write-Host "Created example component at src/components/examples/ContextExample.tsx." -ForegroundColor Green

Write-Host "Phase 2 completed. The following files have been created:" -ForegroundColor Green
Write-Host "- src/context/UIContext.tsx" -ForegroundColor Cyan
Write-Host "- src/context/UserContext.tsx" -ForegroundColor Cyan
Write-Host "- src/context/GameContext.tsx" -ForegroundColor Cyan
Write-Host "- src/context/AppProvider.tsx" -ForegroundColor Cyan
Write-Host "- src/components/examples/ContextExample.tsx" -ForegroundColor Cyan
Write-Host "App.tsx has been updated to use the new AppProvider." -ForegroundColor Cyan

Write-Host "`nNext steps:" -ForegroundColor Yellow
Write-Host "1. Test the application to ensure it still works with the new context structure." -ForegroundColor Yellow
Write-Host "2. Update components to use the new context hooks (useUIContext, useUserContext, useGameContext)." -ForegroundColor Yellow
Write-Host "3. Once all components are updated, you can remove the original context files." -ForegroundColor Yellow

Write-Host "`nTo rollback changes, restore files from: $backupDir" -ForegroundColor Magenta