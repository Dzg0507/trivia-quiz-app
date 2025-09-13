import React from 'react';
import { useAchievementManager } from '../hooks/useAchievementManager';
import { FaTrophy } from 'react-icons/fa';

const Achievements = () => {
  const { achievements, unlockedAchievements } = useAchievementManager();

  return (
    <div className="container mx-auto mt-10">
      <h2 className="text-4xl font-bold text-trivia-gold mb-6">Achievements</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {achievements.map((achievement) => (
          <div
            key={achievement.id}
            className={`p-6 rounded-lg shadow-lg flex items-center space-x-4 ${
              unlockedAchievements.includes(achievement.id)
                ? 'bg-green-500 bg-opacity-30'
                : 'bg-gray-700 bg-opacity-50'
            }`}
          >
            <FaTrophy
              className={`text-4xl ${
                unlockedAchievements.includes(achievement.id)
                  ? 'text-yellow-400'
                  : 'text-gray-500'
              }`}
            />
            <div>
              <h3 className="text-xl font-bold text-white">{achievement.name}</h3>
              <p className="text-gray-300">{achievement.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Achievements;
