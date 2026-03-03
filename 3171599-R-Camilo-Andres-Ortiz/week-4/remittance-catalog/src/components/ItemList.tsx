// ============================================
// COMPONENTE: ItemList
// ============================================
// Renderiza la lista de remesas internacionales con estados condicionales
// Dominio: Sistema de Remesas Internacionales

import React from 'react';
import type { Remittance } from '../types';
import { ItemCard } from './ItemCard';
import { EmptyState } from './EmptyState';
import { LoadingSpinner } from './LoadingSpinner';

interface ItemListProps {
  items: Remittance[];
  isLoading?: boolean;
  error?: string | null;
  onDelete?: (id: number) => void;
  onView?: (id: number) => void;
  onClearFilters?: () => void;
}

/**
 * QUÉ: Lista de remesas internacionales del catálogo
 * PARA: Renderizar las tarjetas de remesas con manejo de estados (loading, error, vacío)
 * IMPACTO: Componente intermedio que decide qué mostrar según el estado de los datos
 */
export const ItemList: React.FC<ItemListProps> = ({
  items,
  isLoading = false,
  error = null,
  onDelete,
  onView,
  onClearFilters,
}) => {
  // Renderizado condicional 1: Estado de carga
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Renderizado condicional 2: Estado de error
  if (error) {
    return (
      <div className="error-state">
        <span className="error-state__icon">⚠️</span>
        <h3>Error al cargar remesas</h3>
        <p>{error}</p>
      </div>
    );
  }

  // Renderizado condicional 3: Estado vacío (sin resultados)
  if (items.length === 0) {
    return <EmptyState onClearFilters={onClearFilters} />;
  }

  // Renderizar lista con .map() y keys únicas basadas en id
  return (
    <div className="item-list">
      {items.map((item) => (
        <ItemCard
          key={item.id}   // ← Key única basada en id, nunca index
          item={item}
          onDelete={onDelete}
          onView={onView}
        />
      ))}
    </div>
  );
};
