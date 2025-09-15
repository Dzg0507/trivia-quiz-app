# AI Instructions for Trivia Quest Advanced

This document provides a comprehensive breakdown of the Trivia Quest Advanced project for any AI model that needs to work with the codebase.

## Project Overview

Trivia Quest Advanced is a web-based trivia game built with React, Vite, and Firebase. It features user authentication, a variety of quiz categories, daily quests, achievements, and a leaderboard. The application is designed to be engaging and visually appealing, with animations and a 3D background.

## Core Features

*   **User Authentication:** Users can sign up and log in using Firebase Authentication.
*   **Trivia Quizzes:** The core of the application. Users can answer trivia questions from various categories.
*   **Daily Quests:** Users are given daily quests to complete for rewards.
*   **Achievements:** Users can unlock achievements by completing certain milestones.
*   **Leaderboard:** Users can see how they rank against other players.
*   **User Profiles:** Users have a profile page where they can see their stats and achievements.
*   **Notifications:** The application provides feedback to the user through notifications.

## Project Structure

The project is organized into the following directories:

*   `public/`: Contains the static assets, including the 3D model for the background.
*   `src/`: Contains the main source code for the application.
    *   `components/`: Contains the React components.
        *   `common/`: Contains common components that are used throughout the application.
    *   `config/`: Contains the configuration files for the application, such as the routes.
    *   `context/`: Contains the React context providers for state management.
    *   `hooks/`: Contains the custom React hooks.
    *   `services/`: Contains the services that interact with external APIs, such as Firebase and the trivia API.
    *   `utils/`: Contains utility functions.

## Key Components & Logic

*   **`App.jsx`:** The main component of the application. It sets up the routing, authentication, and main layout.
*   **`Quiz.jsx`:** The main component for the trivia game. It fetches questions, handles user answers, and updates the user's score.
*   **`useQuizFlow.jsx`:** A custom hook that manages the state and logic for the quiz flow.
*   **`useAchievementManager.jsx`:** A custom hook that manages the user's achievements.
*   **`useQuestManager.jsx`:** A custom hook that manages the user's quests.
*   **`firebase.js`:** Initializes the Firebase application and exports the Firebase services.

## State Management

The application uses a combination of React component state, React context, and custom hooks for state management.

*   **`AuthContext`:** Manages the user's authentication state.
*   **`NotificationContext`:** Manages the application's notifications.
*   **Custom Hooks:** The `use` hooks in the `src/hooks` directory manage the state for different parts of the application, such as the quiz, achievements, and quests.

## Services

The application uses the following services:

*   **`authService.jsx`:** Handles user authentication with Firebase.
*   **`firestoreService.jsx`:** Interacts with the Firestore database to store and retrieve user data.
*   **`triviaApi.jsx`:** Fetches trivia questions from the Open Trivia Database API.
*   **`notificationService.jsx`:** A service for displaying notifications.
*   **`shareService.jsx`:** A service for sharing content.
*   **`localDataStorage.jsx`:** A service for interacting with the browser's local storage.

## Available Scripts

The following scripts are available in the `package.json` file:

*   `npm run dev`: Starts the development server.
*   `npm run build`: Builds the application for production.
*   `npm run lint`: Lints the code.
*   `npm run preview`: Previews the production build.

---

### **Comprehensive Enhancement Plan: Trivia Quest Advanced**

**Goal:** Transform the application from its current state into a highly optimized, robust, and engaging experience, reflecting advanced software engineering practices.

---

#### **Phase 1: Architectural & Code Quality Refinements**

**Task 1.1: Introduce TypeScript for Enhanced Type Safety and Maintainability**
*   **Description:** Systematically convert all JavaScript (`.js`, `.jsx`) files to TypeScript (`.ts`, `.tsx`). This involves adding explicit type definitions for props, state, function arguments, and return values across the entire codebase. Configure `tsconfig.json`, update build scripts, and integrate TypeScript with ESLint.
*   **Files Affected:** All files in `src/`, `package.json`, `vite.config.js`, `eslint.config.js`.
*   **Expected Impact:** Significantly reduces runtime errors, improves code readability and maintainability, facilitates easier refactoring, and enhances developer experience through better autocompletion and static analysis.
*   **Dependencies:** None (foundational change).
*   **Status:** Complete

**Task 1.2: Centralized, Robust Error Handling with Enhanced User Feedback**
*   **Description:** Refine the existing `ErrorBoundary` to provide more granular error reporting (e.g., distinguishing between UI, network, and application logic errors). Implement a global error logging service (e.g., to a console or a mock analytics service). Enhance the `NotificationContext` to support different notification types (success, warning, info, critical) with distinct visual cues and optional user actions (e.g., "retry").
*   **Files Affected:** `src/components/common/ErrorBoundary.jsx`, `src/context/NotificationContext.jsx`, `src/hooks/useNotifications.js`, `src/services/**/*.jsx`, `src/components/**/*.jsx`.
*   **Expected Impact:** Consistent and user-friendly error feedback, reduced code duplication for error handling.
    *   **Dependencies:** Task 1.1 (if types are to be used in error objects).
    *   **Status:** Complete

**Task 1.3: Advanced API Service with Request Cancellation and Unified Error Handling**
*   **Description:** Upgrade `triviaApiService` to leverage `AbortController` for all `axios` requests, allowing for explicit request cancellation (e.g., when a component unmounts or a new request supersedes an old one). Implement a standardized API response structure and integrate API-specific error handling with the centralized notification system (Task 1.2).
*   **Files Affected:** `src/services/triviaApi.jsx`, `src/hooks/useQuizFlow.jsx` (or wherever API calls are made).
*   **Expected Impact:** More stable API interactions, better user experience during network issues, cleaner code.
    *   **Dependencies:** Task 1.2.
    *   **Status:** Complete

**Task 1.4: Implement a Consistent and Animated Global Loading State**
*   **Description:** Develop a dedicated `useLoading` hook or a global `LoadingProvider` that can be easily integrated into components to manage and display a consistent, animated loading indicator (e.g., a full-screen overlay or a component-specific spinner). Replace all ad-hoc loading state implementations.
*   **Files Affected:** `src/components/**/*.jsx` (where loading states are currently handled), potentially a new `src/context/LoadingContext.jsx` and `src/hooks/useLoading.js`.
*   **Expected Impact:** Enhances user experience by providing clear visual feedback during asynchronous operations, reduced code duplication, and ensures a unified loading aesthetic.
    *   **Dependencies:** Task 1.1, Task 3.1 (for advanced loading animations).
    *   **Status:** Complete

#### **Phase 2: Performance Optimizations**

**Task 2.1: Aggressive Memoization and Callback Optimization**
*   **Description:** Conduct a thorough audit of all functional components and custom hooks. Apply `React.memo` to components that receive stable props and `useCallback`/`useMemo` to functions and values that are passed down as props or are expensive to re-compute, ensuring optimal rendering performance.
*   **Files Affected:** All `.tsx` files in `src/components/` and `src/hooks/`.
*   **Expected Impact:** Significantly reduces unnecessary re-renders, leading to a smoother and faster user interface, especially in complex or frequently updated parts of the application.
    *   **Dependencies:** Task 1.1.
    *   **Status:** Complete

**Task 2.2: Advanced Bundle Analysis and Code Splitting Refinement**
*   **Description:** Integrate a bundle analyzer tool (e.g., `rollup-plugin-visualizer`) into the build process. Analyze the bundle size and identify large chunks. Further optimize code splitting beyond lazy loading routes by using `React.lazy` and `Suspense` for component-level splitting where appropriate, and explore dynamic imports for utility functions or libraries.
*   **Files Affected:** `vite.config.js`, `package.json`, `src/App.tsx`, and various component files.
*   **Expected Impact:** Reduces initial load time, improves perceived performance, and optimizes resource delivery for a snappier user experience.
    *   **Dependencies:** Task 1.1.
    *   **Status:** Complete

#### **Phase 3: Advanced UI/UX Enhancements**

**Task 3.1: Implement Sophisticated Micro-interactions and Transitions**
*   **Description:** Elevate the UI with advanced animations using `framer-motion` and `gsap`. This includes:
    *   **Page Transitions:** Smooth transitions between routes.
    *   **Element Entrance/Exit Animations:** Engaging animations for components appearing and disappearing (e.g., quiz questions, leaderboard entries, notifications).
    *   **Interactive Feedback:** Subtle animations on button clicks, input focus, and state changes to provide immediate and delightful user feedback.
*   **Files Affected:** `src/App.tsx`, `src/components/**/*.tsx`, `styles.css`.
*   **Expected Impact:** Transforms the application into a highly engaging and polished user experience, making interactions feel intuitive and responsive.
*   **Dependencies:** Task 2.1.
*   **Status:** Complete

**Task 3.2: Dynamic and Interactive 3D Background Integration**
*   **Description:** Enhance the `BackgroundAnimation` to be more dynamic. Instead of a static animation, make the 3D element react to user interactions (e.g., mouse movement, quiz progress) or application state changes. Explore adding more complex `three.js` effects or integrating it more deeply with the overall theme.
*   **Files Affected:** `src/components/common/BackgroundAnimation.tsx`.
*   **Expected Impact:** Creates a unique, immersive, and visually stunning backdrop that actively contributes to the user experience, moving beyond a passive decorative element.
    *   **Dependencies:** Task 1.1, Task 3.1.
    *   **Status:** Complete

**Task 3.3: Comprehensive Theming System with User Customization**
*   **Description:** Develop a robust theming system that allows users to select from predefined themes (e.g., "Dark Mode," "Retro Neon," "High Contrast") and potentially customize primary/accent colors. This will involve using Tailwind CSS custom properties and a React Context for theme management.
*   **Files Affected:** `tailwind.config.js`, `styles.css`, `src/App.tsx`, `src/components/Navbar.tsx`, and other components. A new `src/context/ThemeContext.tsx` and `src/hooks/useTheme.ts` will be created.
*   **Expected Impact:** Provides a highly personalized user experience, caters to diverse preferences, and demonstrates advanced styling capabilities.
*   **Dependencies:** Task 1.1.
*   **Status:** Complete

#### **Phase 4: Advanced Feature Integration (Innovative & Engaging)**

**Task 4.1: AI-Driven Dynamic Difficulty Adjustment for Quizzes**
*   **Description:** Implement an intelligent system that analyzes a user's performance (e.g., accuracy, speed, streak) and dynamically adjusts the difficulty of subsequent questions fetched from the trivia API. This could involve a simple Bayesian update model or a more sophisticated adaptive learning algorithm.
*   **Files Affected:** `src/hooks/useQuizFlow.tsx`, `src/services/triviaApi.tsx`, `src/components/Quiz.tsx`, potentially new utility files for the AI logic.
*   **Expected Impact:** Creates a highly personalized and continuously challenging quiz experience, preventing boredom or frustration and maximizing engagement.
*   **Dependencies:** Task 1.1, Task 1.3.
*   **Status:** Complete

**Task 4.2: Real-time Multiplayer Quiz Challenge (Basic Implementation)**
*   **Description:** Develop a basic real-time multiplayer mode where two users can join a lobby and compete head-to-head in a quiz. This will involve using Firebase Realtime Database or Firestore for real-time synchronization of game state (questions, answers, scores, timer).
*   **Files Affected:** `src/services/firestoreService.tsx`, new components for `MultiplayerLobby.tsx` and `MultiplayerGame.tsx`, new hooks for real-time data.
*   **Expected Impact:** Significantly boosts user engagement through competitive social interaction, offering a "never before seen" feature in this context.
*   **Dependencies:** Task 1.1, Task 1.2, Task 1.3.
*   **Status:** Complete
