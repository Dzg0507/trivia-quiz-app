// Consolidated UI Context
import React, { createContext, useContext, ReactNode } from 'react';
import { useLoading } from '../hooks/useLoading';
import { useNotifications } from '../hooks/useNotifications';
import { useTheme } from '../hooks/useTheme';

// Define the context type
interface UIContextType {
  loading: boolean;
  startLoading: () => void;
  stopLoading: () => void;
  notification: { message: string; type: string } | null;
  notify: (message: string, type?: string) => void;
  theme: string;
  toggleTheme: () => void;
}

// Create the context with a default value
const UIContext = createContext<UIContextType | null>(null);

// Provider component
interface UIProviderProps {
  children: ReactNode;
}

export const UIProvider: React.FC<UIProviderProps> = ({ children }) => {
  const { loading, startLoading, stopLoading } = useLoading();
  const { notification, notify } = useNotifications();
  const { theme, toggleTheme } = useTheme();

  const ui = {
    loading,
    startLoading,
    stopLoading,
    notification,
    notify,
    theme,
    toggleTheme,
  };
  
  return (
    <UIContext.Provider value={ui}>
      {children}
    </UIContext.Provider>
  );
};

// Custom hook to use the context
export const useUIContext = (): UIContextType => {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error('useUIContext must be used within a UIProvider');
  }
  return context;
};