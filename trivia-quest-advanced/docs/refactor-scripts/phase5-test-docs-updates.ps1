# Phase 5: Test and Documentation Updates
# This script updates tests and documentation to match the new structure

# Create backup directory
$backupDir = "c:\Users\devin\Projects\MainDirForTriviaQuizGamePlan\trivia-quiz-app\trivia-quest-advanced\refactor-backups\phase5"
New-Item -ItemType Directory -Path $backupDir -Force | Out-Null
Write-Host "Created backup directory: $backupDir" -ForegroundColor Green

# Define the root directory
$rootDir = "c:\Users\devin\Projects\MainDirForTriviaQuizGamePlan\trivia-quiz-app\trivia-quest-advanced"

# Backup original files
Write-Host "Backing up original files..." -ForegroundColor Yellow
Copy-Item -Path "$rootDir\src\__tests__\*" -Destination $backupDir -Recurse -Force
Copy-Item -Path "$rootDir\README.md" -Destination $backupDir -Force
Copy-Item -Path "$rootDir\docs\*" -Destination $backupDir -Recurse -Force
Write-Host "Backup completed." -ForegroundColor Green

# Step 1: Create the new test directory structure
Write-Host "Creating new test directory structure..." -ForegroundColor Yellow

# Create test directories
$testDirs = @(
    "src/__tests__/features/auth",
    "src/__tests__/features/quests",
    "src/__tests__/features/quiz",
    "src/__tests__/features/profile",
    "src/__tests__/features/multiplayer",
    "src/__tests__/features/planetary-system",
    "src/__tests__/shared/components",
    "src/__tests__/shared/hooks",
    "src/__tests__/shared/services",
    "src/__tests__/shared/utils"
)

foreach ($dir in $testDirs) {
    New-Item -ItemType Directory -Path "$rootDir\$dir" -Force | Out-Null
}

Write-Host "Created new test directory structure." -ForegroundColor Green

# Step 2: Create example test files for each feature
Write-Host "Creating example test files..." -ForegroundColor Yellow

# Auth feature test
$authTestContent = @"
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Login } from '../../../features/auth';
import { UserProvider } from '../../../context/UserContext';

// Mock the useUserContext hook
jest.mock('../../../context/UserContext', () => ({
  ...jest.requireActual('../../../context/UserContext'),
  useUserContext: () => ({
    user: null,
    loading: false,
    error: null,
    signIn: jest.fn().mockResolvedValue({}),
    signOut: jest.fn().mockResolvedValue({}),
    register: jest.fn().mockResolvedValue({}),
    updateProfile: jest.fn().mockResolvedValue(true),
    updateStats: jest.fn().mockResolvedValue(true),
  }),
}));

describe('Login Component', () => {
  test('renders login form', () => {
    render(<Login />);
    
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  test('handles form submission', async () => {
    render(<Login />);
    
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    });
    
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' },
    });
    
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    
    await waitFor(() => {
      expect(screen.getByText(/signing in/i)).toBeInTheDocument();
    });
  });
});
"@
Set-Content -Path "$rootDir\src\__tests__\features\auth\Login.test.tsx" -Value $authTestContent

# Quiz feature test
$quizTestContent = @"
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Quiz } from '../../../features/quiz';
import { GameProvider } from '../../../context/GameContext';

// Mock the useGameContext hook
jest.mock('../../../context/GameContext', () => ({
  ...jest.requireActual('../../../context/GameContext'),
  useGameContext: () => ({
    questions: [
      {
        category: 'General Knowledge',
        type: 'multiple',
        difficulty: 'medium',
        question: 'What is the capital of France?',
        correct_answer: 'Paris',
        incorrect_answers: ['London', 'Berlin', 'Madrid'],
        allAnswers: ['Paris', 'London', 'Berlin', 'Madrid'],
      },
    ],
    currentQuestionIndex: 0,
    currentQuestion: {
      category: 'General Knowledge',
      type: 'multiple',
      difficulty: 'medium',
      question: 'What is the capital of France?',
      correct_answer: 'Paris',
      incorrect_answers: ['London', 'Berlin', 'Madrid'],
      allAnswers: ['Paris', 'London', 'Berlin', 'Madrid'],
    },
    score: 0,
    streak: 0,
    gameState: 'playing',
    answers: [],
    loading: false,
    error: null,
    startGame: jest.fn().mockResolvedValue([]),
    answerQuestion: jest.fn().mockReturnValue(true),
    nextQuestion: jest.fn().mockReturnValue(true),
    endGame: jest.fn().mockResolvedValue({}),
  }),
}));

describe('Quiz Component', () => {
  test('renders quiz question', () => {
    render(<Quiz />);
    
    expect(screen.getByText(/what is the capital of france/i)).toBeInTheDocument();
    expect(screen.getByText(/paris/i)).toBeInTheDocument();
    expect(screen.getByText(/london/i)).toBeInTheDocument();
    expect(screen.getByText(/berlin/i)).toBeInTheDocument();
    expect(screen.getByText(/madrid/i)).toBeInTheDocument();
  });

  test('handles answer selection', async () => {
    render(<Quiz />);
    
    fireEvent.click(screen.getByText(/paris/i));
    
    await waitFor(() => {
      expect(screen.getByText(/correct/i)).toBeInTheDocument();
    });
  });
});
"@
Set-Content -Path "$rootDir\src\__tests__\features\quiz\Quiz.test.tsx" -Value $quizTestContent

# Shared components test
$sharedComponentsTestContent = @"
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Navbar } from '../../../shared';
import { UIProvider } from '../../../context/UIContext';
import { UserProvider } from '../../../context/UserContext';

// Mock the useUIContext hook
jest.mock('../../../context/UIContext', () => ({
  ...jest.requireActual('../../../context/UIContext'),
  useUIContext: () => ({
    loading: false,
    startLoading: jest.fn(),
    stopLoading: jest.fn(),
    notification: null,
    notify: jest.fn(),
    theme: 'light',
    toggleTheme: jest.fn(),
  }),
}));

// Mock the useUserContext hook
jest.mock('../../../context/UserContext', () => ({
  ...jest.requireActual('../../../context/UserContext'),
  useUserContext: () => ({
    user: { uid: '123', email: 'test@example.com' },
    profile: { username: 'TestUser' },
    loading: false,
    error: null,
    signOut: jest.fn().mockResolvedValue({}),
  }),
}));

describe('Navbar Component', () => {
  test('renders navbar with user info', () => {
    render(<Navbar />);
    
    expect(screen.getByText(/testuser/i)).toBeInTheDocument();
    expect(screen.getByText(/quests/i)).toBeInTheDocument();
    expect(screen.getByText(/profile/i)).toBeInTheDocument();
  });

  test('handles sign out', () => {
    render(<Navbar />);
    
    fireEvent.click(screen.getByText(/sign out/i));
    
    // Check that signOut was called
    expect(jest.requireMock('../../../context/UserContext').useUserContext().signOut).toHaveBeenCalled();
  });
});
"@
Set-Content -Path "$rootDir\src\__tests__\shared\components\Navbar.test.tsx" -Value $sharedComponentsTestContent

# Create test setup file
$testSetupContent = @"
// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Mock the firebase modules
jest.mock('../src/firebase', () => ({
  auth: {
    onAuthStateChanged: jest.fn(),
    signInWithEmailAndPassword: jest.fn(),
    signOut: jest.fn(),
    createUserWithEmailAndPassword: jest.fn(),
    sendPasswordResetEmail: jest.fn(),
    currentUser: null,
  },
  firestore: {
    collection: jest.fn().mockReturnValue({
      doc: jest.fn().mockReturnValue({
        get: jest.fn().mockResolvedValue({
          exists: true,
          data: jest.fn().mockReturnValue({}),
        }),
        update: jest.fn().mockResolvedValue({}),
        set: jest.fn().mockResolvedValue({}),
      }),
      where: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      get: jest.fn().mockResolvedValue({
        docs: [],
      }),
    }),
    FieldValue: {
      arrayUnion: jest.fn(),
      increment: jest.fn(),
    },
  },
}));

// Mock the localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: jest.fn((key) => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString();
    }),
    removeItem: jest.fn((key) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock the fetch API
global.fetch = jest.fn().mockImplementation(() =>
  Promise.resolve({
    json: () => Promise.resolve({ response_code: 0, results: [] }),
  })
);
"@
Set-Content -Path "$rootDir\src\setupTests.ts" -Value $testSetupContent

Write-Host "Created example test files." -ForegroundColor Green

# Step 3: Update documentation
Write-Host "Updating documentation..." -ForegroundColor Yellow

# Create docs directory if it doesn't exist
New-Item -ItemType Directory -Path "$rootDir\docs" -Force | Out-Null

# Create project structure documentation
$projectStructureContent = @"
# Project Structure

The Trivia Quest Advanced application follows a feature-based architecture, organizing code by domain rather than by technical role.

## Directory Structure

```
src/
├── features/           # Feature modules
│   ├── auth/           # Authentication feature
│   │   ├── components/ # Auth-specific components
│   │   ├── hooks/      # Auth-specific hooks
│   │   ├── services/   # Auth-specific services
│   │   └── index.ts    # Feature exports
│   ├── quests/         # Quests feature
│   ├── quiz/           # Quiz feature
│   ├── profile/        # User profile feature
│   ├── multiplayer/    # Multiplayer game feature
│   └── planetary-system/ # Planetary system visualization
├── shared/             # Shared code
│   ├── components/     # Shared components
│   ├── hooks/          # Shared hooks
│   ├── services/       # Shared services
│   ├── utils/          # Utility functions
│   └── index.ts        # Shared exports
├── context/            # React context providers
├── config/             # Application configuration
│   ├── api/            # API configuration
│   ├── firebase/       # Firebase configuration
│   ├── theme/          # Theme configuration
│   ├── routes/         # Route configuration
│   ├── constants/      # Application constants
│   └── index.ts        # Config exports
├── types/              # TypeScript type definitions
│   ├── auth/           # Auth-related types
│   ├── quests/         # Quest-related types
│   ├── quiz/           # Quiz-related types
│   ├── profile/        # Profile-related types
│   ├── multiplayer/    # Multiplayer-related types
│   ├── planetary-system/ # Planetary system types
│   ├── common/         # Common types
│   └── index.ts        # Type exports
├── __tests__/          # Test files (mirror src structure)
├── App.tsx             # Main application component
└── index.tsx           # Application entry point
```

## Feature Modules

Each feature module contains:

- **components/**: React components specific to the feature
- **hooks/**: Custom React hooks specific to the feature
- **services/**: Services for API calls and data manipulation
- **index.ts**: Exports all public components, hooks, and services

## Shared Code

The shared directory contains code that is used across multiple features:

- **components/**: Reusable UI components
- **hooks/**: General-purpose hooks
- **services/**: Common services
- **utils/**: Utility functions

## Context Providers

The context directory contains React context providers:

- **UIContext.tsx**: UI-related state (loading, notifications, theme)
- **UserContext.tsx**: User authentication and profile state
- **GameContext.tsx**: Game state for quizzes and quests
- **AppProvider.tsx**: Combines all providers

## Configuration

The config directory contains application configuration:

- **api/**: API endpoints and parameters
- **firebase/**: Firebase configuration
- **theme/**: Theme definitions
- **routes/**: Route definitions
- **constants/**: Application constants

## Type Definitions

The types directory contains TypeScript type definitions:

- **auth/**: Authentication-related types
- **quests/**: Quest-related types
- **quiz/**: Quiz-related types
- **profile/**: User profile types
- **multiplayer/**: Multiplayer game types
- **planetary-system/**: Planetary system types
- **common/**: Common types
"@
Set-Content -Path "$rootDir\docs\project-structure.md" -Value $projectStructureContent

# Create coding standards documentation
$codingStandardsContent = @"
# Coding Standards

This document outlines the coding standards and best practices for the Trivia Quest Advanced application.

## General Guidelines

- Follow the feature-based architecture
- Use TypeScript for type safety
- Use functional components with hooks
- Keep components small and focused
- Use context for global state management
- Use custom hooks for reusable logic
- Write unit tests for components and hooks

## Imports

Use the following import order:

1. React and React-related imports
2. Third-party libraries
3. Feature imports
4. Shared imports
5. Type imports
6. Style imports

Example:

```tsx
// React and React-related imports
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Third-party libraries
import { motion } from 'framer-motion';

// Feature imports
import { useQuizFlow } from '../../hooks/useQuizFlow';

// Shared imports
import { Button } from '../../../shared/components/Button';

// Type imports
import { Question, Answer } from '../../../types/quiz';

// Style imports
import './Quiz.css';
```

## Feature Exports

Each feature should export its public API through an index.ts file:

```tsx
// features/quiz/index.ts
export * from './components/Quiz';
export * from './components/QuizPage';
export * from './hooks/useQuizFlow';
export * from './services/triviaApi';
```

## Component Structure

Components should follow this structure:

```tsx
import React from 'react';
import { useUIContext } from '../../../context/UIContext';
import { Button } from '../../../shared/components/Button';
import { ComponentProps } from '../../../types/common';

interface ExampleComponentProps extends ComponentProps {
  title: string;
  onAction: () => void;
}

export const ExampleComponent: React.FC<ExampleComponentProps> = ({
  title,
  onAction,
  className,
}) => {
  const { loading } = useUIContext();

  const handleClick = () => {
    onAction();
  };

  return (
    <div className={className}>
      <h2>{title}</h2>
      <Button onClick={handleClick} disabled={loading}>
        Click Me
      </Button>
    </div>
  );
};
```

## Hook Structure

Hooks should follow this structure:

```tsx
import { useState, useEffect } from 'react';
import { useUIContext } from '../../../context/UIContext';
import { fetchData } from '../services/dataService';
import { DataItem } from '../../../types/common';

export const useDataFetcher = (id: string) => {
  const [data, setData] = useState<DataItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { notify } = useUIContext();

  useEffect(() => {
    const fetchDataItem = async () => {
      try {
        setLoading(true);
        const result = await fetchData(id);
        setData(result);
      } catch (err) {
        setError(err.message);
        notify('Error fetching data', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchDataItem();
  }, [id, notify]);

  return { data, loading, error };
};
```

## Testing

Write tests for components and hooks:

```tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ExampleComponent } from './ExampleComponent';

describe('ExampleComponent', () => {
  test('renders title', () => {
    render(
      <ExampleComponent
        title="Test Title"
        onAction={jest.fn()}
      />
    );
    
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  test('calls onAction when button is clicked', () => {
    const mockOnAction = jest.fn();
    render(
      <ExampleComponent
        title="Test Title"
        onAction={mockOnAction}
      />
    );
    
    fireEvent.click(screen.getByText('Click Me'));
    expect(mockOnAction).toHaveBeenCalledTimes(1);
  });
});
```
"@
Set-Content -Path "$rootDir\docs\coding-standards.md" -Value $codingStandardsContent

# Update README.md
$readmeContent = @"
# Trivia Quest Advanced

An interactive trivia quiz game with a planetary quest system.

## Features

- **Interactive Quests**: Complete quests to unlock new planets and earn rewards
- **Trivia Challenges**: Test your knowledge with trivia questions from various categories
- **Planetary System**: Explore a 3D planetary system as you progress
- **User Profiles**: Track your progress, achievements, and stats
- **Multiplayer Mode**: Challenge friends in real-time multiplayer quizzes
- **Leaderboards**: Compete for top positions on global leaderboards

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/trivia-quest-advanced.git
   cd trivia-quest-advanced
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file with your Firebase configuration:
   ```
   REACT_APP_FIREBASE_API_KEY=your-api-key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your-auth-domain
   REACT_APP_FIREBASE_PROJECT_ID=your-project-id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your-storage-bucket
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
   REACT_APP_FIREBASE_APP_ID=your-app-id
   REACT_APP_FIREBASE_MEASUREMENT_ID=your-measurement-id
   ```

4. Start the development server:
   ```
   npm start
   ```

## Project Structure

The application follows a feature-based architecture. See [Project Structure](./docs/project-structure.md) for details.

## Coding Standards

See [Coding Standards](./docs/coding-standards.md) for guidelines on code style and best practices.

## Testing

Run tests with:
```
npm test
```

## Building for Production

Build the app for production:
```
npm run build
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.
"@
Set-Content -Path "$rootDir\README.md" -Value $readmeContent

Write-Host "Updated documentation." -ForegroundColor Green

# Step 4: Create a Jest configuration file
Write-Host "Creating Jest configuration..." -ForegroundColor Yellow

$jestConfigContent = @"
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  testMatch: ['**/__tests__/**/*.test.(ts|tsx)'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '^src/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/index.tsx',
    '!src/reportWebVitals.ts',
    '!src/setupTests.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
};
"@
Set-Content -Path "$rootDir\jest.config.js" -Value $jestConfigContent

# Update package.json scripts
Write-Host "Updating package.json scripts..." -ForegroundColor Yellow

$packageJsonPath = "$rootDir\package.json"
$packageJson = Get-Content -Path $packageJsonPath -Raw | ConvertFrom-Json

# Add or update test scripts
$packageJson.scripts.test = "jest"
$packageJson.scripts."test:watch" = "jest --watch"
$packageJson.scripts."test:coverage" = "jest --coverage"
$packageJson.scripts.lint = "eslint 'src/**/*.{ts,tsx}'"
$packageJson.scripts."lint:fix" = "eslint 'src/**/*.{ts,tsx}' --fix"

# Convert back to JSON and write to file
$packageJsonContent = $packageJson | ConvertTo-Json -Depth 10
Set-Content -Path $packageJsonPath -Value $packageJsonContent

Write-Host "Updated package.json scripts." -ForegroundColor Green

Write-Host "Phase 5 completed. Tests and documentation have been updated." -ForegroundColor Green
Write-Host "The following files have been created or updated:" -ForegroundColor Cyan
Write-Host "- src/__tests__/features/auth/Login.test.tsx" -ForegroundColor Cyan
Write-Host "- src/__tests__/features/quiz/Quiz.test.tsx" -ForegroundColor Cyan
Write-Host "- src/__tests__/shared/components/Navbar.test.tsx" -ForegroundColor Cyan
Write-Host "- src/setupTests.ts" -ForegroundColor Cyan
Write-Host "- docs/project-structure.md" -ForegroundColor Cyan
Write-Host "- docs/coding-standards.md" -ForegroundColor Cyan
Write-Host "- README.md" -ForegroundColor Cyan
Write-Host "- jest.config.js" -ForegroundColor Cyan
Write-Host "- package.json (updated scripts)" -ForegroundColor Cyan

Write-Host "`nNext steps:" -ForegroundColor Yellow
Write-Host "1. Run tests to ensure they pass with the new structure." -ForegroundColor Yellow
Write-Host "2. Update any failing tests to match the new structure." -ForegroundColor Yellow
Write-Host "3. Add more tests for each feature." -ForegroundColor Yellow
Write-Host "4. Review and update documentation as needed." -ForegroundColor Yellow

Write-Host "`nTo rollback changes, restore files from: $backupDir" -ForegroundColor Magenta