// ============================================
// COMPONENTE: App (Raíz)
// ============================================
// Punto de entrada principal de la aplicación
// Dominio: Sistema de Remesas Internacionales - Servicios Financieros y Fintech

import React from 'react';
import { Catalog } from './components/Catalog';
import './App.css';

/**
 * QUÉ: Componente raíz de la aplicación
 * PARA: Renderizar el catálogo de remesas internacionales
 * IMPACTO: Contenedor principal que monta el componente Catalog
 */
const App: React.FC = () => {
  return (
    <div className="app">
      <Catalog />
    </div>
  );
};

export default App;
