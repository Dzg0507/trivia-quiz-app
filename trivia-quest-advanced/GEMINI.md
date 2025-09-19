# Trivia Quest Advanced: Project Overview

This document provides a comprehensive overview of the Trivia Quest Advanced application, a feature-rich trivia game with a 3D interactive planetary system, multiplayer capabilities, and a robust quest and achievement system.

## Tech Stack

- **Frontend:** React, TypeScript, Vite
- **Styling:** Tailwind CSS
- **3D Graphics:** Three.js, @react-three/fiber, @react-three/drei, @react-three/cannon
- **Routing:** React Router
- **State Management:** React Context API, Zustand (implied by presence, but primarily Context is used)
- **Backend:** Firebase (Authentication, Firestore)
- **Testing:** Vitest, React Testing Library
- **Linting:** ESLint

## Project Structure

The project follows a standard React application structure, with the `src` directory containing the majority of the application code.

```
src/
├── components/      # React components, organized by feature
├── config/          # Application configuration, including routes
├── context/         # React context providers for state management
├── hooks/           # Custom React hooks for business logic
├── planetary-system/ # 3D/game-related components
├── services/        # Services for interacting with external APIs
├── types/           # TypeScript type definitions
└── utils/           # Utility functions
```

## Core Features

- **Trivia Gameplay:** Users can answer multiple-choice trivia questions on various topics.
- **3D Planetary System:** An interactive 3D environment where users can navigate and select game modes.
- **User Authentication:** Users can create accounts and log in using Firebase Authentication.
- **User Profiles:** Users have profiles that display their stats, achievements, and other information.
- **Quests and Achievements:** A comprehensive quest and achievement system that rewards users for completing specific tasks.
- **Leaderboards:** A global leaderboard that displays the top players.
- **Multiplayer:** Real-time multiplayer trivia games.
- **Dynamic Quest Generation:** A system for generating new quests for users.

## Architecture

### Component Structure

The application is built around a modular component architecture, with components organized by feature in the `src/components` directory. The main `App.tsx` component sets up the routing and context providers.

### State Management

The application uses a combination of React Context API and custom hooks for state management. The `src/context` directory contains a set of context providers that manage different aspects of the application's state, including:

- `AuthContext`: Manages user authentication state.
- `GameContext`: Manages game-related state.
- `LoadingContext`: Manages the application's loading state.
- `NotificationContext`: Manages the display of notifications.
- `QuizContext`: Manages the state of the trivia quiz.
- `ThemeContext`: Manages the application's theme.
- `UIContext`: Manages the state of the UI.
- `UserContext`: Manages user-related data.

The `AppProvider` component in `src/context/AppProvider.tsx` composes all of these providers into a single provider that wraps the entire application.

### Data Flow

The application follows a unidirectional data flow. Data is fetched from Firestore and the Trivia API by the services in the `src/services` directory. This data is then passed down to the components through the context providers and custom hooks. User interactions trigger updates to the state, which are then reflected in the UI.

## Key Components

- **`App.tsx`**: The main application component that sets up routing and context providers.
- **`StartScreen.tsx`**: The main start screen of the application, which likely contains the 3D planetary system.
- **`QuizPage.tsx`**: The component that displays the trivia quiz.
- **`QuestWorld.tsx`**: The component that displays the quest system.
- **`Profile.tsx`**: The component that displays the user's profile.
- **`Leaderboard.tsx`**: The component that displays the leaderboard.
- **`MultiplayerLobby.tsx`**: The component that allows users to join or create multiplayer games.

## Services and APIs

### `firestoreService.ts`

This service provides a comprehensive set of functions for interacting with Firestore. It manages all of the application's data, including user data, quests, leaderboards, and multiplayer game sessions.

### `triviaApi.ts`

This service is responsible for fetching trivia questions from multiple external APIs. It includes a fallback mechanism to ensure that the application can still fetch questions even if one of the APIs is unavailable. It also includes a retry mechanism with exponential backoff to handle rate limiting and other errors.

## 3D/Interactive Elements

The application includes a 3D interactive planetary system, which is likely implemented using Three.js and `@react-three/fiber`. The `src/planetary-system` directory contains the components and logic for this feature. The `public/models` directory contains the 3D models used in the scene.

## Configuration and Setup

The project is configured using a set of files in the root directory, including:

- **`vite.config.ts`**: The Vite configuration file.
- **`tsconfig.json`**: The TypeScript configuration file.
- **`tailwind.config.js`**: The Tailwind CSS configuration file.

The `package.json` file contains the project's dependencies and scripts for building, testing, and running the application.