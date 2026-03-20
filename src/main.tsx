import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

/**
 * ARCHITECT // VOID_WEAVER
 * SYSTEM // BOOT_SEQUENCE
 */
console.log(
    "%c ARCHITECT // VOID_WEAVER %c SYSTEM // ONLINE ",
    "background: #FF003C; color: white; font-weight: bold; padding: 2px 4px;",
    "background: #E056FD; color: white; font-weight: bold; padding: 2px 4px;"
);

const rootElement = document.getElementById('root');

if (!rootElement) {
    throw new Error("CRITICAL_FAILURE: DOM Node 'root' not found. Terminating.");
}

ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);