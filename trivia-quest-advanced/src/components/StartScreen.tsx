import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import LoomScene from './LoomScene';
import '../app.css';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delay: 0.5, // Short delay for content to appear
      staggerChildren: 0.3,
    },
  },
};

const titleContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const letterVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      damping: 12,
      stiffness: 100,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: 'spring' } },
};

const StartScreen = () => {
  const navigate = useNavigate();

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  const title = "Trivia Quest";

  return (
    <div className="relative h-screen w-screen bg-black">
      <div className="absolute inset-0 z-0">
        <LoomScene />
      </div>
      <motion.div
        className="absolute inset-0 z-10 flex flex-col items-center justify-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          className="text-8xl font-bold mb-12 text-white threadbare-text"
          variants={titleContainerVariants}
          initial="hidden"
          animate="visible"
          style={{ display: 'flex' }}
        >
          {title.split('').map((char, index) => (
            <motion.span
              key={index}
              variants={letterVariants}
              style={{ display: 'inline-block', whiteSpace: 'pre' }}
            >
              {char}
            </motion.span>
          ))}
        </motion.h1>
        <motion.div className="flex space-x-6" variants={itemVariants}>
          <motion.button
            className="px-8 py-4 bg-transparent text-white rounded-md text-2xl border border-white threadbare-text"
            whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.1)' }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleNavigate('/quiz')}
          >
            START QUEST
          </motion.button>
          <motion.button
            className="px-8 py-4 bg-transparent text-white rounded-md text-2xl border border-white threadbare-text"
            whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.1)' }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleNavigate('/leaderboard')}
          >
            LEADERBOARD
          </motion.button>
          <motion.button
            className="px-8 py-4 bg-transparent text-white rounded-md text-2xl border border-white threadbare-text"
            whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.1)' }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleNavigate('/profile')}
          >
            PROFILE
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default StartScreen;
