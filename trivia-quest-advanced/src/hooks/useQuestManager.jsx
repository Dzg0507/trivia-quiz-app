import { useState, useEffect, useCallback } from 'react';
import { useUserStats } from './useUserStats';
import { quests } from '../config/gamification';

export const useQuestManager = () => {
  const { userStats } = useUserStats();
  const [completedQuests, setCompletedQuests] = useState([]);

  const checkQuests = useCallback(() => {
    if (!userStats) return;
    const newCompleted = [];
    quests.forEach((quest) => {
      if (quest.condition(userStats)) {
        newCompleted.push(quest.id);
      }
    });
    setCompletedQuests(newCompleted);
  }, [userStats]);

  useEffect(() => {
    checkQuests();
  }, [checkQuests]);

  return { quests, completedQuests };
};
