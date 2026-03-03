# 💸 Catálogo de Remesas Internacionales

## 📋 Descripción del Dominio

**Sistema de Remesas Internacionales - Servicios Financieros y Fintech**

Este proyecto implementa un catálogo interactivo para gestionar y visualizar remesas internacionales (transferencias de dinero entre países). El sistema permite buscar, filtrar y ordenar transferencias por múltiples criterios relevantes al sector fintech.

### ¿Qué es una remesa internacional?
Una remesa es una transferencia de dinero que un trabajador migrante envía a su país de origen, generalmente a familiares. Es uno de los flujos financieros más importantes del mundo, especialmente en Latinoamérica.

### Propiedades del dominio
Cada remesa incluye:
- **Remitente**: Persona que envía el dinero (nombre + país de origen)
- **Beneficiario**: Persona que recibe el dinero (nombre + país destino)
- **Monto**: Cantidad enviada en USD
- **Tasa de cambio**: Conversión a moneda local del país destino
- **Comisión**: Tarifa cobrada por el servicio
- **Método de transferencia**: Canal utilizado (bancario, móvil, efectivo, cripto)
- **Estado**: Ciclo de vida (pendiente, en tránsito, completada, cancelada)
- **Urgencia**: Si la transferencia es express o estándar

---

## 🎯 Funcionalidades Implementadas

### ✅ Renderizado Condicional
- Estado de carga (loading spinner)
- Estado de error con mensaje descriptivo
- Estado vacío cuando no hay resultados
- Contador de resultados dinámico
- Badges condicionales: urgente, estado de remesa
- Botón de limpiar búsqueda (aparece solo si hay texto)
- Estadísticas calculadas (total enviado, total comisiones)

### ✅ Listas con Keys
- Renderizado de remesas con `.map()` tipado
- Keys únicas basadas en `id` (nunca `index`)
- Componente `ItemCard` extraído para cada remesa
- Acciones por ítem: ver detalles, eliminar

### ✅ Filtrado
- Filtro por **método de transferencia** (categoría): bancario, móvil, efectivo, cripto
- Filtro **booleano**: solo remesas urgentes
- Filtro por **rango de monto** (mín/máx en USD)
- Botón para limpiar todos los filtros

### ✅ Ordenamiento
- 7 opciones de orden:
  - Remitente A-Z / Z-A
  - Monto menor/mayor
  - Más recientes / más antiguos
  - Menor comisión
- Orden ascendente/descendente
- Sin mutación del array original (`[...items].sort()`)

### ✅ Búsqueda
- Input de búsqueda en tiempo real con debounce (300ms)
- Búsqueda case-insensitive
- Búsqueda en múltiples campos: remitente, beneficiario, país origen, país destino, moneda
- Botón para limpiar búsqueda

---

## 🛠️ Tecnologías

- **React 18** + **TypeScript**
- **Vite** (build tool)
- **CSS** puro (variables CSS, responsive)

---

## 📂 Estructura del Proyecto

```
remittance-catalog/
├── src/
│   ├── components/
│   │   ├── Catalog.tsx           # Componente principal (orquestador)
│   │   ├── ItemCard.tsx          # Tarjeta de remesa individual
│   │   ├── ItemList.tsx          # Lista de remesas con estados
│   │   ├── SearchBar.tsx         # Barra de búsqueda en tiempo real
│   │   ├── FilterPanel.tsx       # Panel de filtros (método, urgencia, rango)
│   │   ├── SortSelector.tsx      # Selector de criterio de ordenamiento
│   │   ├── EmptyState.tsx        # Estado vacío (sin resultados)
│   │   └── LoadingSpinner.tsx    # Indicador de carga
│   ├── types/
│   │   └── index.ts              # Interfaces: Remittance, TransferMethod, etc.
│   ├── data/
│   │   └── items.ts              # 12 remesas de ejemplo + opciones
│   ├── hooks/
│   │   └── useDebounce.ts        # Hook para debounce en búsqueda
│   ├── App.tsx                   # Componente raíz
│   ├── App.css                   # Estilos completos de la aplicación
│   └── main.tsx                  # Punto de entrada
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## 🚀 Instrucciones de Ejecución

```bash
# 1. Navegar a la carpeta del proyecto
cd week-4/remittance-catalog

# 2. Instalar dependencias
npm install

# 3. Iniciar servidor de desarrollo
npm run dev

# 4. Abrir en el navegador
# http://localhost:5173
```

---

## 📋 Criterios Cumplidos

| Criterio | Estado |
|---|---|
| Renderizado condicional correcto | ✅ |
| Keys únicas y extracción de componentes | ✅ |
| Filtrado funcional (3 filtros) | ✅ |
| Ordenamiento sin mutación (7 opciones) | ✅ |
| Búsqueda en tiempo real | ✅ |
| Adaptación al dominio (remesas fintech) | ✅ |
| Calidad del código (TypeScript estricto) | ✅ |
| Comentarios QUÉ/PARA/IMPACTO | ✅ |
| Nomenclatura inglés (código) + español (comentarios) | ✅ |
| Mínimo 12 elementos de datos | ✅ |
| Mínimo 5 componentes separados (8 total) | ✅ |
| Estados vacíos con mensaje apropiado | ✅ |
| Sin `any` en el código | ✅ |

---

## 👤 Autor

**Camilo Andrés Ortiz** - Ficha 3171599

Week 04: Renderizado Condicional y Listas - Bootcamp React
