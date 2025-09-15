export const ACHIEVEMENT_DEFINITIONS = [
  { id: 'first-win', name: 'First Victory', description: 'Complete your first quiz', threshold: 10, reward: 50, type: 'points' },
  { id: 'quiz-master', name: 'Quiz Master', description: 'Answer 50 questions correctly', threshold: 50, reward: 200, type: 'correctAnswers' },
  { id: 'streak-king', name: 'Streak King', description: 'Maintain a 7-day streak', threshold: 7, reward: 150, type: 'streak' },
  { id: 'point-milestone', name: 'Point Milestone', description: 'Reach 500 points', threshold: 500, reward: 300, type: 'points' },
];

export const BADGE_DEFINITIONS = [
  { name: 'Beginner', correctNeeded: 10 },
  { name: 'Trivia Star', correctNeeded: 25 },
  { name: 'Quiz Master', correctNeeded: 50 },
];

export const CHALLENGE_BADGE_DEFINITIONS = [
  { name: 'Daily Challenger', correctNeeded: 5, period: 'daily' },
  { name: 'Weekly Warrior', correctNeeded: 20, period: 'weekly' },
  { name: 'Monthly Master', correctNeeded: 50, period: 'monthly' },
];

export const STREAK_BADGE_DEFINITIONS = [
  { name: 'Streak Starter', streakNeeded: 3 },
  { name: 'Streak Legend', streakNeeded: 7 },
  { name: 'Streak Master', streakNeeded: 15 },
];

export const QUIZ_POINTS = {
  CORRECT: 10,
  INCORRECT: 5,
};

// Placeholder for QUEST_DEFINITIONS
export const QUEST_DEFINITIONS = [
  { id: 'daily-quiz', name: 'Complete a Daily Quiz', description: 'Finish one quiz today', type: 'daily', reward: 20 },
  { id: 'answer-5-correct', name: 'Answer 5 Correctly', description: 'Get 5 correct answers in a single quiz', type: 'single_quiz_correct', threshold: 5, reward: 30 },
];
