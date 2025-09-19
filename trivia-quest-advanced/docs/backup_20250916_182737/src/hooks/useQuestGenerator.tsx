import { useEffect } from 'react';
import { useAuth } from './useAuth';
import { firestoreService, Quest } from '../services/firestoreService';
import { QUEST_DEFINITIONS } from '../config/questDefinitions';

const ONE_DAY = 24 * 60 * 60 * 1000;
const ONE_WEEK = 7 * ONE_DAY;
const ONE_MONTH = 30 * ONE_DAY;

const getQuestsForType = (type: 'daily' | 'weekly' | 'monthly') => {
  return QUEST_DEFINITIONS.filter(q => q.type === type);
};

const chooseRandomQuest = (quests: Quest[]): Quest | undefined => {
  if (quests.length === 0) return undefined;
  const randomIndex = Math.floor(Math.random() * quests.length);
  return quests[randomIndex];
};

export const useQuestGenerator = () => {
  const { currentUser } = useAuth();

  useEffect(() => {
    const generateQuests = async () => {
      if (!currentUser) return;

      const userData = await firestoreService.getUserData(currentUser.uid);
      if (!userData) return;

      const now = Date.now();
      const { lastQuestGeneration, quests: userQuests } = userData;

      const questTypes: { [key: string]: number } = {
        daily: ONE_DAY,
        weekly: ONE_WEEK,
        monthly: ONE_MONTH,
      };

      for (const [type, duration] of Object.entries(questTypes)) {
        if (now - (lastQuestGeneration[type as keyof typeof lastQuestGeneration] || 0) > duration) {
          const availableQuests = getQuestsForType(type as 'daily' | 'weekly' | 'monthly');
          const newQuest = chooseRandomQuest(availableQuests);

          if (newQuest) {
            // Remove old quests of this type
            const remainingQuests = userQuests.filter(uq => {
              const questDef = QUEST_DEFINITIONS.find(q => q.id === uq.questId);
              return questDef && questDef.type !== type;
            });

            await firestoreService.updateUserData(currentUser.uid, {
              quests: remainingQuests,
            });

            await firestoreService.assignQuestToUser(currentUser.uid, newQuest);

            await firestoreService.updateUserData(currentUser.uid, {
              [`lastQuestGeneration.${type}`]: now,
            });
          }
        }
      }
    };

    generateQuests();
  }, [currentUser]);
};
