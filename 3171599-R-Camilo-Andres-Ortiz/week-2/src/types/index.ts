// ============================================
// TYPES: INTERFACES Y TIPOS
// ============================================
// Dominio: Sistema de Remesas Internacionales - Servicios Financieros y Fintech
// Aprendiz: Camilo Andres Ortiz - Ficha: 3171599

/**
 * QUÉ: Tipo que define las monedas disponibles para enviar remesas.
 * PARA QUÉ: Restringir los valores posibles de moneda, evitando errores de escritura
 *            y garantizando que solo se usen monedas soportadas por la plataforma.
 * IMPACTO: Se usa en la interface Remittance y en el formulario de selección de moneda.
 */
export type Currency = 'USD' | 'EUR' | 'COP' | 'MXN' | 'BRL' | 'PEN';

/**
 * QUÉ: Tipo que define los estados posibles de una remesa internacional.
 * PARA QUÉ: Controlar el flujo de vida de cada transacción de remesa,
 *            desde su creación hasta su finalización o cancelación.
 * IMPACTO: Se usa para mostrar badges visuales de estado y filtrar remesas.
 */
export type RemittanceStatus = 'pendiente' | 'en-proceso' | 'completada' | 'cancelada';

/**
 * QUÉ: Interface principal que define la estructura de una Remesa Internacional.
 * PARA QUÉ: Tipar correctamente cada transacción de remesa con todas sus propiedades,
 *            incluyendo remitente, destinatario, montos y estado.
 * IMPACTO: Se usa en todos los componentes para garantizar consistencia de datos
 *          en toda la aplicación CRUD de remesas.
 */
export interface Remittance {
  id: number;
  senderName: string;
  receiverName: string;
  amount: number;
  currency: Currency;
  destinationCountry: string;
  status: RemittanceStatus;
  date: string;
}

/**
 * QUÉ: Interface para los datos del formulario de remesas (sin el id).
 * PARA QUÉ: El id se genera automáticamente al crear una remesa, por lo que
 *            no debe incluirse en los datos ingresados por el usuario.
 * IMPACTO: Se usa en el componente RemittanceForm para el estado del formulario
 *          y en las funciones onAdd del componente App.
 */
export interface RemittanceFormData {
  senderName: string;
  receiverName: string;
  amount: number;
  currency: Currency;
  destinationCountry: string;
  status: RemittanceStatus;
  date: string;
}
