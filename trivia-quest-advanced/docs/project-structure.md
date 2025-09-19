# Project Structure

The Trivia Quest Advanced application follows a feature-based architecture, organizing code by domain rather than by technical role.

## Directory Structure

`
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
`

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
