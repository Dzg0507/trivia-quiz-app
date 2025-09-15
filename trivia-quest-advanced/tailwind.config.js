/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'trivia-blue': {
          DEFAULT: '#1e3c72',
          dark: '#1a335e',
          light: '#2a5298'
        },
        'trivia-gold': {
          DEFAULT: '#ffcc00',
          dark: '#e6b800',
          light: '#ffd633'
        },
        'trivia-neon': {
          DEFAULT: '#00ffff',
          dark: '#00e6e6',
          light: '#1affff'
        },
        'trivia-gray': {
          dark: '#1f2937',
          DEFAULT: '#374151',
          light: '#9ca3af'
        },
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        background: 'var(--color-background)',
        text: 'var(--color-text)',
        accent: 'var(--color-accent)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(circle, var(--tw-gradient-stops))',
      },
      animation: {
        'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'enter': 'enter 0.5s ease-out',
        'leave': 'leave 0.5s ease-in'
      },
      keyframes: {
        enter: {
          '0%': { opacity: 0, transform: 'translateY(10px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        leave: {
          '0%': { opacity: 1, transform: 'translateY(0)' },
          '100%': { opacity: 0, transform: 'translateY(-10px)' },
        },
      }
    },
  },
  plugins: [],
  darkMode: 'class',
}
