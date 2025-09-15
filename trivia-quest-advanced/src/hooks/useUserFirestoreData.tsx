import { useState, useEffect, useCallback } from 'react';
import { firestoreService, UserData as FirestoreUserData } from '../services/firestoreService.ts';
import { localDataStorage } from '../services/localDataStorage.ts';
import { User } from 'firebase/auth'; // Import User from firebase/auth

// Define a more specific initial user data structure if needed
const INITIAL_USER_DATA: FirestoreUserData = {
  username: '',
  createdAt: new Date(),
  stats: {
    totalQuizzes: 0,
    totalScore: 0,
    bestScore: 0,
    averageAccuracy: 0,
    longestStreak: 0,
  },
  profile: {
    avatar: '😊',
    bio: '',
  },
  achievements: [],
  quests: [],
};

export const useUserFirestoreData = (currentUser: User | null) => {
  const [userData, setUserData] = useState<FirestoreUserData>(INITIAL_USER_DATA);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<unknown>(null); // Consider a more specific error type

  const syncUserData = useCallback(async () => {
    if (!currentUser || !currentUser.uid) {
      setUserData(INITIAL_USER_DATA);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const data = await firestoreService.getUserData(currentUser.uid);
      const mergedData = data ? { ...INITIAL_USER_DATA, ...data } : INITIAL_USER_DATA;
      setUserData(mergedData);
      localDataStorage.setParsedItem<FirestoreUserData>(`user_data_${currentUser.uid}`, mergedData);
    } catch (err) {
      console.error('Error syncing user data from Firestore:', err);
      setError(err);
      const localData = localDataStorage.getParsedItem<FirestoreUserData>(`user_data_${currentUser.uid}`, INITIAL_USER_DATA);
      setUserData(localData);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  const saveUserData = useCallback(async (newData: Partial<FirestoreUserData>) => {
    if (!currentUser || !currentUser.uid) return;
    setUserData(prev => {
      const updatedData = { ...prev, ...newData };
      firestoreService.updateUserData(currentUser.uid, updatedData);
      localDataStorage.setParsedItem<FirestoreUserData>(`user_data_${currentUser.uid}`, updatedData);
      return updatedData;
    });
  }, [currentUser]);

  useEffect(() => {
    syncUserData();
  }, [currentUser, syncUserData]);

  return { userData, loading, error, saveUserData, syncUserData };
};
