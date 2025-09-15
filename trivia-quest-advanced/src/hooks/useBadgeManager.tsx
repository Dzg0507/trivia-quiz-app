import { useCallback } from 'react';
import { useNotifications } from './useNotifications.ts';
import { BADGE_DEFINITIONS, STREAK_BADGE_DEFINITIONS, CHALLENGE_BADGE_DEFINITIONS } from '../config/gameConfig.ts';
import { localDataStorage } from '../services/localDataStorage.ts';
import { getTodayIdentifier, getThisWeekIdentifier, getThisMonthIdentifier } from '../utils/dateUtils.ts';
import { UserData } from '../services/firestoreService.ts'; // Import UserData
import { User } from 'firebase/auth'; // Import User from firebase/auth


export const useBadgeManager = (currentUser: User | null, badges: string[], saveUserData: (_data: Partial<UserData>) => void) => {
  const { addNotification } = useNotifications();

  const awardBadge = useCallback((badgeName: string): boolean => {
    if (!currentUser || badges.includes(badgeName)) {
      return false;
    }
    const newBadges = [...badges, badgeName];
    saveUserData({ badges: newBadges });
    addNotification(`New Badge Unlocked: ${badgeName}!`, 'info');
    return true;
  }, [currentUser, badges, saveUserData, addNotification]);

  const checkGeneralBadges = useCallback((currentCorrectAnswers: number) => {
    BADGE_DEFINITIONS.forEach((badge) => {
      if (currentCorrectAnswers >= (badge.correctNeeded || 0)) {
        awardBadge(badge.name);
      }
    });
  }, [awardBadge]);

  const checkStreakBadges = useCallback((currentStreak: number) => {
    STREAK_BADGE_DEFINITIONS.forEach((badge) => {
      if (currentStreak >= (badge.streakNeeded || 0)) {
        awardBadge(badge.name);
      }
    });
  }, [awardBadge]);

  const checkChallengeBadges = useCallback(() => {
    const today = getTodayIdentifier();
    const thisWeek = getThisWeekIdentifier();
    const thisMonth = getThisMonthIdentifier();

    CHALLENGE_BADGE_DEFINITIONS.forEach((badge) => {
      const periodIdentifier =
        badge.period === 'daily' ? today :
        badge.period === 'weekly' ? thisWeek :
        thisMonth;
      const statsKey = `stats_${currentUser}_${badge.period}_${periodIdentifier}`;
      const stats = localDataStorage.getParsedItem(statsKey, { correct: 0 });
      if (stats.correct >= (badge.correctNeeded || 0)) {
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
