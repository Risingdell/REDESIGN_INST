// Global styles first, so component stylesheets (loaded with their modules) can override them.
import '@/styles/tokens.css';
import '@/styles/base.css';
import '@/styles/utilities.css';
import '@/styles/components.css';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from '@/app/App';
import { initAnalytics } from '@/services/analytics';

initAnalytics();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
