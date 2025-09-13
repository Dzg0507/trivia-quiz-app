import { useState, useEffect, useCallback } from 'react';
import { firestoreService } from '../services/firestoreService';
import { useAuth } from '../context/AuthContext';

export const useUserStats = () => {
  const { currentUser } = useAuth();
  const [userStats, setUserStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUserStats = useCallback(async () => {
    if (!currentUser) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const stats = await firestoreService.getUserData(currentUser);
    setUserStats(stats);
    setLoading(false);
  }, [currentUser]);

  useEffect(() => {
    loadUserStats();
  }, [loadUserStats]);

  const updateUserStats = useCallback(async (statsUpdate) => {
    if (!currentUser) return;

    await firestoreService.updateUserDataInTransaction(currentUser, (currentStats) => {
      const newStats = {
        ...currentStats,
        points: (currentStats.points || 0) + (statsUpdate.score || 0),
        questionsAttempted: (currentStats.questionsAttempted || 0) + (statsUpdate.questionsAttempted || 0),
        correctAnswers: (currentStats.correctAnswers || 0) + (statsUpdate.correctAnswers || 0),
        incorrectAnswers: (currentStats.incorrectAnswers || 0) + (statsUpdate.incorrectAnswers || 0),

        // Streak
        currentStreak: statsUpdate.correct ? (currentStats.currentStreak || 0) + 1 : 0,
        maxStreak: Math.max(currentStats.maxStreak || 0, statsUpdate.correct ? (currentStats.currentStreak || 0) + 1 : 0),

        // Categories
        correctAnswersByCategory: { ...(currentStats.correctAnswersByCategory || {}) },
        categoriesPlayed: [...(currentStats.categoriesPlayed || [])],

        // Power-ups
        powerUpsUsed: { ...(currentStats.powerUpsUsed || {}) },

        // Quests
        fastAnswers: (currentStats.fastAnswers || 0) + (statsUpdate.fastAnswers || 0),
        perfectQuizzes: (currentStats.perfectQuizzes || 0) + (statsUpdate.perfectQuizzes || 0),
      };

      // Conditionally add properties to avoid creating 'undefined' keys
      if (statsUpdate.powerUp) {
        newStats.powerUpsUsed[statsUpdate.powerUp] = (newStats.powerUpsUsed[statsUpdate.powerUp] || 0) + 1;
      }
      if (statsUpdate.category) {
        newStats.correctAnswersByCategory[statsUpdate.category] = (newStats.correctAnswersByCategory[statsUpdate.category] || 0) + (statsUpdate.correct ? 1 : 0);
        newStats.categoriesPlayed = Array.from(new Set([...(newStats.categoriesPlayed || []), statsUpdate.category]));
      }

      return newStats;
    });

    await loadUserStats();
  }, [currentUser, loadUserStats]);

  return { userStats, loading, updateUserStats };
};
