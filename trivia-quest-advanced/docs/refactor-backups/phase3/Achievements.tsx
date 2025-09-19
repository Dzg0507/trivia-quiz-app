import { useAchievementManager } from '../hooks/useAchievementManager.tsx';
import { Trophy } from 'lucide-react';
import { motion } from 'framer-motion'; // Import motion

interface Achievement {
  name: string;
  correctNeeded: number;
}

const Achievements = () => {
  const { achievements, unlockedAchievements }: { achievements: Achievement[], unlockedAchievements: string[] } = useAchievementManager();

  return (
    <div className="max-w-7xl mx-auto mt-10 p-4">
      <h2 className="text-4xl font-bold text-trivia-gold mb-6 animate-pulse-glow">Achievements</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {achievements.map((achievement: Achievement, index: number) => (
          <motion.div
            key={achievement.name}
            className={`card flex items-center space-x-4 animate-enter ${
              unlockedAchievements.includes(achievement.name)
                ? 'bg-trivia-gold/20'
                : 'bg-trivia-gray/20'
            }`}
            style={{ animationDelay: `${index * 100}ms` }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Trophy
              className={`w-12 h-12 transition-colors duration-500 ${
                unlockedAchievements.includes(achievement.name)
                  ? 'text-trivia-gold'
                  : 'text-trivia-gray-light'
              }`}
            />
            <div>
              <h3 className="text-xl font-bold text-white">{achievement.name}</h3>
              <p className="text-trivia-gray-light">Answer {achievement.correctNeeded} questions correctly</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Achievements;
