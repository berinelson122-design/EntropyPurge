import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

/**
 * ARCHITECT // VOID_WEAVER
 * SYSTEM // BOOT_SEQUENCE
 */
const rootElement = document.getElementById('root');

if (!rootElement) {
    throw new Error("CRITICAL_FAILURE: DOM Node 'root' not found. Terminating.");
}

ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);