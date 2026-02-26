"""
Router de Corredores de Remesas (Categorías)
============================================

CRUD completo para corredores de envío (rutas entre países).
Incluye endpoint para listar remesas de un corredor específico.
"""

from fastapi import APIRouter, Path, Query, HTTPException, status
from datetime import datetime

from database import corridors_db, remittances_db, get_next_corridor_id
from schemas import CorridorCreate, CorridorUpdate, CorridorResponse

router = APIRouter(
    prefix="/corridors",
    tags=["Corridors (Corredores de Remesas)"],
    responses={404: {"description": "Corredor no encontrado"}},
)


# ============================================
# GET /corridors - Listar todos los corredores
# ============================================

@router.get("/", response_model=list[CorridorResponse])
async def list_corridors(
    is_active: bool | None = Query(
        default=None,
        description="Filtrar por corredores activos/inactivos"
    ),
):
    """
    Listar todos los corredores de remesas.

    Opcionalmente filtra por estado activo/inactivo.
    """
    result = list(corridors_db.values())

    if is_active is not None:
        result = [c for c in result if c["is_active"] == is_active]

    return result


# ============================================
# GET /corridors/{id} - Obtener un corredor
# ============================================

@router.get("/{corridor_id}", response_model=CorridorResponse)
async def get_corridor(
    corridor_id: int = Path(
        ..., gt=0,
        title="Corridor ID",
        description="Identificador único del corredor de remesas",
        examples=[1, 2, 3],
    ),
):
    """Obtener un corredor de remesas por su ID."""
    if corridor_id not in corridors_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Corredor con ID {corridor_id} no encontrado",
        )
    return corridors_db[corridor_id]


# ============================================
# POST /corridors - Crear corredor
# ============================================

@router.post("/", response_model=CorridorResponse, status_code=status.HTTP_201_CREATED)
async def create_corridor(corridor: CorridorCreate):
    """
    Crear un nuevo corredor de remesas.

    El corredor define una ruta de envío entre dos países
    con su comisión base asociada.
    """
    # Verificar que no exista un corredor con el mismo código
    for existing in corridors_db.values():
        if existing["code"] == corridor.code:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Ya existe un corredor con el código '{corridor.code}'",
            )

    new_id = get_next_corridor_id()
    corridor_dict = corridor.model_dump()
    corridor_dict["id"] = new_id
    corridor_dict["created_at"] = datetime.now()

    corridors_db[new_id] = corridor_dict
    return corridor_dict


# ============================================
# PUT /corridors/{id} - Actualizar completo
# ============================================

@router.put("/{corridor_id}", response_model=CorridorResponse)
async def replace_corridor(
    corridor_id: int = Path(..., gt=0),
    corridor: CorridorCreate = ...,
):
    """Reemplazar un corredor de remesas completamente."""
    if corridor_id not in corridors_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Corredor con ID {corridor_id} no encontrado",
        )

    # Verificar código duplicado (excluyendo el actual)
    for cid, existing in corridors_db.items():
        if cid != corridor_id and existing["code"] == corridor.code:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Ya existe otro corredor con el código '{corridor.code}'",
            )

    corridor_dict = corridor.model_dump()
    corridor_dict["id"] = corridor_id
    corridor_dict["created_at"] = corridors_db[corridor_id]["created_at"]

    corridors_db[corridor_id] = corridor_dict
    return corridor_dict


# ============================================
# PATCH /corridors/{id} - Actualización parcial
# ============================================

@router.patch("/{corridor_id}", response_model=CorridorResponse)
async def update_corridor(
    corridor_id: int = Path(..., gt=0),
    corridor: CorridorUpdate = ...,
):
    """Actualizar parcialmente un corredor de remesas."""
    if corridor_id not in corridors_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Corredor con ID {corridor_id} no encontrado",
        )

    update_data = corridor.model_dump(exclude_unset=True)

    # Verificar código duplicado si se está cambiando
    if "code" in update_data:
        for cid, existing in corridors_db.items():
            if cid != corridor_id and existing["code"] == update_data["code"]:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Ya existe otro corredor con el código '{update_data['code']}'",
                )

    corridors_db[corridor_id].update(update_data)
    return corridors_db[corridor_id]


# ============================================
# DELETE /corridors/{id} - Eliminar
# ============================================

@router.delete("/{corridor_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_corridor(
    corridor_id: int = Path(..., gt=0),
):
    """
    Eliminar un corredor de remesas.

    No se permite eliminar si tiene remesas asociadas.
    """
    if corridor_id not in corridors_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Corredor con ID {corridor_id} no encontrado",
        )

    # Verificar que no tenga remesas asociadas
    has_remittances = any(
        r["corridor_id"] == corridor_id for r in remittances_db.values()
    )
    if has_remittances:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No se puede eliminar un corredor con remesas asociadas",
        )

    del corridors_db[corridor_id]
    return None


# ============================================
# GET /corridors/{id}/remittances - Remesas de un corredor
# ============================================

@router.get("/{corridor_id}/remittances")
async def get_corridor_remittances(
    corridor_id: int = Path(..., gt=0, description="ID del corredor"),
    page: int = Query(default=1, ge=1, description="Número de página"),
    per_page: int = Query(default=10, ge=1, le=50, description="Elementos por página"),
):
    """
    Listar todas las remesas asociadas a un corredor específico.

    Incluye paginación.
    """
    if corridor_id not in corridors_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Corredor con ID {corridor_id} no encontrado",
        )

    # Filtrar remesas del corredor
    corridor_remittances = [
        r for r in remittances_db.values()
        if r["corridor_id"] == corridor_id
    ]

    # Paginar
    total = len(corridor_remittances)
    pages = (total + per_page - 1) // per_page if total > 0 else 1
    start = (page - 1) * per_page
    end = start + per_page
    items = corridor_remittances[start:end]

    return {
        "corridor": corridors_db[corridor_id],
        "items": items,
        "total": total,
        "page": page,
        "per_page": per_page,
        "pages": pages,
        "has_next": page < pages,
        "has_prev": page > 1,
    }
