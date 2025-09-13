import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { currentUser, logout } = useAuth();

  return (
    <nav className="bg-trivia-blue p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-trivia-gold">Trivia Quest</Link>
        <div className="space-x-4">
          {currentUser && (
            <>
              <Link to="/" className="text-white hover:text-trivia-gold transition">Galaxy Map</Link>
              <Link to="/skills" className="text-white hover:text-trivia-gold transition">Skills</Link>
              <Link to="/quests" className="text-white hover:text-trivia-gold transition">Quests</Link>
              <Link to="/achievements" className="text-white hover:text-trivia-gold transition">Achievements</Link>
              <Link to="/profile" className="text-white hover:text-trivia-gold transition">Profile</Link>
              <Link to="/leaderboard" className="text-white hover:text-trivia-gold transition">Leaderboard</Link>
              <button onClick={logout} className="text-white hover:text-trivia-gold transition">Logout</button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;