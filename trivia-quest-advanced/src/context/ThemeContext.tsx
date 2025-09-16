import React, { useState, useLayoutEffect, ReactNode } from 'react';
import { ThemeContext, Theme } from './ThemeContextValue';

interface ThemeProviderProps {
  children: ReactNode;
}

const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    // Initialize theme from localStorage or default to 'light'
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('theme') as Theme) || 'light';
    }
    return 'light';
  });

  useLayoutEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => {
      if (prevTheme === 'light') return 'dark';
      if (prevTheme === 'dark') return 'retro-neon';
      if (prevTheme === 'retro-neon') return 'high-contrast';
      return 'light';
    });
  };

  const value = { theme, setTheme, toggleTheme };
  console.log('ThemeContext value:', value);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};


export default ThemeProvider;
