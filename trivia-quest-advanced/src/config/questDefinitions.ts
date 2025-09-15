import { Quest } from '../services/firestoreService';

export const QUEST_DEFINITIONS: Quest[] = [
  // Daily Quests
  {
    id: 'daily-quiz-1',
    name: 'Daily Dose of Trivia',
    description: 'Complete one quiz.',
    category: 'General',
    theme: 'Daily Challenge',
    type: 'daily',
    conditions: [{ stat: 'totalQuizzes', operator: '>=', value: 1 }],
    reward: 20,
  },
  {
    id: 'daily-correct-5',
    name: 'Quick Learner',
    description: 'Answer 5 questions correctly.',
    category: 'General',
    theme: 'Daily Challenge',
    type: 'daily',
    conditions: [{ stat: 'totalScore', operator: '>=', value: 50 }], // Assuming 10 points per correct answer
    reward: 30,
  },

  // Weekly Quests
  {
    id: 'weekly-streak-3',
    name: 'Consistent Challenger',
    description: 'Maintain a 3-day streak.',
    category: 'Consistency',
    theme: 'Weekly Goals',
    type: 'weekly',
    conditions: [{ stat: 'longestStreak', operator: '>=', value: 3 }],
    reward: 100,
  },
  {
    id: 'weekly-score-500',
    name: 'Weekly High Score',
    description: 'Score 500 points in a week.',
    category: 'Performance',
    theme: 'Weekly Goals',
    type: 'weekly',
    conditions: [{ stat: 'totalScore', operator: '>=', value: 500 }],
    reward: 150,
  },

  // Monthly Quests
  {
    id: 'monthly-master',
    name: 'Trivia Master',
    description: 'Answer 100 questions correctly in a month.',
    category: 'Mastery',
    theme: 'Monthly Milestones',
    type: 'monthly',
    conditions: [{ stat: 'totalScore', operator: '>=', value: 1000 }],
    reward: 500,
  },
];
