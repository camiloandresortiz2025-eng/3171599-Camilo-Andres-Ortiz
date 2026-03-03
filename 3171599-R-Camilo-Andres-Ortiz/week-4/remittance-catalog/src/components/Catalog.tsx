// ============================================
// COMPONENTE: Catalog (Principal)
// ============================================
// Orquesta todos los componentes del catálogo de remesas internacionales
// Dominio: Sistema de Remesas Internacionales - Servicios Financieros y Fintech

import React, { useState, useMemo } from 'react';
import type { Remittance, TransferMethod, SortOption } from '../types';
import { remittances as initialRemittances } from '../data/items';
import { useDebounce } from '../hooks/useDebounce';
import { SearchBar } from './SearchBar';
import { FilterPanel } from './FilterPanel';
import { SortSelector } from './SortSelector';
import { ItemList } from './ItemList';

/**
 * QUÉ: Componente principal del catálogo de remesas internacionales
 * PARA: Gestionar el estado y orquestar búsqueda, filtrado, ordenamiento de remesas
 * IMPACTO: Centraliza toda la lógica de interacción del catálogo
 */
export const Catalog: React.FC = () => {
  // ============================================
  // ESTADOS
  // ============================================

  // Datos de remesas
  const [items, setItems] = useState<Remittance[]>(initialRemittances);

  // Estados de UI (loading y error para renderizado condicional)
  const [isLoading] = useState<boolean>(false);
  const [error] = useState<string | null>(null);

  // Estados de filtros
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedMethod, setSelectedMethod] = useState<TransferMethod>('all');
  const [showOnlyUrgent, setShowOnlyUrgent] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<SortOption>('date-newest');
  const [minAmount, setMinAmount] = useState<string>('');
  const [maxAmount, setMaxAmount] = useState<string>('');

  // Debounce para búsqueda en tiempo real (300ms de espera)
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // ============================================
  // PROCESAMIENTO DE DATOS CON useMemo
  // ============================================

  /**
   * QUÉ: Procesa las remesas aplicando búsqueda, filtros y ordenamiento
   * PARA: Obtener la lista filtrada y ordenada sin mutar el array original
   * IMPACTO: Se recalcula solo cuando cambian las dependencias (optimización)
   */
  const processedItems = useMemo(() => {
    // Crear copia del array para no mutar el original
    let result = [...items];

    // 1. Filtrar por búsqueda (case-insensitive, múltiples campos)
    if (debouncedSearchTerm) {
      const term = debouncedSearchTerm.toLowerCase();
      result = result.filter((item) =>
        item.senderName.toLowerCase().includes(term) ||
        item.recipientName.toLowerCase().includes(term) ||
        item.originCountry.toLowerCase().includes(term) ||
        item.destinationCountry.toLowerCase().includes(term) ||
        item.currency.toLowerCase().includes(term)
      );
    }

    // 2. Filtrar por método de transferencia (categoría)
    if (selectedMethod !== 'all') {
      result = result.filter((item) => item.transferMethod === selectedMethod);
    }

    // 3. Filtrar por urgencia (filtro booleano)
    if (showOnlyUrgent) {
      result = result.filter((item) => item.isUrgent);
    }

    // 4. Filtrar por rango de monto (filtro numérico)
    if (minAmount) {
      const min = parseFloat(minAmount);
      if (!isNaN(min)) {
        result = result.filter((item) => item.amount >= min);
      }
    }
    if (maxAmount) {
      const max = parseFloat(maxAmount);
      if (!isNaN(max)) {
        result = result.filter((item) => item.amount <= max);
      }
    }

    // 5. Ordenar sin mutar el array - usando [...result].sort()
    switch (sortBy) {
      case 'sender-asc':
        result.sort((a, b) => a.senderName.localeCompare(b.senderName));
        break;
      case 'sender-desc':
        result.sort((a, b) => b.senderName.localeCompare(a.senderName));
        break;
      case 'amount-asc':
        result.sort((a, b) => a.amount - b.amount);
        break;
      case 'amount-desc':
        result.sort((a, b) => b.amount - a.amount);
        break;
      case 'date-newest':
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'date-oldest':
        result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case 'fee-asc':
        result.sort((a, b) => a.fee - b.fee);
        break;
    }

    return result;
  }, [items, debouncedSearchTerm, selectedMethod, showOnlyUrgent, sortBy, minAmount, maxAmount]);

  // ============================================
  // HANDLERS
  // ============================================

  /**
   * QUÉ: Elimina una remesa del catálogo
   * PARA: Permitir al usuario borrar una transferencia de la lista
   */
  const handleDelete = (id: number): void => {
    if (window.confirm('¿Estás seguro de eliminar esta remesa?')) {
      setItems((prev) => prev.filter((item) => item.id !== id));
    }
  };

  /**
   * QUÉ: Muestra los detalles de una remesa
   * PARA: Dar al usuario información completa de la transferencia
   */
  const handleView = (id: number): void => {
    const item = items.find((i) => i.id === id);
    if (item) {
      const receivedAmount = (item.amount * item.exchangeRate).toLocaleString('es-CO', { maximumFractionDigits: 2 });
      alert(
        `📋 Detalles de Remesa #${item.id}\n\n` +
        `👤 Remitente: ${item.senderName} (${item.originCountry})\n` +
        `👤 Beneficiario: ${item.recipientName} (${item.destinationCountry})\n` +
        `💰 Monto: $${item.amount.toFixed(2)} USD\n` +
        `💱 Tasa: 1 USD = ${item.exchangeRate} ${item.currency}\n` +
        `📦 Monto recibido: ${receivedAmount} ${item.currency}\n` +
        `🏷️ Comisión: $${item.fee.toFixed(2)} USD\n` +
        `📡 Método: ${item.transferMethod}\n` +
        `📊 Estado: ${item.status}\n` +
        `📅 Fecha: ${new Date(item.createdAt).toLocaleDateString('es-CO')}\n` +
        `${item.isUrgent ? '⚡ Transferencia URGENTE' : ''}`
      );
    }
  };

  /**
   * QUÉ: Limpia todos los filtros y búsqueda
   * PARA: Restablecer la vista del catálogo a su estado inicial
   */
  const clearFilters = (): void => {
    setSearchTerm('');
    setSelectedMethod('all');
    setShowOnlyUrgent(false);
    setSortBy('date-newest');
    setMinAmount('');
    setMaxAmount('');
  };

  // ============================================
  // CÁLCULO DE ESTADÍSTICAS
  // ============================================

  const totalAmount = processedItems.reduce((sum, item) => sum + item.amount, 0);
  const totalFees = processedItems.reduce((sum, item) => sum + item.fee, 0);

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className="catalog">
      <header className="catalog-header">
        <h1>💸 Catálogo de Remesas Internacionales</h1>
        <p className="catalog-header__subtitle">
          Sistema de Servicios Financieros y Fintech
        </p>
      </header>

      {/* Barra de búsqueda en tiempo real */}
      <SearchBar
        value={searchTerm}
        onChange={setSearchTerm}
        placeholder="Buscar por remitente, beneficiario, país o moneda..."
      />

      {/* Filtros y ordenamiento */}
      <div className="controls">
        <FilterPanel
          selectedMethod={selectedMethod}
          onMethodChange={setSelectedMethod}
          showOnlyUrgent={showOnlyUrgent}
          onUrgentChange={setShowOnlyUrgent}
          minAmount={minAmount}
          onMinAmountChange={setMinAmount}
          maxAmount={maxAmount}
          onMaxAmountChange={setMaxAmount}
          onClearFilters={clearFilters}
        />

        <SortSelector
          value={sortBy}
          onChange={setSortBy}
        />
      </div>

      {/* Resumen de resultados con estadísticas */}
      <div className="results-summary">
        <p className="results-count">
          Mostrando <strong>{processedItems.length}</strong> de <strong>{items.length}</strong> remesas
          {debouncedSearchTerm && ` para "${debouncedSearchTerm}"`}
        </p>
        {processedItems.length > 0 && (
          <div className="results-stats">
            <span>💰 Total: <strong>${totalAmount.toFixed(2)} USD</strong></span>
            <span>🏷️ Comisiones: <strong>${totalFees.toFixed(2)} USD</strong></span>
          </div>
        )}
      </div>

      {/* Lista de remesas con manejo de estados */}
      <ItemList
        items={processedItems}
        isLoading={isLoading}
        error={error}
        onDelete={handleDelete}
        onView={handleView}
        onClearFilters={clearFilters}
      />
    </div>
  );
};

export default Catalog;
