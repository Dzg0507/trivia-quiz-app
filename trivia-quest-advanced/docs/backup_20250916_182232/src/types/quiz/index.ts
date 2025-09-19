// Quiz Types
export interface Question {
  category: string;
  type: string;
  difficulty: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
  allAnswers?: string[]; // Combined and shuffled answers
}

export interface Answer {
  questionIndex: number;
  answer: string;
  isCorrect: boolean;
  points: number;
}

export interface QuizState {
  questions: Question[];
  currentQuestionIndex: number;
  score: number;
  streak: number;
  gameState: 'idle' | 'loading' | 'playing' | 'completed';
  answers: Answer[];
  loading: boolean;
  error: string | null;
}

export interface QuizSettings {
  category: string;
  difficulty: string;
  amount: number;
  timeLimit?: number;
}
