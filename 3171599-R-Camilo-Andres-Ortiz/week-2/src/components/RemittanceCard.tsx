import { Remittance } from '../types';

/**
 * QUÉ: Interface que define las props del componente RemittanceCard.
 * PARA QUÉ: Tipar las props que recibe cada tarjeta de remesa individual.
 * IMPACTO: Garantiza que cada tarjeta reciba los datos y funciones necesarias.
 */
interface RemittanceCardProps {
  remittance: Remittance;
  onDelete: (id: number) => void;
  onEdit: (id: number) => void;
}

/**
 * QUÉ: Componente que muestra una tarjeta individual con los datos de una remesa.
 * PARA QUÉ: Visualizar la información de cada transacción de remesa internacional
 *            (remitente, destinatario, monto, moneda, país, estado, fecha) y
 *            proporcionar botones para editar o eliminar.
 * IMPACTO: Es la unidad visual de cada remesa en la lista. Incluye badges de estado
 *          con colores diferenciados según el estado de la transacción.
 */
const RemittanceCard: React.FC<RemittanceCardProps> = ({ remittance, onDelete, onEdit }) => {
  // ============================================
  // HANDLER: CONFIRMAR ELIMINACIÓN
  // ============================================

  /**
   * QUÉ: Muestra confirmación antes de eliminar una remesa.
   * PARA QUÉ: Prevenir eliminaciones accidentales de transacciones financieras.
   * IMPACTO: Solo ejecuta onDelete si el usuario confirma la acción.
   */
  const handleDelete = () => {
    if (window.confirm(`¿Eliminar la remesa de ${remittance.senderName} a ${remittance.receiverName}?`)) {
      onDelete(remittance.id);
    }
  };

  // ============================================
  // HELPERS DE FORMATO
  // ============================================

  /**
   * QUÉ: Determina la clase CSS del badge según el estado de la remesa.
   * PARA QUÉ: Aplicar colores visuales diferenciados por estado de la transacción.
   * IMPACTO: Mejora la UX al permitir identificar rápidamente el estado de cada remesa.
   */
  const getStatusBadgeClass = (): string => {
    switch (remittance.status) {
      case 'completada':
        return 'badge badge--success';
      case 'pendiente':
        return 'badge badge--info';
      case 'en-proceso':
        return 'badge badge--warning';
      case 'cancelada':
        return 'badge badge--danger';
      default:
        return 'badge badge--secondary';
    }
  };

  /**
   * QUÉ: Formatea el monto con el símbolo de moneda correspondiente.
   * PARA QUÉ: Mostrar el monto de forma legible con separador de miles y decimales.
   * IMPACTO: Mejora la presentación visual de los valores financieros.
   */
  const formatAmount = (): string => {
    const symbols: Record<string, string> = {
      USD: '$',
      EUR: '€',
      COP: '$',
      MXN: '$',
      BRL: 'R$',
      PEN: 'S/',
    };
    const symbol = symbols[remittance.currency] ?? '$';
    return `${symbol}${remittance.amount.toLocaleString('es-CO', { minimumFractionDigits: 2 })} ${remittance.currency}`;
  };

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className="item-card">
      {/* Encabezado con nombre del remitente y badge de estado */}
      <div className="item-card__header">
        <h3 className="item-card__title">💸 {remittance.senderName}</h3>
        <span className={getStatusBadgeClass()}>
          {remittance.status.charAt(0).toUpperCase() + remittance.status.slice(1)}
        </span>
      </div>

      {/* Información detallada de la remesa */}
      <div className="item-card__body">
        <p><strong>👤 Destinatario:</strong> {remittance.receiverName}</p>
        <p><strong>💰 Monto:</strong> {formatAmount()}</p>
        <p><strong>🌍 País destino:</strong> {remittance.destinationCountry}</p>
        <p><strong>📅 Fecha:</strong> {remittance.date}</p>
      </div>

      {/* Botones de acción: editar y eliminar */}
      <div className="item-card__actions">
        <button
          className="btn btn-edit"
          onClick={() => onEdit(remittance.id)}
          aria-label={`Editar remesa de ${remittance.senderName}`}>
          ✏️ Editar
        </button>

        <button
          className="btn btn-delete"
          onClick={handleDelete}
          aria-label={`Eliminar remesa de ${remittance.senderName}`}>
          🗑️ Eliminar
        </button>
      </div>
    </div>
  );
};

export default RemittanceCard;
