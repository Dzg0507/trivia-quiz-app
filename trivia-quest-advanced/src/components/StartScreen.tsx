import React from 'react';
import { useNavigate } from 'react-router-dom';

const StartScreen = () => {
  const navigate = useNavigate();

  const handleStartQuiz = () => {
    navigate('/quiz');
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold mb-8">Welcome to Trivia Quest!</h1>
      <button
        onClick={handleStartQuiz}
        className="px-8 py-4 bg-blue-500 text-white rounded-md text-2xl"
      >
        Start Quiz
      </button>
    </div>
  );
};

export default StartScreen;
