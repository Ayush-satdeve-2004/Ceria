import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import axios from 'axios'

// Set axios base URL globally for backend server requests
axios.defaults.baseURL = import.meta.env.VITE_API_URL || '';

// Accessibility: prefers-reduced-motion query is implemented globally in index.css
// @media (prefers-reduced-motion: reduce)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

// Clean and unregister all Service Workers to prevent aggressive caching bugs
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(registrations => {
    if (registrations.length > 0) {
      for (let registration of registrations) {
        registration.unregister().then(() => {
          console.log('[System] Programmatically unregistered stale Service Worker.');
        });
      }
      // Delete all caches
      if (window.caches) {
        caches.keys().then(names => {
          Promise.all(names.map(name => caches.delete(name))).then(() => {
            console.log('[System] Cleared all caches.');
            window.location.reload();
          });
        });
      }
    }
  });
}
