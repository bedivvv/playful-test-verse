
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Main } from './index';

const rootElement = document.getElementById('root') as HTMLElement;

// Create root and render the app
const root = ReactDOM.createRoot(rootElement);
root.render(<Main />);
