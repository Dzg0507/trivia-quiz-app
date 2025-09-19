// App Context Provider
import React, { ReactNode } from 'react';
import { UIProvider } from './UIContext';
import { UserProvider } from './UserContext';
import { GameProvider } from './GameContext';

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  return (
    <UIProvider>
      <UserProvider>
        <GameProvider>
          {children}
        </GameProvider>
      </UserProvider>
    </UIProvider>
  );
};
