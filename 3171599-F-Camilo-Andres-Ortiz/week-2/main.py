"""
Proyecto Semana 02: API de Gestión de Remesas Internacionales
==============================================================

Dominio: Sistema de Remesas Internacionales - Servicios Financieros y Fintech
Aprendiz: Camilo Andres Ortiz - Ficha: 3171599

Aplicación FastAPI principal con endpoints CRUD para gestionar
transacciones de remesas internacionales.

Ejecutar:
    docker compose up --build

Documentación: http://localhost:8000/docs
"""

from fastapi import FastAPI, HTTPException, status, Query
from datetime import datetime

# Importar los schemas de remesas
from schemas import (
    RemittanceCreate,
    RemittanceUpdate,
    RemittanceResponse,
    RemittanceList,
)
from database import remittances_db, get_next_id, find_by_tracking_code

app = FastAPI(
    title="API de Remesas Internacionales",
    description="Sistema de gestión de remesas internacionales - Servicios Financieros y Fintech. Proyecto Semana 02 - Pydantic v2",
    version="1.0.0",
)


# ============================================
# ENDPOINTS
# ============================================

@app.post(
    "/remittances",
    response_model=RemittanceResponse,
    status_code=status.HTTP_201_CREATED,
    tags=["Remittances"],
)
async def create_remittance(remittance: RemittanceCreate) -> RemittanceResponse:
    """
    Crear una nueva remesa internacional.

    - Valida que el tracking_code no exista
    - Normaliza nombres de remitente y destinatario
    - Valida formato de SWIFT/BIC code
    """
    # Verificar tracking_code único
    if find_by_tracking_code(remittance.tracking_code):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Remittance with tracking code {remittance.tracking_code} already exists",
        )

    # Crear remesa
    remittance_id = get_next_id()
    new_remittance = {
        "id": remittance_id,
        **remittance.model_dump(),
        "created_at": datetime.now(),
        "updated_at": None,
    }
    remittances_db[remittance_id] = new_remittance

    return new_remittance


@app.get(
    "/remittances",
    response_model=RemittanceList,
    tags=["Remittances"],
)
async def list_remittances(
    page: int = Query(ge=1, default=1),
    per_page: int = Query(ge=1, le=100, default=10),
    status_filter: str | None = None,
    currency: str | None = None,
) -> RemittanceList:
    """
    Listar remesas con paginación.

    - Soporta filtro por estado (pendiente, en_proceso, completada, cancelada)
    - Soporta filtro por moneda (USD, EUR, COP, MXN, etc.)
    """
    # Filtrar
    remittances = list(remittances_db.values())
    if status_filter:
        remittances = [r for r in remittances if r["status"] == status_filter]
    if currency:
        remittances = [r for r in remittances if r["currency"] == currency.upper()]

    # Paginar
    total = len(remittances)
    start = (page - 1) * per_page
    end = start + per_page
    items = remittances[start:end]

    return RemittanceList(
        items=items,
        total=total,
        page=page,
        per_page=per_page,
    )


@app.get(
    "/remittances/{remittance_id}",
    response_model=RemittanceResponse,
    tags=["Remittances"],
)
async def get_remittance(remittance_id: int) -> RemittanceResponse:
    """Obtener remesa por ID."""
    if remittance_id not in remittances_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Remittance not found",
        )
    return remittances_db[remittance_id]


@app.get(
    "/remittances/by-tracking/{tracking_code}",
    response_model=RemittanceResponse,
    tags=["Remittances"],
)
async def get_remittance_by_tracking(tracking_code: str) -> RemittanceResponse:
    """Buscar remesa por código de seguimiento (tracking code)."""
    remittance = find_by_tracking_code(tracking_code)
    if not remittance:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Remittance not found",
        )
    return remittance


@app.patch(
    "/remittances/{remittance_id}",
    response_model=RemittanceResponse,
    tags=["Remittances"],
)
async def update_remittance(
    remittance_id: int,
    remittance: RemittanceUpdate,
) -> RemittanceResponse:
    """
    Actualizar remesa parcialmente.

    - Solo actualiza campos enviados
    - Valida tracking_code único si se cambia
    """
    if remittance_id not in remittances_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Remittance not found",
        )

    # Obtener solo campos enviados
    update_data = remittance.model_dump(exclude_unset=True)

    if not update_data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No fields to update",
        )

    # Si se actualiza tracking_code, verificar que no exista
    if "tracking_code" in update_data:
        existing = find_by_tracking_code(update_data["tracking_code"])
        if existing and existing["id"] != remittance_id:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Tracking code {update_data['tracking_code']} already in use",
            )

    # Actualizar
    stored = remittances_db[remittance_id]
    for key, value in update_data.items():
        stored[key] = value
    stored["updated_at"] = datetime.now()

    return stored


@app.delete(
    "/remittances/{remittance_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    tags=["Remittances"],
)
async def delete_remittance(remittance_id: int) -> None:
    """Eliminar remesa."""
    if remittance_id not in remittances_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Remittance not found",
        )
    del remittances_db[remittance_id]


@app.post(
    "/remittances/{remittance_id}/complete",
    response_model=RemittanceResponse,
    tags=["Remittances"],
)
async def complete_remittance(remittance_id: int) -> RemittanceResponse:
    """Marcar remesa como completada."""
    if remittance_id not in remittances_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Remittance not found",
        )

    stored = remittances_db[remittance_id]
    if stored["status"] == "cancelada":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot complete a cancelled remittance",
        )
    stored["status"] = "completada"
    stored["updated_at"] = datetime.now()

    return stored


# ============================================
# HEALTH CHECK
# ============================================

@app.get("/", tags=["Health"])
async def root():
    """Health check."""
    return {
        "status": "ok",
        "message": "Remittances API running - Servicios Financieros y Fintech",
        "total_remittances": len(remittances_db),
    }
