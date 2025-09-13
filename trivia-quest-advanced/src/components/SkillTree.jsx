import React from 'react';
import { motion } from 'framer-motion';
import { FaLock, FaUnlock } from 'react-icons/fa';
import { useSkillManager } from '../hooks/useSkillManager';
import { skills } from '../config/skillsConfig';
import LoadingSpinner from './common/LoadingSpinner';

const SkillNode = ({ skill, unlockedSkills, userPoints, onUnlock, isLoading }) => {
  const isUnlocked = unlockedSkills.includes(skill.id);
  const canUnlock = !isUnlocked && userPoints >= skill.cost && skill.dependencies.every(dep => unlockedSkills.includes(dep));

  return (
    <motion.div
      className="relative p-4 border-2 rounded-lg flex items-center space-x-4"
      style={{
        borderColor: isUnlocked ? '#facc15' : '#4b5563',
        background: isUnlocked ? 'rgba(250, 204, 21, 0.1)' : 'rgba(75, 85, 99, 0.2)',
      }}
      whileHover={{ scale: 1.05 }}
    >
      <div className="text-4xl">
        {isUnlocked ? <FaUnlock className="text-yellow-400" /> : <FaLock className="text-gray-500" />}
      </div>
      <div>
        <h3 className="text-xl font-bold text-white">{skill.name}</h3>
        <p className="text-gray-300">{skill.description}</p>
        {!isUnlocked && (
          <p className="text-yellow-400 font-semibold">Cost: {skill.cost} points</p>
        )}
      </div>
      {canUnlock && !isLoading && (
        <button
          onClick={() => onUnlock(skill)}
          className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs"
        >
          Unlock
        </button>
      )}
    </motion.div>
  );
};

const SkillTree = () => {
  const { unlockedSkills, userPoints, loading, unlockSkill } = useSkillManager();

  if (loading) {
    return <LoadingSpinner text="Loading Skill Tree..." />;
  }

  return (
    <div className="container mx-auto mt-10">
      <h2 className="text-4xl font-bold text-trivia-gold mb-6">Skill Tree</h2>
      <p className="text-white text-lg mb-4">You have {userPoints} points.</p>
      <div className="space-y-4">
        {skills.map((skill, index) => (
          <React.Fragment key={skill.id}>
            <SkillNode
              skill={skill}
              unlockedSkills={unlockedSkills}
              userPoints={userPoints}
              onUnlock={unlockSkill}
              isLoading={loading}
            />
            {index < skills.length - 1 && (
              <div className="h-8 w-1 bg-gray-600 mx-auto" />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default SkillTree;
