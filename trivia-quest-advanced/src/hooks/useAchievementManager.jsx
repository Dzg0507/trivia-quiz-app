import { useCallback } from 'react';
import { useNotifications } from '../context/NotificationContext';
import { ACHIEVEMENT_DEFINITIONS } from '../config/gameConfig';
export const useAchievementManager = (currentUser, achievements, points, correctAnswers, streak, saveUserData) => {
  const { addNotification } = useNotifications();
  const awardAchievement = useCallback((achievementId, reward) => {
    if (!currentUser || achievements.includes(achievementId)) {
      return false;
    }
    const newAchievements = [...achievements, achievementId];
    saveUserData({ achievements: newAchievements, points: points + reward });
    addNotification(
      `Achievement Unlocked: ${ACHIEVEMENT_DEFINITIONS.find(a => a.id === achievementId)?.name || achievementId}!`,
      'success'
    );
    return true;
  }, [currentUser, achievements, points, saveUserData, addNotification]);
  const checkAllAchievements = useCallback(() => {
    ACHIEVEMENT_DEFINITIONS.forEach(ach => {
      let isAchieved = false;
      if (ach.type === 'points') {
        isAchieved = points >= ach.threshold;
      } else if (ach.type === 'correctAnswers') {
        isAchieved = correctAnswers >= ach.threshold;
      } else if (ach.type === 'streak') {
        isAchieved = streak >= ach.threshold;
      }
      if (isAchieved) {
        awardAchievement(ach.id, ach.reward);
      }
    });
  }, [points, correctAnswers, streak, awardAchievement]);
  return {
    awardAchievement,
    checkAllAchievements,
  };
};