import { useCallback } from 'react';
import { useUserStats } from './useUserStats';
import { firestoreService } from '../services/firestoreService';
import { useAuth } from '../context/AuthContext';
import { skills } from '../config/skillsConfig';

export const useSkillManager = () => {
  const { currentUser } = useAuth();
  const { userStats, loading, updateUserStats } = useUserStats();

  const unlockedSkills = userStats?.unlockedSkills || [];
  const userPoints = userStats?.points || 0;

  const unlockSkill = useCallback(async (skill) => {
    if (!currentUser) return;

    const isUnlocked = unlockedSkills.includes(skill.id);
    if (isUnlocked) return;

    const canUnlock = userPoints >= skill.cost && skill.dependencies.every(dep => unlockedSkills.includes(dep));
    if (!canUnlock) return;

    const newUnlockedSkills = [...unlockedSkills, skill.id];
    const newPoints = userPoints - skill.cost;

    await firestoreService.setUserData(currentUser, {
      unlockedSkills: newUnlockedSkills,
      points: newPoints,
    }, true); // merge = true

    // Manually trigger a refresh of user stats after unlocking a skill
    updateUserStats({});

  }, [currentUser, unlockedSkills, userPoints, updateUserStats]);

  return { skills, unlockedSkills, userPoints, loading, unlockSkill };
};
