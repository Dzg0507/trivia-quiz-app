import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { useUserStats } from './useUserStats';
import { firestoreService, QuestWithDefinition, Quest } from '../services/firestoreService';
import { QUEST_DEFINITIONS } from '../config/questDefinitions';

export const useQuestManager = () => {
  const { currentUser } = useAuth();
  const { userStats, loading: userStatsLoading, updateUserStats } = useUserStats();
  const [quests, setQuests] = useState<QuestWithDefinition[]>([]);
  const [generatedQuests, setGeneratedQuests] = useState<Quest[]>([]);
  const [loading, setLoading] = useState(true);

  const checkQuestProgress = useCallback(async () => {
    if (!currentUser || !userStats) {
      setLoading(false);
      return;
    }
    
    setLoading(true);

    const userQuests = await firestoreService.getUserQuests(currentUser.uid);
    const userGeneratedQuests = await firestoreService.getUserGeneratedQuests(currentUser.uid);

    const questsWithDefinitions: QuestWithDefinition[] = userQuests
      .map(uq => ({
        ...uq,
        definition: QUEST_DEFINITIONS.find(q => q.id === uq.questId),
      }))
      .filter(q => q.definition) as QuestWithDefinition[];

    for (const quest of questsWithDefinitions) {
      if (quest.completed) continue;

      let allConditionsMet = true;
      let totalProgress = 0;

      for (const condition of quest.definition.conditions) {
        const userValue = userStats[condition.stat] || 0;
        const conditionValue = condition.value;

        let conditionMet = false;
        switch(condition.operator) {
          case '>=':
            conditionMet = userValue >= conditionValue;
            break;
          case '<=':
            conditionMet = userValue <= conditionValue;
            break;
          case '==':
            conditionMet = userValue === conditionValue;
            break;
        }

        if (!conditionMet) {
          allConditionsMet = false;
        }
        totalProgress += Math.min(1, userValue / conditionValue);
      }

      const progress = Math.min(1, totalProgress / quest.definition.conditions.length);

      if (allConditionsMet && !quest.completed) {
        await firestoreService.updateUserQuest(currentUser.uid, { ...quest, completed: true, progress: 1 });
        updateUserStats({ totalScore: userStats.totalScore + quest.definition.reward });
      } else if (progress !== quest.progress) {
        await firestoreService.updateUserQuest(currentUser.uid, { ...quest, progress });
      }
    }

    for (const quest of userGeneratedQuests) {
      if (quest.completed) continue;

      let allConditionsMet = true;
      let totalProgress = 0;

      for (const condition of quest.conditions) {
        const userValue = userStats[condition.stat] || 0;
        const conditionValue = condition.value;

        let conditionMet = false;
        switch(condition.operator) {
          case '>=':
            conditionMet = userValue >= conditionValue;
            break;
          case '<=':
            conditionMet = userValue <= conditionValue;
            break;
          case '==':
            conditionMet = userValue === conditionValue;
            break;
        }

        if (!conditionMet) {
          allConditionsMet = false;
        }
        totalProgress += Math.min(1, userValue / conditionValue);
      }

      const progress = Math.min(1, totalProgress / quest.conditions.length);

      if (allConditionsMet && !quest.completed) {
        await firestoreService.updateGeneratedUserQuest(currentUser.uid, { ...quest, completed: true, progress: 1 });
        updateUserStats({ totalScore: userStats.totalScore + quest.reward });
      } else if (progress !== quest.progress) {
        await firestoreService.updateGeneratedUserQuest(currentUser.uid, { ...quest, progress });
      }
    }

    const updatedUserQuests = await firestoreService.getUserQuests(currentUser.uid);
    const updatedGeneratedQuests = await firestoreService.getUserGeneratedQuests(currentUser.uid);
    const updatedQuestsWithDefs: QuestWithDefinition[] = updatedUserQuests.map(uq => ({
        ...uq,
        definition: QUEST_DEFINITIONS.find(q => q.id === uq.questId)
    })).filter(q => q.definition) as QuestWithDefinition[];

    setQuests(updatedQuestsWithDefs);
    setGeneratedQuests(updatedGeneratedQuests);
    setLoading(false);
  }, [currentUser, userStats, updateUserStats]);

  useEffect(() => {
    if (userStatsLoading) {
      setLoading(true);
    } else {
      checkQuestProgress();
    }
  }, [userStatsLoading, checkQuestProgress]);

  const addGeneratedQuest = async (quest: Quest) => {
    if (!currentUser) return;
    await firestoreService.assignGeneratedQuestToUser(currentUser.uid, quest);
    checkQuestProgress();
  };

    const combinedQuests = [
    ...quests,
    ...generatedQuests.map((q: any) => ({
      questId: q.id,
      progress: q.progress || 0,
      completed: q.completed || false,
      claimed: q.claimed || false,
      definition: q,
    })),
  ];

  const allQuests = Array.from(new Map(combinedQuests.map(q => [q.questId, q])).values());

  return { quests: allQuests, loading, addGeneratedQuest };
};
