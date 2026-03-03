// ============================================
// COMPONENTE: FilterPanel
// ============================================
// Panel con filtros para el catálogo de remesas internacionales
// Dominio: Sistema de Remesas Internacionales - Fintech

import React from 'react';
import type { TransferMethod } from '../types';
import { transferMethodOptions } from '../data/items';

interface FilterPanelProps {
  selectedMethod: TransferMethod;
  onMethodChange: (method: TransferMethod) => void;
  showOnlyUrgent: boolean;
  onUrgentChange: (value: boolean) => void;
  minAmount: string;
  onMinAmountChange: (value: string) => void;
  maxAmount: string;
  onMaxAmountChange: (value: string) => void;
  onClearFilters: () => void;
}

/**
 * QUÉ: Panel de filtros del catálogo de remesas
 * PARA: Permitir al usuario filtrar remesas por método, urgencia y rango de monto
 * IMPACTO: Reduce el conjunto de resultados según los criterios seleccionados
 */
export const FilterPanel: React.FC<FilterPanelProps> = ({
  selectedMethod,
  onMethodChange,
  showOnlyUrgent,
  onUrgentChange,
  minAmount,
  onMinAmountChange,
  maxAmount,
  onMaxAmountChange,
  onClearFilters,
}) => {
  return (
    <div className="filter-panel">
      {/* Filtro por método de transferencia (categoría del dominio) */}
      <div className="filter-group">
        <label htmlFor="transfer-method">Método de envío:</label>
        <select
          id="transfer-method"
          value={selectedMethod}
          onChange={(e) => onMethodChange(e.target.value as TransferMethod)}
          className="filter-select"
        >
          {transferMethodOptions.map((method) => (
            <option key={method.value} value={method.value}>
              {method.label}
            </option>
          ))}
        </select>
      </div>

      {/* Filtro booleano: solo remesas urgentes */}
      <div className="filter-group">
        <label className="filter-checkbox">
          <input
            type="checkbox"
            checked={showOnlyUrgent}
            onChange={(e) => onUrgentChange(e.target.checked)}
          />
          ⚡ Solo urgentes
        </label>
      </div>

      {/* Filtro por rango de monto (específico del dominio financiero) */}
      <div className="filter-group filter-group--range">
        <label>Rango de monto (USD):</label>
        <div className="filter-range">
          <input
            type="number"
            placeholder="Mín"
            value={minAmount}
            onChange={(e) => onMinAmountChange(e.target.value)}
            className="filter-input"
            min="0"
          />
          <span className="filter-range__separator">—</span>
          <input
            type="number"
            placeholder="Máx"
            value={maxAmount}
            onChange={(e) => onMaxAmountChange(e.target.value)}
            className="filter-input"
            min="0"
          />
        </div>
      </div>

      {/* Botón para limpiar todos los filtros */}
      <button onClick={onClearFilters} className="btn btn-clear">
        🔄 Limpiar filtros
      </button>
    </div>
  );
};
