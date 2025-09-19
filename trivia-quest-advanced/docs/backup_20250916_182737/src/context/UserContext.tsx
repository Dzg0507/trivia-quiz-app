// Consolidated User Context
import React, { createContext, useContext, ReactNode } from 'react';
import { useUser } from '../hooks/useUser';
import { User } from 'firebase/auth';

// Define the context type
interface UserContextType {
  user: User | null;
  profile: any | null;
  stats: any | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<User>;
  signOut: () => Promise<void>;
  register: (email: string, password: string) => Promise<User>;
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
  const user = useUser();
  
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
