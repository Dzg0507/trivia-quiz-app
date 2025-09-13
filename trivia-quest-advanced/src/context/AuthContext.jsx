import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
const AuthContext = createContext(null);
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(authService.getCurrentUser());
  const login = (username) => {
    authService.setCurrentUser(username);
    setCurrentUser(username);
  };
  const logout = () => {
    authService.logout();
    setCurrentUser(null);
  };
  useEffect(() => {
    setCurrentUser(authService.getCurrentUser());
  }, []);
  return (
    <AuthContext.Provider value={{ currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => useContext(AuthContext);