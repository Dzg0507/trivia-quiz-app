import { useState, useEffect, useCallback } from 'react';
import { useUserStats } from './useUserStats.tsx';

import { QUEST_DEFINITIONS } from '../config/gameConfig.ts';

export const useQuestManager = () => {
  const { userStats } = useUserStats();
  const [completedQuests, setCompletedQuests] = useState([]);

  const checkQuests = useCallback(() => {
    if (!userStats) return;
    const newCompleted = [];
    QUEST_DEFINITIONS.forEach((quest) => {
      if (quest.condition(userStats)) {
        newCompleted.push(quest.name);
      }
    });
    setCompletedQuests(newCompleted);
  }, [userStats]);

  useEffect(() => {
    checkQuests();
  }, [checkQuests]);

  return { quests: QUEST_DEFINITIONS, completedQuests };
};
