export const localDataStorage = {
  getItem: (key) => {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return null;
    }
  },
  setItem: (key, value) => {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  },
  removeItem: (key) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  },
  getParsedItem: (key, defaultValue = null) => {
    const item = localDataStorage.getItem(key);
    if (item === null) return defaultValue;
    try {
      return JSON.parse(item);
    } catch (error) {
      console.error(`Error parsing localStorage item '${key}':`, error);
      return defaultValue;
    }
  },
  setParsedItem: (key, value) => {
    try {
      localDataStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error stringifying and setting localStorage item '${key}':`, error);
    }
  },
};