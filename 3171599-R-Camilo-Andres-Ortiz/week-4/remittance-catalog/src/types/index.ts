// ============================================
// TIPOS E INTERFACES
// ============================================
// Dominio: Sistema de Remesas Internacionales - Servicios Financieros y Fintech

/**
 * QUÉ: Interfaz principal para una remesa internacional
 * PARA: Tipar los datos de cada transferencia/remesa en el catálogo
 * IMPACTO: Define la estructura de datos utilizada en toda la aplicación
 */
export interface Remittance {
  id: number;
  senderName: string;           // Nombre del remitente
  recipientName: string;        // Nombre del beneficiario
  originCountry: string;        // País de origen de la remesa
  destinationCountry: string;   // País destino de la remesa
  amount: number;               // Monto enviado (USD)
  currency: string;             // Moneda de destino
  exchangeRate: number;         // Tasa de cambio aplicada
  fee: number;                  // Comisión cobrada (USD)
  transferMethod: TransferMethod; // Método de transferencia
  status: RemittanceStatus;     // Estado actual de la remesa
  isUrgent: boolean;            // Si es transferencia urgente/express
  createdAt: string;            // Fecha de creación (ISO string)
}

// Categorías: Métodos de transferencia disponibles
// QUÉ: Tipos de método de envío de remesas
// PARA: Clasificar las remesas por canal de envío
export type TransferMethod =
  | 'all'
  | 'bank-transfer'    // Transferencia bancaria
  | 'mobile-money'     // Dinero móvil (M-Pesa, Nequi, etc.)
  | 'cash-pickup'      // Retiro en efectivo
  | 'crypto';          // Criptomonedas/blockchain

// Estados posibles de una remesa
// QUÉ: Estado del ciclo de vida de una remesa
// PARA: Filtrar remesas por su estado actual
export type RemittanceStatus =
  | 'pending'      // Pendiente de procesamiento
  | 'in-transit'   // En tránsito / procesándose
  | 'completed'    // Completada / entregada
  | 'cancelled';   // Cancelada

// Opciones de ordenamiento disponibles
// QUÉ: Criterios para ordenar la lista de remesas
// PARA: Permitir al usuario organizar la vista del catálogo
export type SortOption =
  | 'sender-asc'
  | 'sender-desc'
  | 'amount-asc'
  | 'amount-desc'
  | 'date-newest'
  | 'date-oldest'
  | 'fee-asc';

// Estado global de los filtros aplicados
// QUÉ: Agrupa todos los filtros activos
// PARA: Centralizar el estado de filtrado del catálogo
export interface FilterState {
  searchTerm: string;
  transferMethod: TransferMethod;
  showOnlyUrgent: boolean;
  sortBy: SortOption;
  minAmount?: number;
  maxAmount?: number;
}
