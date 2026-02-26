"""
API de Remesas Internacionales - Main
=====================================

Punto de entrada de la aplicación.
Dominio: Sistema de Remesas Internacionales - Servicios Financieros y Fintech.
"""

from fastapi import FastAPI
from routers import corridors, remittances

app = FastAPI(
    title="API de Remesas Internacionales",
    description=(
        "Sistema de gestión de remesas internacionales para servicios "
        "financieros y fintech. Permite gestionar corredores de envío "
        "(rutas entre países), crear y rastrear remesas, aplicar filtrado "
        "avanzado, paginación y ordenamiento."
    ),
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# Incluir routers
app.include_router(corridors.router)
app.include_router(remittances.router)


@app.get("/", tags=["Root"])
async def root():
    """Endpoint raíz de la API de Remesas Internacionales"""
    return {
        "message": "API de Remesas Internacionales",
        "dominio": "Sistema de Remesas Internacionales - Servicios Financieros y Fintech",
        "docs": "/docs",
        "version": "1.0.0",
    }


@app.get("/health", tags=["Root"])
async def health_check():
    """Health check del sistema"""
    return {"status": "healthy", "service": "remittances-api"}
