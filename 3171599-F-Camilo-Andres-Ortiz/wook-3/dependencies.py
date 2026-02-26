"""
Dependencias Reutilizables - Sistema de Remesas Internacionales
===============================================================

Dependencias para paginación, filtros y ordenamiento
aplicados al dominio de remesas financieras.
"""

from fastapi import Query, Depends
from typing import Annotated
from schemas import (
    SortOrder,
    RemittanceSortField,
    RemittanceStatus,
    PaymentMethod,
    Currency,
)


# ============================================
# PAGINACIÓN
# ============================================

class PaginationParams:
    """
    Dependencia reutilizable para paginación.

    Calcula automáticamente el offset a partir de page y per_page.
    """

    def __init__(
        self,
        page: int = Query(
            default=1, ge=1,
            description="Número de página"
        ),
        per_page: int = Query(
            default=10, ge=1, le=50,
            description="Elementos por página (1-50)"
        ),
    ):
        self.page = page
        self.per_page = per_page
        self.offset = (page - 1) * per_page


PaginationDep = Annotated[PaginationParams, Depends()]


# ============================================
# FILTROS DE REMESAS
# ============================================

class RemittanceFilters:
    """
    Dependencia con los filtros específicos del dominio de remesas.

    Filtros disponibles (8 filtros):
    1. search        → busca en sender_name, recipient_name y reference_code
    2. corridor_id   → filtra por corredor (ruta de envío)
    3. min_amount    → monto mínimo de la remesa
    4. max_amount    → monto máximo de la remesa
    5. status        → estado de la remesa (pending, processing, completed, etc.)
    6. currency      → moneda de origen (USD, EUR, GBP)
    7. payment_method→ método de pago (bank_transfer, cash, mobile_wallet, debit_card)
    8. is_express    → si es envío exprés o estándar
    """

    def __init__(
        self,
        search: str | None = Query(
            default=None, min_length=2,
            description="Buscar en nombre del remitente, beneficiario o código de referencia"
        ),
        corridor_id: int | None = Query(
            default=None, gt=0,
            description="Filtrar por ID del corredor de remesas"
        ),
        min_amount: float | None = Query(
            default=None, ge=0,
            description="Monto mínimo de la remesa"
        ),
        max_amount: float | None = Query(
            default=None, ge=0,
            description="Monto máximo de la remesa"
        ),
        status: RemittanceStatus | None = Query(
            default=None,
            description="Filtrar por estado de la remesa"
        ),
        currency: Currency | None = Query(
            default=None,
            description="Filtrar por moneda de origen"
        ),
        payment_method: PaymentMethod | None = Query(
            default=None,
            description="Filtrar por método de pago"
        ),
        is_express: bool | None = Query(
            default=None,
            description="Filtrar por tipo de envío (exprés o estándar)"
        ),
    ):
        self.search = search
        self.corridor_id = corridor_id
        self.min_amount = min_amount
        self.max_amount = max_amount
        self.status = status
        self.currency = currency
        self.payment_method = payment_method
        self.is_express = is_express


RemittanceFiltersDep = Annotated[RemittanceFilters, Depends()]


# ============================================
# ORDENAMIENTO
# ============================================

class SortingParams:
    """
    Dependencia para ordenamiento de resultados.

    Campos disponibles: amount, fee, created_at, sender_name.
    """

    def __init__(
        self,
        sort_by: RemittanceSortField = Query(
            default=RemittanceSortField.created_at,
            description="Campo por el cual ordenar"
        ),
        order: SortOrder = Query(
            default=SortOrder.desc,
            description="Orden ascendente o descendente"
        ),
    ):
        self.sort_by = sort_by
        self.order = order


SortingDep = Annotated[SortingParams, Depends()]
