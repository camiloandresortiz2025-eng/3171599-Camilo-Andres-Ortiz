// ============================================
// COMPONENTE: LoadingSpinner
// ============================================
// Muestra un indicador de carga mientras se procesan las remesas

import React from 'react';

/**
 * QUÉ: Indicador visual de carga (spinner)
 * PARA: Mostrar al usuario que la información de remesas se está procesando
 * IMPACTO: Mejora la UX al dar feedback visual durante operaciones asíncronas
 */
export const LoadingSpinner: React.FC = () => {
  return (
    <div className="loading-spinner">
      <div className="loading-spinner__circle"></div>
      <p className="loading-spinner__text">Procesando remesas...</p>
    </div>
  );
};
