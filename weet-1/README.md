# 💸 Sistema de Remesas Internacionales

## 📋 Dominio
Sistema de envío de dinero internacional (remesas) para servicios financieros y fintech. Permite a usuarios enviar dinero a familiares y amigos en otros países.

## 🏷️ Entidades Modeladas

### Principales
- **Sender (Remitente)**: Persona que envía dinero, con verificación KYC
- **Recipient (Beneficiario)**: Persona que recibe el dinero
- **Remittance (Remesa)**: Transacción de envío de dinero

### Tipos y Unions
- `Currency`: Monedas soportadas (USD, MXN, GTQ, etc.)
- `TransactionStatus`: Estados de la transacción (pending, processing, completed, failed, cancelled)
- `DeliveryMethod`: Métodos de entrega (bank_transfer, cash_pickup, mobile_wallet, home_delivery)
- `IdentificationType`: Tipos de identificación para KYC

## 🔧 Funciones Implementadas

| Función | Descripción |
|---------|-------------|
| `createSender()` | Crea un nuevo remitente |
| `createRecipient()` | Crea un nuevo beneficiario |
| `createRemittance()` | Crea una nueva transacción de remesa |
| `updateRemittanceStatus()` | Actualiza el estado de una remesa |
| `calculateFee()` | Calcula la comisión según monto y método |
| `listRemittances()` | Lista todas las remesas |
| `filterByStatus()` | Filtra remesas por estado |
| `filterByDeliveryMethod()` | Filtra por método de entrega |
| `findByReferenceCode()` | Busca remesa por código de rastreo |
| `calculateTotalSentBySender()` | Calcula total enviado por un remitente |

## 💡 Decisiones de Diseño

1. **Separación Sender/Recipient**: Aunque ambos extienden `Person`, tienen propiedades específicas para sus roles.

2. **Código de referencia**: Código corto de 8 caracteres para que el beneficiario rastree su remesa fácilmente.

3. **Comisiones dinámicas**: La comisión se calcula según el monto y el método de entrega (efectivo cuesta más que wallet móvil).

4. **Control de límites**: Se implementó función para calcular total enviado por remitente (cumplimiento regulatorio).

5. **Tipos estrictos**: Uso de type literals para monedas, estados y métodos previene errores.

## ▶️ Ejecución

```bash
cd FU/weet-1
pnpm install
pnpm start
```

## ✅ Checklist

- [x] Definí interfaces y types para entidades
- [x] Implementé funciones con tipos explícitos
- [x] Usé type unions y literales (Currency, TransactionStatus, DeliveryMethod)
- [x] Comenté el código con qué/para/impacto
- [x] Probé el código y funciona correctamente
