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

// Register Service Worker for PWA (Production Only)
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(reg => console.log('Service Worker registered successfully:', reg.scope))
      .catch(err => console.log('Service Worker registration failed:', err));
  });
} else if ('serviceWorker' in navigator && !import.meta.env.PROD) {
  // Self-Healing Dev Assistant: Wipes out stale service workers and dev caches automatically!
  navigator.serviceWorker.getRegistrations().then(registrations => {
    for (let registration of registrations) {
      registration.unregister().then(() => {
        console.log('[Dev Assistant] Programmatically unregistered stale Service Worker cache.');
        // Force refresh to reload clean app from dev server
        window.location.reload();
      });
    }
  });

  if (window.caches) {
    caches.keys().then(names => {
      for (let name of names) {
        caches.delete(name);
      }
    });
  }
}
