// ============================================
// TIPOS E INTERFACES — Sistema de Remesas Internacionales (Fintech)
// ============================================

/**
 * QUÉ: Representa una remesa internacional enviada a través de la plataforma
 * PARA: Tipar los datos principales de transferencias que se muestran en ItemList
 * IMPACTO: Define la estructura de cada transacción mostrada en el dashboard
 */
export interface Remittance {
  id: number;
  senderName: string;
  receiverName: string;
  amountSent: number;
  amountReceived: number;
  sendCurrency: string;
  receiveCurrency: string;
  originCountry: string;
  destinationCountry: string;
  status: RemittanceStatus;
  createdAt: string;
  estimatedDelivery: string;
  transferMethod: TransferMethod;
  fee: number;
}

/**
 * QUÉ: Estados posibles de una remesa
 * PARA: Renderizado condicional de badges de estado en la UI
 */
export type RemittanceStatus =
  | 'pending'
  | 'processing'
  | 'in_transit'
  | 'completed'
  | 'cancelled'
  | 'failed';

/**
 * QUÉ: Métodos de envío de la remesa
 * PARA: Mostrar el canal de transferencia utilizado
 */
export type TransferMethod =
  | 'bank_transfer'
  | 'mobile_wallet'
  | 'cash_pickup'
  | 'crypto';

/**
 * QUÉ: Estadísticas clave del dashboard de remesas
 * PARA: Alimentar el componente StatsCard con métricas financieras
 * IMPACTO: Cada métrica se carga con un useEffect independiente
 */
export interface RemittanceStats {
  totalRemittances: number;
  activeTransfers: number;
  totalAmountUSD: number;
  successRate: number;
  averageFee: number;
  topCorridor: string;
}

/**
 * QUÉ: Datos en tiempo real de la plataforma de remesas
 * PARA: Alimentar el componente RealTimeIndicator con polling cada 5s
 * IMPACTO: Simula tasa de cambio y volumen de transacciones en vivo
 */
export interface RealTimeData {
  exchangeRate: number;
  rateCurrency: string;
  pendingTransfers: number;
  transactionsPerMinute: number;
  lastUpdated: string;
}

/**
 * QUÉ: Estado genérico para manejar peticiones asíncronas
 * PARA: Reutilizar en cualquier componente que haga fetch
 */
export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

/**
 * QUÉ: Filtros de búsqueda para la lista de remesas
 * PARA: Filtrar remesas por texto, estado o país en ItemList
 */
export interface SearchFilters {
  query: string;
  status?: RemittanceStatus;
  country?: string;
}
