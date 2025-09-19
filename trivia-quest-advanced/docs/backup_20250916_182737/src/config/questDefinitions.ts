import { Quest } from '../services/firestoreService';
import { QUEST_AREAS } from './questAreaData';

// Generate main quests from the quest area data
const mainQuests: Quest[] = QUEST_AREAS.map(area => ({
  id: area.id,
  name: area.name,
  description: area.description,
  category: 'Exploration',
  theme: 'Main Story',
  type: 'main',
  conditions: [{ stat: 'totalQuizzes', operator: '>=', value: 0 }],
  reward: 100,
  planetName: area.planetName,
  position: area.position,
}));

// Define other quests (daily, weekly, monthly)
const otherQuests: Quest[] = [
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
    conditions: [{ stat: 'correctAnswers', operator: '>=', value: 5 }],
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
    conditions: [{ stat: 'correctAnswers', operator: '>=', value: 100 }],
    reward: 500,
  },
];

// Combine all quests into a single export
export const QUEST_DEFINITIONS: Quest[] = [...mainQuests, ...otherQuests];
