import React, { useState, useEffect } from 'react';
import type { Remittance, RemittanceStatus } from '../types';
import { fetchRemittances, searchRemittances } from '../utils/api';

// ============================================
// COMPONENTE: ItemList (Lista de Remesas Internacionales)
// QUÉ: Muestra todas las transferencias de la plataforma fintech
// PARA: Visualizar el historial de remesas con estados, montos y corredores
// IMPACTO: Usa useEffect con AbortController para fetch seguro al montar
// ============================================

/**
 * QUÉ: Mapeo de estados de remesa a etiquetas legibles y colores
 * PARA: Renderizar badges de estado con estilo visual diferenciado
 */
const STATUS_CONFIG: Record<
  RemittanceStatus,
  { label: string; className: string }
> = {
  pending: { label: 'Pendiente', className: 'status-pending' },
  processing: { label: 'Procesando', className: 'status-processing' },
  in_transit: { label: 'En tránsito', className: 'status-transit' },
  completed: { label: 'Completada', className: 'status-completed' },
  cancelled: { label: 'Cancelada', className: 'status-cancelled' },
  failed: { label: 'Fallida', className: 'status-failed' },
};

/**
 * QUÉ: Mapeo de métodos de transferencia a etiquetas legibles
 * PARA: Mostrar el canal utilizado para cada remesa
 */
const METHOD_LABELS: Record<string, string> = {
  bank_transfer: '🏦 Transferencia Bancaria',
  mobile_wallet: '📱 Billetera Móvil',
  cash_pickup: '💵 Retiro en Efectivo',
  crypto: '₿ Criptomoneda',
};

export const ItemList: React.FC = () => {
  // Estados para data, loading, error y búsqueda
  const [remittances, setRemittances] = useState<Remittance[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  /**
   * QUÉ: Efecto para cargar las remesas al montar el componente
   * PARA: Obtener datos iniciales de la API de forma segura
   * IMPACTO: Usa AbortController para cancelar la petición si el componente
   *          se desmonta antes de que finalice, evitando memory leaks
   */
  useEffect(() => {
    const controller = new AbortController();

    const loadRemittances = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchRemittances(controller.signal);
        setRemittances(data);
      } catch (err) {
        // No actualizar estado si fue cancelación intencional
        if (err instanceof DOMException && err.name === 'AbortError') {
          return;
        }
        setError(
          err instanceof Error ? err.message : 'Error al cargar remesas',
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    loadRemittances();

    // Cleanup: cancelar petición pendiente al desmontar
    return () => {
      controller.abort();
    };
  }, []); // Array vacío: solo al montar

  /**
   * QUÉ: Efecto para filtrar remesas cuando el usuario escribe en el buscador
   * PARA: Re-fetch filtrado con debounce implícito (delay en API)
   * IMPACTO: Depende de searchTerm; se ejecuta cada vez que cambia el término
   */
  useEffect(() => {
    // No buscar si no hay término (ya tenemos los datos iniciales)
    if (searchTerm === '') return;

    let cancelled = false;

    const performSearch = async () => {
      try {
        const results = await searchRemittances(searchTerm);
        if (!cancelled) {
          setRemittances(results);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : 'Error en la búsqueda',
          );
        }
      }
    };

    performSearch();

    // Cleanup: evitar actualizar estado si se lanza otra búsqueda
    return () => {
      cancelled = true;
    };
  }, [searchTerm]);

  /**
   * QUÉ: Handler para resetear la búsqueda y recargar todos los datos
   * PARA: Botón de limpiar filtro
   */
  const handleClearSearch = async () => {
    setSearchTerm('');
    setLoading(true);
    try {
      const data = await fetchRemittances();
      setRemittances(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Error al recargar remesas',
      );
    } finally {
      setLoading(false);
    }
  };

  // Formatear montos con separadores de miles
  const formatCurrency = (amount: number, currency: string): string => {
    if (currency === 'BTC') return `${amount} BTC`;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency === 'GTQ' || currency === 'HNL' || currency === 'DOP'
        ? 'USD'
        : currency,
      minimumFractionDigits: 2,
    })
      .format(amount)
      .replace('$', `${currency} `);
  };

  // Renderizado condicional: estado de carga
  if (loading) {
    return (
      <div className="item-list">
        <h2>📋 Remesas Internacionales</h2>
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Cargando transferencias...</p>
        </div>
      </div>
    );
  }

  // Renderizado condicional: estado de error
  if (error) {
    return (
      <div className="item-list error">
        <h2>📋 Remesas Internacionales</h2>
        <div className="error-message">
          <p>⚠️ {error}</p>
          <button onClick={() => window.location.reload()}>
            🔄 Reintentar
          </button>
        </div>
      </div>
    );
  }

  // Renderizado principal: lista de remesas
  return (
    <div className="item-list">
      <div className="list-header">
        <h2>📋 Remesas Internacionales</h2>
        <p className="item-count">
          Total: <strong>{remittances.length}</strong> transferencias
        </p>
      </div>

      {/* Barra de búsqueda */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Buscar por emisor, receptor o país..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        {searchTerm && (
          <button onClick={handleClearSearch} className="clear-btn">
            ✕
          </button>
        )}
      </div>

      {/* Lista de remesas */}
      <ul className="items">
        {remittances.map((remittance) => (
          <li key={remittance.id} className="item-card">
            <div className="card-header">
              <span className="remittance-id">#{remittance.id}</span>
              <span
                className={`status-badge ${STATUS_CONFIG[remittance.status].className}`}
              >
                {STATUS_CONFIG[remittance.status].label}
              </span>
            </div>

            <div className="card-corridor">
              <span className="country">{remittance.originCountry}</span>
              <span className="arrow">→</span>
              <span className="country">{remittance.destinationCountry}</span>
            </div>

            <div className="card-people">
              <p>
                <strong>Emisor:</strong> {remittance.senderName}
              </p>
              <p>
                <strong>Receptor:</strong> {remittance.receiverName}
              </p>
            </div>

            <div className="card-amounts">
              <div className="amount-sent">
                <span className="amount-label">Enviado</span>
                <span className="amount-value">
                  {formatCurrency(
                    remittance.amountSent,
                    remittance.sendCurrency,
                  )}
                </span>
              </div>
              <span className="arrow-amount">→</span>
              <div className="amount-received">
                <span className="amount-label">Recibido</span>
                <span className="amount-value">
                  {formatCurrency(
                    remittance.amountReceived,
                    remittance.receiveCurrency,
                  )}
                </span>
              </div>
            </div>

            <div className="card-footer">
              <span className="method">
                {METHOD_LABELS[remittance.transferMethod]}
              </span>
              <span className="fee">
                Comisión: ${remittance.fee.toFixed(2)}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
