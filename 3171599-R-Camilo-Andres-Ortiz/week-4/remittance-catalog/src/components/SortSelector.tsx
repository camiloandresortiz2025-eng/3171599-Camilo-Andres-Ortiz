// ============================================
// COMPONENTE: SortSelector
// ============================================
// Selector de criterio de ordenamiento para remesas
// Dominio: Sistema de Remesas Internacionales

import React from 'react';
import type { SortOption } from '../types';
import { sortOptions } from '../data/items';

interface SortSelectorProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
}

/**
 * QUÉ: Selector de ordenamiento del catálogo de remesas
 * PARA: Permitir al usuario elegir cómo se organizan las remesas en la lista
 * IMPACTO: Reordena la lista sin mutar el array original
 */
export const SortSelector: React.FC<SortSelectorProps> = ({
  value,
  onChange,
}) => {
  return (
    <div className="sort-selector">
      <label htmlFor="sort">Ordenar por:</label>
      <select
        id="sort"
        value={value}
        onChange={(e) => onChange(e.target.value as SortOption)}
        className="sort-select"
      >
        {sortOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};
