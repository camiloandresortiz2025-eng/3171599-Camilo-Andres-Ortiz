import React, { useState, useEffect } from 'react';
import type { RealTimeData } from '../types';
import { fetchRealTimeData } from '../utils/api';

// ============================================
// COMPONENTE: RealTimeIndicator (Indicador en Tiempo Real)
// QUÉ: Muestra tasa de cambio y transacciones activas con polling automático
// PARA: Simular un feed de datos en vivo de mercado cambiario fintech
// IMPACTO: Usa setInterval con cleanup para polling cada 5 segundos,
//          evitando memory leaks al desmontar el componente
// ============================================

// Intervalo de actualización: 5 segundos (5000ms)
const POLLING_INTERVAL = 5000;

export const RealTimeIndicator: React.FC = () => {
  // Estados del componente
  const [data, setData] = useState<RealTimeData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [updateCount, setUpdateCount] = useState<number>(0);

  /**
   * QUÉ: Efecto principal con polling periódico cada 5 segundos
   * PARA: Actualizar la tasa de cambio y métricas en tiempo real
   * IMPACTO: Configura setInterval al montar y clearInterval al desmontar.
   *          Sin el cleanup, el interval seguiría ejecutándose después del
   *          desmontaje causando memory leaks y actualizaciones a estado
   *          de un componente que ya no existe
   */
  useEffect(() => {
    // Función para cargar/actualizar datos en tiempo real
    const loadRealTimeData = async () => {
      try {
        setIsUpdating(true);
        const newData = await fetchRealTimeData();
        setData(newData);
        setLoading(false);
        setUpdateCount((prev) => prev + 1);
      } catch (err) {
        console.error('Error loading real-time data:', err);
      } finally {
        setIsUpdating(false);
      }
    };

    // Llamada inicial inmediata (no esperar 5 segundos)
    loadRealTimeData();

    // Configurar polling con setInterval
    const intervalId = setInterval(() => {
      loadRealTimeData();
    }, POLLING_INTERVAL);

    // Cleanup: limpiar interval al desmontar para evitar memory leaks
    return () => {
      clearInterval(intervalId);
    };
  }, []); // Array vacío: configurar solo al montar

  /**
   * QUÉ: Formateador de timestamp ISO a hora legible
   * PARA: Mostrar la hora de última actualización en formato local
   */
  const formatTimestamp = (isoString: string): string => {
    const date = new Date(isoString);
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  // Renderizado condicional: carga inicial
  if (loading) {
    return (
      <div className="realtime-indicator">
        <div className="realtime-header">
          <h2>💱 Mercado en Vivo</h2>
        </div>
        <div className="realtime-loading">
          <div className="spinner"></div>
          <p>Conectando al mercado...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div className="realtime-indicator">
      <div className="realtime-header">
        <h2>💱 Mercado en Vivo</h2>
        {isUpdating && (
          <span className="updating-badge">🔄 Actualizando...</span>
        )}
      </div>

      <div className="realtime-content">
        {/* Tasa de cambio principal */}
        <div className="realtime-rate">
          <span className="rate-label">{data.rateCurrency}</span>
          <span className="rate-value">{data.exchangeRate.toFixed(4)}</span>
        </div>

        {/* Métricas secundarias en tiempo real */}
        <div className="realtime-metrics">
          <div className="rt-metric">
            <span className="rt-metric-value">{data.pendingTransfers}</span>
            <span className="rt-metric-label">Pendientes</span>
          </div>
          <div className="rt-metric">
            <span className="rt-metric-value">
              {data.transactionsPerMinute}
            </span>
            <span className="rt-metric-label">Txn/min</span>
          </div>
          <div className="rt-metric">
            <span className="rt-metric-value">{updateCount}</span>
            <span className="rt-metric-label">Updates</span>
          </div>
        </div>

        {/* Timestamp de última actualización */}
        <div className="realtime-timestamp">
          🕐 Última actualización: {formatTimestamp(data.lastUpdated)}
        </div>

        {/* Indicador de próxima actualización */}
        <div className="next-update">
          Actualización cada {POLLING_INTERVAL / 1000} segundos
        </div>
      </div>

      {/* Barra de progreso animada entre actualizaciones */}
      <div className="progress-bar">
        <div
          className="progress-fill"
          key={updateCount}
          style={{
            animation: `progress ${POLLING_INTERVAL}ms linear`,
          }}
        ></div>
      </div>
    </div>
  );
};
