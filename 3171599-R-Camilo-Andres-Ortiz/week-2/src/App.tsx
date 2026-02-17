import { useState } from 'react';
import { Remittance } from './types';
import Header from './components/Header';
import RemittanceForm from './components/RemittanceForm';
import RemittanceList from './components/RemittanceList';

/**
 * QUÉ: Componente principal de la aplicación de gestión de remesas internacionales.
 * PARA QUÉ: Gestiona el estado global (lista de remesas y modo edición)
 *            y coordina la comunicación entre los componentes hijos.
 * IMPACTO: Es el componente raíz que contiene toda la lógica CRUD y pasa
 *          funciones y datos a Header, RemittanceForm y RemittanceList.
 */
const App = () => {
  // ============================================
  // ESTADO PRINCIPAL
  // ============================================

  // Estado para la lista de remesas internacionales
  const [remittances, setRemittances] = useState<Remittance[]>([]);

  // Estado para el id de la remesa que se está editando (null = modo agregar)
  const [editingId, setEditingId] = useState<number | null>(null);

  // ============================================
  // FUNCIONES CRUD
  // ============================================

  /**
   * QUÉ: Agrega una nueva remesa a la lista.
   * PARA QUÉ: Implementa la operación CREATE del CRUD.
   * IMPACTO: Genera un id único con Date.now() y agrega la remesa al estado
   *          usando spread operator para mantener la inmutabilidad.
   *
   * @param remittance - Datos de la nueva remesa (sin id)
   */
  const addRemittance = (remittance: Omit<Remittance, 'id'>): void => {
    const newRemittance: Remittance = {
      ...remittance,
      id: Date.now(), // Genera ID único basado en timestamp
    };
    setRemittances([...remittances, newRemittance]);
  };

  /**
   * QUÉ: Actualiza las propiedades de una remesa existente.
   * PARA QUÉ: Implementa la operación UPDATE del CRUD.
   * IMPACTO: Usa map() para crear un nuevo array donde solo la remesa
   *          con el id coincidente se actualiza con las nuevas propiedades.
   *
   * @param id - ID de la remesa a actualizar
   * @param updates - Propiedades a actualizar (parciales)
   */
  const updateRemittance = (id: number, updates: Partial<Remittance>): void => {
    setRemittances(
      remittances.map((r) => (r.id === id ? { ...r, ...updates } : r)),
    );
  };

  /**
   * QUÉ: Elimina una remesa de la lista.
   * PARA QUÉ: Implementa la operación DELETE del CRUD.
   * IMPACTO: Usa filter() para crear un nuevo array excluyendo la remesa
   *          con el id especificado, manteniendo inmutabilidad.
   *
   * @param id - ID de la remesa a eliminar
   */
  const deleteRemittance = (id: number): void => {
    setRemittances(remittances.filter((r) => r.id !== id));
    // Si se elimina la remesa que se estaba editando, cancelar edición
    if (editingId === id) {
      setEditingId(null);
    }
  };

  /**
   * QUÉ: Activa el modo edición para una remesa específica.
   * PARA QUÉ: Permite al usuario modificar los datos de una remesa existente.
   * IMPACTO: Establece editingId con el id de la remesa, lo que causa que
   *          RemittanceForm se pre-llene con los datos actuales.
   *
   * @param id - ID de la remesa a editar
   */
  const startEdit = (id: number): void => {
    setEditingId(id);
  };

  /**
   * QUÉ: Cancela el modo edición.
   * PARA QUÉ: Permite al usuario descartar los cambios y volver al modo agregar.
   * IMPACTO: Establece editingId en null, lo que limpia el formulario.
   */
  const cancelEdit = (): void => {
    setEditingId(null);
  };

  // ============================================
  // ELEMENTO SIENDO EDITADO
  // ============================================

  // Busca la remesa que se está editando para pasarla al formulario
  const remittanceToEdit = editingId
    ? remittances.find((r) => r.id === editingId)
    : undefined;

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className="app">
      {/* Header con título y descripción del sistema de remesas */}
      <Header />

      <div className="container">
        {/* Formulario para agregar/editar remesas */}
        <RemittanceForm
          onAdd={addRemittance}
          onUpdate={updateRemittance}
          editingItem={remittanceToEdit}
          onCancelEdit={cancelEdit}
        />

        {/* Lista de remesas internacionales */}
        <RemittanceList
          remittances={remittances}
          onDelete={deleteRemittance}
          onEdit={startEdit}
        />
      </div>
    </div>
  );
};

export default App;
