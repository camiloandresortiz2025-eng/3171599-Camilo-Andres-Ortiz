# 💸 Sistema de Gestión de Remesas Internacionales

## 📋 Información del Proyecto

- **Aprendiz**: Camilo Andres Ortiz
- **Ficha**: 3171599
- **Dominio**: Sistema de Remesas Internacionales — Servicios Financieros y Fintech
- **Semana**: Week 02 — Introducción a React con TypeScript

---

## 🎯 Descripción

Aplicación web construida con **React + TypeScript + Vite** que permite gestionar remesas internacionales mediante operaciones CRUD (Crear, Leer, Actualizar, Eliminar).

El sistema simula una plataforma fintech donde se pueden registrar transacciones de envío de dinero internacional, con información sobre remitente, destinatario, monto, moneda, país de destino, estado y fecha.

---

## 🚀 Funcionalidades

- ✅ **Registrar** nuevas remesas internacionales con formulario validado
- ✅ **Visualizar** lista de remesas en tarjetas con diseño responsive
- ✅ **Editar** remesas existentes (pre-llenado automático del formulario)
- ✅ **Eliminar** remesas con confirmación de seguridad
- ✅ **Badges de estado** con colores diferenciados (Pendiente, En proceso, Completada, Cancelada)
- ✅ **Formato de moneda** con símbolos según la divisa seleccionada
- ✅ **Estado vacío** con mensaje informativo cuando no hay remesas
- ✅ **Validación** de campos requeridos y montos positivos

---

## 🏗️ Estructura de Componentes

```
App (componente principal con estado)
├── Header (título y descripción del sistema fintech)
├── RemittanceForm (formulario agregar/editar remesas)
│   ├── Inputs: remitente, destinatario, monto, país destino, fecha
│   ├── Selects: moneda (USD, EUR, COP, MXN, BRL, PEN), estado
│   ├── Botón submit (Registrar / Actualizar)
│   └── Botón cancelar (al editar)
├── RemittanceList (lista de remesas)
│   └── RemittanceCard × N (tarjeta individual)
│       ├── Info: remitente, destinatario, monto, moneda, país, fecha
│       ├── Badge de estado con color
│       ├── Botón editar
│       └── Botón eliminar con confirmación
```

---

## 📦 Estructura de Archivos

```
week-2/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── README.md
└── src/
    ├── main.tsx
    ├── App.tsx
    ├── types/
    │   └── index.ts
    ├── components/
    │   ├── Header.tsx
    │   ├── RemittanceForm.tsx
    │   ├── RemittanceCard.tsx
    │   └── RemittanceList.tsx
    └── styles/
        └── App.css
```

---

## 🛠️ Tecnologías

- **React** 18.3
- **TypeScript** 5.6
- **Vite** 6.0
- CSS puro (sin librerías externas)

---

## ⚙️ Instalación y Ejecución

```bash
# 1. Navegar a la carpeta del proyecto
cd week-2

# 2. Instalar dependencias
pnpm install

# 3. Ejecutar en modo desarrollo
pnpm dev

# 4. Build para producción
pnpm build
```

---

## 💡 Decisiones de Diseño

1. **Dominio fintech**: Se eligió remesas internacionales como dominio, con propiedades relevantes al sector (moneda, país destino, estado de transacción).
2. **Tipos estrictos**: Se usan union types para `Currency` y `RemittanceStatus` en lugar de strings genéricos.
3. **Inmutabilidad**: Todas las operaciones CRUD usan spread operator, `map()` y `filter()` sin mutar el estado.
4. **Formularios controlados**: Cada input está vinculado al estado con `value` + `onChange`.
5. **Confirmación al eliminar**: Se pide confirmación antes de eliminar una remesa para evitar pérdida de datos.
6. **Formato de moneda**: Se muestra el símbolo correcto según la moneda seleccionada.
7. **Paleta de colores**: Se usa una paleta azul oscuro profesional, acorde al sector financiero.

---

_Última actualización: Febrero 2026_
