export const localDataStorage = {
  getItem: (key: string): string | null => {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return null;
    }
  },
  setItem: (key: string, value: string): void => {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  },
  removeItem: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  },
  getParsedItem: <T>(key: string, defaultValue: T): T => {
    const item = localDataStorage.getItem(key);
    if (item === null) return defaultValue;
    try {
      return JSON.parse(item) as T;
    } catch (error) {
      console.error(`Error parsing localStorage item '${key}':`, error);
      return defaultValue;
    }
  },
  setParsedItem: <T>(key: string, value: T): void => {
    try {
      localDataStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error stringifying and setting localStorage item '${key}':`, error);
    }
  },
};