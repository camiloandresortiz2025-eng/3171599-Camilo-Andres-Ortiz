// ============================================
// COMPONENTE: SearchBar
// ============================================
// Barra de búsqueda en tiempo real para filtrar remesas
// Dominio: Sistema de Remesas Internacionales

import React from 'react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

/**
 * QUÉ: Barra de búsqueda del catálogo de remesas
 * PARA: Permitir búsqueda en tiempo real por remitente, beneficiario o país
 * IMPACTO: Filtra las remesas mientras el usuario escribe (con debounce)
 */
export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = 'Buscar por remitente, beneficiario o país...',
}) => {
  return (
    <div className="search-bar">
      <span className="search-bar__icon">🔍</span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="search-bar__input"
        aria-label="Buscar remesas"
      />

      {/* Renderizado condicional: Botón de limpiar solo si hay texto */}
      {value && (
        <button
          onClick={() => onChange('')}
          className="search-bar__clear"
          aria-label="Limpiar búsqueda"
        >
          ✕
        </button>
      )}
    </div>
  );
};
