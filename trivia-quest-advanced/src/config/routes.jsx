import React from 'react';
import Quiz from '../components/Quiz';
import Profile from '../components/Profile';
import Quests from '../components/Quests';
import Login from '../components/Login';
import Leaderboard from '../components/Leaderboard';
import Achievements from '../components/Achievements';
import GalaxyMap from '../components/GalaxyMap';
import SkillsPage from '../pages/SkillsPage';

export const appRoutes = [
  {
    path: '/login',
    element: <Login />,
    protected: false,
    name: 'Login'
  },
  {
    path: '/',
    element: <GalaxyMap />,
    protected: true,
    name: 'Galaxy Map'
  },
  {
    path: '/quiz',
    element: <Quiz />,
    protected: true,
    name: 'Quiz'
  },
  {
    path: '/skills',
    element: <SkillsPage />,
    protected: true,
    name: 'Skills'
  },
  {
    path: '/quests',
    element: <Quests />,
    protected: true,
    name: 'Quests'
  },
  {
    path: '/profile',
    element: <Profile />,
    protected: true,
    name: 'Profile'
  },
  {
    path: '/leaderboard',
    element: <Leaderboard />,
    protected: true,
    name: 'Leaderboard'
  },
  {
    path: '/achievements',
    element: <Achievements />,
    protected: true,
    name: 'Achievements'
  },
];