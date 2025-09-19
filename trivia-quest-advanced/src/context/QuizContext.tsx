import { createContext, useState, ReactNode, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface QuizContextType {
  startQuiz: (category?: string, theme?: string, difficulty?: 'easy' | 'medium' | 'hard') => void;
  activeQuiz: { category?: string; theme?: string; difficulty?: 'easy' | 'medium' | 'hard' } | null;
  endQuiz: () => void;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export const QuizProvider = ({ children }: { children: ReactNode }) => {
  const [activeQuiz, setActiveQuiz] = useState<{ category?: string; theme?: string; difficulty?: 'easy' | 'medium' | 'hard' } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    console.log('QuizContext activeQuiz changed:', activeQuiz);
  }, [activeQuiz]);

  const startQuiz = useCallback((category?: string, theme?: string, difficulty?: 'easy' | 'medium' | 'hard') => {
    console.log('startQuiz called with:', { category, theme, difficulty });
    setActiveQuiz({ category, theme, difficulty });
    navigate('/quiz');
  }, [navigate]);

  const endQuiz = useCallback(() => {
    setActiveQuiz(null);
    navigate('/'); // Or wherever you want to go after a quiz
  }, [navigate]);

  return (
    <QuizContext.Provider value={{ startQuiz, activeQuiz, endQuiz }}>
      {children}
    </QuizContext.Provider>
  );
};