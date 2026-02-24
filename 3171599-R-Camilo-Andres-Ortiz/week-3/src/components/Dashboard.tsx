import React from 'react';
import { ItemList } from './ItemList';
import { StatsCard } from './StatsCard';
import { RealTimeIndicator } from './RealTimeIndicator';

// ============================================
// COMPONENTE: Dashboard (Componente Principal)
// QUÉ: Contenedor principal del sistema de remesas internacionales
// PARA: Integrar y orquestar los 3 componentes del dashboard fintech
// IMPACTO: Proporciona el layout responsivo y la estructura visual general
// ============================================

export const Dashboard: React.FC = () => {
  return (
    <div className="dashboard">
      {/* Header del dashboard con branding de la plataforma fintech */}
      <header className="dashboard-header">
        <div className="header-brand">
          <h1>🌐 RemesasPay</h1>
          <span className="brand-subtitle">
            Plataforma de Remesas Internacionales
          </span>
        </div>
        <div className="header-actions">
          <button
            className="refresh-btn"
            onClick={() => window.location.reload()}
          >
            🔄 Refrescar
          </button>
        </div>
      </header>

      {/* Layout principal con los 3 componentes */}
      <main className="dashboard-main">
        {/* Sección de estadísticas (ocupa mayor parte del ancho) */}
        <section className="dashboard-section stats-section">
          <StatsCard />
        </section>

        {/* Sección de datos en tiempo real (columna lateral) */}
        <section className="dashboard-section realtime-section">
          <RealTimeIndicator />
        </section>

        {/* Sección de lista de remesas (ancho completo) */}
        <section className="dashboard-section list-section">
          <ItemList />
        </section>
      </main>

      {/* Footer con info de la plataforma */}
      <footer className="dashboard-footer">
        <p>
          RemesasPay Dashboard — Sistema de Remesas Internacionales ©{' '}
          {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
};
