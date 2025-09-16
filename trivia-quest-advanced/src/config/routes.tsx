import { lazy } from 'react';
import QuestWorld from '../components/QuestWorld.tsx';

// Lazy load components for code splitting
const StartScreen = lazy(() => import('../components/StartScreen.tsx'));
const QuizPage = lazy(() => import('../components/QuizPage.tsx'));
const Profile = lazy(() => import('../components/Profile.tsx'));
const Login = lazy(() => import('../components/Login.tsx'));
const Leaderboard = lazy(() => import('../components/Leaderboard.tsx'));
const Achievements = lazy(() => import('../components/Achievements.tsx'));
const MultiplayerLobby = lazy(() => import('../components/MultiplayerLobby.tsx')); // New
const MultiplayerGame = lazy(() => import('../components/MultiplayerGame.tsx'));   // New

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
];
