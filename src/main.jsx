import React, { startTransition } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import App from './App.jsx';
import './fonts.css';
import './index.css';

const el = document.getElementById('root');
const app = (
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
// HTML pré-renderizado no build (SEO) → hidrata; em `npm run dev` → render normal.
// startTransition → hidratação fatiada (sem tarefas longas no main thread).
if (el.hasChildNodes()) startTransition(() => { hydrateRoot(el, app); });
else createRoot(el).render(app);
