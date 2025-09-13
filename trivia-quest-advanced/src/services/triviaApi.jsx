import axios from 'axios';
import { decode } from 'html-entities';
// Utility function to shuffle an array
const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j] = [array[j], array[i]]];
  }
  return array;
};
const TRIVIA_API_URL = 'https://opentdb.com/api.php?amount=10&type=multiple';
export const triviaApiService = {
  fetchQuestions: async (retries = 3) => {
    try {
      const response = await axios.get(TRIVIA_API_URL);
      return response.data.results.map(q => ({
        question: decode(q.question),
        answers: shuffleArray([...q.incorrect_answers, q.correct_answer].map(ans => decode(ans))),
        correct_answer: decode(q.correct_answer),
      }));
    } catch (error) {
      console.error('Error fetching questions:', error);
      if (retries > 0) {
        console.log(`Retrying question fetch, ${retries} attempts left...`);
        await new Promise(resolve => setTimeout(resolve, 5000));
        return triviaApiService.fetchQuestions(retries - 1);
      } else {
        throw new Error('Failed to load questions after multiple retries.');
      }
    }
  }
};