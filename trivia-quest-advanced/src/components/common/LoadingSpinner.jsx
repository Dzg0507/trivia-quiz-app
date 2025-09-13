import React from 'react';
import { motion } from 'framer-motion';

const LoadingSpinner = ({ text = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-white">
      <motion.div
        style={{
          width: 100,
          height: 100,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <motion.div
          style={{
            width: 20,
            height: 20,
            backgroundColor: '#fff',
            borderRadius: '50%',
            boxShadow: '0 0 10px #fff, 0 0 20px #fff, 0 0 30px #ff00ff, 0 0 40px #ff00ff',
          }}
          animate={{
            y: [0, -30, 0],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </motion.div>
      <p className="mt-4 text-lg">{text}</p>
    </div>
  );
};

export default LoadingSpinner;
