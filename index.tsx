import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

import { ErrorBoundary } from './components/common/ErrorBoundary';

const root = ReactDOM.createRoot(rootElement);

// Disable logs in production for performance
if (import.meta.env.PROD) {
  console.log = () => { };
  console.debug = () => { };
}

root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);