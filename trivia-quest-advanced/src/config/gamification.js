export const achievements = [
  { id: 'specialist', name: 'Specialist', description: 'Answer 10 questions correctly in a single category.', condition: (stats) => Object.values(stats.correctAnswersByCategory || {}).some(count => count >= 10) },
  { id: 'streaker', name: 'Streaker', description: 'Answer 5 questions in a row correctly.', condition: (stats) => stats.maxStreak >= 5 },
  { id: 'collector', name: 'Collector', description: 'Unlock all skills in the skill tree.', condition: (stats) => (stats.unlockedSkills || []).length === 3 }, // Assuming 3 skills
  { id: 'explorer', name: 'Explorer', description: 'Play a quiz in 5 different categories.', condition: (stats) => (stats.categoriesPlayed || []).length >= 5 },
  { id: 'persistent', name: 'Persistent', description: 'Attempt 100 questions.', condition: (stats) => stats.questionsAttempted >= 100 },
];

export const quests = [
  { id: 'history_buff', name: 'History Buff', description: 'Answer 3 history questions correctly.', condition: (stats) => (stats.correctAnswersByCategory?.history || 0) >= 3 },
  { id: 'speed_demon', name: 'Speed Demon', description: 'Answer 5 questions with more than 10 seconds left on the timer.', condition: (stats) => (stats.fastAnswers || 0) >= 5 },
  { id: 'power_user', name: 'Power User', description: 'Use a power-up 3 times.', condition: (stats) => Object.values(stats.powerUpsUsed || {}).reduce((a, b) => a + b, 0) >= 3 },
  { id: 'perfect_quiz', name: 'Perfect Quiz', description: 'Get a perfect score on a quiz.', condition: (stats) => (stats.perfectQuizzes || 0) >= 1 },
];
