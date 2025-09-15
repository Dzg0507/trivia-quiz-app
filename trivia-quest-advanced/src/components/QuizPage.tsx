import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserFirestoreData } from '../hooks/useUserFirestoreData';
import Quiz from './Quiz';

const QuizPage = () => {
  const navigate = useNavigate();
  const { userStats, updateUserStats, loading } = useUserFirestoreData();

  const handleNavigateHome = () => {
    navigate('/profile');
  };

  return (
    <Quiz
      onNavigateHome={handleNavigateHome}
      userStats={userStats}
      updateUserStats={updateUserStats}
      isLoading={loading}
    />
  );
};

export default QuizPage;
