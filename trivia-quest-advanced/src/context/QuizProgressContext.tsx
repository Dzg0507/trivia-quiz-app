import React, { useState, ReactNode, useCallback } from 'react';
import { QuizProgressContext } from './QuizProgressContextValue';

interface QuizProgressProviderProps {
  children: ReactNode;
}

const QuizProgressProvider: React.FC<QuizProgressProviderProps> = ({ children }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [questionsLength, setQuestionsLength] = useState<number>(0);

  const updateQuizProgress = useCallback((index: number, length: number) => {
    setCurrentIndex(index);
    setQuestionsLength(length);
  }, []);

  return (
    <QuizProgressContext.Provider value={{ currentIndex, questionsLength, updateQuizProgress }}>
      {children}
    </QuizProgressContext.Provider>
  );
};


export default QuizProgressProvider;
