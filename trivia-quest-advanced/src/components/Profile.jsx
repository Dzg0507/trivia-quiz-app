import React, { useEffect, useState, useCallback } from 'react';
import { decode } from 'html-entities';
import { useAuth } from '../context/AuthContext';
import { useUserStats } from '../hooks/useUserStats';
import { useNotifications } from '../context/NotificationContext';
import { shareService } from '../services/shareService';

const ProfileForm = ({ localProfile, setLocalProfile, handleSaveProfile }) => (
  <div className="space-y-4">
    <div>
      <label htmlFor="bgColor" className="text-lg text-trivia-neon">
        Background Color
      </label>
      <input
        id="bgColor"
        type="color"
        value={localProfile.bgColor || '#ffffff'}
        onChange={(e) => setLocalProfile({ ...localProfile, bgColor: e.target.value })}
        className="w-full h-10 p-1 border-2 border-trivia-gold rounded-lg"
        aria-label="Select profile background color"
      />
    </div>
    <div>
      <label htmlFor="avatar" className="text-lg text-trivia-neon">
        Avatar
      </label>
      <select
        id="avatar"
        value={localProfile.avatar || '😊'}
        onChange={(e) => setLocalProfile({ ...localProfile, avatar: e.target.value })}
        className="w-full p-2 bg-gray-700 text-white rounded-lg"
        aria-label="Select profile avatar"
      >
        <option value="😊">Default (😊)</option>
        <option value="🎮">Gamer (🎮)</option>
        <option value="⭐">Star (⭐)</option>
        <option value="✨">Sparkle (✨)</option>
      </select>
    </div>
    <div>
      <label htmlFor="bio" className="text-lg text-trivia-neon">
        Bio
      </label>
      <textarea
        id="bio"
        value={decode(localProfile.bio || '')}
        onChange={(e) => setLocalProfile({ ...localProfile, bio: e.target.value })}
        className="w-full p-2 bg-gray-700 text-white rounded-lg"
        rows="4"
        placeholder="Tell your story..."
        aria-label="Enter your profile bio"
      />
    </div>
    <div className="flex space-x-4">
      <button
        onClick={handleSaveProfile}
        className="px-6 py-3 bg-trivia-gold text-black rounded-full hover:bg-yellow-400 transition transform hover:scale-105"
        aria-label="Save profile changes"
      >
        Save
      </button>
    </div>
  </div>
);

const ProfileStats = ({ points, badges }) => (
  <div className="mt-6">
    <h3 className="text-2xl text-trivia-gold">Stats</h3>
    <p>
      Points: <span className="text-trivia-gold">{points}</span>
    </p>
    <p>
      Badges:{' '}
      {badges.length ? (
        badges.map((b) => (
          <span key={b} className="text-trivia-neon mx-1">
            {b}
          </span>
        ))
      ) : (
        'None yet'
      )}
    </p>
  </div>
);

const Profile = () => {
  const { currentUser } = useAuth();
  const { loading, points, badges, profile, updateProfileSettings } = useUserStats(currentUser);
  const { addNotification } = useNotifications();
  const [localProfile, setLocalProfile] = useState(profile);

  useEffect(() => {
    setLocalProfile(profile);
  }, [profile]);

  const handleSaveProfile = useCallback(() => {
    updateProfileSettings({ ...localProfile, bio: decode(localProfile.bio || '') });
    addNotification('Profile Saved!', 'success');
  }, [localProfile, updateProfileSettings, addNotification]);

  const handleShareProfile = useCallback(() => {
    const shareUrl = `${window.location.origin}/profile?user=${encodeURIComponent(currentUser)}`;
    shareService.shareProfile(currentUser, points, badges, shareUrl, addNotification);
  }, [currentUser, points, badges, addNotification, shareService]);

  if (loading) {
    return (
      <div className="container mx-auto mt-10 text-center text-trivia-gold">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="container mx-auto mt-10">
      <div
        className="bg-gray-800 p-6 rounded-lg shadow-lg"
        style={{ backgroundColor: localProfile.bgColor || '#ffffff' }}
      >
        <h2 className="text-4xl font-bold text-trivia-gold mb-6">My Profile</h2>
        <ProfileForm
          localProfile={localProfile}
          setLocalProfile={setLocalProfile}
          handleSaveProfile={handleSaveProfile}
        />
        <button
          onClick={handleShareProfile}
          className="px-6 py-3 bg-trivia-neon text-black rounded-full hover:bg-cyan-400 transition transform hover:scale-105 mt-4"
          aria-label="Share your profile"
        >
          Share
        </button>
        <ProfileStats points={points} badges={badges} />
      </div>
    </div>
  );
};

export default Profile;