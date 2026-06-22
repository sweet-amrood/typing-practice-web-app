import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { applyTheme, DEFAULT_THEME } from './utils/themes';
import './index.css';

applyTheme(DEFAULT_THEME);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
