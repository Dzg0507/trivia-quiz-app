import { useState, useEffect, useCallback } from 'react';
import { firestoreService } from '../services/firestoreService';
import { localDataStorage } from '../services/localDataStorage';

const INITIAL_USER_DATA = { points: 0, achievements: [], badges: [], streak: 0, profile: { bgColor: '#ffffff', avatar: '😊', bio: '' } };

export const useUserFirestoreData = (currentUser) => {
  const [userData, setUserData] = useState(INITIAL_USER_DATA);
  const [loading, setLoading] = useState(true);

  const syncUserData = useCallback(async () => {
    if (!currentUser) {
      setUserData(INITIAL_USER_DATA);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const data = await firestoreService.getUserData(currentUser);
      const mergedData = data ? { ...INITIAL_USER_DATA, ...data } : INITIAL_USER_DATA;
      setUserData(mergedData);
      // Update local storage for immediate access or as a fallback cache
      localDataStorage.setParsedItem(`user_data_${currentUser}`, mergedData);
    } catch (error) {
      console.error('Error syncing user data from Firestore:', error);
      // Attempt to load from local storage if Firestore fails
      const localData = localDataStorage.getParsedItem(`user_data_${currentUser}`, INITIAL_USER_DATA);
      setUserData(localData);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  const saveUserData = useCallback(async (newData) => {
    if (!currentUser) return;
    setUserData(prev => {
      const updatedData = { ...prev, ...newData };
      firestoreService.setUserData(currentUser, updatedData);
      localDataStorage.setParsedItem(`user_data_${currentUser}`, updatedData);
      return updatedData;
    });
  }, [currentUser]);

  useEffect(() => {
    syncUserData();
  }, [currentUser, syncUserData]);

  return { userData, loading, saveUserData, syncUserData };
};