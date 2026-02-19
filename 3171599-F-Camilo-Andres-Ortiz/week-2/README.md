# 💸 API de Remesas Internacionales

## 📋 Información del Proyecto

- **Aprendiz**: Camilo Andres Ortiz
- **Ficha**: 3171599
- **Dominio**: Sistema de Remesas Internacionales — Servicios Financieros y Fintech
- **Semana**: Week 02 — Pydantic v2 - Validación de Datos

---

## 🎯 Descripción

API REST CRUD completa construida con **FastAPI + Pydantic v2** para gestionar transacciones de remesas internacionales. Incluye validación robusta de datos, normalización automática de campos y almacenamiento en memoria.

---

## 🚀 Funcionalidades

- ✅ **CRUD completo** de remesas internacionales
- ✅ **Validación robusta** con Pydantic v2 (Field, field_validator)
- ✅ **Schemas separados**: RemittanceCreate, RemittanceUpdate, RemittanceResponse
- ✅ **Paginación** con filtros por estado y moneda
- ✅ **Normalización automática**: nombres capitalizados, tracking code y SWIFT en mayúsculas
- ✅ **Validadores personalizados**: formato REM-XXXXX, SWIFT/BIC code
- ✅ **Búsqueda por campo único**: tracking code
- ✅ **Marcar como completada**: endpoint adicional de cambio de estado
- ✅ **Documentación Swagger** automática en `/docs`
- ✅ **Docker** listo para ejecutar

---

## 📦 Endpoints

| Método | Endpoint                          | Descripción                     |
| ------ | --------------------------------- | ------------------------------- |
| POST   | `/remittances`                    | Crear nueva remesa              |
| GET    | `/remittances`                    | Listar con paginación y filtros |
| GET    | `/remittances/{id}`               | Obtener por ID                  |
| GET    | `/remittances/by-tracking/{code}` | Buscar por tracking code        |
| PATCH  | `/remittances/{id}`               | Actualización parcial           |
| DELETE | `/remittances/{id}`               | Eliminar remesa                 |
| POST   | `/remittances/{id}/complete`      | Marcar como completada          |
| GET    | `/`                               | Health check                    |

---

## 🏗️ Estructura del Proyecto

```
week-2/
├── main.py              # Aplicación FastAPI con endpoints
├── schemas.py           # Schemas Pydantic (Create, Update, Response, List)
├── database.py          # Base de datos en memoria
├── pyproject.toml       # Dependencias del proyecto
├── Dockerfile           # Imagen Docker
├── docker-compose.yml   # Configuración Docker Compose
└── README.md            # Este archivo
```

---

## 🔧 Entity Model: Remittance (11 campos)

| Campo                 | Tipo                 | Descripción                                         |
| --------------------- | -------------------- | --------------------------------------------------- |
| `id`                  | int                  | Auto-generated                                      |
| `sender_name`         | str                  | Nombre del remitente (2-100 chars, capitalizado)    |
| `receiver_name`       | str                  | Nombre del destinatario (2-100 chars, capitalizado) |
| `sender_email`        | EmailStr             | Email del remitente                                 |
| `amount`              | Decimal              | Monto (> 0, máx 2 decimales)                        |
| `currency`            | CurrencyEnum         | USD, EUR, COP, MXN, BRL, PEN, GBP                   |
| `destination_country` | str                  | País destino (capitalizado)                         |
| `tracking_code`       | str                  | Código único REM-XXXXX                              |
| `swift_code`          | str                  | SWIFT/BIC del banco (8-11 chars)                    |
| `status`              | RemittanceStatusEnum | pendiente, en_proceso, completada, cancelada        |
| `is_urgent`           | bool                 | Remesa urgente (tarifa express)                     |
| `notes`               | str \| None          | Notas adicionales                                   |
| `created_at`          | datetime             | Fecha de creación                                   |
| `updated_at`          | datetime \| None     | Fecha de actualización                              |

---

## ⚙️ Instalación y Ejecución

### Con Docker (recomendado)

```bash
cd week-2
docker compose up --build
```

### Sin Docker

```bash
cd week-2
pip install uv
uv sync
uv run uvicorn main:app --reload
```

### Acceder a la documentación

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

---

## 💡 Decisiones de Diseño

1. **Tracking code REM-XXXXX**: Formato estandarizado para identificar remesas de forma única.
2. **SWIFT/BIC validation**: Valida formato bancario internacional (8 u 11 chars alfanuméricos).
3. **Normalización automática**: Nombres en Title Case, códigos en UPPER, país capitalizado.
4. **Enum para monedas y estados**: Restringen valores válidos sin usar strings arbitrarios.
5. **Schemas separados**: Create (validadores estrictos), Update (campos opcionales), Response (con timestamps).
6. **Filtros en listado**: Permite filtrar por estado y moneda para dashboards fintech.

---

_Última actualización: Febrero 2026_
