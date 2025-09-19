// Example component using the new contexts
import React from 'react';
import { useUIContext } from '../context/UIContext';
import { useUserContext } from '../context/UserContext';
import { useGameContext } from '../context/GameContext';

const ExampleComponent = () => {
  const { loading, notify, theme, toggleTheme } = useUIContext();
  const { user, signOut, profile } = useUserContext();
  const { score, answerQuestion, gameState } = useGameContext();

  const handleSignOut = async () => {
    try {
      await signOut();
      notify('Signed out successfully', 'success');
    } catch (error) {
      notify('Error signing out', 'error');
    }
  };

  const handleToggleTheme = () => {
    toggleTheme();
    notify(Switched to  theme, 'info');
  };

  return (
    <div className={example-component theme-}>
      {loading && <div className="loading-indicator">Loading...</div>}
      
      <div className="user-info">
        {user ? (
          <>
            <h2>Welcome, {profile?.username || user.email}</h2>
            <button onClick={handleSignOut}>Sign Out</button>
          </>
        ) : (
          <h2>Please sign in</h2>
        )}
      </div>
      
      <div className="game-info">
        {gameState === 'playing' && (
          <>
            <h3>Current Score: {score}</h3>
            <button onClick={() => answerQuestion('Sample answer')}>
              Submit Answer
            </button>
          </>
        )}
      </div>
      
      <button onClick={handleToggleTheme}>
        Switch to {theme === 'light' ? 'Dark' : 'Light'} Theme
      </button>
    </div>
  );
};

export default ExampleComponent;
