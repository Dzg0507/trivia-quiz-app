import { useState, useEffect, useCallback } from 'react';
import { triviaApiService } from '../services/triviaApi';
import { useNotifications } from '../context/NotificationContext';

export const useQuizFlow = (onAnswerCallback, onQuizCompleteCallback) => {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { addNotification } = useNotifications();

  const fetchQuestions = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const fetchedQuestions = await triviaApiService.fetchQuestions();
      setQuestions(fetchedQuestions);
      setCurrentIndex(0);
    } catch (err) {
      setError(err.message);
      addNotification(`Error loading questions: ${err.message}`, 'error', 5000);
    } finally {
      setIsLoading(false);
    }
  }, [addNotification]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  const handleAnswer = useCallback(
    (selectedAnswer) => {
      const currentQuestion = questions[currentIndex];
      if (!currentQuestion) return;
      const isCorrect = selectedAnswer === currentQuestion.correct_answer;
      onAnswerCallback(isCorrect); // Notify parent/stats hook about the answer
      setTimeout(() => {
        if (currentIndex + 1 < questions.length) {
          setCurrentIndex((prev) => prev + 1);
        } else {
          onQuizCompleteCallback();
        }
      }, 1000); // Delay for visual feedback
    },
    [questions, currentIndex, onAnswerCallback, onQuizCompleteCallback]
  );

  const resetQuiz = useCallback(() => {
    setQuestions([]);
    setCurrentIndex(0);
    fetchQuestions();
  }, [fetchQuestions]);

  const currentQuestion = questions[currentIndex];
  const quizCompleted = currentIndex >= questions.length && questions.length > 0;

  return {
    isLoading,
    error,
    currentQuestion,
    currentIndex,
    questionsLength: questions.length,
    handleAnswer,
    resetQuiz,
    quizCompleted,
  };
};