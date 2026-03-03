// ============================================
// COMPONENTE: ItemCard (RemittanceCard)
// ============================================
// Muestra una tarjeta con la información de una remesa internacional
// Dominio: Sistema de Remesas Internacionales - Fintech

import React from 'react';
import type { Remittance } from '../types';

interface ItemCardProps {
  item: Remittance;
  onDelete?: (id: number) => void;
  onView?: (id: number) => void;
}

/**
 * QUÉ: Tarjeta individual de remesa internacional
 * PARA: Mostrar la información de cada transferencia de forma visual y organizada
 * IMPACTO: Cada tarjeta muestra datos clave: remitente, beneficiario, monto, estado, etc.
 */
export const ItemCard: React.FC<ItemCardProps> = ({
  item,
  onDelete,
  onView,
}) => {
  /**
   * QUÉ: Obtiene la clase CSS y emoji según el estado de la remesa
   * PARA: Diferenciar visualmente cada estado
   */
  const getStatusBadge = (status: string): { label: string; className: string } => {
    switch (status) {
      case 'completed':
        return { label: '✅ Completada', className: 'badge--completed' };
      case 'in-transit':
        return { label: '🚀 En tránsito', className: 'badge--transit' };
      case 'pending':
        return { label: '⏳ Pendiente', className: 'badge--pending' };
      case 'cancelled':
        return { label: '❌ Cancelada', className: 'badge--cancelled' };
      default:
        return { label: status, className: '' };
    }
  };

  /**
   * QUÉ: Obtiene el emoji del método de transferencia
   * PARA: Representar visualmente cada canal de envío
   */
  const getMethodIcon = (method: string): string => {
    switch (method) {
      case 'bank-transfer': return '🏦';
      case 'mobile-money': return '📱';
      case 'cash-pickup': return '💵';
      case 'crypto': return '₿';
      default: return '📦';
    }
  };

  const statusBadge = getStatusBadge(item.status);

  return (
    <div className={`item-card ${item.isUrgent ? 'item-card--urgent' : ''}`}>
      {/* Renderizado condicional: Badge de urgente */}
      {item.isUrgent && (
        <span className="badge badge--urgent">⚡ URGENTE</span>
      )}

      {/* Encabezado de la tarjeta */}
      <div className="item-card__header">
        <h3 className="item-card__amount">
          ${item.amount.toFixed(2)} USD
        </h3>
        <span className={`badge ${statusBadge.className}`}>
          {statusBadge.label}
        </span>
      </div>

      {/* Información del remitente y beneficiario */}
      <div className="item-card__route">
        <div className="item-card__person">
          <span className="item-card__label">De:</span>
          <span className="item-card__value">{item.senderName}</span>
          <span className="item-card__country">📍 {item.originCountry}</span>
        </div>
        <span className="item-card__arrow">→</span>
        <div className="item-card__person">
          <span className="item-card__label">Para:</span>
          <span className="item-card__value">{item.recipientName}</span>
          <span className="item-card__country">📍 {item.destinationCountry}</span>
        </div>
      </div>

      {/* Detalles financieros */}
      <div className="item-card__details">
        <div className="item-card__detail">
          <span className="item-card__detail-label">Método:</span>
          <span>{getMethodIcon(item.transferMethod)} {item.transferMethod.replace('-', ' ')}</span>
        </div>
        <div className="item-card__detail">
          <span className="item-card__detail-label">Tasa de cambio:</span>
          <span>1 USD = {item.exchangeRate} {item.currency}</span>
        </div>
        <div className="item-card__detail">
          <span className="item-card__detail-label">Comisión:</span>
          <span>${item.fee.toFixed(2)} USD</span>
        </div>
        <div className="item-card__detail">
          <span className="item-card__detail-label">Monto recibido:</span>
          <span className="item-card__received">
            {(item.amount * item.exchangeRate).toLocaleString('es-CO', { maximumFractionDigits: 2 })} {item.currency}
          </span>
        </div>
        <div className="item-card__detail">
          <span className="item-card__detail-label">Fecha:</span>
          <span>{new Date(item.createdAt).toLocaleDateString('es-CO')}</span>
        </div>
      </div>

      {/* Acciones - Renderizado condicional de botones */}
      <div className="item-card__actions">
        {onView && (
          <button
            onClick={() => onView(item.id)}
            className="btn btn-view"
          >
            👁️ Ver detalles
          </button>
        )}
        {onDelete && (
          <button
            onClick={() => onDelete(item.id)}
            className="btn btn-delete"
          >
            🗑️ Eliminar
          </button>
        )}
      </div>
    </div>
  );
};
