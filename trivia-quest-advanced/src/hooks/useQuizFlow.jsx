import { useState, useEffect, useCallback } from 'react';
import { triviaApiService } from '../services/triviaApi';
import { useUserStats } from './useUserStats';
import { useNotifications } from '../context/NotificationContext';

export const useQuizFlow = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isQuizOver, setIsQuizOver] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { updateUserStats, loading: userStatsLoading } = useUserStats();
  const { addNotification } = useNotifications();

  const loadQuestions = useCallback(async () => {
    setIsLoading(true);
    setIsQuizOver(false);
    setScore(0);
    setCurrentQuestionIndex(0);
    const fetchedQuestions = await triviaApiService.fetchQuestions();
    setQuestions(fetchedQuestions);
    setIsLoading(false);
    setTimeLeft(15);
    setIsAnswered(false);
  }, []);

  useEffect(() => {
    loadQuestions();
  }, [loadQuestions]);

  useEffect(() => {
    if (timeLeft > 0 && !isAnswered && !isQuizOver) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !isAnswered && !isQuizOver) {
      handleAnswer(null);
    }
  }, [timeLeft, isAnswered, isQuizOver]);

  const handleAnswer = (selectedAnswer) => {
    setIsAnswered(true);
    const correctAnswer = questions[currentQuestionIndex].correct_answer;
    if (selectedAnswer === correctAnswer) {
      setScore(score + 1);
      addNotification('Correct!', 'success');
    } else {
      addNotification(`Wrong! The correct answer was ${correctAnswer}`, 'error');
    }

    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setTimeLeft(15);
        setIsAnswered(false);
      } else {
        setIsQuizOver(true);
        updateUserStats({ score: score + (selectedAnswer === correctAnswer ? 1 : 0), questionsAttempted: questions.length });
      }
    }, 2000);
  };

  const currentQuestion = questions[currentQuestionIndex];
  const allAnswers = currentQuestion ? currentQuestion.answers : [];

  return {
    questions,
    currentQuestionIndex,
    score,
    timeLeft,
    isAnswered,
    isQuizOver,
    isLoading: isLoading || userStatsLoading,
    currentQuestion,
    allAnswers,
    handleAnswer,
    loadQuestions,
  };
};
