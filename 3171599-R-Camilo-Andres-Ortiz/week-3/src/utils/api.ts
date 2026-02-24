// ============================================
// FUNCIONES DE API Y DATOS MOCK
// Sistema de Remesas Internacionales — Fintech
// ============================================

import type { Remittance, RealTimeData } from '../types';

// ============================================
// CONFIGURACIÓN
// ============================================

// Simulador de latencia de red para datos mock
const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

// ============================================
// DATOS MOCK — Remesas Internacionales
// ============================================

const MOCK_REMITTANCES: Remittance[] = [
  {
    id: 1001,
    senderName: 'Carlos Méndez',
    receiverName: 'María Méndez',
    amountSent: 500,
    amountReceived: 9750,
    sendCurrency: 'USD',
    receiveCurrency: 'MXN',
    originCountry: 'Estados Unidos',
    destinationCountry: 'México',
    status: 'completed',
    createdAt: '2026-02-22T14:30:00Z',
    estimatedDelivery: '2026-02-22T18:00:00Z',
    transferMethod: 'bank_transfer',
    fee: 4.99,
  },
  {
    id: 1002,
    senderName: 'Ana García',
    receiverName: 'José García',
    amountSent: 300,
    amountReceived: 1152000,
    sendCurrency: 'USD',
    receiveCurrency: 'COP',
    originCountry: 'España',
    destinationCountry: 'Colombia',
    status: 'in_transit',
    createdAt: '2026-02-23T09:15:00Z',
    estimatedDelivery: '2026-02-24T12:00:00Z',
    transferMethod: 'mobile_wallet',
    fee: 3.50,
  },
  {
    id: 1003,
    senderName: 'Luis Fernández',
    receiverName: 'Rosa Fernández',
    amountSent: 1200,
    amountReceived: 4380,
    sendCurrency: 'USD',
    receiveCurrency: 'PEN',
    originCountry: 'Estados Unidos',
    destinationCountry: 'Perú',
    status: 'processing',
    createdAt: '2026-02-23T11:45:00Z',
    estimatedDelivery: '2026-02-24T09:00:00Z',
    transferMethod: 'bank_transfer',
    fee: 5.99,
  },
  {
    id: 1004,
    senderName: 'Pedro Castillo',
    receiverName: 'Elena Castillo',
    amountSent: 750,
    amountReceived: 680.25,
    sendCurrency: 'USD',
    receiveCurrency: 'EUR',
    originCountry: 'Estados Unidos',
    destinationCountry: 'España',
    status: 'completed',
    createdAt: '2026-02-21T16:20:00Z',
    estimatedDelivery: '2026-02-21T20:00:00Z',
    transferMethod: 'bank_transfer',
    fee: 2.99,
  },
  {
    id: 1005,
    senderName: 'Miguel Torres',
    receiverName: 'Sofía Torres',
    amountSent: 200,
    amountReceived: 11200,
    sendCurrency: 'USD',
    receiveCurrency: 'GTQ',
    originCountry: 'Estados Unidos',
    destinationCountry: 'Guatemala',
    status: 'pending',
    createdAt: '2026-02-23T13:00:00Z',
    estimatedDelivery: '2026-02-24T15:00:00Z',
    transferMethod: 'cash_pickup',
    fee: 6.99,
  },
  {
    id: 1006,
    senderName: 'Roberto Díaz',
    receiverName: 'Carmen Díaz',
    amountSent: 450,
    amountReceived: 25650,
    sendCurrency: 'USD',
    receiveCurrency: 'HNL',
    originCountry: 'Estados Unidos',
    destinationCountry: 'Honduras',
    status: 'completed',
    createdAt: '2026-02-20T10:00:00Z',
    estimatedDelivery: '2026-02-20T16:00:00Z',
    transferMethod: 'mobile_wallet',
    fee: 3.99,
  },
  {
    id: 1007,
    senderName: 'Javier Ruiz',
    receiverName: 'Patricia Ruiz',
    amountSent: 1000,
    amountReceived: 0.018,
    sendCurrency: 'USD',
    receiveCurrency: 'BTC',
    originCountry: 'Canadá',
    destinationCountry: 'El Salvador',
    status: 'in_transit',
    createdAt: '2026-02-23T08:30:00Z',
    estimatedDelivery: '2026-02-23T09:00:00Z',
    transferMethod: 'crypto',
    fee: 1.50,
  },
  {
    id: 1008,
    senderName: 'Fernando López',
    receiverName: 'Isabel López',
    amountSent: 800,
    amountReceived: 6280000,
    sendCurrency: 'EUR',
    receiveCurrency: 'CLP',
    originCountry: 'Alemania',
    destinationCountry: 'Chile',
    status: 'failed',
    createdAt: '2026-02-22T07:15:00Z',
    estimatedDelivery: '2026-02-23T10:00:00Z',
    transferMethod: 'bank_transfer',
    fee: 7.50,
  },
  {
    id: 1009,
    senderName: 'Daniela Morales',
    receiverName: 'Andrés Morales',
    amountSent: 350,
    amountReceived: 12950,
    sendCurrency: 'USD',
    receiveCurrency: 'DOP',
    originCountry: 'Estados Unidos',
    destinationCountry: 'República Dominicana',
    status: 'completed',
    createdAt: '2026-02-21T12:00:00Z',
    estimatedDelivery: '2026-02-21T18:00:00Z',
    transferMethod: 'cash_pickup',
    fee: 4.50,
  },
  {
    id: 1010,
    senderName: 'Valentina Herrera',
    receiverName: 'Diego Herrera',
    amountSent: 600,
    amountReceived: 3450,
    sendCurrency: 'USD',
    receiveCurrency: 'BRL',
    originCountry: 'Estados Unidos',
    destinationCountry: 'Brasil',
    status: 'processing',
    createdAt: '2026-02-23T15:20:00Z',
    estimatedDelivery: '2026-02-24T14:00:00Z',
    transferMethod: 'bank_transfer',
    fee: 5.25,
  },
];

// ============================================
// FUNCIONES DE FETCH
// ============================================

/**
 * QUÉ: Obtiene la lista de remesas internacionales
 * PARA: Alimentar el componente ItemList con las transferencias
 * IMPACTO: Soporta cancelación con AbortController para evitar race conditions
 *
 * @param signal - AbortSignal para cancelar la petición al desmontar
 * @returns Promise con array de Remittance
 */
export const fetchRemittances = async (
  signal?: AbortSignal,
): Promise<Remittance[]> => {
  // Simula latencia de red (1 segundo)
  await delay(1000);

  // Verifica si la petición fue cancelada durante el delay
  if (signal?.aborted) {
    throw new DOMException('Request aborted', 'AbortError');
  }

  return MOCK_REMITTANCES;
};

/**
 * QUÉ: Obtiene el total de remesas procesadas
 * PARA: Mostrar la métrica "Total de Remesas" en StatsCard
 * IMPACTO: Se carga de forma independiente con su propio useEffect
 */
export const fetchTotalRemittances = async (): Promise<number> => {
  await delay(700);
  return MOCK_REMITTANCES.length;
};

/**
 * QUÉ: Obtiene la cantidad de transferencias activas (no completadas)
 * PARA: Mostrar la métrica "Transferencias Activas" en StatsCard
 * IMPACTO: Se carga de forma independiente con su propio useEffect
 */
export const fetchActiveTransfers = async (): Promise<number> => {
  await delay(900);
  return MOCK_REMITTANCES.filter(
    (r) =>
      r.status === 'pending' ||
      r.status === 'processing' ||
      r.status === 'in_transit',
  ).length;
};

/**
 * QUÉ: Obtiene el volumen total enviado en USD
 * PARA: Mostrar la métrica "Volumen Total USD" en StatsCard
 * IMPACTO: Se carga de forma independiente con su propio useEffect
 */
export const fetchTotalVolumeUSD = async (): Promise<number> => {
  await delay(600);
  return MOCK_REMITTANCES.reduce((sum, r) => sum + r.amountSent, 0);
};

/**
 * QUÉ: Obtiene la tasa de éxito de las remesas
 * PARA: Mostrar el "% de Éxito" en StatsCard
 * IMPACTO: Se carga de forma independiente con su propio useEffect
 */
export const fetchSuccessRate = async (): Promise<number> => {
  await delay(500);
  const completed = MOCK_REMITTANCES.filter(
    (r) => r.status === 'completed',
  ).length;
  return Math.round((completed / MOCK_REMITTANCES.length) * 100);
};

/**
 * QUÉ: Obtiene datos de la plataforma en tiempo real (tasa de cambio, transacciones)
 * PARA: Alimentar el componente RealTimeIndicator con polling cada 5 segundos
 * IMPACTO: Genera valores aleatorios simulando fluctuaciones de mercado cambiario
 */
export const fetchRealTimeData = async (): Promise<RealTimeData> => {
  await delay(400);

  // Simula fluctuación de tasa de cambio USD/MXN entre 19.20 y 20.10
  const baseRate = 19.65;
  const fluctuation = (Math.random() - 0.5) * 0.9;
  const exchangeRate = parseFloat((baseRate + fluctuation).toFixed(4));

  // Simula transacciones pendientes y volumen por minuto
  const pendingTransfers = Math.floor(Math.random() * 30) + 10;
  const transactionsPerMinute = Math.floor(Math.random() * 50) + 20;

  return {
    exchangeRate,
    rateCurrency: 'USD/MXN',
    pendingTransfers,
    transactionsPerMinute,
    lastUpdated: new Date().toISOString(),
  };
};

/**
 * QUÉ: Busca remesas por nombre de emisor, receptor o país destino
 * PARA: Filtrar la lista de remesas en ItemList
 *
 * @param query - Término de búsqueda
 * @returns Promise con remesas filtradas
 */
export const searchRemittances = async (
  query: string,
): Promise<Remittance[]> => {
  await delay(500);

  if (!query.trim()) {
    return MOCK_REMITTANCES;
  }

  const lowerQuery = query.toLowerCase();

  return MOCK_REMITTANCES.filter(
    (r) =>
      r.senderName.toLowerCase().includes(lowerQuery) ||
      r.receiverName.toLowerCase().includes(lowerQuery) ||
      r.destinationCountry.toLowerCase().includes(lowerQuery) ||
      r.originCountry.toLowerCase().includes(lowerQuery),
  );
};
