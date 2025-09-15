import React from 'react';
import ReactDOM from 'react-dom/client'; // Use createRoot for React 18+
import App from './App.tsx';
import './App.css';

// Use createRoot for React 18+ concurrent mode features
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);