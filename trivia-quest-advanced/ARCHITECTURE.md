# Trivia Quest Advanced: Architecture Overview

This document provides a comprehensive overview of the Trivia Quest Advanced application's architecture. It is intended to be a reference for developers and AI agents working on the codebase.

## High-Level Overview

Trivia Quest Advanced is a web-based trivia game that combines a 3D planetary exploration interface with a traditional quiz format. Users can navigate a solar system, select planets, and undertake quests that lead to trivia quizzes. The application is built using React, TypeScript, and `react-three-fiber` for the 3D visualization.

## Technology Stack

- **Frontend Framework**: React 18.2.0 with TypeScript 5.9.2
- **Build Tool**: Vite 7.1.2
- **3D Rendering**: Three.js 0.157.0 with React Three Fiber 8.18.0
- **Animation**: GSAP 3.13.0 and Framer Motion 12.23.12
- **Styling**: Tailwind CSS 3.4.3
- **Routing**: React Router 7.9.1
- **State Management**: Zustand 4.4.7 and React Context API
- **Backend Services**: Firebase 12.2.1 (Authentication, Firestore)
- **Testing**: Vitest 3.2.4 with Testing Library

## Project Structure

The project is organized into the following main directories:

-   `src/components`: Contains the main React components that make up the application's UI and 3D world.
-   `src/config`: Contains configuration files for game data, such as planet data, quest areas, and physics settings.
-   `src/context`: Contains React context providers for managing global state, such as authentication, loading, and notifications.
-   `src/hooks`: Contains custom React hooks for managing complex logic, such as quest management, user stats, and quiz flow.
-   `src/planetary-system`: Contains the components and logic for the `react-three-fiber` 3D world.
-   `src/services`: Contains services for interacting with external APIs, such as Firestore and the trivia API.
-   `src/types`: Contains TypeScript type definitions and interfaces.
-   `src/utils`: Contains utility functions for date formatting, error logging, etc.

## Core Concepts

### Quests

Quests are the central gameplay element. They are defined in `src/config/questDefinitions.ts` and managed by the `useQuestManager` hook. Each quest is associated with a planet and a trivia category. When a user selects a quest, the camera focuses on the corresponding planet.

### 3D World (Planetary System)

The 3D world is built using `react-three-fiber`. The main components are:

-   `PlanetaryApp.tsx`: The root of the `react-three-fiber` application. It sets up the Canvas and passes necessary props to the Scene component.
-   `Scene.tsx`: The main scene, containing the solar system, lights, and camera controls. It also handles deselection logic using onPointerMissed events.
-   `SolarSystem.tsx`: Renders the planets based on configuration in planetData.ts. It includes an invisible plane to capture clicks for deselection.
-   `CameraAnimator.tsx`: Handles camera animations between planets and quest areas using GSAP for smooth transitions.
-   `Planets/*.tsx`: Individual planet components that load 3D models and handle planet-specific rendering.

### State Management

The application uses a combination of React state, context, and `zustand` for state management.

-   **`useState` and `useEffect`**: Used for component-level state.
-   **React Context**: Used for global state that is not related to the 3D world, such as authentication and notifications.
-   **`zustand`**: The `useSolarSystemStore` is used to manage the state of the 3D world, including the selected planet, quest areas, and camera targets.

The application includes the following context providers:

-   **`AuthContext`**: Manages user authentication state.
-   **`NotificationContext`**: Handles system notifications.
-   **`LoadingContext`**: Manages loading state indicators.
-   **`QuizProgressContext`**: Tracks quiz gameplay state.
-   **`ThemeContext`**: Manages UI theme preferences.

The Zustand store (`useSolarSystemStore`) in `src/planetary-system/States.ts` manages:

-   Selected planet tracking
-   Quest area navigation
-   Camera target coordination
-   Planet focus state

### React Router

The application uses `react-router-dom` for navigation. The main routes are defined in `src/config/routes.tsx`. The `useNavigate` hook is used to programmatically navigate between pages, such as from the quest world to the quiz page.

The main routes include:
- `/login`: User authentication
- `/`: Start screen
- `/quests`: Main 3D quest world
- `/quiz`: Quiz gameplay interface
- `/profile`: User profile management
- `/leaderboard`: Competitive rankings
- `/achievements`: User achievements
- `/multiplayer` and `/multiplayer/:gameId`: Multiplayer functionality

The application uses lazy loading for route components to improve performance.

## Component Breakdown

-   **`QuestWorld.tsx`**: The main component that brings together the 3D world and the quest system. It manages the `cameraTarget` state and handles planet selection and deselection.
-   **`PlanetaryApp.tsx`**: The root of the `react-three-fiber` application. It sets up the `Canvas` and passes the necessary props to the `Scene` component.
-   **`Scene.tsx`**: The main scene, containing the solar system, lights, and camera controls. It also handles the deselection logic by using an `onPointerMissed` event.
-   **`SolarSystem.tsx`**: Renders the planets and includes an invisible plane to capture clicks for deselection.
-   **`CameraAnimator.tsx`**: Handles camera animations between planets and quest areas. It uses `gsap` for smooth transitions.
-   **`QuestMenu.tsx`**: The UI for selecting quests. When a quest is selected, it updates the `cameraTarget` in `QuestWorld`.
-   **`QuizPage.tsx`**: The page where the user plays the trivia quiz.

## Data Flow

### Quest Selection

1.  The user selects a quest in the `QuestMenu` component.
2.  `QuestMenu` calls the `onQuestSelect` callback, which updates the `cameraTarget` state in `QuestWorld`.
3.  The `cameraTarget` is passed down to `PlanetaryApp`, `Scene`, and finally to `CameraAnimator`.
4.  `CameraAnimator` animates the camera to the target planet.

### Planet Interaction

1.  The user clicks on a planet in the `SolarSystem` component.
2.  The `onPlanetClick` callback is called, which updates the `selectedPlanet` in the `useSolarSystemStore` and the `cameraTarget` in `QuestWorld`.
3.  If the user clicks on the background, the `onPlanetDeselect` callback is called, which clears the `selectedPlanet` and `cameraTarget`.
4.  When the `selectedPlanet` changes, the `useEffect` hook in `QuestWorld` updates the `cameraTarget` to the selected quest area.

### Starting a Quiz

1.  When a quest area is selected, the `activeQuest` state in `QuestWorld` is updated.
2.  The user can then click the "Start Quiz" button.
3.  The `startQuiz` function in `QuestWorld` uses the `useNavigate` hook to navigate to the `/quiz` page.

## Services

-   **`firestoreService.ts`**: This service handles all interactions with Firestore. It is used to fetch quest data, user stats, and other game data. It provides functions for:
    - User data management (profiles, stats, achievements)
    - Quest tracking and progression
    - Leaderboard data retrieval
    - Multiplayer game session management

-   **`triviaApi.ts`**: This service is used to fetch trivia questions from the Open Trivia Database API.
    - **Endpoint:** `https://opentdb.com/api.php`
    - **Parameters:** Question count, category, difficulty, and type
    - **Response:** Structured trivia questions with correct and incorrect answers

-   **`authService.ts`**: Manages Firebase authentication operations.
    - User registration and login
    - Password reset functionality
    - Authentication state tracking

-   **`localDataStorage.ts`**: Handles local storage operations for offline functionality.

-   **`notificationService.ts`**: Manages system notifications and alerts.

-   **`shareService.ts`**: Provides functionality for sharing achievements and scores.

## File Tree

```
src/
├── components/
│   ├── common/
│   │   ├── BackgroundAnimation.tsx
│   │   ├── ErrorBoundary.tsx
│   │   ├── GlobalLoadingIndicator.tsx
│   │   ├── NotificationToast.tsx
│   │   ├── Settings.tsx
│   │   └── withNotifications.tsx
│   ├── Achievements.tsx
│   ├── Leaderboard.tsx
│   ├── Login.tsx
│   ├── LoomScene.tsx
│   ├── MultiplayerGame.tsx
│   ├── MultiplayerLobby.tsx
│   ├── Navbar.tsx
│   ├── Profile.tsx
│   ├── QuestMenu.tsx
│   ├── Quests.tsx
│   ├── QuestWorld.tsx
│   ├── Quiz.tsx
│   ├── QuizPage.tsx
│   ├── StartScreen.tsx
│   └── threadShaders.ts
├── config/
│   ├── gameConfig.ts
│   ├── physicsConfig.ts
│   ├── planetData.ts
│   ├── questAreaData.ts
│   ├── questDefinitions.ts
│   └── routes.tsx
├── context/
│   ├── AuthContext.ts
│   ├── AuthContext.tsx
│   ├── AuthContextValue.ts
│   ├── LoadingContext.tsx
│   ├── LoadingContextValue.ts
│   ├── NotificationContext.tsx
│   ├── NotificationContextValue.ts
│   ├── QuizProgressContext.tsx
│   ├── QuizProgressContextValue.ts
│   ├── ThemeContext.tsx
│   └── ThemeContextValue.ts
├── hooks/
│   ├── useAchievementManager.tsx
│   ├── useAuth.ts
│   ├── useBadgeManager.tsx
│   ├── useLoading.ts
│   ├── useMultiplayerGame.ts
│   ├── useNotifications.ts
│   ├── useQuestGenerator.tsx
│   ├── useQuestManager.tsx
│   ├── useQuizFlow.tsx
│   ├── useQuizProgress.ts
│   ├── useStreakTracker.tsx
│   ├── useTheme.ts
│   ├── useUserFirestoreData.tsx
│   └── useUserStats.tsx
├── planetary-system/
│   ├── scene/
│   │   ├── planets/
│   │   │   ├── AshTwin.tsx
│   │   │   ├── BrittleHollow.tsx
│   │   │   ├── DarkBramble.tsx
│   │   │   ├── EmberTwin.tsx
│   │   │   ├── GiantsDeep.tsx
│   │   │   ├── QuantumMoon.tsx
│   │   │   └── TimberHearth.tsx
│   │   ├── CamControls.jsx
│   │   ├── CameraAnimator.tsx
│   │   ├── PlanetAtmosphere.jsx
│   │   ├── Scene.tsx
│   │   ├── SolarSystem.tsx
│   │   └── Stars.jsx
│   ├── shaders/
│   │   ├── black-hole/
│   │   │   ├── BlackHole.tsx
│   │   │   ├── fragment.glsl
│   │   │   └── vertex.glsl
│   │   └── materials/
│   │       ├── cloudy-surface/
│   │       │   ├── CloudySurfaceMaterial.ts
│   │       │   ├── fragment.glsl
│   │       │   └── vertex.glsl
│   │       ├── sand-column/
│   │       │   ├── fragment.glsl
│   │       │   ├── SandColumnMaterial.ts
│   │       │   └── vertex.glsl
│   │       └── smoke/
│   │           ├── fragment.glsl
│   │           ├── Smoke.tsx
│   │           └── vertex.glsl
│   ├── ui/
│   │   ├── label/
│   │   │   └── Label.tsx
│   │   ├── loading-screen/
│   │   │   └── LoadingScreen.tsx
│   │   ├── ArrowNavigation.css
│   │   ├── ArrowNavigation.tsx
│   │   └── UI.tsx
│   ├── PlanetaryApp.tsx
│   ├── States.d.ts
│   └── States.ts
├── services/
│   ├── authService.ts
│   ├── firestoreService.ts
│   ├── localDataStorage.ts
│   ├── notificationService.ts
│   ├── shareService.ts
│   └── triviaApi.ts
├── types/
│   ├── glsl.d.ts
│   ├── jsx.d.ts
│   ├── react-three-cannon.d.ts
│   ├── trivia.ts
│   └── troika-three-text.d.ts
├── utils/
│   ├── dateUtils.ts
│   └── errorLogger.ts
├── app.css
├── App.test.tsx
├── App.tsx
├── firebase.ts
└── main.tsx
```

## Styling

The project uses Tailwind CSS for utility-first styling. The configuration file is `tailwind.config.js`. PostCSS is used for processing the CSS, and its configuration is in `postcss.config.js`. Global styles and Tailwind directives are located in `styles.css`. Component-specific styles are co-located with their components, either as inline styles or as separate CSS files (e.g., `ArrowNavigation.css`).

Key styling features include:
- Custom color scheme with trivia-themed variables
- Responsive design for different screen sizes
- Animation classes for UI transitions
- Backdrop blur effects for modals and overlays
- Custom 3D styling for the planetary system

## Testing Strategy

The project uses Vitest for testing. The configuration is in `vitest.config.ts`. Test files are co-located with the components they are testing and have the `.test.tsx` extension (e.g., `App.test.tsx`). The tests can be run using the `npm run test` command.

Testing includes:
- Component tests using React Testing Library
- Hook tests for custom React hooks
- Service mocks for external dependencies
- JSDOM for simulating browser environment

The testing setup includes:
- Custom test utilities in `src/utils/test-utils.ts`
- Mock implementations for Firebase services
- Test fixtures for common data structures

## State Management Deep Dive

The application uses `zustand` for managing the state of the 3D world via the `useSolarSystemStore`. This store is defined in `src/planetary-system/States.ts`. It is responsible for tracking:

-   `selectedPlanet`: The currently selected planet.
-   `questAreas`: The quest areas for the selected planet.
-   `selectedQuestAreaIndex`: The index of the currently selected quest area.
-   `isPlanetJustSelected`: A flag to prevent the camera from immediately snapping to a quest area when a planet is first selected.
-   `focus`: Tracks which planet is currently in focus.
-   `quantumObserved`: Special state for the quantum moon mechanics.

The store also includes actions for updating the state, such as:
- `setSelectedPlanet`: Updates the selected planet and loads its quest areas
- `nextQuestArea`: Navigates to the next quest area on the current planet
- `previousQuestArea`: Navigates to the previous quest area on the current planet
- `setQuestAreas`: Updates the available quest areas
- `setIsPlanetJustSelected`: Controls the camera animation behavior

The store is used in several key components:
- `QuestWorld.tsx`: Manages the `cameraTarget` state based on store updates
- `Scene.tsx`: Displays arrow navigation and handles planet selection/deselection
- `SolarSystem.tsx`: Controls planet visibility based on focus state
- `CameraAnimator.tsx`: Animates camera movements based on target changes

This state management approach allows for decoupled components that react to shared state changes, making the codebase more maintainable and testable.

## Key Component Signatures & Props

To understand how the main components are connected, here are their props (signatures):

**`QuestWorld.tsx`**

This component is the root of the 3D experience and does not take any props.

**`PlanetaryApp.tsx`**

```typescript
interface PlanetaryAppProps {
    onPlanetClick: (planetName: string) => void;
    onPlanetDeselect: () => void;
    cameraTarget: {
        planetName: string;
        objectName?: string;
        position?: [number, number, number];
    } | null;
}
```

**`Scene.tsx`**

```typescript
interface SceneProps {
    onPlanetClick: (planetName: string) => void;
    onPlanetDeselect: () => void;
    cameraTarget: {
        planetName: string;
        objectName?: string;
        position?: [number, number, number];
    } | null;
}
```

**`SolarSystem.tsx`**

```typescript
interface SolarSystemProps {
  onPlanetClick: (planetName: string) => void;
  onPointerMissed?: () => void;
  focus?: string | null;
}
```

**`CameraAnimator.tsx`**

```typescript
interface CameraAnimatorProps {
  target: {
    planetName: string;
    objectName?: string;
    position?: [number, number, number];
  } | null;
}
```

## 3D Asset and Model Loading

The 3D models are stored in the `public/models` directory. They are loaded into the planet components (e.g., `TimberHearth.tsx`) using the `useGLTF` hook from `@react-three/drei`. The `planetName` prop is used to construct the path to the correct model file. For example, the `TimberHearth` component loads the model from `public/models/timber-hearth/timber-hearth.glb`.

The naming convention is that the planet name in `planetData.ts` corresponds to the name of the directory and the `.glb` file for that planet.

## A Note on GLSL and Shaders

The project uses custom GLSL shaders for some visual effects. These shaders are located in the `src/planetary-system/shaders` directory. They are loaded as raw strings and used to create custom materials. For example, the `BlackHole.tsx` component uses the shaders in `src/planetary-system/shaders/black-hole` to create the black hole effect.

When working with visual effects, it is important to check this directory for existing shaders that can be reused or modified.

## Data Models and Schemas

Understanding the shape of the data is critical for refactoring. Here are the most important data structures:

### Zustand Store (`useSolarSystemStore`)

Defined in `src/planetary-system/States.ts`.

```typescript
interface SolarSystemState {
  selectedPlanet: string | null;
  questAreas: QuestArea[];
  selectedQuestAreaIndex: number;
  isPlanetJustSelected: boolean;
  actions: {
    setSelectedPlanet: (planetName: string | null) => void;
    setQuestAreas: (areas: QuestArea[]) => void;
    nextQuestArea: () => void;
    previousQuestArea: () => void;
    setIsPlanetJustSelected: (isJustSelected: boolean) => void;
  };
}
```

### Core TypeScript Interfaces

These types are found throughout the application, primarily in the `src/types` and `src/config` directories.

**`Quest` (from `src/services/firestoreService.ts`)**

```typescript
export interface QuestWithDefinition {
  id: string;
  userId: string;
  definition: QuestDefinition;
  progress: number;
  completed: boolean;
}

export interface QuestDefinition {
  id: string;
  name: string;
  description: string;
  planet: string;
  category: number; // Corresponds to a trivia category ID
}
```

**`PlanetData` (from `src/config/planetData.ts`)**

```typescript
export interface PlanetData {
  name: string;
  position: [number, number, number];
  scale: number;
}
```

**`QuestArea` (from `src/config/questAreaData.ts`)**

```typescript
export interface QuestArea {
  id: string;
  name: string;
  position: [number, number, number];
}
```

**`TriviaQuestion` (from `src/types/trivia.ts`)**

```typescript
export interface TriviaQuestion {
  category: string;
  type: string;
  difficulty: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
}
```

## API and Service Interactions

### `triviaApi.ts`

This service is responsible for fetching trivia questions from the Open Trivia Database API.

-   **Endpoint:** `https://opentdb.com/api.php`
-   **Method:** `GET`
-   **Example Query:** `?amount=10&category=18&difficulty=medium&type=multiple`
-   **Response:**

    ```json
    {
      "response_code": 0,
      "results": [
        {
          "category": "Science: Computers",
          "type": "multiple",
          "difficulty": "medium",
          "question": "What does the 'S' in the acronym SIM stand for?",
          "correct_answer": "Subscriber",
          "incorrect_answers": [
            "Single",
            "Secure",
            "Solid"
          ]
        }
      ]
    }
    ```

### `firestoreService.ts`

This service handles all interactions with Firebase Firestore. It provides functions for:

-   Fetching user data and stats.
-   Fetching quest definitions and user quest progress.
-   Updating user progress and creating new game data.

All data is stored in collections that correspond to the data models (e.g., `users`, `quests`).

## Component Hierarchy

This is a simplified view of the main component tree for the 3D world:

```
QuestWorld
└── PlanetaryApp
    └── Canvas (from react-three-fiber)
        └── Scene
            ├── SolarSystem
            │   ├── TimberHearth
            │   ├── EmberTwin
            │   └── ... (other planets)
            ├── CameraAnimator
            └── CamControls
```

## Business Logic and Game Rules

This section outlines the core rules of the game, which are essential for any refactoring that touches gameplay mechanics.

-   **Quest Completion:** A quest is considered complete when the user successfully answers a certain number of trivia questions related to the quest's category. The exact number is defined in `src/config/gameConfig.ts`.
-   **Scoring:** Points are awarded for each correct answer. The scoring system may take into account the difficulty of the question and the time taken to answer.
-   **Streaks:** The `useStreakTracker` hook suggests a system for tracking consecutive correct answers, which may provide bonus points.
-   **Achievements and Badges:** The `useAchievementManager` and `useBadgeManager` hooks imply a system for rewarding users for completing certain milestones (e.g., completing all quests on a planet, achieving a certain score).
-   **Multiplayer:** The presence of `MultiplayerGame.tsx` and `MultiplayerLobby.tsx` indicates a multiplayer mode, where users can likely compete in quizzes.

## Known Issues and Technical Debt

The application has a few areas that could be improved:

- **Type Safety**: Some components use `@ts-expect-error` or type assertions that could be improved with proper typing.
- **Test Coverage**: While the testing framework is in place, test coverage could be expanded.
- **Error Handling**: Error boundaries are implemented, but more granular error handling could be added.
- **Accessibility**: The application could benefit from improved accessibility features, especially for the 3D components.
- **Mobile Optimization**: The 3D experience could be further optimized for mobile devices.
- **Code Documentation**: Some complex components could benefit from additional documentation.


## Build and Deployment

The application uses Vite for building and bundling. The main build commands are:

```bash
# Development server with hot module replacement
npm run dev

# Production build
npm run build

# Preview production build locally
npm run preview
```

The build process includes:
- TypeScript compilation
- Asset optimization
- Bundle splitting for improved loading performance
- CSS processing with PostCSS and Tailwind
- GLSL shader compilation

The application can be deployed to various hosting platforms, with Firebase Hosting being a natural choice given the Firebase backend integration.

## Performance Considerations

The application implements several performance optimizations:

- **Code Splitting**: Uses React.lazy and dynamic imports to split code by route
- **Asset Optimization**: 3D models are optimized for web delivery
- **Suspense**: Implements React Suspense for loading states
- **Memoization**: Uses React.memo and useMemo to prevent unnecessary re-renders
- **Bundle Analysis**: Uses rollup-plugin-visualizer for bundle size analysis

## Future Outlook: Making Trivia Quest Advanced Stand Out

This section provides some forward-thinking ideas that could be implemented to make this application truly unique and engaging.

-   **Procedurally Generated Solar Systems:** Instead of a fixed solar system, a new, unique one could be generated for each user or on a regular basis (e.g., weekly). This would leverage the component-based nature of the planets and provide endless replayability.

-   **Dynamic, AI-Generated Quests:** The quest system could be integrated with a large language model to generate new quests, storylines, and trivia questions on the fly. This could be based on real-world events, user interests, or even the user's past performance.

-   **Immersive WebXR Integration:** The application could be made fully VR- and AR-compatible using the WebXR features of `react-three-fiber`. This would allow users to explore the solar system in a much more immersive way, potentially even flying their own ship between planets.

-   **Social Hubs and Collaborative Quests:** The multiplayer functionality could be expanded to include persistent social hubs on planets. Here, users could meet, chat, and team up for large-scale collaborative quests or tournaments that require multiple users to answer questions correctly.

-   **Deep Physics and Orbital Mechanics:** The `react-three-cannon` physics library could be used to its full potential to simulate realistic orbital mechanics. This would make the solar system feel more dynamic and alive, with planets orbiting the sun and moons orbiting their planets.

-   **Player-Created Content:** A powerful feature would be to allow users to create and share their own quests, trivia categories, and even custom planets. This would foster a strong community and provide a virtually endless stream of new content for players to explore.