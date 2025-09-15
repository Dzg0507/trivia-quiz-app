import { useNavigate } from 'react-router-dom';
import { useUserStats } from '../hooks/useUserStats';
import Quiz from './Quiz';

const QuizPage = () => {
  const navigate = useNavigate();
  const { userStats, updateUserStats, loading } = useUserStats();

  const handleNavigateHome = () => {
    navigate('/profile');
  };

  return (
    <Quiz
      onNavigateHome={handleNavigateHome}
      userStats={userStats}
      updateUserStats={updateUserStats}
      isLoading={loading}
    />
  );
};

export default QuizPage;
