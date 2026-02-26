"""
Router de Remesas (Entidad principal)
=====================================

CRUD completo con filtrado avanzado, paginación, ordenamiento,
búsqueda full-text y estadísticas por corredor.
"""

from fastapi import APIRouter, Path, HTTPException, status
from datetime import datetime

from database import (
    remittances_db,
    corridors_db,
    get_next_remittance_id,
)
from schemas import (
    RemittanceCreate,
    RemittanceUpdate,
    RemittanceResponse,
    PaginatedResponse,
    SortOrder,
)
from dependencies import PaginationDep, RemittanceFiltersDep, SortingDep

router = APIRouter(
    prefix="/remittances",
    tags=["Remittances (Remesas)"],
    responses={404: {"description": "Remesa no encontrada"}},
)


# ============================================
# FUNCIONES AUXILIARES
# ============================================

def _calculate_fee(amount: float, corridor_id: int, is_express: bool) -> float:
    """
    Calcula la comisión de la remesa.

    - Comisión base: porcentaje del corredor sobre el monto.
    - Si es exprés: se agrega un 2% adicional.
    """
    corridor = corridors_db[corridor_id]
    fee_percentage = corridor["base_fee_percentage"]
    if is_express:
        fee_percentage += 2.0
    return round(amount * fee_percentage / 100, 2)


def _generate_reference_code(remittance_id: int) -> str:
    """Genera código de referencia único: REM-YYYYMMDD-XXX"""
    now = datetime.now()
    return f"REM-{now.strftime('%Y%m%d')}-{str(remittance_id).zfill(3)}"


def _enrich_with_corridor(remittance: dict) -> dict:
    """Agrega datos del corredor a la remesa."""
    enriched = remittance.copy()
    corridor_id = remittance.get("corridor_id")
    enriched["corridor"] = corridors_db.get(corridor_id)
    return enriched


def _apply_filters(items: list[dict], filters: RemittanceFiltersDep) -> list[dict]:
    """Aplica todos los filtros a la lista de remesas."""
    result = items

    # 1. Búsqueda en sender_name, recipient_name, reference_code
    if filters.search:
        search_lower = filters.search.lower()
        result = [
            r for r in result
            if search_lower in r["sender_name"].lower()
            or search_lower in r["recipient_name"].lower()
            or search_lower in r["reference_code"].lower()
        ]

    # 2. Filtro por corredor
    if filters.corridor_id is not None:
        result = [r for r in result if r["corridor_id"] == filters.corridor_id]

    # 3. Monto mínimo
    if filters.min_amount is not None:
        result = [r for r in result if r["amount"] >= filters.min_amount]

    # 4. Monto máximo
    if filters.max_amount is not None:
        result = [r for r in result if r["amount"] <= filters.max_amount]

    # 5. Estado de la remesa
    if filters.status is not None:
        result = [r for r in result if r["status"] == filters.status.value]

    # 6. Moneda
    if filters.currency is not None:
        result = [r for r in result if r["currency"] == filters.currency.value]

    # 7. Método de pago
    if filters.payment_method is not None:
        result = [
            r for r in result
            if r["payment_method"] == filters.payment_method.value
        ]

    # 8. Envío exprés
    if filters.is_express is not None:
        result = [r for r in result if r["is_express"] == filters.is_express]

    return result


# ============================================
# GET /remittances/search - Búsqueda full-text
# ============================================

@router.get("/search")
async def search_remittances(
    q: str,
    page: int = 1,
    per_page: int = 10,
):
    """
    Búsqueda full-text en remesas.

    Busca en: nombre del remitente, nombre del beneficiario,
    código de referencia y país del corredor.
    """
    if len(q) < 2:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El término de búsqueda debe tener al menos 2 caracteres",
        )

    query_lower = q.lower()
    results = []

    for remittance in remittances_db.values():
        # Buscar en campos de la remesa
        match = (
            query_lower in remittance["sender_name"].lower()
            or query_lower in remittance["recipient_name"].lower()
            or query_lower in remittance["reference_code"].lower()
        )

        # Buscar también en el corredor asociado
        if not match:
            corridor = corridors_db.get(remittance["corridor_id"], {})
            match = (
                query_lower in corridor.get("origin_country", "").lower()
                or query_lower in corridor.get("destination_country", "").lower()
                or query_lower in corridor.get("code", "").lower()
            )

        if match:
            results.append(_enrich_with_corridor(remittance))

    # Paginar
    total = len(results)
    pages = (total + per_page - 1) // per_page if total > 0 else 1
    start = (page - 1) * per_page
    items = results[start : start + per_page]

    return {
        "query": q,
        "items": items,
        "total": total,
        "page": page,
        "per_page": per_page,
        "pages": pages,
        "has_next": page < pages,
        "has_prev": page > 1,
    }


# ============================================
# GET /remittances/stats - Estadísticas
# ============================================

@router.get("/stats")
async def get_remittance_stats():
    """
    Estadísticas de remesas agrupadas por corredor.

    Retorna: total de remesas, monto total, monto promedio,
    comisiones totales y conteo por estado para cada corredor.
    """
    stats_by_corridor = {}

    for corridor in corridors_db.values():
        cid = corridor["id"]
        corridor_remittances = [
            r for r in remittances_db.values() if r["corridor_id"] == cid
        ]

        amounts = [r["amount"] for r in corridor_remittances]
        fees = [r["fee"] for r in corridor_remittances]

        # Conteo por estado
        status_count = {}
        for r in corridor_remittances:
            st = r["status"]
            status_count[st] = status_count.get(st, 0) + 1

        stats_by_corridor[corridor["code"]] = {
            "corridor_name": corridor["name"],
            "corridor_id": cid,
            "is_active": corridor["is_active"],
            "total_remittances": len(corridor_remittances),
            "total_amount": round(sum(amounts), 2) if amounts else 0,
            "average_amount": round(sum(amounts) / len(amounts), 2) if amounts else 0,
            "total_fees": round(sum(fees), 2) if fees else 0,
            "by_status": status_count,
        }

    # Totales generales
    all_remittances = list(remittances_db.values())
    all_amounts = [r["amount"] for r in all_remittances]
    all_fees = [r["fee"] for r in all_remittances]

    return {
        "summary": {
            "total_remittances": len(all_remittances),
            "total_amount": round(sum(all_amounts), 2) if all_amounts else 0,
            "average_amount": round(sum(all_amounts) / len(all_amounts), 2) if all_amounts else 0,
            "total_fees_collected": round(sum(all_fees), 2) if all_fees else 0,
            "active_corridors": sum(1 for c in corridors_db.values() if c["is_active"]),
        },
        "by_corridor": stats_by_corridor,
    }


# ============================================
# GET /remittances - Listar con filtros
# ============================================

@router.get("/", response_model=PaginatedResponse)
async def list_remittances(
    pagination: PaginationDep,
    filters: RemittanceFiltersDep,
    sorting: SortingDep,
):
    """
    Listar remesas con filtrado avanzado, paginación y ordenamiento.

    **Filtros disponibles:**
    - `search`: busca en remitente, beneficiario y código de referencia
    - `corridor_id`: filtra por corredor (ruta de envío)
    - `min_amount` / `max_amount`: rango de montos
    - `status`: estado de la remesa (pending, processing, completed, cancelled, failed)
    - `currency`: moneda de origen (USD, EUR, GBP)
    - `payment_method`: método de pago (bank_transfer, cash, mobile_wallet, debit_card)
    - `is_express`: envío exprés (true/false)

    **Ordenamiento:** por amount, fee, created_at o sender_name (asc/desc)
    """
    # Obtener todas las remesas
    result = list(remittances_db.values())

    # Aplicar filtros
    result = _apply_filters(result, filters)

    # Ordenar
    sort_field = sorting.sort_by.value
    reverse = sorting.order == SortOrder.desc
    result.sort(key=lambda x: x.get(sort_field, ""), reverse=reverse)

    # Paginar
    total = len(result)
    pages = (total + pagination.per_page - 1) // pagination.per_page if total > 0 else 1
    start = pagination.offset
    end = start + pagination.per_page
    items = result[start:end]

    # Enriquecer con datos del corredor
    items = [_enrich_with_corridor(item) for item in items]

    return PaginatedResponse(
        items=items,
        total=total,
        page=pagination.page,
        per_page=pagination.per_page,
        pages=pages,
        has_next=pagination.page < pages,
        has_prev=pagination.page > 1,
    )


# ============================================
# GET /remittances/{id} - Obtener una remesa
# ============================================

@router.get("/{remittance_id}")
async def get_remittance(
    remittance_id: int = Path(
        ..., gt=0,
        title="Remittance ID",
        description="Identificador único de la remesa",
        examples=[1, 2, 3],
    ),
):
    """
    Obtener una remesa por su ID.

    Incluye datos completos del corredor asociado.
    """
    if remittance_id not in remittances_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Remesa con ID {remittance_id} no encontrada",
        )

    return _enrich_with_corridor(remittances_db[remittance_id])


# ============================================
# POST /remittances - Crear remesa
# ============================================

@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_remittance(remittance: RemittanceCreate):
    """
    Crear una nueva remesa internacional.

    - Verifica que el corredor exista y esté activo.
    - Calcula automáticamente la comisión (fee).
    - Genera el código de referencia único.
    - Estado inicial: 'pending'.
    """
    # Verificar que el corredor existe
    if remittance.corridor_id not in corridors_db:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Corredor con ID {remittance.corridor_id} no encontrado",
        )

    # Verificar que el corredor esté activo
    corridor = corridors_db[remittance.corridor_id]
    if not corridor["is_active"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"El corredor '{corridor['name']}' no está activo actualmente",
        )

    new_id = get_next_remittance_id()

    # Calcular comisión
    fee = _calculate_fee(
        amount=remittance.amount,
        corridor_id=remittance.corridor_id,
        is_express=remittance.is_express,
    )

    remittance_dict = remittance.model_dump()
    remittance_dict["id"] = new_id
    remittance_dict["reference_code"] = _generate_reference_code(new_id)
    remittance_dict["fee"] = fee
    remittance_dict["status"] = "pending"
    remittance_dict["created_at"] = datetime.now()

    # Convertir enums a sus valores string
    remittance_dict["currency"] = remittance.currency.value
    remittance_dict["payment_method"] = remittance.payment_method.value

    remittances_db[new_id] = remittance_dict

    return _enrich_with_corridor(remittance_dict)


# ============================================
# PUT /remittances/{id} - Reemplazar completo
# ============================================

@router.put("/{remittance_id}")
async def replace_remittance(
    remittance_id: int = Path(..., gt=0),
    remittance: RemittanceCreate = ...,
):
    """
    Reemplazar una remesa completamente.

    Recalcula la comisión con los nuevos datos.
    """
    if remittance_id not in remittances_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Remesa con ID {remittance_id} no encontrada",
        )

    # Verificar corredor
    if remittance.corridor_id not in corridors_db:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Corredor con ID {remittance.corridor_id} no encontrado",
        )

    corridor = corridors_db[remittance.corridor_id]
    if not corridor["is_active"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"El corredor '{corridor['name']}' no está activo actualmente",
        )

    # Recalcular comisión
    fee = _calculate_fee(
        amount=remittance.amount,
        corridor_id=remittance.corridor_id,
        is_express=remittance.is_express,
    )

    existing = remittances_db[remittance_id]
    remittance_dict = remittance.model_dump()
    remittance_dict["id"] = remittance_id
    remittance_dict["reference_code"] = existing["reference_code"]
    remittance_dict["fee"] = fee
    remittance_dict["status"] = existing["status"]
    remittance_dict["created_at"] = existing["created_at"]
    remittance_dict["currency"] = remittance.currency.value
    remittance_dict["payment_method"] = remittance.payment_method.value

    remittances_db[remittance_id] = remittance_dict

    return _enrich_with_corridor(remittance_dict)


# ============================================
# PATCH /remittances/{id} - Actualización parcial
# ============================================

@router.patch("/{remittance_id}")
async def update_remittance(
    remittance_id: int = Path(..., gt=0),
    remittance: RemittanceUpdate = ...,
):
    """
    Actualizar parcialmente una remesa.

    Solo se actualizan los campos proporcionados.
    Si se cambia el monto, corredor o is_express, se recalcula la comisión.
    """
    if remittance_id not in remittances_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Remesa con ID {remittance_id} no encontrada",
        )

    update_data = remittance.model_dump(exclude_unset=True)

    # Si se cambia el corredor, verificar que exista y esté activo
    if "corridor_id" in update_data:
        if update_data["corridor_id"] not in corridors_db:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Corredor con ID {update_data['corridor_id']} no encontrado",
            )
        corridor = corridors_db[update_data["corridor_id"]]
        if not corridor["is_active"]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"El corredor '{corridor['name']}' no está activo",
            )

    # Convertir enums a valores string
    if "currency" in update_data and update_data["currency"] is not None:
        update_data["currency"] = update_data["currency"].value
    if "payment_method" in update_data and update_data["payment_method"] is not None:
        update_data["payment_method"] = update_data["payment_method"].value
    if "status" in update_data and update_data["status"] is not None:
        update_data["status"] = update_data["status"].value

    # Aplicar cambios
    remittances_db[remittance_id].update(update_data)

    # Recalcular comisión si cambió amount, corridor_id o is_express
    if any(k in update_data for k in ("amount", "corridor_id", "is_express")):
        current = remittances_db[remittance_id]
        remittances_db[remittance_id]["fee"] = _calculate_fee(
            amount=current["amount"],
            corridor_id=current["corridor_id"],
            is_express=current["is_express"],
        )

    return _enrich_with_corridor(remittances_db[remittance_id])


# ============================================
# DELETE /remittances/{id} - Eliminar
# ============================================

@router.delete("/{remittance_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_remittance(
    remittance_id: int = Path(..., gt=0),
):
    """
    Eliminar una remesa.

    Solo se pueden eliminar remesas en estado 'pending' o 'cancelled'.
    """
    if remittance_id not in remittances_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Remesa con ID {remittance_id} no encontrada",
        )

    remittance = remittances_db[remittance_id]
    if remittance["status"] not in ("pending", "cancelled"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                f"Solo se pueden eliminar remesas en estado 'pending' o 'cancelled'. "
                f"Estado actual: '{remittance['status']}'"
            ),
        )

    del remittances_db[remittance_id]
    return None
