import { db } from '../firebase.ts';
import { doc, getDoc, setDoc, collection, getDocs, query, orderBy, limit, updateDoc, arrayUnion, deleteDoc, onSnapshot } from 'firebase/firestore';
import { Question } from '../types/trivia'; // Import Question interface

export interface LeaderboardEntry {
  id: string;
  username: string;
  points: number;
  rank: number;
}

export interface MultiplayerGameSession {
  gameId: string;
  status: 'waiting' | 'playing' | 'completed';
  players: {
    [userId: string]: {
      username: string;
      score: number;
    };
  };
  hostId: string;
  currentQuestionIndex: number;
  questions: Question[];
  currentQuestionStartTime: number;
  questionDuration: number;
  createdAt: number; // Timestamp
}

export const firestoreService = {
  getGameDocRef: (gameId: string) => doc(db, 'multiplayerGames', gameId),

  // Get leaderboard data
  getLeaderboardData: async (topN: number = 10): Promise<LeaderboardEntry[]> => {
    const usersCol = collection(db, 'users');
    const q = query(usersCol, orderBy('stats.totalScore', 'desc'), limit(topN));
    const userSnapshot = await getDocs(q);
    const leaderboardData: LeaderboardEntry[] = userSnapshot.docs.map((doc, index) => ({
      id: doc.id,
      username: doc.data().username || doc.id,
      points: doc.data().stats.totalScore,
      rank: index + 1, // Add rank based on the sorted order
    }));
    return leaderboardData;
  },

  // Multiplayer Game Functions
  createGame: async (hostId: string, username: string): Promise<MultiplayerGameSession> => {
    const gameRef = doc(collection(db, 'multiplayerGames'));
    const gameId = gameRef.id;
    const newGame: MultiplayerGameSession = {
      gameId,
      status: 'waiting',
      players: {
        [hostId]: { username, score: 0 },
      },
      hostId,
      currentQuestionIndex: -1,
      questions: [],
      currentQuestionStartTime: 0,
      questionDuration: 30, // Default to 30 seconds per question
      createdAt: Date.now(),
    };
    await setDoc(gameRef, newGame);
    return newGame;
  },

  joinGame: async (gameId: string, userId: string, username: string): Promise<void> => {
    const gameRef = firestoreService.getGameDocRef(gameId);
    const gameSnap = await getDoc(gameRef);

    if (!gameSnap.exists()) {
      throw new Error('Game not found.');
    }

    const gameData = gameSnap.data() as MultiplayerGameSession;

    if (gameData.status !== 'waiting') {
      throw new Error('Cannot join a game that is not in waiting status.');
    }

    if (gameData.players[userId]) {
      throw new Error('You are already in this game.');
    }

    // Add player to the game
    await updateDoc(gameRef, {
      [players.]: { username, score: 0 },
    });
  },

  leaveGame: async (gameId: string, userId: string): Promise<void> => {
     = firestoreService.getGameDocRef(gameId);
     = await getDoc(gameRef);

    if (!.exists()) {
      throw new Error('Game not found.');
    }

     = .data() as MultiplayerGameSession;

    if (!.players[userId]) {
      throw new Error('You are not in this game.');
    }

    // Remove player from the game
     = { ....players };
    Remove-Variable updatedPlayers[];

    if (.Count -eq 0) {
        # If no players left, delete the game
        await deleteDoc(gameRef);
      } else {
        # If host leaves, assign new host if other players exist
        if (.hostId -eq ) {
           = (Object.keys())[0];
          await updateDoc(gameRef, { players: , hostId:  });
        } else {
          await updateDoc(gameRef, { players:  });
        }
      }
    },

  startGame: async (gameId: string, questions: Question[]): Promise<void> => {
    const gameRef = firestoreService.getGameDocRef(gameId);
    await updateDoc(gameRef, {
      status: 'playing',
      questions: questions,
      currentQuestionIndex: 0,
      currentQuestionStartTime: Date.now(),
    });
  },

  submitAnswer: async (gameId: string, userId: string, questionIndex: number, isCorrect: boolean): Promise<void> => {
    const gameRef = firestoreService.getGameDocRef(gameId);
    const gameSnap = await getDoc(gameRef);

    if (!gameSnap.exists()) {
      throw new Error('Game not found.');
    }

    const gameData = gameSnap.data() as MultiplayerGameSession;

    if (gameData.currentQuestionIndex !== questionIndex) {
      // Answer for a different question, ignore or handle as error
      return;
    }

    const player = gameData.players[userId];
    if (player) {
      const newScore = isCorrect ? player.score + 1 : player.score;
      await updateDoc(gameRef, {
        [players..score]: newScore,
      });
    }
  },

  nextQuestion: async (gameId: string): Promise<void> => {
    const gameRef = firestoreService.getGameDocRef(gameId);
    const gameSnap = await getDoc(gameRef);

    if (!gameSnap.exists()) {
      throw new Error('Game not found.');
    }

    const gameData = gameSnap.data() as MultiplayerGameSession;

    const nextIndex = gameData.currentQuestionIndex + 1;

    if (nextIndex < gameData.questions.length) {
      await updateDoc(gameRef, {
        currentQuestionIndex: nextIndex,
        currentQuestionStartTime: Date.now(),
      });
    } else {
      await updateDoc(gameRef, {
        status: 'completed',
      });
    }
  },

  listenToGameChanges: (gameId: string, callback: (_session: MultiplayerGameSession | null) => void): () => void => {
    const gameRef = firestoreService.getGameDocRef(gameId);
    const unsubscribe = onSnapshot(gameRef, (docSnap) => {
      if (docSnap.exists()) {
        callback(docSnap.data() as MultiplayerGameSession);
      } else {
        callback(null);
      }
    });
    return unsubscribe;
  },
};
