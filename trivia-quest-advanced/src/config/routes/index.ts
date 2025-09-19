// Routes Configuration
export const ROUTES = {
  home: '/',
  login: '/login',
  register: '/register',
  profile: '/profile',
  quests: '/quests',
  questDetails: '/quests/:questId',
  quiz: '/quiz/:questId',
  leaderboard: '/leaderboard',
  achievements: '/achievements',
  multiplayer: '/multiplayer',
  multiplayerGame: '/multiplayer/:gameId',
  settings: '/settings',
  notFound: '*'
};

export const getQuestDetailsRoute = (questId: string) => {
  return ROUTES.questDetails.replace(':questId', questId);
};

export const getQuizRoute = (questId: string) => {
  return ROUTES.quiz.replace(':questId', questId);
};

export const getMultiplayerGameRoute = (gameId: string) => {
  return ROUTES.multiplayerGame.replace(':gameId', gameId);
};
