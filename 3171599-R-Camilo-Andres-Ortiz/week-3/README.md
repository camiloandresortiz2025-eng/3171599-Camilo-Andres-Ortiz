# 🌐 RemesasPay — Dashboard de Remesas Internacionales

## 📋 Dominio

**Sistema de Remesas Internacionales — Servicios Financieros y Fintech**

Este proyecto simula el panel de control de una plataforma fintech especializada en el envío de remesas internacionales. Permite visualizar transferencias entre países, monitorear estadísticas clave del negocio y observar datos de mercado cambiario en tiempo real.

---

## 🎯 Decisiones Técnicas

### Adaptación al Dominio

- **Remittance** reemplaza la interfaz genérica `Item`: incluye emisor, receptor, montos en ambas divisas, corredor (país origen → destino), método de transferencia, comisión y estado.
- **RemittanceStats** con métricas específicas: total de remesas, transferencias activas, volumen total en USD y tasa de éxito.
- **RealTimeData** simula un feed de mercado cambiario: tasa de cambio USD/MXN con fluctuación aleatoria, transacciones pendientes y volumen por minuto.

### Arquitectura de Componentes

| Componente            | Responsabilidad                                         |
| --------------------- | ------------------------------------------------------- |
| `Dashboard`           | Layout principal, integra los 3 componentes             |
| `ItemList`            | Lista de remesas con fetch + AbortController + búsqueda |
| `StatsCard`           | 4 métricas con useEffect independientes                 |
| `RealTimeIndicator`   | Polling cada 5s con setInterval + cleanup               |

### Patrones de useEffect utilizados

1. **Fetch con AbortController** (ItemList): Cancela peticiones al desmontar para evitar race conditions.
2. **Múltiples efectos independientes** (StatsCard): Cada stat tiene su propio useEffect con loading individual.
3. **Polling con setInterval** (RealTimeIndicator): Actualiza datos cada 5 segundos con cleanup via `clearInterval`.
4. **Búsqueda con efecto dependiente** (ItemList): useEffect que depende de `searchTerm` para filtrar remesas.

### Datos Mock

Se incluyen 10 remesas realistas con corredores como USA→México, España→Colombia, USA→Perú, etc. Los métodos de transferencia incluyen transferencia bancaria, billetera móvil, retiro en efectivo y criptomonedas.

---

## 🛠️ Tecnologías

- React 18 + TypeScript
- Vite
- CSS puro (tema oscuro fintech)

## 🚀 Ejecución

```bash
pnpm install
pnpm dev
```

---

_Proyecto Week 03 — Bootcamp React 2026_
