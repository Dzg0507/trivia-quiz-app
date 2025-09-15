import React from 'react';
import { useQuestManager } from '../hooks/useQuestManager.tsx';
import { ClipboardList, Check } from 'lucide-react';
import { QuestDefinition } from '../config/gameConfig.ts'; // Assuming QuestDefinition is defined here
import { motion } from 'framer-motion'; // Import motion

const Quests = () => {
  const { quests, completedQuests } = useQuestManager();

  return (
    <div className="max-w-7xl mx-auto mt-10 p-4">
      <h2 className="text-4xl font-bold text-trivia-gold mb-6 animate-pulse-glow">Daily Quests</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quests.map((quest: QuestDefinition, index: number) => (
          <motion.div
            key={quest.id}
            className={`card flex items-center space-x-4 animate-enter ${
              completedQuests.includes(quest.id)
                ? 'bg-green-500/20'
                : 'bg-trivia-gray/20'
            }`}
            style={{ animationDelay: `${index * 100}ms` }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="relative">
                <ClipboardList
                className={`w-12 h-12 transition-colors duration-500 ${
                    completedQuests.includes(quest.id)
                    ? 'text-green-400'
                    : 'text-trivia-gray-light'
                }`}
                />
                {completedQuests.includes(quest.id) && (
                    <div className="absolute -top-2 -right-2 bg-green-500 rounded-full p-1">
                        <Check className="w-4 h-4 text-white" />
                    </div>
                )}
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">{quest.name}</h3>
              <p className="text-trivia-gray-light">{quest.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Quests;
