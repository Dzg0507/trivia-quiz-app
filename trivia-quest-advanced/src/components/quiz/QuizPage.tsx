import { useNavigate } from 'react-router-dom';
import { useUserStats } from '../../hooks/useUserStats';
import Quiz from './Quiz';
import { useQuiz } from '../../context/QuizContext'; // Import useQuiz

const QuizPage = () => {
  const navigate = useNavigate();
  const { userStats, updateUserStats, loading } = useUserStats();
  const { activeQuiz, endQuiz } = useQuiz(); // Use the QuizContext

  console.log('QuizPage activeQuiz:', activeQuiz);

  const handleNavigateHome = () => {
    endQuiz(); // End the quiz when navigating home
  };

  if (!activeQuiz) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
        <p className="text-xl">No active quiz. Please start a quest from the Quest Generator.</p>
      </div>
    );
  }

  return (
    <Quiz
      onNavigateHome={handleNavigateHome}
      userStats={userStats}
      updateUserStats={updateUserStats}
      isLoading={loading}
      initialCategory={activeQuiz.category}
      initialTheme={activeQuiz.theme}
      initialDifficulty={activeQuiz.difficulty}
    />
  );
};

export default QuizPage;