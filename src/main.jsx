import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { loadWAFEnv } from './utils/getWAFEnv.js';


async function initializeApp() {
  await loadWAFEnv();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
}

initializeApp().catch((error) => {
  console.error("Erreur lors de l'initialisation de l'application:", error);
});
