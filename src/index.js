import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

// reverting back to React v17 for leaflet compatibility
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
