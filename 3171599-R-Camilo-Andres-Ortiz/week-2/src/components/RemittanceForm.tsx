import { useState, useEffect } from 'react';
import { Remittance, RemittanceFormData, Currency, RemittanceStatus } from '../types';

/**
 * QUÉ: Interface que define las props del componente RemittanceForm.
 * PARA QUÉ: Tipar correctamente las funciones y datos que recibe el formulario
 *            desde el componente padre (App).
 * IMPACTO: Garantiza que el formulario reciba las funciones CRUD correctas.
 */
interface RemittanceFormProps {
  onAdd: (remittance: Omit<Remittance, 'id'>) => void;
  onUpdate: (id: number, updates: Partial<Remittance>) => void;
  editingItem?: Remittance;
  onCancelEdit: () => void;
}

/**
 * QUÉ: Componente de formulario para agregar o editar remesas internacionales.
 * PARA QUÉ: Permite al usuario ingresar los datos de una nueva remesa (remitente,
 *            destinatario, monto, moneda, país destino, estado, fecha) o modificar
 *            una remesa existente.
 * IMPACTO: Es la interfaz principal de entrada de datos. Se adapta automáticamente
 *          entre modo "agregar" y modo "editar" según si hay una remesa seleccionada.
 */
const RemittanceForm: React.FC<RemittanceFormProps> = ({
  onAdd,
  onUpdate,
  editingItem,
  onCancelEdit,
}) => {
  // ============================================
  // ESTADO DEL FORMULARIO
  // ============================================

  // Estado inicial con los campos necesarios para una remesa internacional
  const initialState: RemittanceFormData = {
    senderName: '',
    receiverName: '',
    amount: 0,
    currency: 'USD',
    destinationCountry: '',
    status: 'pendiente',
    date: new Date().toISOString().split('T')[0] ?? '',
  };

  const [formData, setFormData] = useState<RemittanceFormData>(initialState);

  // ============================================
  // EFECTO: PRE-LLENAR FORMULARIO AL EDITAR
  // ============================================

  /**
   * QUÉ: useEffect que detecta cuando se selecciona una remesa para editar.
   * PARA QUÉ: Pre-llena el formulario con los datos actuales de la remesa,
   *            o lo limpia si se cancela la edición.
   * IMPACTO: Permite al usuario ver los datos actuales antes de modificarlos.
   */
  useEffect(() => {
    if (editingItem) {
      // Pre-llenar formulario con datos de la remesa a editar (sin id)
      const { id: _id, ...rest } = editingItem;
      setFormData(rest);
    } else {
      // Si no hay elemento editando, limpiar formulario
      setFormData(initialState);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editingItem]);

  // ============================================
  // HANDLERS
  // ============================================

  /**
   * QUÉ: Maneja cambios en inputs de texto y número.
   * PARA QUÉ: Actualiza el estado del formulario de forma reactiva con cada tecla.
   * IMPACTO: Mantiene el formulario como "controlado" (React controla el valor).
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  /**
   * QUÉ: Maneja cambios en campos select (moneda, estado).
   * PARA QUÉ: Actualiza la selección de moneda o estado de la remesa.
   * IMPACTO: Permite seleccionar valores de listas predefinidas (Currency, RemittanceStatus).
   */
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  /**
   * QUÉ: Valida los datos del formulario antes de enviar.
   * PARA QUÉ: Asegura que todos los campos requeridos estén completos y que
   *            los valores numéricos sean válidos (monto > 0).
   * IMPACTO: Previene la creación de remesas con datos incompletos o inválidos.
   */
  const validate = (): boolean => {
    if (!formData.senderName.trim()) {
      alert('El nombre del remitente es requerido');
      return false;
    }
    if (!formData.receiverName.trim()) {
      alert('El nombre del destinatario es requerido');
      return false;
    }
    if (formData.amount <= 0) {
      alert('El monto debe ser mayor a 0');
      return false;
    }
    if (!formData.destinationCountry.trim()) {
      alert('El país de destino es requerido');
      return false;
    }
    if (!formData.date) {
      alert('La fecha es requerida');
      return false;
    }
    return true;
  };

  /**
   * QUÉ: Maneja el envío del formulario.
   * PARA QUÉ: Ejecuta la validación y luego llama a onAdd (crear) o onUpdate (editar)
   *            según el modo actual del formulario.
   * IMPACTO: Crea una nueva remesa o actualiza una existente, y luego limpia el formulario.
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validar datos antes de proceder
    if (!validate()) return;

    // Preparar datos con el monto como número
    const dataToSubmit = {
      ...formData,
      amount: Number(formData.amount),
    };

    if (editingItem) {
      // Modo edición: actualizar remesa existente
      onUpdate(editingItem.id, dataToSubmit);
      onCancelEdit();
    } else {
      // Modo agregar: crear nueva remesa
      onAdd(dataToSubmit);
    }

    // Limpiar formulario después de enviar
    setFormData(initialState);
  };

  // ============================================
  // OPCIONES DE MONEDAS Y PAÍSES
  // ============================================

  // Lista de monedas soportadas por la plataforma fintech
  const currencies: Currency[] = ['USD', 'EUR', 'COP', 'MXN', 'BRL', 'PEN'];

  // Lista de estados posibles de una remesa
  const statuses: RemittanceStatus[] = ['pendiente', 'en-proceso', 'completada', 'cancelada'];

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className="form-container">
      <h2>{editingItem ? '✏️ Editar Remesa' : '➕ Nueva Remesa Internacional'}</h2>

      <form onSubmit={handleSubmit} className="item-form">
        {/* Campo: Nombre del Remitente */}
        <div className="form-group">
          <label htmlFor="senderName">Remitente *</label>
          <input
            type="text"
            id="senderName"
            name="senderName"
            value={formData.senderName}
            onChange={handleChange}
            placeholder="Nombre completo del remitente"
            required
          />
        </div>

        {/* Campo: Nombre del Destinatario */}
        <div className="form-group">
          <label htmlFor="receiverName">Destinatario *</label>
          <input
            type="text"
            id="receiverName"
            name="receiverName"
            value={formData.receiverName}
            onChange={handleChange}
            placeholder="Nombre completo del destinatario"
            required
          />
        </div>

        {/* Campo: Monto de la remesa */}
        <div className="form-group">
          <label htmlFor="amount">Monto *</label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            placeholder="Monto a enviar"
            min="0.01"
            step="0.01"
            required
          />
        </div>

        {/* Campo: Moneda */}
        <div className="form-group">
          <label htmlFor="currency">Moneda *</label>
          <select
            id="currency"
            name="currency"
            value={formData.currency}
            onChange={handleSelectChange}
          >
            {currencies.map((cur) => (
              <option key={cur} value={cur}>
                {cur}
              </option>
            ))}
          </select>
        </div>

        {/* Campo: País de destino */}
        <div className="form-group">
          <label htmlFor="destinationCountry">País Destino *</label>
          <input
            type="text"
            id="destinationCountry"
            name="destinationCountry"
            value={formData.destinationCountry}
            onChange={handleChange}
            placeholder="Ej: Colombia, México, Perú"
            required
          />
        </div>

        {/* Campo: Estado de la remesa */}
        <div className="form-group">
          <label htmlFor="status">Estado</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleSelectChange}
          >
            {statuses.map((st) => (
              <option key={st} value={st}>
                {st.charAt(0).toUpperCase() + st.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Campo: Fecha de la transacción */}
        <div className="form-group">
          <label htmlFor="date">Fecha *</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>

        {/* Botones de acción */}
        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            {editingItem ? 'Actualizar Remesa' : 'Registrar Remesa'}
          </button>

          {editingItem && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                onCancelEdit();
                setFormData(initialState);
              }}>
              Cancelar
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default RemittanceForm;
