"""
Simulación de Base de Datos - Remesas Internacionales
======================================================

Dominio: Sistema de Remesas Internacionales - Servicios Financieros y Fintech
Aprendiz: Camilo Andres Ortiz - Ficha: 3171599

Base de datos en memoria para el proyecto de remesas.
"""

# "Base de datos" en memoria para remesas internacionales
remittances_db: dict[int, dict] = {}

# Contador para IDs auto-incrementales
_id_counter = 0


def get_next_id() -> int:
    """
    QUÉ: Genera el siguiente ID disponible.
    PARA QUÉ: Asignar IDs únicos auto-incrementales a cada remesa.
    IMPACTO: Garantiza que cada remesa tenga un identificador único.
    """
    global _id_counter
    _id_counter += 1
    return _id_counter


def find_by_tracking_code(tracking_code: str) -> dict | None:
    """
    QUÉ: Busca una remesa por su código de seguimiento (tracking code).
    PARA QUÉ: Verificar unicidad del tracking code y permitir búsqueda
              por campo único alternativo al ID.
    IMPACTO: Permite a los usuarios rastrear remesas usando el código
             de seguimiento sin necesitar el ID interno.
    """
    tracking_upper = tracking_code.upper()
    for remittance in remittances_db.values():
        if remittance["tracking_code"].upper() == tracking_upper:
            return remittance
    return None


def reset_db() -> None:
    """
    QUÉ: Resetea la base de datos en memoria.
    PARA QUÉ: Limpiar datos entre tests o reiniciar la aplicación.
    IMPACTO: Útil para tests unitarios y de integración.
    """
    global _id_counter
    remittances_db.clear()
    _id_counter = 0
