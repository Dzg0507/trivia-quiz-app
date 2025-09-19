// Example of updated imports
// Before:
// import { Question, Answer } from '../types/trivia';
// import { UserStats } from '../types/user';
// import { Quest } from '../types/quest';

// After:
import { Question, Answer } from '../types/quiz';
import { UserStats } from '../types/profile';
import { Quest } from '../types/quests';

// Or use the consolidated imports:
import { Question, Answer, UserStats, Quest } from '../types';

// Before:
// import { API_URL } from '../config/api';
// import { FIREBASE_CONFIG } from '../config/firebase';
// import { ROUTES } from '../config/routes';

// After:
import { API_CONFIG, FIREBASE_CONFIG, ROUTES } from '../config';

// Before:
// const apiUrl = 'https://opentdb.com/api.php';
// const category = 9;
// const difficulty = 'medium';
// const amount = 10;

// After:
import { API_CONFIG, buildTriviaApiUrl } from '../config';
const category = API_CONFIG.trivia.categories.generalKnowledge;
const difficulty = 'medium';
const amount = 10;
const apiUrl = buildTriviaApiUrl(category, difficulty, amount);

// Before:
// const theme = {
//   primary: '#6200ee',
//   secondary: '#03dac6',
//   background: '#f5f5f5',
//   text: '#000000'
// };

// After:
import { getTheme } from '../config';
const theme = getTheme('light');
