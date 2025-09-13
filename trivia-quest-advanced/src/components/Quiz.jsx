import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuizFlow } from '../hooks/useQuizFlow';
import { FaTrophy, FaHourglassHalf, FaRedo, FaBrain, FaGem } from 'react-icons/fa';
import LoadingSpinner from './common/LoadingSpinner';

const Quiz = () => {
  const {
    questions,
    currentQuestionIndex,
    pointsThisQuiz,
    timeLeft,
    isAnswered,
    isQuizOver,
    isLoading,
    currentQuestion,
    allAnswers,
    handleAnswer,
    loadQuestions,
    unlockedSkills,
    useMindReader,
    mindReaderUsed,
  } = useQuizFlow();

  if (isLoading) {
    return <LoadingSpinner text="Preparing Questions..." />;
  }

  if (isQuizOver) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center text-white"
      >
        <h2 className="text-3xl font-bold mb-4">Quiz Over!</h2>
        <p className="text-xl mb-4">You scored {pointsThisQuiz} points in this quiz!</p>
        <button
          onClick={loadQuestions}
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-full flex items-center justify-center mx-auto"
        >
          <FaRedo className="mr-2" />
          Play Again
        </button>
      </motion.div>
    );
  }

  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  return (
    <AnimatePresence>
      {currentQuestion && (
        <motion.div
          key={currentQuestionIndex}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.5 }}
          className="p-4 md:p-8 max-w-2xl mx-auto"
        >
          <div className="bg-gray-800 bg-opacity-50 backdrop-blur-md rounded-lg shadow-2xl p-6">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center space-x-2 text-lg font-semibold text-white">
                <FaTrophy className="text-yellow-400" />
                <span>Score: {pointsThisQuiz}</span>
              </div>
              <div className="flex items-center space-x-2 text-lg font-semibold text-white">
                <FaHourglassHalf className="text-red-400" />
                <span>Time: {timeLeft}</span>
              </div>
            </div>
            <div className="mb-4">
              <p className="text-xl font-light text-gray-300 mb-2">Question {currentQuestionIndex + 1}/{questions.length}</p>
              <h2
                className="text-2xl md:text-3xl font-bold text-white"
                dangerouslySetInnerHTML={{ __html: currentQuestion.question }}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {allAnswers.map((answer, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={isAnswered}
                  onClick={() => handleAnswer(answer, isLastQuestion && unlockedSkills.includes('double_or_nothing'))}
                  className={`w-full p-4 rounded-lg text-white font-semibold transition-all duration-300
                    ${isAnswered
                      ? answer === currentQuestion.correct_answer
                        ? 'bg-green-500'
                        : 'bg-red-500'
                      : 'bg-purple-600 hover:bg-purple-700'
                    }`}
                  dangerouslySetInnerHTML={{ __html: answer }}
                />
              ))}
            </div>
            <div className="mt-4 flex justify-center space-x-4">
              {unlockedSkills.includes('mind_reader') && !mindReaderUsed && !isAnswered && (
                <button
                  onClick={useMindReader}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full flex items-center"
                >
                  <FaBrain className="mr-2" />
                  Use Mind Reader
                </button>
              )}
              {isLastQuestion && unlockedSkills.includes('double_or_nothing') && !isAnswered && (
                <p className="text-yellow-400 font-bold flex items-center">
                  <FaGem className="mr-2" />
                  Double or Nothing is active!
                </p>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Quiz;
