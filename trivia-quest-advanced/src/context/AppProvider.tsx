// App Context Provider
import React, { ReactNode } from 'react';
import { UIProvider } from './UIContext';
import { UserProvider } from './UserContext';
import { GameProvider } from './GameContext';
import { AuthProvider } from './AuthContext.tsx'; // Import AuthProvider from the TSX file
import { QuizProvider } from './QuizContext'; // Import QuizProvider

import { LoadingProvider } from './LoadingContext';
import { NotificationProvider } from './NotificationContext';
import ThemeProvider from './ThemeContext';

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  return (
    <ThemeProvider>
      <LoadingProvider>
        <NotificationProvider>
          <UIProvider>
            <AuthProvider> {/* Wrap UserProvider with AuthProvider */}
              <UserProvider>
                <GameProvider>
                  <QuizProvider>
                    {children}
                  </QuizProvider>
                </GameProvider>
              </UserProvider>
            </AuthProvider>
          </UIProvider>
        </NotificationProvider>
      </LoadingProvider>
    </ThemeProvider>
  );
};
