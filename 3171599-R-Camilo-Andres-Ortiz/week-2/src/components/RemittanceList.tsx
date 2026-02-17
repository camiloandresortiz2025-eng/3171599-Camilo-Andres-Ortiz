import { Remittance } from '../types';
import RemittanceCard from './RemittanceCard';

/**
 * QUÉ: Interface que define las props del componente RemittanceList.
 * PARA QUÉ: Tipar las props que recibe la lista de remesas.
 * IMPACTO: Garantiza que la lista reciba el array de remesas y las funciones CRUD.
 */
interface RemittanceListProps {
  remittances: Remittance[];
  onDelete: (id: number) => void;
  onEdit: (id: number) => void;
}

/**
 * QUÉ: Componente que renderiza la lista completa de remesas internacionales.
 * PARA QUÉ: Iterar sobre el array de remesas usando .map() y renderizar un
 *            RemittanceCard por cada transacción registrada.
 * IMPACTO: Maneja el estado vacío mostrando un mensaje informativo cuando no
 *          hay remesas, y organiza las tarjetas en un grid responsive.
 */
const RemittanceList: React.FC<RemittanceListProps> = ({ remittances, onDelete, onEdit }) => {
  // Manejar estado vacío: cuando no hay remesas registradas
  if (remittances.length === 0) {
    return (
      <div className="empty-state">
        <p>📭 No hay remesas registradas</p>
        <p className="empty-state__hint">
          Registra tu primera remesa internacional usando el formulario de arriba
        </p>
      </div>
    );
  }

  // ============================================
  // RENDER: LISTA DE REMESAS
  // ============================================

  return (
    <div className="item-list">
      {/* Usa .map() para renderizar cada remesa con key única */}
      {remittances.map((remittance) => (
        <RemittanceCard
          key={remittance.id}
          remittance={remittance}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
};

export default RemittanceList;
