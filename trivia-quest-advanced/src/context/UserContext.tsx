// Consolidated User Context
import React, { createContext, useContext, ReactNode } from 'react';
import { useUserFirestoreData } from '../hooks/useUserFirestoreData';
import { User } from 'firebase/auth';
import { AuthContext } from './AuthContext.tsx'; // Import AuthContext from the TSX file

// Define the context type
interface UserContextType {
  user: User | null;
  profile: any | null;
  stats: any | null;
  loading: boolean;
  error: string | null;
  updateProfile: (data: any) => Promise<boolean>;
  updateStats: (newStats: any) => Promise<boolean>;
}

// Create the context with a default value
const UserContext = createContext<UserContextType | null>(null);

// Provider component
interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const authContext = useContext(AuthContext); // Get auth context
  if (!authContext) {
    throw new Error('UserProvider must be used within an AuthProvider');
  }
  const { currentUser, loading: authLoading } = authContext; // Destructure currentUser and authLoading

  const firestoreData = useUserFirestoreData(currentUser);

  const user = {
    user: currentUser, // Pass currentUser directly
    profile: firestoreData.userData?.profile || null,
    stats: firestoreData.userData?.stats || null,
    loading: authLoading || firestoreData.loading, // Combine loading states
    error: firestoreData.error ? String(firestoreData.error) : null,
    updateProfile: async (data: any) => {
      if (firestoreData.saveUserData) {
        await firestoreData.saveUserData({ profile: data });
        return true;
      }
      return false;
    },
    updateStats: async (newStats: any) => {
      if (firestoreData.saveUserData) {
        await firestoreData.saveUserData({ stats: newStats });
        return true;
      }
      return false;
    },
  };

  return (
    <UserContext.Provider value={user}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the context
export const useUserContext = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
};