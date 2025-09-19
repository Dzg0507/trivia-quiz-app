import { useState, useEffect, useCallback } from 'react';
import { firestoreService, UserStats, UserProfile } from '../services/firestoreService.ts';
import { useAuth } from '../hooks/useAuth.ts';

export const useUserStats = () => {
  const { currentUser } = useAuth();
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<unknown>(null); // Consider a more specific error type

  const fetchUserStats = useCallback(async () => {
    if (!currentUser || !currentUser.uid) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const userData = await firestoreService.getUserData(currentUser.uid);
      if (userData) {
        setUserStats(userData.stats);
        setProfile(userData.profile);
      }
    } catch (err) {
      console.error("Error fetching user data:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  const updateUserStats = useCallback(async (newStats: Partial<UserStats>) => {
    if (!currentUser || !currentUser.uid) return;
    try {
      // Fetch current stats to merge, or assume firestoreService handles merging
      const currentData = await firestoreService.getUserData(currentUser.uid);
      const updatedStats = { ...currentData?.stats, ...newStats } as UserStats;
      await firestoreService.updateUserData(currentUser.uid, { stats: updatedStats });
      setUserStats(updatedStats);
    } catch (err) {
      console.error("Error updating user stats:", err);
      setError(err);
    }
  }, [currentUser]);

  const updateProfileSettings = useCallback(async (newSettings: Partial<UserProfile>) => {
    if (!currentUser || !currentUser.uid) return;
    try {
      // Fetch current profile to merge, or assume firestoreService handles merging
      const currentData = await firestoreService.getUserData(currentUser.uid);
      const updatedProfile = { ...currentData?.profile, ...newSettings } as UserProfile;
      await firestoreService.updateUserData(currentUser.uid, { profile: updatedProfile });
      setProfile(updatedProfile);
    } catch (err) {
      console.error("Error updating profile settings:", err);
      setError(err);
    }
  }, [currentUser]);

  useEffect(() => {
    fetchUserStats();
  }, [fetchUserStats]);

  return { userStats, profile, loading, error, updateUserStats, updateProfileSettings };
};
