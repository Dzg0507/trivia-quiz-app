import React from 'react';
import { useLoading } from '../../hooks/useLoading';

const GlobalLoadingIndicator: React.FC = () => {
  const { isLoading } = useLoading();

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="animate-spin rounded-full h-20 w-20 border-t-2 border-b-2 border-trivia-neon"></div>
    </div>
  );
};

export default GlobalLoadingIndicator;
