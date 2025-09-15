export interface Question {
  question: string;
  answers: string[];
  correct_answer: string;
  category: string;
  difficulty: string;
}

export interface ApiResponse<T> {
  data: T | null;
  error: ApiError | null;
  status: 'success' | 'error';
}

export interface ApiError {
  message: string;
  code?: string | number;
  details?: unknown;
  isCanceled?: boolean;
}
