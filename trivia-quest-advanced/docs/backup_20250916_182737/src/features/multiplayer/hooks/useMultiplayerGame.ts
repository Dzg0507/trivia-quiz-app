import { useState, useEffect, useCallback, useRef } from 'react';
import { firestoreService, MultiplayerGameSession } from '../services/firestoreService.ts';
import { useAuth } from './useAuth.ts';
import { useNotifications } from './useNotifications.ts';
import { triviaApiService } from '../services/triviaApi.ts';
import { Question } from '../types/trivia';

interface UseMultiplayerGameResult {
  gameSession: MultiplayerGameSession | null;
  loading: boolean;
  error: string | null;
  isHost: boolean;
  currentQuestion: Question | undefined;
  timeLeft: number;
  selectedAnswer: string | null;
  isAnswered: boolean;
  handleStartGame: () => Promise<void>;
  handleAnswerClick: (_answer: string) => Promise<void>;
  handleLeaveGame: () => Promise<void>;
  getAnswerButtonStyle: (_answer: string) => string;
}

export const useMultiplayerGame = (gameId: string): UseMultiplayerGameResult => {
  const { currentUser } = useAuth();
  const { addNotification } = useNotifications();

  const [gameSession, setGameSession] = useState<MultiplayerGameSession | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const timerIntervalRef = useRef<number | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);

  const currentQuestion = gameSession?.questions[gameSession.currentQuestionIndex];
  const isHost = currentUser?.uid === gameSession?.hostId;

  const startTimer = useCallback(() => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
    if (gameSession && gameSession.status === 'playing' && currentQuestion) {
      const endTime = gameSession.currentQuestionStartTime + gameSession.questionDuration * 1000;
      const updateTime = () => {
        const remaining = Math.max(0, Math.ceil((endTime - Date.now()) / 1000));
        setTimeLeft(remaining);
        if (remaining === 0) {
          window.clearInterval(timerIntervalRef.current!); // Clear the interval when time is up
          if (!isAnswered) { // If user hasn't answered, mark as answered
            setIsAnswered(true);
            // Optionally, submit a null answer to Firestore here if needed for tracking
          }
          // Host responsibility to move to next question
          if (isHost && gameSession.currentQuestionIndex === gameSession.questions.length - 1) {
            // Last question, game ends
            // firestoreService.endGame(gameId);
          } else if (isHost) {
            // Move to next question after a short delay
            setTimeout(() => {
              firestoreService.nextQuestion(gameId);
              setSelectedAnswer(null);
              setIsAnswered(false);
            }, 2000); // 2 seconds to show results
          }
        }
      };
      timerIntervalRef.current = window.setInterval(updateTime, 1000);
      updateTime(); // Initial call to set time immediately
    }
  }, [gameSession, currentQuestion, isHost, gameId, isAnswered]);

  useEffect(() => {
    if (!gameId) {
      setError('Game ID is missing.');
      setLoading(false);
      return;
    }

    const unsubscribe = firestoreService.listenToGameChanges(gameId, (session) => {
      if (session) {
        setGameSession(session);
        setLoading(false);
        setError(null);
        // Reset local state when question changes
        if (session.currentQuestionIndex !== (gameSession?.currentQuestionIndex ?? -1)) {
          setSelectedAnswer(null);
          setIsAnswered(false);
          startTimer(); // Restart timer for new question
        }
      } else {
        setError('Game not found or has ended.');
        setLoading(false);
        setGameSession(null);
      }
    });

    return () => {
      unsubscribe();
      if (timerIntervalRef.current) {
        window.clearInterval(timerIntervalRef.current);
      }
    };
  }, [gameId, startTimer, gameSession?.currentQuestionIndex]);

  const handleStartGame = useCallback(async () => {
    if (!gameId || !isHost) return;
    setLoading(true);
    try {
      const questions = await triviaApiService.fetchQuestions(10); // Fetch 10 questions for the game
      if (questions.data) {
        await firestoreService.startGame(gameId, questions.data);
        addNotification('Game started!', 'success');
      } else if (questions.error) {
        addNotification(`Failed to fetch questions: ${questions.error.message}`, 'error');
      }
    } catch (err: unknown) {
      console.error('Error starting game:', err);
      addNotification(`Error starting game: ${(err as Error).message}`, 'error');
    } finally {
      setLoading(false);
    }
  }, [gameId, isHost, addNotification]);

  const handleAnswerClick = useCallback(async (answer: string) => {
    if (!gameSession || !currentUser || isAnswered) return;

    setSelectedAnswer(answer);
    setIsAnswered(true);

    const isCorrect = answer === currentQuestion?.correct_answer;
    await firestoreService.submitAnswer(gameId, currentUser.uid, gameSession.currentQuestionIndex, isCorrect);

    // Host will handle moving to the next question after a delay
  }, [gameSession, currentUser, isAnswered, currentQuestion, gameId]);

  const getAnswerButtonStyle = useCallback((answer: string) => {
    if (!isAnswered) {
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
  }, [isAnswered, selectedAnswer, currentQuestion]);

  const handleLeaveGame = useCallback(async () => {
    if (!currentUser || !gameId) return;
    try {
      await firestoreService.leaveGame(gameId, currentUser.uid);
      addNotification('Left game.', 'info');
      // navigate('/multiplayer'); // Navigation handled by component
    } catch (err: unknown) {
      console.error('Error leaving game:', err);
      addNotification(`Failed to leave game: ${(err as Error).message}`, 'error');
    }
  }, [currentUser, gameId, addNotification]);

  return {
    gameSession,
    loading,
    error,
    isHost,
    currentQuestion,
    timeLeft,
    selectedAnswer,
    isAnswered,
    handleStartGame,
    handleAnswerClick,
    handleLeaveGame,
    getAnswerButtonStyle,
  };
};
