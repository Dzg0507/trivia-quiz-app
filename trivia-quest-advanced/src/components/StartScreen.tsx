import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import LoomScene from './LoomScene';
import '../app.css';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delay: 11, // Delay until after the 11s weaving animation
      staggerChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: 'spring' } },
};

const StartScreen = () => {
  const navigate = useNavigate();
  const [inspect, setInspect] = useState(false);
  const [unravel, setUnravel] = useState(false);

  const handleStartQuiz = () => {
    navigate('/quiz');
  };

  return (
    <div className="relative h-screen w-screen bg-black">
      <div className="absolute inset-0 z-0">
        <LoomScene inspect={inspect} unravel={unravel} />
      </div>
      <motion.div
        className="absolute inset-0 z-10 flex flex-col items-center justify-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          className="text-8xl font-bold mb-12 text-white threadbare-text"
          variants={itemVariants}
        >
          TENSOR
        </motion.h1>
        <motion.div className="flex space-x-6" variants={itemVariants}>
          <motion.button
            className="px-8 py-4 bg-transparent text-white rounded-md text-2xl border border-white threadbare-text"
            whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.1)' }}
            whileTap={{ scale: 0.9 }}
            onClick={handleStartQuiz}
          >
            BEGIN WEAVING
          </motion.button>
          <motion.button
            className="px-8 py-4 bg-transparent text-white rounded-md text-2xl border border-white threadbare-text"
            whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.1)' }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setInspect(!inspect)}
          >
            INSPECT PATTERN
          </motion.button>
          <motion.button
            className="px-8 py-4 bg-transparent text-white rounded-md text-2xl border border-white threadbare-text"
            whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.1)' }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setUnravel(true)}
          >
            UNRAVEL
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default StartScreen;
