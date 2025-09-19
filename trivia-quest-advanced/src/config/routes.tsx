import { lazy } from 'react';
import ThreeDPlayground from '../components/3DPlayground.tsx';

// Lazy load components for code splitting
const StartScreen = lazy(() => import('../components/StartScreen.tsx'));
const QuizPage = lazy(() => import('../components/quiz/QuizPage.tsx'));
const Profile = lazy(() => import('../components/profile/Profile.tsx'));
const Login = lazy(() => import('../components/auth/Login.tsx'));
const Leaderboard = lazy(() => import('../components/Leaderboard.tsx'));
const Achievements = lazy(() => import('../components/Achievements.tsx'));
const MultiplayerLobby = lazy(() => import('../components/multiplayer/MultiplayerLobby.tsx'));
const MultiplayerGame = lazy(() => import('../components/multiplayer/MultiplayerGame.tsx'));
const QuestWorld = lazy(() => import('../components/quests/QuestWorld.tsx'));
const QuestGenerator = lazy(() => import('../components/quests/QuestGenerator.tsx'));


// Loading component (not exported to avoid react-refresh issues)

export const appRoutes = [
  {
    path: '/login',
    element: <Login />,
    protected: false,
    name: 'Login',
  },
  {
    path: '/',
    element: <StartScreen />,
    protected: true,
    name: 'Start',
  },
  {
    path: '/quiz',
    element: <QuizPage />,
    protected: true,
    name: 'Quiz',
  },
  {
    path: '/quests',
    element: <QuestWorld />,
    protected: true,
    name: 'Quests',
  },
  {
    path: '/quests/generate',
    element: <QuestGenerator />,
    protected: true,
    name: 'Quest Generator',
  },
  {
    path: '/profile',
    element: <Profile />,
    protected: true,
    name: 'Profile',
  },
  {
    path: '/leaderboard',
    element: <Leaderboard />,
    protected: true,
    name: 'Leaderboard',
  },
  {
    path: '/achievements',
    element: <Achievements />,
    protected: true,
    name: 'Achievements',
  },
  {
    path: '/multiplayer',
    element: <MultiplayerLobby />,
    protected: true,
    name: 'Multiplayer Lobby',
  },
  {
    path: '/multiplayer/:gameId',
    element: <MultiplayerGame />,
    protected: true,
    name: 'Multiplayer Game',
  },
  {
    path: '/playground',
    element: <ThreeDPlayground />,
    protected: false,
    name: 'Playground',
  },
];
