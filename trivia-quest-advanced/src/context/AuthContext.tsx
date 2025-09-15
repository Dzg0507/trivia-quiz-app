import React, { useState, ReactNode } from 'react';
import { AuthContext } from './AuthContextValue.ts';
import { User } from 'firebase/auth';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null); // TODO: Use proper User type

  const login = (username: string) => {
    setCurrentUser(username);
  };

  const logout = () => {
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};