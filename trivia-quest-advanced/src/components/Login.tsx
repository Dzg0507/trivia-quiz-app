import { useState, useEffect, useCallback, ChangeEvent, FormEvent } from 'react';
import { authService } from '../services/authService.ts';
import { useAuth } from '../hooks/useAuth.ts';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../hooks/useNotifications.ts';
import { motion } from 'framer-motion'; // Import motion

const Login = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isSignup, setIsSignup] = useState<boolean>(false);
  const { login: authContextLogin } = useAuth();
  const { addNotification } = useNotifications();
  const navigate = useNavigate();

  useEffect(() => {
    setUsername('');
    setPassword('');
  }, [isSignup]);

  const handleSubmit = useCallback(async (e: FormEvent) => {
    e.preventDefault();
    let result;
    if (isSignup) {
      result = await authService.signup(username, password);
    } else {
      result = await authService.login(username, password);
    }

    if (result.success) {
      addNotification(result.message || (isSignup ? 'Account created successfully!' : 'Login successful!'), 'success');
      if (!isSignup && result.user) {
        authContextLogin(result.user);
        navigate('/');
      }
    } else {
      addNotification(result.message || 'An unknown error occurred.', 'error');
    }
  }, [username, password, isSignup, authContextLogin, navigate, addNotification]);

  const toggleSignup = useCallback(() => {
    setIsSignup(prev => !prev);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="card w-full max-w-md animate-enter">
        <h1 className="text-3xl font-bold text-center text-white mb-6">{isSignup ? 'Create an Account' : 'Welcome Back'}</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-trivia-gray-light mb-2">
              Username
            </label>
            <motion.input
              type="text"
              id="username"
              value={username}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg bg-trivia-blue-dark/50 border border-trivia-blue-light focus:outline-none focus:ring-2 focus:ring-trivia-neon text-white transition-all duration-300"
              whileFocus={{ scale: 1.01, borderColor: '#8B5CF6' }}
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-trivia-gray-light mb-2">
              Password
            </label>
            <motion.input
              type="password"
              id="password"
              value={password}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg bg-trivia-blue-dark/50 border border-trivia-blue-light focus:outline-none focus:ring-2 focus:ring-trivia-neon text-white transition-all duration-300"
              whileFocus={{ scale: 1.01, borderColor: '#8B5CF6' }}
            />
          </div>
          <motion.button type="submit" className="btn btn-gold w-full"
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05 }}
          >
            {isSignup ? 'Sign Up' : 'Login'}
          </motion.button>
          <p className="text-center text-sm text-trivia-gray-light">
            {isSignup ? 'Already have an account?' : 'Don\'t have an account?'}{' '}
            <motion.button type="button" onClick={toggleSignup} className="font-semibold text-trivia-neon hover:text-trivia-neon-light transition-colors duration-300"
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.05 }}
            >
              {isSignup ? 'Login' : 'Sign Up'}
            </motion.button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
