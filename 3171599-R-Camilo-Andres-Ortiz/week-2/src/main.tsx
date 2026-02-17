import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './styles/App.css';

/**
 * QUÉ: Punto de entrada de la aplicación React.
 * PARA QUÉ: Monta el componente raíz (App) en el DOM dentro de StrictMode.
 * IMPACTO: Sin este archivo la aplicación no se renderiza en el navegador.
 */
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
