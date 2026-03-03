// ============================================
// COMPONENTE: EmptyState
// ============================================
// Muestra un mensaje cuando no se encuentran remesas
// Dominio: Sistema de Remesas Internacionales

import React from 'react';

interface EmptyStateProps {
  message?: string;
  onClearFilters?: () => void;
}

/**
 * QUÉ: Componente de estado vacío del catálogo de remesas
 * PARA: Indicar al usuario que no hay resultados y ofrecer acción de limpieza
 * IMPACTO: Mejora la UX mostrando feedback cuando no hay datos
 */
export const EmptyState: React.FC<EmptyStateProps> = ({
  message = 'No se encontraron remesas con los filtros aplicados',
  onClearFilters,
}) => {
  return (
    <div className="empty-state">
      <span className="empty-state__icon">📭</span>
      <h3 className="empty-state__title">Sin resultados</h3>
      <p className="empty-state__message">{message}</p>

      {/* Renderizado condicional: Botón solo aparece si existe la función */}
      {onClearFilters && (
        <button
          onClick={onClearFilters}
          className="btn btn-clear"
        >
          🔄 Limpiar filtros
        </button>
      )}
    </div>
  );
};
