import axios, { AxiosError } from 'axios';
import { decode } from 'html-entities';
import { Question, ApiResponse, ApiError } from '../types/trivia';
import { logError } from '../utils/errorLogger';
import { NotificationType } from '../context/NotificationContextValue';

// Utility function to shuffle an array
const shuffleArray = <T>(array: T[]): T[] => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

interface OpenTriviaQuestionRaw {
  category: string;
  type: string;
  difficulty: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
}

interface OpenTriviaApiResponse {
  response_code: number;
  results: OpenTriviaQuestionRaw[];
}

interface TriviaApiQuestionRaw {
  category: string;
  id: string;
  correctAnswer: string;
  incorrectAnswers: string[];
  question: string;
  tags: string[];
  type: string;
  difficulty: string;
  regions: string[];
}

interface TriviaApiConfig<T> {
  name: string;
  baseUrl: string; // Changed from url to baseUrl
  formatResponse: (data: T) => Question[];
}

// API configurations
const APIs: Record<string, TriviaApiConfig<OpenTriviaApiResponse> | TriviaApiConfig<TriviaApiQuestionRaw[]>> = {
  OPEN_TRIVIA_DB: {
    name: 'Open Trivia DB',
    baseUrl: 'https://opentdb.com/api.php', // Changed to baseUrl
    formatResponse: (data: OpenTriviaApiResponse) => {
      return data.results.map((q: OpenTriviaQuestionRaw) => ({
        question: decode(q.question),
        answers: shuffleArray([...q.incorrect_answers, q.correct_answer].map((ans: string) => decode(ans))),
        correct_answer: decode(q.correct_answer),
        category: q.category,
        difficulty: q.difficulty
      }));
    }
  },
  TRIVIA_API: {
    name: 'Trivia API',
    baseUrl: 'https://the-trivia-api.com/api/questions', // Changed to baseUrl
    formatResponse: (data: TriviaApiQuestionRaw[]) => {
      return data.map((q: TriviaApiQuestionRaw) => ({
        question: q.question,
        answers: shuffleArray([...q.incorrectAnswers, q.correctAnswer]),
        correct_answer: q.correctAnswer,
        category: q.category,
        difficulty: q.difficulty
      }));
    }
  }
};

export const triviaApiService = {
  fetchQuestions: async (
    retries: number = 3,
    apiIndex: number = 0,
    difficulty?: 'easy' | 'medium' | 'hard', // Added difficulty parameter
    signal?: AbortSignal,
    addNotification?: (_message: string, _type?: NotificationType, _duration?: number) => void
  ): Promise<ApiResponse<Question[]>> => {

    const apiKeys = Object.keys(APIs);
    const currentApi = APIs[apiKeys[apiIndex]];

    if (!currentApi) {
      const error: ApiError = { message: 'All API options have been exhausted.', code: 'API_EXHAUSTED' };
      logError(new Error(error.message), undefined, { ...error }, 'critical');
      addNotification?.(error.message, 'critical', 0);
      return { data: null, error, status: 'error' };
    }

    try {
      console.log(`Attempting to fetch from ${currentApi.name}...`);

      let url = currentApi.baseUrl;
      if (currentApi.name === 'Open Trivia DB') {
        url += `?amount=10&type=multiple`;
        if (difficulty) {
          url += `&difficulty=${difficulty}`;
        }
      } else if (currentApi.name === 'Trivia API') {
        url += `?limit=10&type=multiple`;
        if (difficulty) {
          url += `&difficulty=${difficulty}`;
        }
      }

      const response = await axios.get(url, { signal });

      const questions = currentApi.formatResponse(response.data);
      if (!questions || questions.length === 0) {
        throw new Error('No questions returned from API');
      }

      const invalidQuestions = questions.filter(q => !q.question || !q.correct_answer || !q.answers);
      if (invalidQuestions.length > 0) {
        console.warn(`${invalidQuestions.length} invalid questions from ${currentApi.name}`);
        throw new Error('Invalid question format received from API');
      }

      console.log(`Successfully fetched ${questions.length} questions from ${currentApi.name}`);
      return { data: questions, error: null, status: 'success' };

    } catch (error: unknown) {
      if (axios.isCancel(error)) {
        const apiError: ApiError = { message: (error as Error).message, isCanceled: true, code: 'REQUEST_CANCELED' };
        logError(new Error(apiError.message), undefined, { ...apiError }, 'info');
        // No notification for user-initiated cancellation
        return { data: null, error: apiError, status: 'error' };
      }

      logError(error as Error, undefined, { api: currentApi.name }, 'error');
      addNotification?.(`Error fetching from ${currentApi.name}: ${(error as Error).message}`, 'error');

      if ((error as AxiosError).response?.status === 429) {
        if (retries > 0) {
          const delay = Math.min(6000 * Math.pow(2, 3 - retries), 60000); // Max 60 seconds delay
          addNotification?.(`Rate limited on ${currentApi.name}. Retrying in ${delay / 1000}s...`, 'warning');
          await new Promise(resolve => setTimeout(resolve, delay));
          return triviaApiService.fetchQuestions(retries - 1, apiIndex, difficulty, signal, addNotification); // Pass difficulty
        } else {
          const nextApiIndex = apiIndex + 1;
          if (nextApiIndex < apiKeys.length) {
            addNotification?.(`${currentApi.name} exhausted, switching to ${APIs[apiKeys[nextApiIndex]].name}...`, 'info');
            return triviaApiService.fetchQuestions(3, nextApiIndex, difficulty, signal, addNotification); // Pass difficulty
          }
        }
      }

      if (retries > 0) {
        addNotification?.(`Retrying ${currentApi.name}...`, 'warning');
        await new Promise(resolve => setTimeout(resolve, 2000));
        return triviaApiService.fetchQuestions(retries - 1, apiIndex, difficulty, signal, addNotification); // Pass difficulty
      } else {
        const nextApiIndex = apiIndex + 1;
        if (nextApiIndex < apiKeys.length) {
          addNotification?.(`${currentApi.name} failed, switching to ${APIs[apiKeys[nextApiIndex]].name}...`, 'info');
          return triviaApiService.fetchQuestions(3, nextApiIndex, difficulty, signal, addNotification); // Pass difficulty
        }
        const finalError: ApiError = { message: 'All trivia APIs have failed after multiple retries.', code: 'ALL_APIS_FAILED' };
        logError(new Error(finalError.message), undefined, { ...finalError }, 'critical');
        addNotification?.(finalError.message, 'critical', 0);
        return { data: null, error: finalError, status: 'error' };
      }
    }
  },

  // Method to get available API names
  getAvailableAPIs: (): string[] => {
    return Object.keys(APIs).map(key => APIs[key].name);
  },

  // Method to test a specific API
  testAPI: async (apiName: string): Promise<ApiResponse<Question[]>> => {
    const apiKey = Object.keys(APIs).find(key => APIs[key].name === apiName);
    if (!apiKey) {
      const error: ApiError = { message: `API "${apiName}" not found`, code: 'API_NOT_FOUND' };
      logError(new Error(error.message), undefined, { ...error }, 'error');
      return { data: null, error, status: 'error' };
    }

    try {
      const response = await axios.get(APIs[apiKey].baseUrl); // Use baseUrl here
      const questions = APIs[apiKey].formatResponse(response.data);
      return { data: questions, error: null, status: 'success' };
    } catch (error: unknown) {
      logError(error as Error, undefined, { api: apiName }, 'error');
      const apiError: ApiError = { message: (error as Error).message, code: (error as AxiosError).response?.status || 'NETWORK_ERROR' };
      return { data: null, error: apiError, status: 'error' };
    }
  }
};
