import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { firestoreService, MultiplayerGameSession } from '../../services/firestoreService';
import { useAuth } from '../../hooks/useAuth';
import { useNotifications } from '../../hooks/useNotifications';
import { Question } from '../../types/trivia';
import { motion } from 'framer-motion';
import { Loader2, Users, Crown, Clock, CheckCircle, XCircle, RotateCcw, Home, Trophy } from 'lucide-react';
import { triviaApiService } from '../../services/triviaApi';

const MultiplayerGame: React.FC = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { addNotification } = useNotifications();

  const [gameSession, setGameSession] = useState<MultiplayerGameSession | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isHost, setIsHost] = useState<boolean>(false);
  const [fetchingQuestions, setFetchingQuestions] = useState<boolean>(false);

  // Listen to game session changes
  useEffect(() => {
    if (!gameId) {
      setError('Game ID is missing.');
      setLoading(false);
      return;
    }

    const unsubscribe = firestoreService.listenToGameChanges(gameId, (session) => {
      if (session) {
        setGameSession(session);
        if (currentUser && session.hostId === currentUser.uid) {
          setIsHost(true);
        }
        // Reset answer state when question changes
        if (session.currentQuestionIndex !== -1 && session.questions.length > 0) {
          setSelectedAnswer(null);
          setIsAnswered(false);
          setTimeLeft(session.questionDuration - Math.floor((Date.now() - session.currentQuestionStartTime) / 1000));
        }
      } else {
        setError('Game not found or ended.');
        addNotification('Game not found or ended.', 'error');
        navigate('/multiplayer');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [gameId, currentUser, navigate, addNotification]);

  // Timer for current question
  useEffect(() => {
    if (gameSession && gameSession.status === 'playing' && gameSession.currentQuestionStartTime > 0 && !isAnswered) {
      const interval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - gameSession.currentQuestionStartTime) / 1000);
        const remaining = gameSession.questionDuration - elapsed;
        if (remaining <= 0) {
          setTimeLeft(0);
          setIsAnswered(true); // Time's up, mark as answered
          clearInterval(interval);
          // Host automatically moves to next question after a delay
          if (isHost) {
            setTimeout(() => {
              firestoreService.nextQuestion(gameId!);
            }, 2000); // 2 seconds to show correct answer
          }
        } else {
          setTimeLeft(remaining);
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [gameSession, isAnswered, isHost, gameId]);

  const handleStartGame = useCallback(async () => {
    if (!gameId || !isHost) return;
    setFetchingQuestions(true);
    try {
      const response = await triviaApiService.fetchQuestions(10, 0, 'medium', undefined, addNotification); // Fetch 10 medium questions
      if (response.status === 'success' && response.data) {
        await firestoreService.startGame(gameId, response.data);
      } else {
        addNotification(`Failed to fetch questions: ${response.error?.message}`, 'error');
      }
    } catch (err) {
      console.error('Error starting game:', err);
      addNotification(`Error starting game: ${(err as Error).message}`, 'error');
    } finally {
      setFetchingQuestions(false);
    }
  }, [gameId, isHost, addNotification]);

  const handleAnswerClick = useCallback(async (answer: string) => {
    if (!gameId || !currentUser || !gameSession || isAnswered || gameSession.status !== 'playing') return;

    setSelectedAnswer(answer);
    setIsAnswered(true);

    const currentQuestion = gameSession.questions[gameSession.currentQuestionIndex];
    const isCorrect = answer === currentQuestion.correct_answer;

    await firestoreService.submitAnswer(gameId, currentUser.uid, gameSession.currentQuestionIndex, isCorrect);

    // Host automatically moves to next question after a delay if all players answered or time is up
    // This logic is handled by the timer now, but could be more sophisticated
  }, [gameId, currentUser, gameSession, isAnswered]);

  

  const handleLeaveGame = useCallback(async () => {
    if (!gameId || !currentUser) return;
    try {
      await firestoreService.leaveGame(gameId, currentUser.uid);
      addNotification('Left the game.', 'info');
      navigate('/multiplayer');
    } catch (err) {
      console.error('Error leaving game:', err);
      addNotification(`Failed to leave game: ${(err as Error).message}`, 'error');
    }
  }, [gameId, currentUser, navigate, addNotification]);

  const currentQuestion: Question | undefined = useMemo(() => {
    if (gameSession && gameSession.questions.length > 0 && gameSession.currentQuestionIndex !== -1) {
      return gameSession.questions[gameSession.currentQuestionIndex];
    }
    return undefined;
  }, [gameSession]);

  const sortedPlayers = useMemo(() => {
    if (!gameSession) return [];
    return Object.values(gameSession.players).sort((a, b) => b.score - a.score);
  }, [gameSession]);

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin w-16 h-16 text-trivia-neon" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="card text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">Error</h2>
          <p className="text-trivia-gray-light mb-6">{error}</p>
          <motion.button
            onClick={() => navigate('/multiplayer')}
            className="btn btn-gold w-full flex items-center justify-center gap-2"
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05 }}
          >
            <Home className="w-5 h-5" />
            Back to Lobby
          </motion.button>
        </div>
      </div>
    );
  }

  if (!gameSession) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="card text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">Game Not Found</h2>
          <p className="text-trivia-gray-light mb-6">The game you are trying to join does not exist or has ended.</p>
          <motion.button
            onClick={() => navigate('/multiplayer')}
            className="btn btn-gold w-full flex items-center justify-center gap-2"
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05 }}
          >
            <Home className="w-5 h-5" />
            Back to Lobby
          </motion.button>
        </div>
      </div>
    );
  }

  if (gameSession.status === 'waiting') {
    return (
      <motion.div
        className="min-h-screen flex items-center justify-center p-4"
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={cardVariants}
      >
        <div className="card w-full max-w-md text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Waiting for Players...</h2>
          <p className="text-trivia-gray-light mb-6">Game ID: <span className="font-mono text-trivia-neon">{gameId}</span></p>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-white mb-3 flex items-center justify-center gap-2">
              <Users className="w-5 h-5 text-trivia-gold" /> Players ({Object.keys(gameSession.players).length})
            </h3>
            <ul className="space-y-2">
              {Object.entries(gameSession.players).map(([playerId, player]) => (
                <li key={playerId} className="flex items-center justify-center gap-2 text-white/80">
                  {player.username} {playerId === gameSession.hostId && <Crown className="w-4 h-4 text-trivia-gold" />}
                </li>
              ))}
            </ul>
          </div>

          {isHost ? (
            <motion.button
              onClick={handleStartGame}
              className="btn btn-gold w-full flex items-center justify-center gap-2 mb-4"
              disabled={Object.keys(gameSession.players).length < 2 || fetchingQuestions}
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.05 }}
            >
              {fetchingQuestions ? <Loader2 className="animate-spin" /> : <CheckCircle className="w-5 h-5" />}
              {fetchingQuestions ? 'Fetching Questions...' : 'Start Game'}
            </motion.button>
          ) : (
            <p className="text-trivia-gray-light mb-4">Waiting for host to start the game...</p>
          )}

          <motion.button
            onClick={handleLeaveGame}
            className="btn bg-red-500/20 hover:bg-red-500/40 w-full flex items-center justify-center gap-2"
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05 }}
          >
            <Home className="w-5 h-5" />
            Leave Game
          </motion.button>
        </div>
      </motion.div>
    );
  }

  if (gameSession.status === 'completed') {
    return (
      <motion.div
        className="min-h-screen flex items-center justify-center p-4"
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={cardVariants}
      >
        <div className="card w-full max-w-md text-center">
          <Trophy className="w-16 h-16 text-trivia-gold mx-auto mb-4 animate-pulse-glow" />
          <h2 className="text-3xl font-bold text-white mb-6">Game Over!</h2>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-white mb-3">Final Scores:</h3>
            <ul className="space-y-2">
              {sortedPlayers.map((player, index) => (
                <li key={player.username} className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
                  <span className="font-medium text-white">{index + 1}. {player.username}</span>
                  <span className="font-bold text-trivia-gold">{player.score}</span>
                </li>
              ))}
            </ul>
          </div>

          <motion.button
            onClick={() => navigate('/multiplayer')}
            className="btn btn-gold w-full flex items-center justify-center gap-2"
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05 }}
          >
            <RotateCcw className="w-5 h-5" />
            Back to Lobby
          </motion.button>
        </div>
      </motion.div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="card text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">No Questions</h2>
          <p className="text-trivia-gray-light mb-6">The game has no questions loaded.</p>
          <motion.button
            onClick={() => navigate('/multiplayer')}
            className="btn btn-gold w-full flex items-center justify-center gap-2"
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05 }}
          >
            <Home className="w-5 h-5" />
            Back to Lobby
          </motion.button>
        </div>
      </div>
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
                <Users className="w-5 h-5 text-trivia-neon" />
                <span className="font-semibold">Players: {Object.keys(gameSession.players).length}</span>
              </div>
              <div className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-trivia-gold" />
                <span className="font-semibold">Host: {gameSession.players[gameSession.hostId]?.username || 'Unknown'}</span>
              </div>
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
              style={{ width: `${((gameSession.currentQuestionIndex + 1) / gameSession.questions.length) * 100}%` }}
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
                key={`${gameSession.currentQuestionIndex}-${index}`}
                onClick={() => handleAnswerClick(answer)}
                disabled={isAnswered}
                className={`btn text-left justify-start ${getAnswerButtonStyle(answer)}`}
                variants={answerVariants}
                custom={index}
              >
                <div className="flex items-center justify-between w-full">
                  <span>{answer}</span>
                  {isAnswered && (
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

          {isAnswered && (
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

        <motion.div className="card mt-6">
          <h3 className="text-xl font-semibold text-white mb-3">Scores:</h3>
          <ul className="space-y-2">
            {sortedPlayers.map((player, index) => (
              <li key={player.username} className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
                <span className="font-medium text-white">{index + 1}. {player.username}</span>
                <span className="font-bold text-trivia-gold">{player.score}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        <div className="text-center mt-6">
          <motion.button
            onClick={handleLeaveGame}
            className="btn bg-red-500/20 hover:bg-red-500/40 flex items-center gap-2 mx-auto"
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05 }}
          >
            <Home className="w-5 h-5" />
            Leave Game
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default MultiplayerGame;
