import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { triviaApiService } from '../services/triviaApi';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from './common/LoadingSpinner';
import { GALAXY_BACKGROUND_URL } from '../config/assetUrls';

const Star = ({ category, onSelect, isSelected }) => {
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [size, setSize] = useState(0);

  useEffect(() => {
    setX(Math.random() * 90 + 5);
    setY(Math.random() * 80 + 10);
    setSize(Math.random() * 12 + 4);
  }, []);

  if (isSelected) {
    return (
      <motion.div
        key={category.id}
        initial={{
          x: `${x}vw`,
          y: `${y}vh`,
          scale: 1,
        }}
        animate={{
          scale: 200,
          zIndex: 20,
          transition: { duration: 1, ease: 'easeInOut' },
        }}
        className="absolute bg-white rounded-full"
        style={{
          width: size,
          height: size,
          boxShadow: '0 0 10px #fff, 0 0 20px #fff, 0 0 30px #ff00ff, 0 0 40px #ff00ff',
        }}
      />
    );
  }

  return (
    <motion.div
      key={category.id}
      initial={{
        x: `${x}vw`,
        y: `${y}vh`,
        scale: 0,
      }}
      animate={{
        scale: 1,
        transition: { delay: Math.random() * 2, duration: 1 },
      }}
      whileHover={{ scale: 1.5, zIndex: 10 }}
      onClick={() => onSelect(category)}
      className="absolute cursor-pointer"
    >
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.7, 1, 0.7],
        }}
        transition={{
          duration: Math.random() * 2 + 1,
          repeat: Infinity,
          repeatType: 'reverse',
        }}
        className="bg-white rounded-full"
        style={{
          width: size,
          height: size,
          boxShadow: '0 0 10px #fff, 0 0 20px #fff, 0 0 30px #ff00ff, 0 0 40px #ff00ff',
        }}
      />
      <span className="absolute left-1/2 top-full transform -translate-x-1/2 mt-2 text-white text-sm whitespace-nowrap bg-black bg-opacity-50 px-2 py-1 rounded">
        {category.name}
      </span>
    </motion.div>
  );
};

const GalaxyMap = () => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const fetchedCategories = await triviaApiService.getCategories();
        const categoryArray = Object.entries(fetchedCategories).map(([name, values]) => ({
          name: name,
          id: values[0], // Use the first value in the array as the ID for the API
        }));
        setCategories(categoryArray);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setTimeout(() => {
      navigate(`/quiz?category=${category.id}`);
    }, 1000); // Match the duration of the zoom animation
  };

  if (isLoading) {
    return <LoadingSpinner text="Loading Galaxy..." />;
  }

  return (
    <div
      className="relative w-full h-screen overflow-hidden"
      style={{
        backgroundImage: `url(${GALAXY_BACKGROUND_URL})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <AnimatePresence>
        {!selectedCategory && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50, transition: { duration: 0.5 } }}
          >
            <h1 className="text-white text-5xl font-bold text-center my-8 text-shadow-lg">Choose Your Destination</h1>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="relative w-full h-full">
        {categories.map((category) => (
          <Star
            key={category.id}
            category={category}
            onSelect={handleCategorySelect}
            isSelected={selectedCategory?.id === category.id}
          />
        ))}
      </div>
    </div>
  );
};

export default GalaxyMap;
