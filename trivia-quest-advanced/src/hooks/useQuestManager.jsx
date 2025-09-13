import { useState, useEffect, useCallback } from 'react';
import { useUserStats } from './useUserStats';

const quests = [
  { id: 'daily_login', name: 'Daily Login', description: 'Log in for the first time today.', condition: (stats) => stats.logins_today >= 1 },
  { id: 'play_3_games', name: 'Trivia Enthusiast', description: 'Play 3 games of trivia.', condition: (stats) => stats.games_played >= 3 },
  { id: 'score_100', name: 'High Scorer', description: 'Score 100 points in a single game.', condition: (stats) => stats.high_score >= 100 },
];

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
