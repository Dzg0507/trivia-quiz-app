import React from 'react';
import { useTheme } from '../../hooks/useTheme';
import { useAuth } from '../../hooks/useAuth';

interface SettingsProps {
  onClose: () => void;
}

const Settings: React.FC<SettingsProps> = ({ onClose }) => {
  const { theme, toggleTheme } = useTheme();
  const { logout } = useAuth();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-96">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h2>
          <button onClick={onClose} className="text-gray-900 dark:text-white">
            &times;
          </button>
        </div>
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-900 dark:text-white">Theme</span>
            <button
              onClick={toggleTheme}
              className="px-4 py-2 bg-blue-500 text-white rounded-md"
            >
              {theme === 'dark' ? 'Light' : 'Dark'}
            </button>
          </div>
          <button
            onClick={logout}
            className="w-full px-4 py-2 bg-red-500 text-white rounded-md"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
