import React from 'react';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import './Components/interceptors/axios';

import { createRoot } from 'react-dom/client';

console.warn = () => {}; 
console.error = () => {}; 
createRoot(document.getElementById('root')).render(<App />);

reportWebVitals();
