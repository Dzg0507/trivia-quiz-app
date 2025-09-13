import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { triviaApiService } from '../services/triviaApi';
import { useUserStats } from './useUserStats';
import { useNotifications } from '../context/NotificationContext';
import { useSkillManager } from './useSkillManager';

export const useQuizFlow = ({ onAnswerCallback, onQuizCompleteCallback }) => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [pointsThisQuiz, setPointsThisQuiz] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isQuizOver, setIsQuizOver] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [mindReaderUsed, setMindReaderUsed] = useState(false);

  const { updateUserStats, loading: userStatsLoading } = useUserStats();
  const { addNotification } = useNotifications();
  const { unlockedSkills } = useSkillManager();
  const location = useLocation();

  const initialTime = useMemo(() => unlockedSkills.includes('time_warp') ? 20 : 15, [unlockedSkills]);

  const loadQuestions = useCallback(async () => {
    const searchParams = new URLSearchParams(location.search);
    const category = searchParams.get('category');

    setIsLoading(true);
    setIsQuizOver(false);
    setPointsThisQuiz(0);
    setCurrentQuestionIndex(0);
    const fetchedQuestions = await triviaApiService.fetchQuestions(null, category ? [category] : []);
    setQuestions(fetchedQuestions);
    setIsLoading(false);
    setTimeLeft(initialTime);
    setIsAnswered(false);
    setMindReaderUsed(false);
  }, [location.search, initialTime]);

  useEffect(() => {
    loadQuestions();
  }, [location.search, initialTime]);

  useEffect(() => {
    if (timeLeft > 0 && !isAnswered && !isQuizOver) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !isAnswered && !isQuizOver) {
      handleAnswer(null);
    }
  }, [timeLeft, isAnswered, isQuizOver]);

  const handleAnswer = (selectedAnswer, isDoubleOrNothing = false) => {
    setIsAnswered(true);
    const isCorrect = selectedAnswer === questions[currentQuestionIndex].correct_answer;
    const category = questions[currentQuestionIndex].category;
    const fastAnswer = isCorrect && timeLeft > 10;

    if (isCorrect) {
      const pointsToAdd = isDoubleOrNothing ? pointsThisQuiz : 1;
      setPointsThisQuiz(pointsThisQuiz + pointsToAdd);
      addNotification('Correct!', 'success');
    } else {
      addNotification(`Wrong! The correct answer was ${questions[currentQuestionIndex].correct_answer}`, 'error');
    }

    // Update stats for this question
    const statsUpdate = {
      correct: isCorrect,
      category: category,
      score: isCorrect ? (isDoubleOrNothing ? pointsThisQuiz : 1) : 0,
      questionsAttempted: 1,
      correctAnswers: isCorrect ? 1 : 0,
      incorrectAnswers: isCorrect ? 0 : 1,
      fastAnswers: fastAnswer ? 1 : 0,
    };
    updateUserStats(statsUpdate);
    if (onAnswerCallback) onAnswerCallback(statsUpdate);

    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setTimeLeft(initialTime);
        setIsAnswered(false);
        setMindReaderUsed(false);
      } else {
        setIsQuizOver(true);
        const finalPoints = pointsThisQuiz + (isCorrect ? (isDoubleOrNothing ? pointsThisQuiz : 1) : 0);
        const perfectQuiz = finalPoints === questions.length;
        const finalStats = { perfectQuizzes: perfectQuiz ? 1 : 0 };
        updateUserStats(finalStats);
        if (onQuizCompleteCallback) onQuizCompleteCallback(finalStats);
      }
    }, 2000);
  };

  const useMindReader = () => {
    if (unlockedSkills.includes('mind_reader') && !mindReaderUsed) {
      const correctAnswer = questions[currentQuestionIndex].correct_answer;
      const incorrectAnswer = questions[currentQuestionIndex].incorrect_answers[0];
      const newAnswers = [correctAnswer, incorrectAnswer].sort(() => Math.random() - 0.5);

      const newQuestions = [...questions];
      newQuestions[currentQuestionIndex].answers = newAnswers;
      setQuestions(newQuestions);
      setMindReaderUsed(true);
      addNotification('Mind Reader used! Two answers removed.', 'info');
      updateUserStats({ powerUp: 'mind_reader' });
    }
  };

  const currentQuestion = questions[currentQuestionIndex];
  const allAnswers = currentQuestion ? (currentQuestion.answers || [...currentQuestion.incorrect_answers, currentQuestion.correct_answer].sort(() => Math.random() - 0.5)) : [];

  return {
    questions,
    currentQuestionIndex,
    pointsThisQuiz,
    timeLeft,
    isAnswered,
    isQuizOver,
    isLoading: isLoading || userStatsLoading,
    currentQuestion,
    allAnswers,
    handleAnswer,
    loadQuestions,
    unlockedSkills,
    useMindReader,
    mindReaderUsed,
  };
};
