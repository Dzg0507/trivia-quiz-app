import { useContext } from 'react';
import { LoadingContext, LoadingContextType } from '../context/LoadingContextValue';

export const useLoading = (): LoadingContextType => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  console.log('useLoading context:', context);
  return context;
};
