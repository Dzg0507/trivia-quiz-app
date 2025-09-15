import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { useUserStats } from './useUserStats';
import { firestoreService, UserQuest, Quest, QuestWithDefinition } from '../services/firestoreService';
import { QUEST_DEFINITIONS } from '../config/questDefinitions';

export const useQuestManager = () => {
  const { currentUser } = useAuth();
  const { userStats } = useUserStats();
  const [quests, setQuests] = useState<QuestWithDefinition[]>([]);
  const [loading, setLoading] = useState(true);

  const checkQuestProgress = useCallback(async () => {
    if (!currentUser || !userStats) return;
    setLoading(true);

    const userQuests = await firestoreService.getUserQuests(currentUser.uid);

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
      } else if (progress !== quest.progress) {
        await firestoreService.updateUserQuest(currentUser.uid, { ...quest, progress });
      }
    }

    const updatedUserQuests = await firestoreService.getUserQuests(currentUser.uid);
    const updatedQuestsWithDefs: QuestWithDefinition[] = updatedUserQuests.map(uq => ({
        ...uq,
        definition: QUEST_DEFINITIONS.find(q => q.id === uq.questId)
    })).filter(q => q.definition) as QuestWithDefinition[];

    setQuests(updatedQuestsWithDefs);
    setLoading(false);
  }, [currentUser, userStats]);

  useEffect(() => {
    checkQuestProgress();
  }, [checkQuestProgress]);

  return { quests, loading };
};
