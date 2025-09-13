import axios from 'axios';
import { decode } from 'html-entities';

const API_URL = 'https://the-trivia-api.com/v2/questions';

// Utility function to shuffle an array
const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

export const triviaApiService = {
  fetchQuestions: async (region = null, categories = [], difficulty = 'medium', limit = 10) => {
    try {
      const params = {
        limit,
        difficulty,
      };

      if (region) {
        params.region = region;
      }

      if (categories.length > 0) {
        params.categories = categories.join(',');
      }

      const response = await axios.get(API_URL, { params });

      // The new API response format is slightly different.
      // We need to adapt it to match the structure our components expect.
      return response.data.map(q => ({
        question: decode(q.question.text),
        answers: shuffleArray([...q.incorrectAnswers, q.correctAnswer].map(ans => decode(ans))),
        correct_answer: decode(q.correctAnswer),
        category: q.category,
        difficulty: q.difficulty,
      }));
    } catch (error) {
      console.error('Error fetching trivia questions:', error);
      // It might be good to throw the error to be handled by the calling component
      // This allows for more specific error messages to the user.
      throw new Error('Failed to load questions. Please try again later.');
    }
  },

  getCategories: async () => {
    try {
      const response = await axios.get('https://the-trivia-api.com/v2/categories');
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw new Error('Failed to load categories.');
    }
  }
};