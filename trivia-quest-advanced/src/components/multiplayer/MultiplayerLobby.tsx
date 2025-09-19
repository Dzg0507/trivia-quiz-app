import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import { firestoreService, MultiplayerGameSession } from '../../services/firestoreService';
import { useAuth } from '../../hooks/useAuth';
import { useNotifications } from '../../hooks/useNotifications';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, LogIn, RefreshCw, Users, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const MultiplayerLobby: React.FC = () => {
  const { currentUser } = useAuth();
  const { addNotification } = useNotifications();
  const navigate = useNavigate();

  const [gameIdInput, setGameIdInput] = useState<string>('');
  const [availableGames, setAvailableGames] = useState<MultiplayerGameSession[]>([]);
  const [loadingGames, setLoadingGames] = useState<boolean>(true);
  const [creatingGame, setCreatingGame] = useState<boolean>(false);
  const [joiningGame, setJoiningGame] = useState<boolean>(false);

  useEffect(() => {
    const fetchAvailableGames = async () => {
      setLoadingGames(true);
      try {
        // This would ideally be a real-time listener for games with status 'waiting'
        // For now, a simple fetch will do, but a listener is better for real-time updates
        // firestoreService.listenToAvailableGames((games) => { setAvailableGames(games); setLoadingGames(false); });
        // Since listenToAvailableGames is not implemented, we'll simulate a fetch
        // In a real app, you'd query for games where status === 'waiting'
        const gamesCollection = await getDocs(collection(db, 'multiplayerGames'));
        const games: MultiplayerGameSession[] = [];
        gamesCollection.forEach(doc => {
          const game = doc.data() as MultiplayerGameSession;
          if (game.status === 'waiting') {
            games.push(game);
          }
        });
        setAvailableGames(games);
      } catch (error) {
        console.error("Error fetching available games:", error);
        addNotification('Failed to load available games.', 'error');
      } finally {
        setLoadingGames(false);
      }
    };

    fetchAvailableGames();
    // Polling for available games (replace with real-time listener if implemented)
    const interval = setInterval(fetchAvailableGames, 5000);
    return () => clearInterval(interval);
  }, [addNotification]);

  const handleCreateGame = async () => {
    if (!currentUser) {
      addNotification('You must be logged in to create a game.', 'warning');
      return;
    }
    setCreatingGame(true);
    try {
      const userData = await firestoreService.getUserData(currentUser.uid);
      if (!userData) {
        throw new Error('User data not found.');
      }
      const newGame = await firestoreService.createGame(currentUser.uid, userData.username);
      addNotification(`Game ${newGame.gameId} created!`, 'success');
      navigate(`/multiplayer/${newGame.gameId}`);
    } catch (error) {
      console.error('Error creating game:', error);
      addNotification(`Failed to create game: ${(error as Error).message}`, 'error');
    } finally {
      setCreatingGame(false);
    }
  };

  const handleJoinGame = async (gameId: string) => {
    if (!currentUser) {
      addNotification('You must be logged in to join a game.', 'warning');
      return;
    }
    setJoiningGame(true);
    try {
      const userData = await firestoreService.getUserData(currentUser.uid);
      if (!userData) {
        throw new Error('User data not found.');
      }
      await firestoreService.joinGame(gameId, currentUser.uid, userData.username);
      addNotification(`Joined game ${gameId}!`, 'success');
      navigate(`/multiplayer/${gameId}`);
    } catch (error) {
      console.error('Error joining game:', error);
      addNotification(`Failed to join game: ${(error as Error).message}`, 'error');
    } finally {
      setJoiningGame(false);
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: -50, transition: { duration: 0.3 } },
  };

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center p-4"
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={cardVariants}
    >
      <div className="card w-full max-w-md">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">Multiplayer Lobby</h2>

        {/* Create Game */}
        <div className="mb-8 p-4 bg-trivia-blue-dark/50 rounded-xl">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <PlusCircle className="w-6 h-6 text-trivia-gold" /> Create New Game
          </h3>
          <motion.button
            onClick={handleCreateGame}
            className="btn btn-gold w-full flex items-center justify-center gap-2"
            disabled={creatingGame || !currentUser}
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05 }}
          >
            {creatingGame ? <Loader2 className="animate-spin" /> : <PlusCircle className="w-5 h-5" />}
            {creatingGame ? 'Creating...' : 'Create Game'}
          </motion.button>
        </div>

        {/* Join Game by ID */}
        <div className="mb-8 p-4 bg-trivia-blue-dark/50 rounded-xl">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <LogIn className="w-6 h-6 text-trivia-neon" /> Join Game by ID
          </h3>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Enter Game ID"
              className="flex-grow p-3 rounded-lg bg-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-trivia-neon"
              value={gameIdInput}
              onChange={(e) => setGameIdInput(e.target.value)}
            />
            <motion.button
              onClick={() => handleJoinGame(gameIdInput)}
              className="btn btn-neon flex items-center justify-center gap-2"
              disabled={joiningGame || !gameIdInput || !currentUser}
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.05 }}
            >
              {joiningGame ? <Loader2 className="animate-spin" /> : <LogIn className="w-5 h-5" />}
              {joiningGame ? 'Joining...' : 'Join'}
            </motion.button>
          </div>
        </div>

        {/* Available Games */}
        <div className="p-4 bg-trivia-blue-dark/50 rounded-xl">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Users className="w-6 h-6 text-trivia-gold" /> Available Games
            <motion.button
              onClick={() => { /* Re-fetch available games */ }}
              className="ml-auto p-1 rounded-full hover:bg-white/10 transition-colors"
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.1 }}
            >
              <RefreshCw className="w-5 h-5 text-white" />
            </motion.button>
          </h3>
          {loadingGames ? (
            <div className="flex justify-center items-center py-4">
              <Loader2 className="animate-spin w-8 h-8 text-trivia-neon" />
            </div>
          ) : availableGames.length === 0 ? (
            <p className="text-white/70 text-center">No games waiting. Create one!</p>
          ) : (
            <ul className="space-y-3">
              {availableGames.map((game) => (
                <motion.li
                  key={game.gameId}
                  className="flex justify-between items-center p-3 bg-white/10 rounded-lg"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <span className="text-white font-medium">Game ID: {game.gameId}</span>
                  <span className="text-white/70">Host: {game.players[game.hostId]?.username || 'Unknown'}</span>
                  <motion.button
                    onClick={() => handleJoinGame(game.gameId)}
                    className="btn btn-neon px-4 py-2 text-sm"
                    disabled={joiningGame || !currentUser}
                    whileTap={{ scale: 0.95 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    Join
                  </motion.button>
                </motion.li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default MultiplayerLobby;
