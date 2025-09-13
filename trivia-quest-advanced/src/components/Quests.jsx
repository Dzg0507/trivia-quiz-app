import React from 'react';
import { useQuestManager } from '../hooks/useQuestManager';
import { FaClipboardList } from 'react-icons/fa';

const Quests = () => {
  const { quests, completedQuests } = useQuestManager();

  return (
    <div className="container mx-auto mt-10">
      <h2 className="text-4xl font-bold text-trivia-gold mb-6">Quests</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quests.map((quest) => (
          <div
            key={quest.id}
            className={`p-6 rounded-lg shadow-lg flex items-center space-x-4 ${
              completedQuests.includes(quest.id)
                ? 'bg-green-500 bg-opacity-30'
                : 'bg-gray-700 bg-opacity-50'
            }`}
          >
            <FaClipboardList
              className={`text-4xl ${
                completedQuests.includes(quest.id)
                  ? 'text-yellow-400'
                  : 'text-gray-500'
              }`}
            />
            <div>
              <h3 className="text-xl font-bold text-white">{quest.name}</h3>
              <p className="text-gray-300">{quest.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Quests;
