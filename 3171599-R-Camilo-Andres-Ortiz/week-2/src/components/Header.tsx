/**
 * QUÉ: Componente Header para el sistema de remesas internacionales.
 * PARA QUÉ: Muestra el título y la descripción de la aplicación fintech,
 *            dando contexto al usuario sobre la funcionalidad del sistema.
 * IMPACTO: Es el primer elemento visual que ve el usuario. Establece la
 *          identidad del sistema de remesas internacionales.
 */
const Header: React.FC = () => {
  return (
    <header className="header">
      {/* Título principal del sistema fintech de remesas */}
      <h1>💸 Sistema de Remesas Internacionales</h1>

      {/* Descripción del propósito del sistema */}
      <p>Gestiona envíos de dinero internacionales — Servicios Financieros y Fintech</p>
    </header>
  );
};

export default Header;
