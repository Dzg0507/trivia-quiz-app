import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { triviaApiService } from '../services/triviaApi.ts';
import { useNotifications } from '../hooks/useNotifications.ts';
import { Question } from '../types/trivia';

type Difficulty = 'easy' | 'medium' | 'hard';

export const useQuizFlow = (
  onAnswerCallback: (_isCorrect: boolean) => void,
  onQuizCompleteCallback: () => void
) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [correctStreak, setCorrectStreak] = useState<number>(0);
  const [incorrectStreak, setIncorrectStreak] = useState<number>(0);
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [retryCount, setRetryCount] = useState(0);
  const { addNotification } = useNotifications();

  const fetchQuestions = useCallback(async (currentDifficulty: Difficulty, signal: AbortSignal) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await triviaApiService.fetchQuestions(10, 0, currentDifficulty, signal, addNotification);
      if (response.status === 'success' && response.data) {
        setQuestions(response.data);
        setCurrentIndex(0);
      } else if (response.error && !response.error.isCanceled) {
        setError(response.error.message);
      }
    } catch (err: unknown) {
      if (!axios.isCancel(err)) {
        setError((err as Error).message);
        addNotification(`Error loading questions: ${(err as Error).message}`, 'error', 5000);
      }
    } finally {
      setIsLoading(false);
    }
  }, [addNotification]);

  // Fetch questions on initial load or when difficulty changes
  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    setQuestions([]);
    setCurrentIndex(0);
    setCorrectStreak(0);
    setIncorrectStreak(0);
    setError(null);
    fetchQuestions(difficulty, signal);

    return () => {
      abortController.abort();
    };
  }, [fetchQuestions, difficulty, retryCount]);

  const adjustDifficulty = useCallback((isCorrect: boolean, newCorrectStreak: number, newIncorrectStreak: number) => {
    if (isCorrect) {
      // Check if we should increase difficulty based on the NEW streak count
      if (newCorrectStreak >= 5 && difficulty === 'easy') {
        setDifficulty('medium');
        addNotification('Great streak! Difficulty increased to Medium! 🔥', 'info');
      } else if (newCorrectStreak >= 5 && difficulty === 'medium') {
        setDifficulty('hard');
        addNotification('Amazing! Difficulty increased to Hard! 🚀', 'info');
      }
    } else {
      // Check if we should decrease difficulty based on the NEW streak count
      if (newIncorrectStreak >= 2 && difficulty === 'hard') {
        setDifficulty('medium');
        addNotification('Difficulty decreased to Medium', 'info');
      } else if (newIncorrectStreak >= 2 && difficulty === 'medium') {
        setDifficulty('easy');
        addNotification('Difficulty decreased to Easy', 'info');
      }
    }
  }, [difficulty, addNotification]);

  const handleAnswer = useCallback(
    (selectedAnswer: string) => {
      const currentQuestion = questions[currentIndex];
      if (!currentQuestion) return;

      const isCorrect = selectedAnswer === currentQuestion.correct_answer;
      onAnswerCallback(isCorrect);

      // Update streaks and get the new values for difficulty adjustment
      let newCorrectStreak = 0;
      let newIncorrectStreak = 0;

      if (isCorrect) {
        newCorrectStreak = correctStreak + 1;
        newIncorrectStreak = 0;
        setCorrectStreak(newCorrectStreak);
        setIncorrectStreak(0);
      } else {
        newCorrectStreak = 0;
        newIncorrectStreak = incorrectStreak + 1;
        setCorrectStreak(0);
        setIncorrectStreak(newIncorrectStreak);
      }

      // Adjust difficulty using the new streak values
      adjustDifficulty(isCorrect, newCorrectStreak, newIncorrectStreak);
      setSelectedAnswer(selectedAnswer);

      setTimeout(() => {
        if (currentIndex + 1 < questions.length) {
          setCurrentIndex((prev) => prev + 1);
          setSelectedAnswer(null);
        } else {
          onQuizCompleteCallback();
        }
      }, 1000);
    },
    [questions, currentIndex, correctStreak, incorrectStreak, onAnswerCallback, onQuizCompleteCallback, adjustDifficulty]
  );

  const resetQuiz = useCallback(() => {
    setQuestions([]);
    setCurrentIndex(0);
    setCorrectStreak(0);
    setIncorrectStreak(0);
    setDifficulty('easy');
    setError(null);
    setRetryCount(c => c + 1);
  }, []);

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
    difficulty,
    selectedAnswer,
  };
};
