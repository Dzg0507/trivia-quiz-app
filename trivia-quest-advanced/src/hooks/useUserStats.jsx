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

  const updateUserStats = useCallback(async (newStats) => {
    if (!currentUser) return;
    const currentStats = await firestoreService.getUserData(currentUser);
    const updatedStats = {
      ...currentStats,
      ...newStats,
      points: (currentStats.points || 0) + (newStats.score || 0),
      questionsAttempted: (currentStats.questionsAttempted || 0) + (newStats.questionsAttempted || 0),
    };
    await firestoreService.setUserData(currentUser, updatedStats);
    await loadUserStats();
  }, [currentUser, loadUserStats]);

  return { userStats, loading, updateUserStats };
};
