import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.ts';
import { Trophy, Star, User, BarChart, Settings as SettingsIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import Settings from './common/Settings.tsx';

const MotionLink = motion(Link);
const MotionNavLink = motion(NavLink);

const Navbar = () => {
  const { currentUser } = useAuth();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const navLinkClasses = "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white transition-all duration-300";
  const activeLinkClasses = "bg-white/10 text-white";

  return (
    <>
      <nav className="bg-transparent p-4">
        <div className="card max-w-7xl mx-auto">
          <div className="flex justify-between items-center">
            <MotionLink to="/" className="text-2xl font-bold text-trivia-gold animate-pulse-glow"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >Trivia Quest</MotionLink>
            <div className="flex items-center space-x-2">
              {currentUser && (
                <>
                  <MotionNavLink to="/quests" className={({ isActive }: { isActive: boolean }) => `${navLinkClasses} ${isActive ? activeLinkClasses : ''}`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Star className="w-4 h-4" />
                    <span>Quests</span>
                  </MotionNavLink>
                  <MotionNavLink to="/achievements" className={({ isActive }: { isActive: boolean }) => `${navLinkClasses} ${isActive ? activeLinkClasses : ''}`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Trophy className="w-4 h-4" />
                    <span>Achievements</span>
                  </MotionNavLink>
                  <MotionNavLink to="/leaderboard" className={({ isActive }: { isActive: boolean }) => `${navLinkClasses} ${isActive ? activeLinkClasses : ''}`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <BarChart className="w-4 h-4" />
                    <span>Leaderboard</span>
                  </MotionNavLink>
                  <MotionNavLink to="/profile" className={({ isActive }: { isActive: boolean }) => `${navLinkClasses} ${isActive ? activeLinkClasses : ''}`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <User className="w-4 h-4" />
                    <span>Profile</span>
                  </MotionNavLink>
                  <motion.button onClick={() => setIsSettingsOpen(true)} className={`${navLinkClasses} bg-blue-500/20 hover:bg-blue-500/40`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <SettingsIcon className="w-4 h-4" />
                    <span>Settings</span>
                  </motion.button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
      {isSettingsOpen && <Settings onClose={() => setIsSettingsOpen(false)} />}
    </>
  );
};

export default Navbar;
