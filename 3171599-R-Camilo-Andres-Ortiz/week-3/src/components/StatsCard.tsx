import React, { useState, useEffect } from 'react';
import {
  fetchTotalRemittances,
  fetchActiveTransfers,
  fetchTotalVolumeUSD,
  fetchSuccessRate,
} from '../utils/api';

// ============================================
// COMPONENTE: StatsCard (Estadísticas de Remesas)
// QUÉ: Muestra métricas clave del sistema de remesas internacionales
// PARA: Dar visibilidad rápida del rendimiento de la plataforma fintech
// IMPACTO: Cada estadística se carga con su propio useEffect independiente,
//          demostrando el manejo de múltiples efectos en un componente
// ============================================

export const StatsCard: React.FC = () => {
  // Estados independientes para cada métrica
  const [totalRemittances, setTotalRemittances] = useState<number>(0);
  const [loadingTotal, setLoadingTotal] = useState<boolean>(true);

  const [activeTransfers, setActiveTransfers] = useState<number>(0);
  const [loadingActive, setLoadingActive] = useState<boolean>(true);

  const [totalVolume, setTotalVolume] = useState<number>(0);
  const [loadingVolume, setLoadingVolume] = useState<boolean>(true);

  const [successRate, setSuccessRate] = useState<number>(0);
  const [loadingRate, setLoadingRate] = useState<boolean>(true);

  /**
   * QUÉ: Efecto 1 — Carga el total de remesas procesadas
   * PARA: Mostrar la métrica "Total Remesas" en el dashboard
   * IMPACTO: Se ejecuta una vez al montar, independiente de los demás stats
   */
  useEffect(() => {
    const loadTotal = async () => {
      try {
        setLoadingTotal(true);
        const total = await fetchTotalRemittances();
        setTotalRemittances(total);
      } catch (err) {
        console.error('Error loading total remittances:', err);
      } finally {
        setLoadingTotal(false);
      }
    };

    loadTotal();
  }, []);

  /**
   * QUÉ: Efecto 2 — Carga la cantidad de transferencias activas
   * PARA: Mostrar la métrica "Transferencias Activas" (pendientes/en tránsito)
   * IMPACTO: Se ejecuta una vez al montar, independiente de los demás stats
   */
  useEffect(() => {
    const loadActive = async () => {
      try {
        setLoadingActive(true);
        const active = await fetchActiveTransfers();
        setActiveTransfers(active);
      } catch (err) {
        console.error('Error loading active transfers:', err);
      } finally {
        setLoadingActive(false);
      }
    };

    loadActive();
  }, []);

  /**
   * QUÉ: Efecto 3 — Carga el volumen total enviado en USD
   * PARA: Mostrar la métrica "Volumen Total USD" procesado por la plataforma
   * IMPACTO: Se ejecuta una vez al montar, independiente de los demás stats
   */
  useEffect(() => {
    const loadVolume = async () => {
      try {
        setLoadingVolume(true);
        const volume = await fetchTotalVolumeUSD();
        setTotalVolume(volume);
      } catch (err) {
        console.error('Error loading total volume:', err);
      } finally {
        setLoadingVolume(false);
      }
    };

    loadVolume();
  }, []);

  /**
   * QUÉ: Efecto 4 — Carga la tasa de éxito de las remesas
   * PARA: Mostrar el "% de Éxito" de transferencias completadas
   * IMPACTO: Se ejecuta una vez al montar, independiente de los demás stats
   */
  useEffect(() => {
    const loadRate = async () => {
      try {
        setLoadingRate(true);
        const rate = await fetchSuccessRate();
        setSuccessRate(rate);
      } catch (err) {
        console.error('Error loading success rate:', err);
      } finally {
        setLoadingRate(false);
      }
    };

    loadRate();
  }, []);

  // Formatea valores grandes con separadores de miles
  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  // Formatea montos en dólares
  const formatUSD = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="stats-card">
      <h2>📊 Estadísticas de la Plataforma</h2>

      <div className="stats-grid">
        {/* Stat 1: Total de remesas */}
        <div className="stat">
          <div className="stat-icon">📦</div>
          <div className="stat-value">
            {loadingTotal ? (
              <span className="stat-loading">...</span>
            ) : (
              formatNumber(totalRemittances)
            )}
          </div>
          <div className="stat-label">Total Remesas</div>
        </div>

        {/* Stat 2: Transferencias activas */}
        <div className="stat">
          <div className="stat-icon">⚡</div>
          <div className="stat-value active-value">
            {loadingActive ? (
              <span className="stat-loading">...</span>
            ) : (
              formatNumber(activeTransfers)
            )}
          </div>
          <div className="stat-label">Activas Ahora</div>
        </div>

        {/* Stat 3: Volumen total USD */}
        <div className="stat">
          <div className="stat-icon">💰</div>
          <div className="stat-value volume-value">
            {loadingVolume ? (
              <span className="stat-loading">...</span>
            ) : (
              formatUSD(totalVolume)
            )}
          </div>
          <div className="stat-label">Volumen Total</div>
        </div>

        {/* Stat 4: Tasa de éxito */}
        <div className="stat">
          <div className="stat-icon">✅</div>
          <div className="stat-value rate-value">
            {loadingRate ? (
              <span className="stat-loading">...</span>
            ) : (
              `${successRate}%`
            )}
          </div>
          <div className="stat-label">Tasa de Éxito</div>
        </div>
      </div>
    </div>
  );
};
