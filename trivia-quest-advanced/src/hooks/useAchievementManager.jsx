import { useState, useEffect, useCallback } from 'react';
import { useUserStats } from './useUserStats';

const achievements = [
  { id: 'correct_1', name: 'Novice', description: 'Answer 1 question correctly.', condition: (stats) => stats.points >= 1 },
  { id: 'correct_10', name: 'Apprentice', description: 'Answer 10 questions correctly.', condition: (stats) => stats.points >= 10 },
  { id: 'correct_50', name: 'Adept', description: 'Answer 50 questions correctly.', condition: (stats) => stats.points >= 50 },
  { id: 'attempt_10', name: 'Getting Started', description: 'Attempt 10 questions.', condition: (stats) => stats.questionsAttempted >= 10 },
  { id: 'attempt_100', name: 'Persistent', description: 'Attempt 100 questions.', condition: (stats) => stats.questionsAttempted >= 100 },
];

export const useAchievementManager = () => {
  const { userStats } = useUserStats();
  const [unlockedAchievements, setUnlockedAchievements] = useState([]);

  const checkAchievements = useCallback(() => {
    if (!userStats) return;
    const newUnlocked = [];
    achievements.forEach((achievement) => {
      if (achievement.condition(userStats)) {
        newUnlocked.push(achievement.id);
      }
    });
    setUnlockedAchievements(newUnlocked);
  }, [userStats]);

  useEffect(() => {
    checkAchievements();
  }, [checkAchievements]);

  return { achievements, unlockedAchievements };
};
