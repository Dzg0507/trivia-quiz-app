import { useState, useEffect } from 'react';

export const useStreakTracker = () => {
  const [streak, setStreak] = useState<number>(0);

  useEffect(() => {
    // Example: Load streak from storage or API
    setStreak(0);
  }, []);

  const incrementStreak = (): void => {
    setStreak((prev) => prev + 1);
  };

  const resetStreak = (): void => {
    setStreak(0);
  };

  return { streak, incrementStreak, resetStreak };
};
