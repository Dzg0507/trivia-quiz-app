import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Clock, Trophy, Target, CheckCircle, XCircle, RotateCcw, Home } from 'lucide-react';
import { useQuizFlow } from '../hooks/useQuizFlow';
import { useLoading } from '../hooks/useLoading';
import { motion } from 'framer-motion';
import { useQuizProgress } from '../hooks/useQuizProgress';

import { UserStats } from '../services/firestoreService';

interface QuizProps {
  onNavigateHome: () => void;
  userStats: UserStats | null; // TODO: Define a proper interface for userStats
  updateUserStats: (stats: Partial<UserStats>) => void;
  isLoading: boolean; // userStatsLoading from parent
}

const Quiz: React.FC<QuizProps> = React.memo(({ onNavigateHome, userStats, updateUserStats, isLoading: userStatsLoading }) => {
  Quiz.displayName = 'Quiz';
  const [score, setScore] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(30);
  const [isQuizComplete, setIsQuizComplete] = useState<boolean>(false);
  const [streakCount, setStreakCount] = useState<number>(0);
  const [maxStreak, setMaxStreak] = useState<number>(0);

  const { startLoading, stopLoading } = useLoading();
  const { updateQuizProgress } = useQuizProgress();

  const onQuizCompleteRef = useRef<() => void>(() => {});

  const onAnswerCallback = useCallback((isCorrect: boolean) => {
    if (isCorrect) {
      setScore(prevScore => prevScore + 1);
      setStreakCount(prevStreak => prevStreak + 1);
      setMaxStreak(prevMaxStreak => Math.max(prevMaxStreak, streakCount + 1));
    } else {
      setStreakCount(0);
    }
  }, [streakCount]);

  const {
    isLoading: quizLoading,
    error: quizError,
    currentQuestion,
    currentIndex,
    questionsLength,
    handleAnswer: quizFlowHandleAnswer,
    resetQuiz: quizFlowResetQuiz,
    quizCompleted: quizFlowCompleted,
    difficulty,
    selectedAnswer
  } = useQuizFlow(onAnswerCallback, () => onQuizCompleteRef.current());

  const onQuizCompleteCallback = useCallback(() => {
    setIsQuizComplete(true);
    const accuracy = questionsLength > 0 ? Math.round((score / questionsLength) * 100) : 0;

    if (updateUserStats) {
      updateUserStats({
        totalQuizzes: (userStats?.totalQuizzes || 0) + 1,
        totalScore: (userStats?.totalScore || 0) + score,
        bestScore: Math.max(userStats?.bestScore || 0, score),
        averageAccuracy: userStats?.totalQuizzes
          ? Math.round(((userStats.averageAccuracy * userStats.totalQuizzes) + accuracy) / (userStats.totalQuizzes + 1))
          : accuracy,
        longestStreak: Math.max(userStats?.longestStreak || 0, maxStreak)
      });
    }
  }, [score, questionsLength, maxStreak, updateUserStats, userStats]);

  onQuizCompleteRef.current = onQuizCompleteCallback;

  useEffect(() => {
    if (quizLoading) {
      startLoading();
    } else {
      stopLoading();
    }
  }, [quizLoading, startLoading, stopLoading]);

  useEffect(() => {
    updateQuizProgress(currentIndex, questionsLength);
  }, [currentIndex, questionsLength, updateQuizProgress]);

  useEffect(() => {
    if (quizFlowCompleted && !isQuizComplete) {
      setIsQuizComplete(true);
    }
  }, [quizFlowCompleted, isQuizComplete]);



  const handleAnswerClick = useCallback((answer: string) => {
    if (!selectedAnswer) {
      quizFlowHandleAnswer(answer);
    }
  }, [selectedAnswer, quizFlowHandleAnswer]);

  const restartQuiz = useCallback(() => {
    quizFlowResetQuiz();
    setScore(0);
    setTimeLeft(30);
    setIsQuizComplete(false);
    setStreakCount(0);
    setMaxStreak(0);
  }, [quizFlowResetQuiz]);

  const getAnswerButtonStyle = useCallback((answer: string) => {
    if (selectedAnswer === null) {
      return 'bg-white/20 hover:bg-white/30 border-2 border-white/30 hover:border-white/50 text-white';
    }
    
    if (!currentQuestion) return 'bg-trivia-gray text-white/50';
    
    if (answer === currentQuestion.correct_answer) {
      return 'bg-green-500 border-green-500 text-white';
    }
    if (answer === selectedAnswer && answer !== currentQuestion.correct_answer) {
      return 'bg-red-500 border-red-500 text-white';
    }
    return 'bg-trivia-gray border-trivia-gray text-white/50';
  }, [selectedAnswer, currentQuestion]);

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: -50, transition: { duration: 0.3 } },
  };

  const answerVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: (i: number) => ({
      opacity: 1, x: 0, transition: { delay: i * 0.1, duration: 0.3 }
    }),
    exit: { opacity: 0, x: 50, transition: { duration: 0.2 } },
  };

  if (quizError) {
    return (
      <motion.div
        className="min-h-screen flex items-center justify-center p-4"
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={cardVariants}
      >
        <div className="card text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">Oops! Something went wrong</h2>
          <p className="text-trivia-gray-light mb-6">{quizError}</p>
          <div className="space-y-3">
            <motion.button
              onClick={restartQuiz}
              className="btn btn-gold w-full flex items-center justify-center gap-2"
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.05 }}
            >
              <RotateCcw className="w-5 h-5" />
              Try Again
            </motion.button>
            <motion.button
              onClick={onNavigateHome}
              disabled={userStatsLoading}
              className="btn btn-gold w-full flex items-center justify-center gap-2"
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.05 }}
            >
              <Home className="w-5 h-5" />
              Back to Home
            </motion.button>
          </div>
        </div>
      </motion.div>
    );
  }

  if (quizLoading || userStatsLoading) {
    return (
      <motion.div
        className="min-h-screen flex items-center justify-center"
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={cardVariants}
      >
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-trivia-neon border-t-transparent rounded-full mx-auto mb-4 animate-spin" />
          <p className="text-white text-xl font-semibold">Loading Quiz...</p>
        </div>
      </motion.div>
    );
  }

  const accuracy = questionsLength > 0 ? Math.round((score / questionsLength) * 100) : 0;

  if (isQuizComplete) {
    return (
      <motion.div
        className="min-h-screen flex items-center justify-center p-4"
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={cardVariants}
      >
        <div className="card text-center">
          <Trophy className="w-16 h-16 text-trivia-gold mx-auto mb-4 animate-pulse-glow" />
          
          <h2 className="text-3xl font-bold text-white mb-6">Quiz Complete!</h2>
          
          <div className="space-y-4 mb-8">
            <div className="bg-trivia-blue-dark/50 p-4 rounded-xl">
              <p className="text-lg text-white">
                <span className="font-bold text-2xl text-trivia-gold">{score}</span> / {questionsLength}
              </p>
              <p className="text-trivia-gray-light">Questions Correct</p>
            </div>
            
            <div className="bg-trivia-blue-dark/50 p-4 rounded-xl">
              <p className="text-lg text-white">
                <span className="font-bold text-2xl text-trivia-gold">{accuracy}%</span>
              </p>
              <p className="text-trivia-gray-light">Accuracy</p>
            </div>

            {maxStreak > 1 && (
              <div className="bg-trivia-blue-dark/50 p-4 rounded-xl">
                <p className="text-lg text-white">
                  <span className="font-bold text-2xl text-trivia-gold">{maxStreak}</span>
                </p>
                <p className="text-trivia-gray-light">Best Streak</p>
              </div>
            )}

            {difficulty && (
              <div className="bg-trivia-blue-dark/50 p-4 rounded-xl">
                <p className="text-lg text-white">
                  <span className={`font-bold text-2xl capitalize ${
                    difficulty === 'easy' 
                      ? 'text-green-300'
                      : difficulty === 'medium'
                      ? 'text-yellow-300'
                      : 'text-red-300'
                  }`}>
                    {difficulty}
                  </span>
                </p>
                <p className="text-trivia-gray-light">Difficulty</p>
              </div>
            )}
          </div>
          
          <div className="space-y-3">
            <motion.button
              onClick={restartQuiz}
              className="btn btn-gold w-full flex items-center justify-center gap-2"
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.05 }}
            >
              <RotateCcw className="w-5 h-5" />
              Play Again
            </motion.button>
            <motion.button
              onClick={onNavigateHome}
              className="btn bg-trivia-gray hover:bg-trivia-gray-dark w-full flex items-center justify-center gap-2"
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.05 }}
            >
              <Home className="w-5 h-5" />
              Back to Home
            </motion.button>
          </div>
        </div>
      </motion.div>
    );
  }

  if (!currentQuestion) {
    return (
      <motion.div
        className="min-h-screen flex items-center justify-center p-4"
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={cardVariants}
      >
        <div className="card text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">Question Error</h2>
          <p className="text-trivia-gray-light mb-6">Unable to load the current question.</p>
          <div className="space-y-3">
            <motion.button
              onClick={restartQuiz}
              className="btn btn-gold w-full flex items-center justify-center gap-2"
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.05 }}
            >
              <RotateCcw className="w-5 h-5" />
              Restart Quiz
            </motion.button>
            <motion.button
              onClick={onNavigateHome}
              className="btn bg-trivia-gray hover:bg-trivia-gray-dark w-full flex items-center justify-center gap-2"
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.05 }}
            >
              <Home className="w-5 h-5" />
              Back to Home
            </motion.button>
          </div>
        </div>
      </motion.div>
    );
  }

  const allAnswers = currentQuestion.answers || [];

  return (
    <div className="min-h-screen p-4">
      <motion.div
        key={currentQuestion.question}
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={cardVariants}
        className="max-w-4xl mx-auto"
      >
        <motion.div className="card mb-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-trivia-neon" />
                <span className="font-semibold">
                  Question {currentIndex + 1} of {questionsLength}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-trivia-gold" />
                <span className="font-semibold">Score: {score}</span>
              </div>
              {streakCount > 1 && (
                <div className="flex items-center gap-2 animate-pulse-fast">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-semibold">Streak: {streakCount}</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              <span className={`font-bold text-xl ${timeLeft <= 10 ? 'text-red-400 animate-pulse-fast' : ''}`}>
                {timeLeft}s
              </span>
            </div>
          </div>
          
          <div className="w-full bg-white/20 rounded-full h-2">
            <div
              className="bg-trivia-neon rounded-full h-2 transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / questionsLength) * 100}%` }}
            />
          </div>
        </motion.div>

        <motion.div className="card">
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-trivia-blue-light/50 text-trivia-neon px-3 py-1 rounded-full text-sm font-medium">
                {currentQuestion.category || 'General Knowledge'}
              </span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${
                currentQuestion.difficulty === 'easy' 
                  ? 'bg-green-500/20 text-green-300'
                  : currentQuestion.difficulty === 'medium'
                  ? 'bg-yellow-500/20 text-yellow-300'
                  : 'bg-red-500/20 text-red-300'
              }`}>
                {currentQuestion.difficulty || 'Unknown'}
              </span>
              {difficulty && difficulty !== currentQuestion.difficulty && (
                <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${
                  difficulty === 'easy' 
                    ? 'bg-green-500/20 text-green-300'
                    : difficulty === 'medium'
                    ? 'bg-yellow-500/20 text-yellow-300'
                    : 'bg-red-500/20 text-red-300'
                }`}>
                  Quiz: {difficulty}
                </span>
              )}
            </div>
            
            <h2 className="text-2xl font-bold text-white leading-relaxed">
              {currentQuestion.question}
            </h2>
          </div>

          <motion.div 
            className="grid gap-4"
            variants={answerVariants}
            initial="hidden"
            animate="visible"
          >
            {allAnswers.map((answer, index) => (
              <motion.button
                key={`${currentIndex}-${index}`}
                onClick={() => handleAnswerClick(answer)}
                disabled={selectedAnswer !== null}
                className={`btn text-left justify-start ${getAnswerButtonStyle(answer)}`}
                variants={answerVariants}
                custom={index}
              >
                <div className="flex items-center justify-between w-full">
                  <span>{answer}</span>
                  {selectedAnswer !== null && (
                    <span className="ml-2">
                      {answer === currentQuestion.correct_answer ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : answer === selectedAnswer ? (
                        <XCircle className="w-5 h-5" />
                      ) : null}
                    </span>
                  )}
                </div>
              </motion.button>
            ))}
          </motion.div>

          {selectedAnswer !== null && (
            <motion.div 
              className="mt-6 p-4 rounded-xl bg-trivia-blue-dark/50"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={cardVariants}
            >
              <p className="text-white">
                {selectedAnswer === currentQuestion.correct_answer ? (
                  <span className="text-green-400 font-semibold">Correct! Well done! 🎉</span>
                ) : timeLeft === 0 ? (
                  <span className="text-red-400 font-semibold">Time's up! ⏰</span>
                ) : (
                  <span className="text-white/80 font-semibold">Incorrect. The correct answer was: <span className="text-trivia-gold">{currentQuestion.correct_answer}</span></span>
                )}
              </p>
            </motion.div>
          )}
        </motion.div>

        <div className="text-center mt-6">
          <motion.button
            onClick={onNavigateHome}
            className="btn bg-white/20 hover:bg-white/30 flex items-center gap-2 mx-auto"
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05 }}
          >
            <Home className="w-5 h-5" />
            Back to Home
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
});

export default Quiz;
