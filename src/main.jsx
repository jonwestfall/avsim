import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import AdminPage from './admin/AdminPage';
import './styles.css';

const normalizedPath = window.location.pathname.replace(/\/+$/, '');
const RootComponent = normalizedPath.endsWith('/admin') ? AdminPage : App;

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RootComponent />
  </React.StrictMode>
);
