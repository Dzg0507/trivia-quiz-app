import React, { useEffect, useState, useCallback, ChangeEvent } from 'react';
import { decode } from 'html-entities';
import { useAuth } from '../hooks/useAuth.ts';
import { useUserStats } from '../hooks/useUserStats.tsx';
import { useNotifications } from '../hooks/useNotifications.ts';
import { shareService } from '../services/shareService.ts';
import { Save, Share2, Award, Star } from 'lucide-react';
import { UserProfile } from '../services/firestoreService.ts'; // Import UserProfile
import { motion } from 'framer-motion'; // Import motion

interface ProfileFormProps {
  localProfile: UserProfile;
  setLocalProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  handleSaveProfile: () => void;
}

const ProfileForm = ({ localProfile, setLocalProfile, handleSaveProfile }: ProfileFormProps) => (
  <div className="space-y-6">
    <div>
      <label htmlFor="avatar" className="block text-sm font-medium text-gray-300 mb-2">
        Avatar
      </label>
      <motion.select
        id="avatar"
        value={localProfile?.avatar || '😊'}
        onChange={(e: ChangeEvent<HTMLSelectElement>) => setLocalProfile({ ...localProfile, avatar: e.target.value })}
        className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-trivia-neon text-white transition-all duration-300"
        aria-label="Select profile avatar"
        whileFocus={{ scale: 1.01, borderColor: '#8B5CF6' }}
      >
        <option value="😊">Default (😊)</option>
        <option value="🎮">Gamer (🎮)</option>
        <option value="⭐">Star (⭐)</option>
        <option value="✨">Sparkle (✨)</option>
      </motion.select>
    </div>
    <div>
      <label htmlFor="bio" className="block text-sm font-medium text-gray-300 mb-2">
        Bio
      </label>
      <motion.textarea
        id="bio"
        value={decode(localProfile?.bio || '')}
        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setLocalProfile({ ...localProfile, bio: e.target.value })}
        className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-trivia-neon text-white transition-all duration-300"
        rows={4}
        placeholder="Tell your story..."
        aria-label="Enter your profile bio"
        whileFocus={{ scale: 1.01, borderColor: '#8B5CF6' }}
      />
    </div>
    <div className="flex space-x-4">
      <motion.button
        onClick={handleSaveProfile}
        className="btn btn-gold flex items-center gap-2"
        aria-label="Save profile changes"
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.05 }}
      >
        <Save className="w-5 h-5" />
        Save
      </motion.button>
    </div>
  </div>
);

interface ProfileStatsProps {
  points: number;
  badges: string[];
}

const ProfileStats = ({ points, badges }: ProfileStatsProps) => (
  <div className="mt-6 space-y-4">
    <h3 className="text-2xl text-trivia-gold font-bold">Stats</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.div className="card bg-trivia-blue-dark/50 p-4 flex items-center gap-4"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
            <Star className="w-8 h-8 text-trivia-gold" />
            <div>
                <p className="text-2xl font-bold text-trivia-neon">{points}</p>
                <p className="text-gray-400">Total Points</p>
            </div>
        </motion.div>
        <motion.div className="card bg-trivia-blue-dark/50 p-4 flex items-center gap-4"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
            <Award className="w-8 h-8 text-trivia-gold" />
            <div>
                <p className="text-2xl font-bold text-trivia-neon">{badges.length}</p>
                <p className="text-gray-400">Badges Earned</p>
            </div>
        </motion.div>
    </div>
    {badges.length > 0 && (
        <div className="mt-4">
            <h4 className="text-lg font-semibold text-white">Badges</h4>
            <div className="flex flex-wrap gap-2 mt-2">
                {badges.map((b) => (
                    <motion.span key={b} className="bg-trivia-neon/20 text-trivia-neon px-3 py-1 rounded-full text-sm"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                        {b}
                    </motion.span>
                ))}
            </div>
        </div>
    )}
  </div>
);

const Profile = () => {
  const { currentUser } = useAuth();
  const { loading, userStats, profile, updateProfileSettings } = useUserStats();
  const { addNotification } = useNotifications();
  const [localProfile, setLocalProfile] = useState<UserProfile>(profile || { avatar: '😊', bio: '' });

  useEffect(() => {
    if (profile) {
      setLocalProfile(profile);
    }
  }, [profile]);

  const handleSaveProfile = useCallback(() => {
    updateProfileSettings({ ...localProfile, bio: decode(localProfile.bio || '') });
    addNotification('Profile Saved!', 'success');
  }, [localProfile, updateProfileSettings, addNotification]);

  const handleShareProfile = useCallback(() => {
    if (!currentUser || !userStats) return;
    shareService.shareScore({
      score: userStats.totalScore,
      total: userStats.totalQuizzes,
      playerName: currentUser.displayName || currentUser.email || '',
    });
  }, [currentUser, userStats]);

  if (loading) {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <div className="w-12 h-12 border-4 border-trivia-neon border-t-transparent rounded-full mx-auto mb-4 animate-spin" />
                <p className="text-white text-xl font-semibold">Loading Profile...</p>
            </div>
        </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto mt-10 p-4">
        <div className="card animate-enter">
            <div className="flex items-center gap-6">
                <div className="text-8xl">{localProfile?.avatar || '😊'}</div>
                <div>
                    <h2 className="text-4xl font-bold text-white mb-2">{currentUser?.displayName || currentUser?.email}</h2>
                    <p className="text-gray-300">{decode(localProfile?.bio || 'No bio yet.')}</p>
                </div>
            </div>
        </div>

        <div className="card mt-6 animate-enter" style={{ animationDelay: '200ms' }}>
            <h3 className="text-2xl text-trivia-gold font-bold mb-4">Edit Profile</h3>
            <ProfileForm
                localProfile={localProfile}
                setLocalProfile={setLocalProfile}
                handleSaveProfile={handleSaveProfile}
            />
        </div>

        <div className="card mt-6 animate-enter" style={{ animationDelay: '400ms' }}>
            <ProfileStats points={userStats?.totalScore || 0} badges={[]} />
        </div>

        <div className="mt-6 text-center animate-enter" style={{ animationDelay: '600ms' }}>
            <motion.button
                onClick={handleShareProfile}
                className="btn btn-neon flex items-center gap-2 mx-auto"
                aria-label="Share your profile"
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.05 }}
                >
                <Share2 className="w-5 h-5" />
                Share Profile
            </motion.button>
        </div>
    </div>
  );
};

export default Profile;
