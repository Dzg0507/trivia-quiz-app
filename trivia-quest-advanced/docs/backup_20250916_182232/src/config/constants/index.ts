// Application Constants
export const APP_CONSTANTS = {
  appName: 'Trivia Quest Advanced',
  version: '1.0.0',
  maxQuizQuestions: 20,
  defaultQuizTime: 30, // seconds per question
  maxMultiplayerPlayers: 8,
  leaderboardLimit: 100,
  questTypes: ['daily', 'weekly', 'monthly', 'main'],
  questDifficulties: ['easy', 'medium', 'hard'],
  defaultAvatar: '😊',
  storageKeys: {
    theme: 'trivia-quest-theme',
    lastLogin: 'trivia-quest-last-login',
    cachedQuizzes: 'trivia-quest-cached-quizzes',
    userSettings: 'trivia-quest-user-settings'
  }
};

export const ACHIEVEMENT_THRESHOLDS = {
  quizCompleted: 1,
  quizMaster: 10,
  quizChampion: 50,
  perfectScore: 100,
  streakMaster: 5,
  streakChampion: 10
};

export const BADGE_RARITIES = {
  common: 'common',
  uncommon: 'uncommon',
  rare: 'rare',
  epic: 'epic',
  legendary: 'legendary'
};
