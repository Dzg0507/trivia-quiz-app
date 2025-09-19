// Theme Configuration
import { Theme } from '../../types/common';

export const LIGHT_THEME: Theme = {
  name: 'light',
  colors: {
    primary: '#6200ee',
    secondary: '#03dac6',
    background: '#f5f5f5',
    surface: '#ffffff',
    text: '#000000',
    error: '#b00020',
    warning: '#ff9800',
    info: '#2196f3',
    success: '#4caf50'
  }
};

export const DARK_THEME: Theme = {
  name: 'dark',
  colors: {
    primary: '#bb86fc',
    secondary: '#03dac6',
    background: '#121212',
    surface: '#1e1e1e',
    text: '#ffffff',
    error: '#cf6679',
    warning: '#ffb74d',
    info: '#64b5f6',
    success: '#81c784'
  }
};

export const getTheme = (themeName: 'light' | 'dark'): Theme => {
  return themeName === 'light' ? LIGHT_THEME : DARK_THEME;
};
