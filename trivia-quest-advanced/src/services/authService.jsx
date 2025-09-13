import { localDataStorage } from './localDataStorage';
import { firestoreService } from './firestoreService';

const USER_STORAGE_KEY = 'users';
const CURRENT_USER_KEY = 'currentUser';

export const authService = {
  getCurrentUser: () => localDataStorage.getItem(CURRENT_USER_KEY),
  setCurrentUser: (username) => localDataStorage.setItem(CURRENT_USER_KEY, username),
  removeCurrentUser: () => localDataStorage.removeItem(CURRENT_USER_KEY),

  getRegisteredUsers: () => localDataStorage.getParsedItem(USER_STORAGE_KEY, {}),
  setRegisteredUsers: (users) => localDataStorage.setParsedItem(USER_STORAGE_KEY, users),

  login: (username, password) => {
    const users = authService.getRegisteredUsers();
    if (users[username] === password) {
      authService.setCurrentUser(username);
      firestoreService.initializeUserDoc(username); // Ensure user doc exists on login
      return { success: true, username };
    }
    return { success: false, message: 'Invalid username or password!' };
  },

  signup: (username, password) => {
    const users = authService.getRegisteredUsers();
    if (users[username]) {
      return { success: false, message: 'Username already exists!' };
    }
    users[username] = password;
    authService.setRegisteredUsers(users);
    firestoreService.initializeUserDoc(username); // Create user doc on signup
    return { success: true, message: 'Account created! Please log in.' };
  },

  logout: () => {
    authService.removeCurrentUser();
    // Clear all user-specific local storage data associated with this user if needed
    // For simplicity, we only remove currentUser, but a more robust solution might iterate and remove. 
    // Or, better, store user-specific data under a key prefixed with username in localDataStorage.
  }
};