"""
Schemas Pydantic - Sistema de Remesas Internacionales
=====================================================

Define los modelos de datos para validación de la API
de remesas internacionales (Servicios Financieros y Fintech).
"""

from pydantic import BaseModel, Field
from datetime import datetime
from enum import Enum


# ============================================
# ENUMS
# ============================================

class SortOrder(str, Enum):
    """Orden de clasificación"""
    asc = "asc"
    desc = "desc"


class RemittanceSortField(str, Enum):
    """Campos disponibles para ordenar remesas"""
    amount = "amount"
    fee = "fee"
    created_at = "created_at"
    sender_name = "sender_name"


class RemittanceStatus(str, Enum):
    """Estados posibles de una remesa"""
    pending = "pending"
    processing = "processing"
    completed = "completed"
    cancelled = "cancelled"
    failed = "failed"


class PaymentMethod(str, Enum):
    """Métodos de pago disponibles"""
    bank_transfer = "bank_transfer"
    cash = "cash"
    mobile_wallet = "mobile_wallet"
    debit_card = "debit_card"


class Currency(str, Enum):
    """Monedas de origen soportadas"""
    USD = "USD"
    EUR = "EUR"
    GBP = "GBP"


# ============================================
# CORRIDOR SCHEMAS (Categoría: Corredor de remesas)
# ============================================

class CorridorBase(BaseModel):
    """Schema base para corredores de remesas"""
    name: str = Field(
        ..., min_length=2, max_length=100,
        description="Nombre descriptivo del corredor (ej: 'Estados Unidos a México')"
    )
    code: str = Field(
        ..., min_length=4, max_length=10, pattern=r"^[A-Z]{2}-[A-Z]{2}$",
        description="Código del corredor en formato XX-YY (ej: 'US-MX')"
    )
    origin_country: str = Field(
        ..., min_length=2, max_length=50,
        description="País de origen de la remesa"
    )
    destination_country: str = Field(
        ..., min_length=2, max_length=50,
        description="País de destino de la remesa"
    )
    base_fee_percentage: float = Field(
        ..., gt=0, le=15,
        description="Porcentaje de comisión base (1-15%)"
    )
    is_active: bool = Field(
        default=True,
        description="Si el corredor está activo para operaciones"
    )


class CorridorCreate(CorridorBase):
    """Schema para crear un nuevo corredor"""
    pass


class CorridorUpdate(BaseModel):
    """Schema para actualización parcial de corredor"""
    name: str | None = Field(default=None, min_length=2, max_length=100)
    code: str | None = Field(default=None, min_length=4, max_length=10, pattern=r"^[A-Z]{2}-[A-Z]{2}$")
    origin_country: str | None = Field(default=None, min_length=2, max_length=50)
    destination_country: str | None = Field(default=None, min_length=2, max_length=50)
    base_fee_percentage: float | None = Field(default=None, gt=0, le=15)
    is_active: bool | None = None


class CorridorResponse(CorridorBase):
    """Schema de respuesta para corredor"""
    id: int
    created_at: datetime

    model_config = {"from_attributes": True}


# ============================================
# REMITTANCE SCHEMAS (Entidad principal: Remesa)
# ============================================

class RemittanceBase(BaseModel):
    """Schema base para remesas"""
    sender_name: str = Field(
        ..., min_length=2, max_length=100,
        description="Nombre completo del remitente"
    )
    recipient_name: str = Field(
        ..., min_length=2, max_length=100,
        description="Nombre completo del beneficiario"
    )
    amount: float = Field(
        ..., gt=0, le=10000,
        description="Monto a enviar en la moneda de origen (máximo 10,000)"
    )
    currency: Currency = Field(
        ..., description="Moneda de origen (USD, EUR, GBP)"
    )
    exchange_rate: float = Field(
        ..., gt=0,
        description="Tasa de cambio aplicada"
    )
    payment_method: PaymentMethod = Field(
        ..., description="Método de pago utilizado"
    )
    is_express: bool = Field(
        default=False,
        description="Si es envío exprés (comisión adicional del 2%)"
    )


class RemittanceCreate(RemittanceBase):
    """Schema para crear una nueva remesa"""
    corridor_id: int = Field(
        ..., gt=0,
        description="ID del corredor de remesas (ruta origen-destino)"
    )


class RemittanceUpdate(BaseModel):
    """Schema para actualización parcial de remesa"""
    sender_name: str | None = Field(default=None, min_length=2, max_length=100)
    recipient_name: str | None = Field(default=None, min_length=2, max_length=100)
    amount: float | None = Field(default=None, gt=0, le=10000)
    currency: Currency | None = None
    exchange_rate: float | None = Field(default=None, gt=0)
    payment_method: PaymentMethod | None = None
    corridor_id: int | None = Field(default=None, gt=0)
    status: RemittanceStatus | None = None
    is_express: bool | None = None


class RemittanceResponse(RemittanceBase):
    """Schema de respuesta para remesa"""
    id: int
    reference_code: str
    corridor_id: int
    status: RemittanceStatus
    fee: float
    created_at: datetime
    corridor: CorridorResponse | None = None

    model_config = {"from_attributes": True}


# ============================================
# PAGINATION SCHEMA
# ============================================

class PaginatedResponse(BaseModel):
    """Schema para respuestas paginadas"""
    items: list[dict]
    total: int
    page: int
    per_page: int
    pages: int
    has_next: bool
    has_prev: bool
