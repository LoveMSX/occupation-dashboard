import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './App.css';
import App from './App';
import { initializeLogger, logError } from './utils/logger';

// Initialize logging utilities
initializeLogger();

try {
  // Try to render the actual App component
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  console.log('App rendered successfully');
} catch (error) {
  logError(error as Error, 'main.tsx');
  
  // Fall back to minimal app
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <div style={{ padding: '20px' }}>
        <h1>Emergency Recovery Mode</h1>
        <p>The application is in recovery mode due to rendering issues.</p>
        <p>Error: {String(error)}</p>
      </div>
    </React.StrictMode>
  );
}
