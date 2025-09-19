// API Configuration
export const API_CONFIG = {
  trivia: {
    baseUrl: 'https://opentdb.com/api.php',
    defaultParams: {
      amount: 10,
      type: 'multiple'
    },
    categories: {
      generalKnowledge: 9,
      books: 10,
      film: 11,
      music: 12,
      musicals: 13,
      television: 14,
      videoGames: 15,
      boardGames: 16,
      science: 17,
      computers: 18,
      mathematics: 19,
      mythology: 20,
      sports: 21,
      geography: 22,
      history: 23,
      politics: 24,
      art: 25,
      celebrities: 26,
      animals: 27,
      vehicles: 28,
      comics: 29,
      gadgets: 30,
      anime: 31,
      cartoons: 32
    },
    difficulties: ['easy', 'medium', 'hard']
  }
};

export const buildTriviaApiUrl = (category: number, difficulty: string, amount: number) => {
  return \?amount=\&category=\&difficulty=\&type=\;
};
