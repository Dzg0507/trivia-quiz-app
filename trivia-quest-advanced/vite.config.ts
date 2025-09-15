import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    visualizer({
      filename: './stats.html',
      open: false, // Set to true to automatically open the report in your browser
      gzipSize: true,
      brotliSize: true,
    }),
  ],
  resolve: {
    alias: {
      '@react-three/cannon': './mock/react-three-cannon.js',
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'firebase-bundle': [
            'firebase/app',
            'firebase/auth',
            'firebase/firestore',
          ],
          'react-bundle': [
            'react',
            'react-dom',
            'react-router-dom',
            'lucide-react',
            'gsap',
          ],
        },
      },
    },
  },
});
