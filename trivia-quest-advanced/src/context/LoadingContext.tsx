import React, { useState, useCallback, useMemo, ReactNode } from 'react';
import { LoadingContext, LoadingContextType } from './LoadingContextValue';

interface LoadingProviderProps {
  children: ReactNode;
}

export const LoadingProvider: React.FC<LoadingProviderProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const startLoading = useCallback(() => {
    setIsLoading(true);
  }, []);

  const stopLoading = useCallback(() => {
    setIsLoading(false);
  }, []);

  const value = useMemo<LoadingContextType>(() => ({
    isLoading,
    startLoading,
    stopLoading,
  }), [isLoading, startLoading, stopLoading]);

  return (
    <LoadingContext.Provider value={value}>
      {children}
    </LoadingContext.Provider>
  );
};
