import { useState, useEffect } from 'react';
import { Shield, Mail, Phone, Heart, Briefcase, CreditCard } from 'lucide-react';
import './EmployeeDetail.css'; 

const EmployeeDetail = ({ isOpen, onClose, empleado, onEdit }) => {
  const [empleadoCompleto, setEmpleadoCompleto] = useState(null);
  const [cargando, setCargando] = useState(false);
  const getToken = () => localStorage.getItem("token");

  useEffect(() => {
    const cargarDetalleCompleto = async () => {
      if (!isOpen || !empleado?.employee_id) return;
      setCargando(true);
      try {
        // CORRECCIÓN: Agregado el header de Authorization
        const response = await fetch(`http://localhost:3000/api/employees/${empleado.employee_id}`, {
          headers: { 'Authorization': `Bearer ${getToken()}` }
        });
        
        if (response.ok) {
          const data = await response.json();
          setEmpleadoCompleto(data);
        } else {
          console.error("Error al cargar detalles.");
          setEmpleadoCompleto(empleado);
        }
      } catch (error) {
        console.error("Error de red:", error);
        setEmpleadoCompleto(empleado);
      } finally {
        setCargando(false);
      }
    };

    if (isOpen) {
      cargarDetalleCompleto();
    } else {
      setEmpleadoCompleto(null);
    }
  }, [isOpen, empleado]);

  if (!isOpen || !empleado) return null;

  const datos = empleadoCompleto || empleado;

  // Lógica para mostrar la identificación sin guiones extra si falta algún dato
  const renderIdentificacion = () => {
    if (cargando) return 'Cargando...';
    const tipo = datos.employee_document_type || '';
    const num = datos.employee_document_number || '';
    if (!tipo && !num) return 'No registrado';
    return tipo && num ? `${tipo} - ${num}` : `${tipo}${num}`;
  };

  const obtenerIniciales = () => {
    const nombre = datos.employee_full_name || `${datos.employee_first_name || ''} ${datos.employee_last_name || ''}`;
    return nombre.substring(0, 2).toUpperCase();
  };

  return ( 
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>Detalles del Empleado</h2>
          <button className="close-button" onClick={onClose}>&times;</button>
        </div>

        <div className="modal-content">
          <div className="user-avatar-section">
            <div className="avatar-icon-wrapper" style={{ fontSize: '1.25rem', fontWeight: '700' }}>
              {obtenerIniciales()}
            </div>
            <div>
              <h3 className="value-text value-text-large" style={{ margin: '0 0 4px 0' }}>
                {datos.employee_full_name || `${datos.employee_first_name} ${datos.employee_last_name}`}
              </h3>
              <span className={`status-badge status-${datos.employee_status ? 'active' : 'inactive'}`}>
                {datos.employee_status ? 'Activo' : 'Inactivo'}
              </span>
            </div>
          </div>

          <br />

          <div className="detail-grid">
            <div className="info-card">
              <div className="info-item-header">
                <CreditCard size={16} />
                <span className="label-text">Identificación</span>
              </div>
              <span className="value-text">{renderIdentificacion()}</span>
            </div>

            <div className="info-card">
              <div className="info-item-header">
                <Briefcase size={16} />
                <span className="label-text">Cargo Ocupacional</span>
              </div>
              <span className="value-text">{datos.position_name || 'No asignado'}</span>
            </div>

            <div className="info-card">
              <div className="info-item-header">
                <Mail size={16} />
                <span className="label-text">Correo Electrónico</span>
              </div>
              <span className="value-text">{datos.employee_email || 'No registrado'}</span>
            </div>

            <div className="info-card">
              <div className="info-item-header">
                <Phone size={16} />
                <span className="label-text">Teléfono de Contacto</span>
              </div>
              <span className="value-text">{datos.employee_phone || 'No registrado'}</span>
            </div>

            <div className="info-card">
              <div className="info-item-header">
                <Heart size={16} />
                <span className="label-text">Entidad de Salud (EPS)</span>
              </div>
              <span className="value-text">{datos.employee_eps || 'No registrada'}</span>
            </div>

            <div className="info-card">
              <div className="info-item-header">
                <Shield size={16} />
                <span className="label-text">ID Sistema</span>
              </div>
              <span className="value-text">#{datos.employee_id}</span>
            </div>
          </div>

          <div className="action-buttons">
            <button type="button" className="btn-secondary" onClick={onClose}>Cerrar</button>
            <button type="button" className="btn-primary" onClick={() => onEdit(datos)}>Editar Información</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetail;