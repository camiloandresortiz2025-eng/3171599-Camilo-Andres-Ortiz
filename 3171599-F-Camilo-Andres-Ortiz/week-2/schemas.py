"""
Schemas Pydantic para la API de Remesas Internacionales
========================================================

Dominio: Sistema de Remesas Internacionales - Servicios Financieros y Fintech
Aprendiz: Camilo Andres Ortiz - Ficha: 3171599

Schemas implementados:
- RemittanceBase: Campos comunes para todas las remesas
- RemittanceCreate: Para POST (con validadores de normalización)
- RemittanceUpdate: Para PATCH (todos opcionales)
- RemittanceResponse: Para respuestas (incluye id y timestamps)
- RemittanceList: Lista paginada de remesas
"""

from pydantic import BaseModel, Field, EmailStr, ConfigDict, field_validator
from datetime import datetime
from decimal import Decimal
from enum import Enum
import re


# ============================================
# ENUMS PARA EL DOMINIO DE REMESAS
# ============================================

class CurrencyEnum(str, Enum):
    """
    QUÉ: Enum con las monedas soportadas por la plataforma fintech.
    PARA QUÉ: Restringir valores válidos de moneda en los schemas.
    IMPACTO: Previene errores al solo aceptar monedas reconocidas.
    """
    USD = "USD"
    EUR = "EUR"
    COP = "COP"
    MXN = "MXN"
    BRL = "BRL"
    PEN = "PEN"
    GBP = "GBP"


class RemittanceStatusEnum(str, Enum):
    """
    QUÉ: Enum con los estados posibles de una remesa.
    PARA QUÉ: Controlar el ciclo de vida de cada transacción.
    IMPACTO: Garantiza que solo se asignen estados válidos.
    """
    pendiente = "pendiente"
    en_proceso = "en_proceso"
    completada = "completada"
    cancelada = "cancelada"


# ============================================
# TODO 1: RemittanceBase
# Campos comunes para todos los schemas de remesa
# ============================================

class RemittanceBase(BaseModel):
    """
    QUÉ: Schema base con los campos comunes de una remesa internacional.
    PARA QUÉ: Definir la estructura mínima de datos que comparten
              RemittanceCreate, RemittanceUpdate y RemittanceResponse.
    IMPACTO: Evita duplicación de código y centraliza las validaciones
             de campos compartidos.

    Campos:
    - sender_name: str (2-100 caracteres) — Nombre del remitente
    - receiver_name: str (2-100 caracteres) — Nombre del destinatario
    - sender_email: EmailStr — Email del remitente para notificaciones
    - amount: Decimal (> 0, máx 2 decimales) — Monto a enviar
    - currency: CurrencyEnum — Moneda de la transacción
    - destination_country: str (2-60 caracteres) — País destino
    - tracking_code: str — Código único de seguimiento (REM-XXXXX)
    - swift_code: str — Código SWIFT/BIC del banco destino
    - status: RemittanceStatusEnum — Estado de la transacción
    - is_urgent: bool — Si la remesa es urgente (tarifa express)
    - notes: str | None — Notas adicionales opcionales
    """
    sender_name: str = Field(
        ...,
        min_length=2,
        max_length=100,
        description="Nombre completo del remitente",
        examples=["Carlos Andrés Pérez"],
    )
    receiver_name: str = Field(
        ...,
        min_length=2,
        max_length=100,
        description="Nombre completo del destinatario",
        examples=["María López García"],
    )
    sender_email: EmailStr = Field(
        ...,
        description="Email del remitente para confirmaciones",
        examples=["carlos.perez@email.com"],
    )
    amount: Decimal = Field(
        ...,
        gt=0,
        max_digits=12,
        decimal_places=2,
        description="Monto a enviar (mayor a 0, máximo 2 decimales)",
        examples=[250.50],
    )
    currency: CurrencyEnum = Field(
        default=CurrencyEnum.USD,
        description="Moneda de la transacción",
        examples=["USD"],
    )
    destination_country: str = Field(
        ...,
        min_length=2,
        max_length=60,
        description="País de destino de la remesa",
        examples=["Colombia"],
    )
    tracking_code: str = Field(
        ...,
        min_length=9,
        max_length=10,
        description="Código de seguimiento único (formato: REM-XXXXX)",
        examples=["REM-12345"],
    )
    swift_code: str = Field(
        ...,
        min_length=8,
        max_length=11,
        description="Código SWIFT/BIC del banco destino (8-11 caracteres alfanuméricos)",
        examples=["BSCHESMM"],
    )
    status: RemittanceStatusEnum = Field(
        default=RemittanceStatusEnum.pendiente,
        description="Estado actual de la remesa",
    )
    is_urgent: bool = Field(
        default=False,
        description="Indica si la remesa es urgente (tarifa express)",
    )
    notes: str | None = Field(
        default=None,
        max_length=500,
        description="Notas adicionales sobre la remesa",
    )


# ============================================
# TODO 2: RemittanceCreate
# Schema para crear remesas (POST)
# Incluye validadores para normalizar datos
# ============================================

class RemittanceCreate(RemittanceBase):
    """
    QUÉ: Schema para crear una nueva remesa internacional (POST).
    PARA QUÉ: Valida y normaliza los datos de entrada antes de crear
              la remesa en la base de datos.
    IMPACTO: Garantiza que los datos se almacenen de forma consistente
             (nombres capitalizados, tracking code en mayúsculas, etc.).

    Validadores requeridos:
    1. normalize_names: Capitalizar sender_name y receiver_name
    2. validate_tracking_code: Formato REM-XXXXX (5 dígitos)
    3. validate_swift_code: Formato alfanumérico 8-11 chars
    4. normalize_country: Capitalizar país de destino
    """

    @field_validator("sender_name", "receiver_name")
    @classmethod
    def normalize_names(cls, v: str) -> str:
        """
        QUÉ: Validador que normaliza nombres de remitente y destinatario.
        PARA QUÉ: Asegurar consistencia en el formato de nombres
                  (sin espacios extra, capitalizado correctamente).
        IMPACTO: Los nombres se almacenan siempre en formato título.
        """
        v = v.strip()
        if len(v) < 2:
            raise ValueError("El nombre debe tener al menos 2 caracteres")
        return v.title()

    @field_validator("tracking_code")
    @classmethod
    def validate_tracking_code(cls, v: str) -> str:
        """
        QUÉ: Validador del código de seguimiento de la remesa.
        PARA QUÉ: Asegurar que siga el formato estándar REM-XXXXX
                  donde X son dígitos (3 a 5 dígitos).
        IMPACTO: Permite identificar y rastrear cada remesa de forma única.
        """
        v = v.strip().upper()
        if not re.match(r"^REM-\d{3,5}$", v):
            raise ValueError("Tracking code debe tener formato: REM-12345 (REM- seguido de 3 a 5 dígitos)")
        return v

    @field_validator("swift_code")
    @classmethod
    def validate_swift_code(cls, v: str) -> str:
        """
        QUÉ: Validador del código SWIFT/BIC del banco destino.
        PARA QUÉ: Verificar que sea un código SWIFT válido (8 u 11
                  caracteres alfanuméricos en mayúsculas).
        IMPACTO: Garantiza que la remesa pueda ser procesada por el
                 sistema bancario internacional.
        """
        v = v.strip().upper()
        if not re.match(r"^[A-Z0-9]{8}([A-Z0-9]{3})?$", v):
            raise ValueError("SWIFT code debe ser 8 u 11 caracteres alfanuméricos (ej: BSCHESMM)")
        return v

    @field_validator("destination_country")
    @classmethod
    def normalize_country(cls, v: str) -> str:
        """
        QUÉ: Validador que normaliza el nombre del país destino.
        PARA QUÉ: Asegurar formato consistente del nombre del país.
        IMPACTO: Facilita filtrado y búsqueda de remesas por país.
        """
        v = v.strip()
        if len(v) < 2:
            raise ValueError("País de destino debe tener al menos 2 caracteres")
        return v.title()


# ============================================
# TODO 3: RemittanceUpdate
# Schema para actualizar remesas (PATCH)
# Todos los campos son opcionales
# ============================================

class RemittanceUpdate(BaseModel):
    """
    QUÉ: Schema para actualización parcial de remesas (PATCH).
    PARA QUÉ: Permitir actualizar solo los campos que el usuario envíe,
              sin requerir todos los campos de la remesa.
    IMPACTO: Los campos no enviados se ignoran (exclude_unset=True en
             el endpoint), y los enviados se validan igualmente.
    """
    sender_name: str | None = Field(default=None, min_length=2, max_length=100)
    receiver_name: str | None = Field(default=None, min_length=2, max_length=100)
    sender_email: EmailStr | None = None
    amount: Decimal | None = Field(default=None, gt=0, max_digits=12, decimal_places=2)
    currency: CurrencyEnum | None = None
    destination_country: str | None = Field(default=None, min_length=2, max_length=60)
    tracking_code: str | None = Field(default=None, min_length=9, max_length=10)
    swift_code: str | None = Field(default=None, min_length=8, max_length=11)
    status: RemittanceStatusEnum | None = None
    is_urgent: bool | None = None
    notes: str | None = Field(default=None, max_length=500)

    @field_validator("sender_name", "receiver_name")
    @classmethod
    def normalize_names(cls, v: str | None) -> str | None:
        """Normaliza nombres solo si se proporcionan."""
        if v is None:
            return v
        v = v.strip()
        if len(v) < 2:
            raise ValueError("El nombre debe tener al menos 2 caracteres")
        return v.title()

    @field_validator("tracking_code")
    @classmethod
    def validate_tracking_code(cls, v: str | None) -> str | None:
        """Valida tracking code solo si se proporciona."""
        if v is None:
            return v
        v = v.strip().upper()
        if not re.match(r"^REM-\d{3,5}$", v):
            raise ValueError("Tracking code debe tener formato: REM-12345")
        return v

    @field_validator("swift_code")
    @classmethod
    def validate_swift_code(cls, v: str | None) -> str | None:
        """Valida SWIFT code solo si se proporciona."""
        if v is None:
            return v
        v = v.strip().upper()
        if not re.match(r"^[A-Z0-9]{8}([A-Z0-9]{3})?$", v):
            raise ValueError("SWIFT code debe ser 8 u 11 caracteres alfanuméricos")
        return v

    @field_validator("destination_country")
    @classmethod
    def normalize_country(cls, v: str | None) -> str | None:
        """Normaliza país solo si se proporciona."""
        if v is None:
            return v
        v = v.strip()
        return v.title()


# ============================================
# TODO 4: RemittanceResponse
# Schema para respuestas (incluye id y timestamps)
# ============================================

class RemittanceResponse(RemittanceBase):
    """
    QUÉ: Schema para las respuestas de la API.
    PARA QUÉ: Incluir campos generados por el servidor (id, timestamps)
              que no están en el schema de creación.
    IMPACTO: Define la estructura exacta de datos que el cliente recibe
             al consultar o crear una remesa.
    """
    model_config = ConfigDict(from_attributes=True)

    id: int = Field(..., description="ID único de la remesa")
    created_at: datetime = Field(..., description="Fecha de creación de la remesa")
    updated_at: datetime | None = Field(default=None, description="Fecha de última actualización")


# ============================================
# TODO 5: RemittanceList
# Schema para lista paginada
# ============================================

class RemittanceList(BaseModel):
    """
    QUÉ: Schema para lista paginada de remesas.
    PARA QUÉ: Retornar resultados paginados con metadatos (total, página actual,
              registros por página) en vez de todos los resultados de una vez.
    IMPACTO: Mejora el rendimiento y la experiencia de usuario al manejar
             grandes volúmenes de transacciones.
    """
    items: list[RemittanceResponse] = Field(..., description="Lista de remesas")
    total: int = Field(..., description="Total de remesas encontradas")
    page: int = Field(..., description="Página actual")
    per_page: int = Field(..., description="Registros por página")
