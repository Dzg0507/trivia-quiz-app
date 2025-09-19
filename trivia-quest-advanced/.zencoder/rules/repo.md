---
description: Repository Information Overview
alwaysApply: true
---

# Trivia Quest Advanced Information

## Summary
Trivia Quest Advanced is a React-based interactive trivia game with a 3D planetary exploration system. It features quests, multiplayer gameplay, user profiles, and achievements. The app uses Firebase for backend services and includes animations with Framer Motion and Three.js.

## Structure
- **src/components/**: UI components organized by feature (auth, quiz, profile, quests, multiplayer)
- **src/context/**: Context providers for state management (Auth, User, Quiz, Theme, etc.)
- **src/hooks/**: Custom React hooks for game logic and state management
- **src/services/**: API and Firebase services for data handling
- **src/types/**: TypeScript type definitions for app entities
- **src/config/**: Configuration files for game data, routes, and constants
- **src/utils/**: Utility functions for dates and error logging
- **src/planetary-system/**: 3D visualization components using Three.js

## Language & Runtime
**Language**: TypeScript
**Version**: ES2020 (as specified in tsconfig.json)
**Build System**: Vite 7.1.2
**Package Manager**: npm

## Dependencies
**Main Dependencies**:
- react: ^18.2.0
- react-dom: ^18.2.0
- react-router-dom: ^7.9.1
- firebase: ^12.2.1
- framer-motion: ^12.23.12
- @react-three/fiber: ^8.18.0
- @react-three/drei: ^9.122.0
- three: ^0.157.0
- zustand: ^4.4.7
- gsap: ^3.13.0

**Development Dependencies**:
- typescript: ^5.9.2
- vite: ^7.1.2
- vitest: ^3.2.4
- @testing-library/react: ^16.3.0
- eslint: ^9.33.0
- tailwindcss: ^3.4.3

## Build & Installation
```bash
npm install
npm run dev     # Development server
npm run build   # Production build
npm run preview # Preview production build
```

## Testing
**Framework**: Vitest with React Testing Library
**Test Location**: Co-located with components (.test.tsx files)
**Configuration**: vitest.config.ts, vitest.setup.ts
**Run Command**:
```bash
npm test
npm run test:watch
npm run test:coverage
```

## Features
**Authentication**: Firebase-based user authentication
**Quests**: Interactive quest system with different difficulty levels
**Planetary System**: 3D planetary exploration interface using Three.js
**Multiplayer**: Real-time multiplayer quiz competitions
**Profile**: User profiles with statistics and achievements
**Leaderboard**: Global competition rankings

## State Management
The application uses a combination of:
- React Context API for global state (auth, theme, notifications)
- Zustand for 3D world state management
- Local component state for UI-specific state

## Architecture
The application follows a feature-based architecture with:
- Context providers for global state
- Custom hooks for complex logic
- Service layer for external API interactions
- Component composition for UI organization
- 3D visualization using react-three-fiber