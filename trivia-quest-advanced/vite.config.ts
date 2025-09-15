import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
      // Use path.resolve to create an absolute path
      '@react-three/cannon': path.resolve(__dirname, './mock/react-three-cannon.jsx'),
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