// Consolidated Game Context
import React, { createContext, useContext, ReactNode } from 'react';
import { useMultiplayerGame } from '../hooks/useMultiplayerGame';

// Define the context type
interface GameContextType {
  questions: any[];
  currentQuestionIndex: number;
  currentQuestion: any;
  score: number;
  streak: number;
  gameState: string;
  answers: any[];
  loading: boolean;
  error: string | null;
  startGame: (category: string, difficulty: string, amount?: number) => Promise<any[]>;
  answerQuestion: (answer: string) => boolean;
  nextQuestion: () => boolean;
  endGame: () => Promise<any>;
  createMultiplayerGame: (settings: any) => Promise<string>;
  joinMultiplayerGame: (gameId: string) => Promise<boolean>;
  submitMultiplayerAnswer: (answer: string) => Promise<boolean>;
  multiplayerGameId: string | null;
}

// Create the context with a default value
const GameContext = createContext<GameContextType | null>(null);

// Provider component
interface GameProviderProps {
  children: ReactNode;
  questId?: string;
  userId?: string;
}

export const GameProvider: React.FC<GameProviderProps> = ({ children, questId, userId }) => {
  const game = useMultiplayerGame(questId, userId);
  
  return (
    <GameContext.Provider value={game}>
      {children}
    </GameContext.Provider>
  );
};

// Custom hook to use the context
export const useGameContext = (): GameContextType => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGameContext must be used within a GameProvider');
  }
  return context;
};