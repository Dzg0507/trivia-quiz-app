import { useState, useEffect, useCallback } from 'react';
import { useUserStats } from './useUserStats';
import { achievements } from '../config/gamification';

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
