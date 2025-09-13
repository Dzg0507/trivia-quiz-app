import { useCallback } from 'react';
import { useNotifications } from '../context/NotificationContext';
import { BADGE_DEFINITIONS, STREAK_BADGE_DEFINITIONS, CHALLENGE_BADGE_DEFINITIONS } from '../config/gameConfig';
import { localDataStorage } from '../services/localDataStorage';
import { getTodayIdentifier, getThisWeekIdentifier, getThisMonthIdentifier } from '../utils/dateUtils';
export const useBadgeManager = (currentUser, badges, saveUserData) => {
  const { addNotification } = useNotifications();
  const awardBadge = useCallback((badgeName) => {
    if (!currentUser || badges.includes(badgeName)) {
      return false;
    }
    const newBadges = [...badges, badgeName];
    saveUserData({ badges: newBadges });
    addNotification(`New Badge Unlocked: ${badgeName}!`, 'info');
    return true;
  }, [currentUser, badges, saveUserData, addNotification]);
  const checkGeneralBadges = useCallback((currentCorrectAnswers) => {
    BADGE_DEFINITIONS.forEach(badge => {
      if (currentCorrectAnswers >= badge.correctNeeded) {
        awardBadge(badge.name);
      }
    });
  }, [awardBadge]);
  const checkStreakBadges = useCallback((currentStreak) => {
    STREAK_BADGE_DEFINITIONS.forEach(badge => {
      if (currentStreak >= badge.streakNeeded) {
        awardBadge(badge.name);
      }
    });
  }, [awardBadge]);
  const checkChallengeBadges = useCallback(() => {
    const today = getTodayIdentifier();
    const thisWeek = getThisWeekIdentifier();
    const thisMonth = getThisMonthIdentifier();
    CHALLENGE_BADGE_DEFINITIONS.forEach(badge => {
      const periodIdentifier =
        badge.period === 'daily' ? today :
        badge.period === 'weekly' ? thisWeek :
        thisMonth;
      const statsKey = `stats_${currentUser}_${badge.period}_${periodIdentifier}`;
      const stats = localDataStorage.getParsedItem(statsKey, { correct: 0 });
      if (stats.correct >= badge.correctNeeded) {
        awardBadge(badge.name);
      }
    });
  }, [currentUser, awardBadge]);
  return {
    awardBadge,
    checkGeneralBadges,
    checkStreakBadges,
    checkChallengeBadges,
  };
};