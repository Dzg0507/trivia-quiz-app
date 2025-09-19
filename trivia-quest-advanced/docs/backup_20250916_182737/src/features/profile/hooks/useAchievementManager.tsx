import { useState, useEffect, useCallback } from 'react';
import { useUserStats } from './useUserStats.tsx';

import { BADGE_DEFINITIONS } from '../config/gameConfig.ts';

export const useAchievementManager = () => {
  const { userStats } = useUserStats();
  const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>([]);

  const checkAchievements = useCallback(() => {
    if (!userStats) return;
    const newUnlocked: string[] = [];
    BADGE_DEFINITIONS.forEach((badge) => {
      if (userStats.correctAnswers >= badge.correctNeeded) {
        newUnlocked.push(badge.name);
      }
    });
    setUnlockedAchievements(newUnlocked);
  }, [userStats]);

  useEffect(() => {
    checkAchievements();
  }, [checkAchievements]);

  return { achievements: BADGE_DEFINITIONS, unlockedAchievements };
};
