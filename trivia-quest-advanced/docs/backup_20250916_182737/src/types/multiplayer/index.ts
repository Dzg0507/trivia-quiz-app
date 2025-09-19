// Multiplayer Types
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

export interface MultiplayerGameSettings {
  category: string;
  difficulty: string;
  questionCount: number;
  timePerQuestion: number;
  isPrivate: boolean;
}

export interface MultiplayerState {
  gameId: string | null;
  isHost: boolean;
  players: string[];
  gameStatus: 'waiting' | 'playing' | 'completed';
  loading: boolean;
  error: string | null;
}
