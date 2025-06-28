
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Main } from './index';

const rootElement = document.getElementById('root') as HTMLElement;

// Only create root if it doesn't exist
if (!rootElement._reactRootContainer) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<Main />);
}
