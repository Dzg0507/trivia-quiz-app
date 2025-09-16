import { useContext } from 'react';
import { QuizProgressContext } from '../context/QuizProgressContextValue';

export const useQuizProgress = () => {
  const context = useContext(QuizProgressContext);
  if (!context) {
    throw new Error('useQuizProgress must be used within a QuizProgressProvider');
  }
  console.log('useQuizProgress context:', context);
  return context;
};
