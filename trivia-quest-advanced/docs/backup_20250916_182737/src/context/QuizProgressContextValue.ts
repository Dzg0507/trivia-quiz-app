import { createContext } from 'react';

interface QuizProgressContextType {
  currentIndex: number;
  questionsLength: number;
  updateQuizProgress: (index: number, length: number) => void;
}

export const QuizProgressContext = createContext<QuizProgressContextType | undefined>(undefined);
