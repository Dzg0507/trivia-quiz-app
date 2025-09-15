import React, { useState, useEffect, useCallback } from 'react';
import { firestoreService, LeaderboardEntry } from '../services/firestoreService.ts'; // Import LeaderboardEntry
import { Trophy, XCircle } from 'lucide-react';
import { motion } from 'framer-motion'; // Import motion

interface LeaderboardTableProps {
  leaderboard: LeaderboardEntry[];
}

interface RawUserData {
  id: string;
  username?: string;
  points: number;
}

const processLeaderboardData = (usersData: RawUserData[]): LeaderboardEntry[] => {
  return usersData
    .filter(user => typeof user.points === 'number')
    .sort((a, b) => b.points - a.points)
    .slice(0, 10)
    .map((user, index) => ({
      id: user.id,
      rank: index + 1,
      username: user.username || user.id,
      points: user.points,
    }));
};

const LeaderboardTable = ({ leaderboard }: LeaderboardTableProps) => (
  <div className="card animate-enter">
    <table className="w-full text-left">
      <thead>
        <tr className="border-b border-trivia-blue-light">
          <th className="p-4 text-trivia-gold">Rank</th>
          <th className="p-4 text-trivia-gold">Player</th>
          <th className="p-4 text-trivia-gold">Points</th>
        </tr>
      </thead>
      <tbody>
        {leaderboard.length === 0 ? (
          <tr>
            <td colSpan={3} className="p-4 text-center text-trivia-gray-light">No data available yet.</td>
          </tr>
        ) : (
          leaderboard.map((entry, index) => (
            <motion.tr
              key={entry.id}
              className="border-b border-trivia-blue-light/50 hover:bg-trivia-blue-light/20 animate-enter"
              style={{ animationDelay: `${index * 100}ms` }}
              whileHover={{ scale: 1.01, backgroundColor: 'rgba(100, 149, 237, 0.25)' }}
              whileTap={{ scale: 0.99 }}
            >
              <td className="p-4 font-bold text-xl">
                {entry.rank === 1 && <Trophy className="w-6 h-6 text-trivia-gold inline-block mr-2" />}
                {entry.rank}
              </td>
              <td className="p-4">{entry.username}</td>
              <td className="p-4 text-trivia-neon">{entry.points}</td>
            </motion.tr>
          ))
        )}
      </tbody>
    </table>
  </div>
);

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLeaderboard = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const usersData = await firestoreService.getLeaderboardData();
      const sortedLeaderboard = processLeaderboardData(usersData);
      setLeaderboard(sortedLeaderboard);
    } catch (err: unknown) {
      console.error('Error fetching leaderboard:', err);
      if (err instanceof Error) {
        setError(`Failed to load leaderboard: ${err.message}`);
      } else {
        setError('Failed to load leaderboard. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  if (loading) {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <div className="w-12 h-12 border-4 border-trivia-neon border-t-transparent rounded-full mx-auto mb-4 animate-spin" />
                <p className="text-white text-xl font-semibold">Loading Leaderboard...</p>
            </div>
        </div>
    );
  }

  if (error) {
    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="card text-center animate-enter">
                <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-white mb-4">Error</h2>
                <p className="text-trivia-gray-light mb-6">{error}</p>
            </div>
        </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto mt-10 p-4">
      <h2 className="text-4xl font-bold text-trivia-gold mb-6 animate-pulse-glow">Leaderboard</h2>
      <LeaderboardTable leaderboard={leaderboard} />
    </div>
  );
};

export default Leaderboard;