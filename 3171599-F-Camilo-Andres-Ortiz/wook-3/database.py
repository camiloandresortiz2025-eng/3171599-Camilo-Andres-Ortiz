"""
Base de Datos Simulada - Sistema de Remesas Internacionales
===========================================================

Datos en memoria para el sistema de remesas.
Incluye corredores (rutas de envío) y remesas (transferencias).
"""

from datetime import datetime


# ============================================
# CORREDORES DE REMESAS (Categorías)
# ============================================

corridors_db: dict[int, dict] = {
    1: {
        "id": 1,
        "name": "Estados Unidos a México",
        "code": "US-MX",
        "origin_country": "Estados Unidos",
        "destination_country": "México",
        "base_fee_percentage": 3.5,
        "is_active": True,
        "created_at": datetime(2024, 1, 1, 10, 0, 0),
    },
    2: {
        "id": 2,
        "name": "Estados Unidos a Colombia",
        "code": "US-CO",
        "origin_country": "Estados Unidos",
        "destination_country": "Colombia",
        "base_fee_percentage": 4.0,
        "is_active": True,
        "created_at": datetime(2024, 1, 1, 10, 0, 0),
    },
    3: {
        "id": 3,
        "name": "Estados Unidos a Guatemala",
        "code": "US-GT",
        "origin_country": "Estados Unidos",
        "destination_country": "Guatemala",
        "base_fee_percentage": 4.5,
        "is_active": True,
        "created_at": datetime(2024, 1, 15, 8, 0, 0),
    },
    4: {
        "id": 4,
        "name": "España a Ecuador",
        "code": "ES-EC",
        "origin_country": "España",
        "destination_country": "Ecuador",
        "base_fee_percentage": 3.8,
        "is_active": True,
        "created_at": datetime(2024, 2, 1, 9, 0, 0),
    },
    5: {
        "id": 5,
        "name": "Reino Unido a India",
        "code": "UK-IN",
        "origin_country": "Reino Unido",
        "destination_country": "India",
        "base_fee_percentage": 2.5,
        "is_active": False,
        "created_at": datetime(2024, 2, 15, 11, 0, 0),
    },
}

next_corridor_id = 6


# ============================================
# REMESAS (Entidad principal)
# ============================================

remittances_db: dict[int, dict] = {
    1: {
        "id": 1,
        "reference_code": "REM-20240115-001",
        "sender_name": "Carlos García",
        "recipient_name": "María García López",
        "corridor_id": 1,
        "amount": 500.00,
        "currency": "USD",
        "exchange_rate": 17.45,
        "fee": 17.50,
        "payment_method": "bank_transfer",
        "status": "completed",
        "is_express": False,
        "created_at": datetime(2024, 1, 15, 9, 0, 0),
    },
    2: {
        "id": 2,
        "reference_code": "REM-20240120-002",
        "sender_name": "Juan Pérez",
        "recipient_name": "Ana Pérez Muñoz",
        "corridor_id": 2,
        "amount": 1200.00,
        "currency": "USD",
        "exchange_rate": 4185.50,
        "fee": 48.00,
        "payment_method": "debit_card",
        "status": "completed",
        "is_express": False,
        "created_at": datetime(2024, 1, 20, 14, 0, 0),
    },
    3: {
        "id": 3,
        "reference_code": "REM-20240201-003",
        "sender_name": "Miguel Torres",
        "recipient_name": "Pedro Torres Ruiz",
        "corridor_id": 3,
        "amount": 300.00,
        "currency": "USD",
        "exchange_rate": 7.82,
        "fee": 19.50,
        "payment_method": "cash",
        "status": "processing",
        "is_express": True,
        "created_at": datetime(2024, 2, 1, 10, 0, 0),
    },
    4: {
        "id": 4,
        "reference_code": "REM-20240210-004",
        "sender_name": "Roberto Sánchez",
        "recipient_name": "Lucía Sánchez Vega",
        "corridor_id": 4,
        "amount": 800.00,
        "currency": "EUR",
        "exchange_rate": 1.08,
        "fee": 30.40,
        "payment_method": "bank_transfer",
        "status": "pending",
        "is_express": False,
        "created_at": datetime(2024, 2, 10, 8, 30, 0),
    },
    5: {
        "id": 5,
        "reference_code": "REM-20240215-005",
        "sender_name": "Laura Martínez",
        "recipient_name": "Carmen Díaz Martínez",
        "corridor_id": 1,
        "amount": 2000.00,
        "currency": "USD",
        "exchange_rate": 17.52,
        "fee": 110.00,
        "payment_method": "mobile_wallet",
        "status": "completed",
        "is_express": True,
        "created_at": datetime(2024, 2, 15, 11, 0, 0),
    },
    6: {
        "id": 6,
        "reference_code": "REM-20240301-006",
        "sender_name": "Andrés López",
        "recipient_name": "Felipe López Herrera",
        "corridor_id": 2,
        "amount": 150.00,
        "currency": "USD",
        "exchange_rate": 4192.30,
        "fee": 6.00,
        "payment_method": "cash",
        "status": "failed",
        "is_express": False,
        "created_at": datetime(2024, 3, 1, 16, 0, 0),
    },
    7: {
        "id": 7,
        "reference_code": "REM-20240305-007",
        "sender_name": "Diana Ramírez",
        "recipient_name": "Jorge Ramírez Solano",
        "corridor_id": 1,
        "amount": 750.00,
        "currency": "USD",
        "exchange_rate": 17.48,
        "fee": 26.25,
        "payment_method": "debit_card",
        "status": "pending",
        "is_express": False,
        "created_at": datetime(2024, 3, 5, 9, 0, 0),
    },
    8: {
        "id": 8,
        "reference_code": "REM-20240310-008",
        "sender_name": "Patricia Flores",
        "recipient_name": "Rosa Flores Morales",
        "corridor_id": 3,
        "amount": 450.00,
        "currency": "USD",
        "exchange_rate": 7.85,
        "fee": 20.25,
        "payment_method": "bank_transfer",
        "status": "cancelled",
        "is_express": False,
        "created_at": datetime(2024, 3, 10, 10, 0, 0),
    },
}

next_remittance_id = 9


# ============================================
# HELPER FUNCTIONS
# ============================================

def get_next_corridor_id() -> int:
    """Obtener y auto-incrementar ID de corredor"""
    global next_corridor_id
    current = next_corridor_id
    next_corridor_id += 1
    return current


def get_next_remittance_id() -> int:
    """Obtener y auto-incrementar ID de remesa"""
    global next_remittance_id
    current = next_remittance_id
    next_remittance_id += 1
    return current
