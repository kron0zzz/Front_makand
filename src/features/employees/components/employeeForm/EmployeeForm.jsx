import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import './EmployeeForm.css';

const EmployeeForm = ({ isOpen, onClose, formData, setFormData, isEditing, cargarEmpleados }) => {
  const [positions, setPositions] = useState([]);
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);
  const getToken = () => localStorage.getItem("token");

  // 1. Cargar cargos al abrir el modal
  useEffect(() => {
    const cargarPosiciones = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/positions', {
          headers: { 'Authorization': `Bearer ${getToken()}` }
        });
        if (response.ok) {
          const data = await response.json();
          setPositions(data);
        }
      } catch (err) {
        console.error("Error al cargar cargos:", err);
      }
    };

    if (isOpen) {
      cargarPosiciones();
    }
  }, [isOpen]);

  // 2. Si editamos, aseguramos que el formulario tenga los datos más frescos
  // (Esto soluciona el problema de que no carguen los datos al venir de la tabla)
  useEffect(() => {
    const obtenerDatosFrescos = async () => {
      if (isOpen && isEditing && formData?.employee_id) {
        setCargando(true);
        try {
          const response = await fetch(`http://localhost:3000/api/employees/${formData.employee_id}`, {
            headers: { 'Authorization': `Bearer ${getToken()}` }
          });
          if (response.ok) {
            const data = await response.json();
            setFormData(data); // Actualiza con el objeto completo del servidor
          }
        } catch (err) {
          console.error("Error al obtener datos frescos:", err);
        } finally {
          setCargando(false);
        }
      }
    };
    obtenerDatosFrescos();
  }, [isOpen, isEditing, formData?.employee_id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'position_id' ? parseInt(value) : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const url = isEditing 
      ? `http://localhost:3000/api/employees/${formData.employee_id}` 
      : 'http://localhost:3000/api/employees';

    try {
      const response = await fetch(url, {
        method: isEditing ? 'PUT' : 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify(isEditing ? formData : { ...formData, employee_status: true })
      });

      if (response.ok) {
        if (cargarEmpleados) await cargarEmpleados();
        onClose();
      } else {
        const resData = await response.json();
        setError(resData.message || 'Error al guardar los datos');
      }
    } catch (err) {
      console.error(err);
      setError('Error de conexión con el servidor.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="form-modal-overlay">
      <div className="form-modal-container">
        <div className="form-header">
          <h2>{isEditing ? 'Editar Empleado' : 'Registrar Nuevo Empleado'}</h2>
          <button className="form-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {error && <div className="modal-error-message" style={{color: 'red', marginBottom: '10px'}}>{error}</div>}
        {cargando && <p>Cargando información...</p>}

        <form onSubmit={handleSubmit} className="form-body">
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Tipo de Documento *</label>
              <select name="employee_document_type" className="form-input" value={formData.employee_document_type || ''} onChange={handleChange} required>
                <option value="">Seleccione...</option>
                <option value="CC">Cédula de Ciudadanía</option>
                <option value="CE">Cédula de Extranjería</option>
                <option value="PPT">Permiso de Protección Temporal</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Número de Documento *</label>
              <input type="text" name="employee_document_number" className={`form-input ${isEditing ? 'form-input-disabled' : ''}`} value={formData.employee_document_number || ''} onChange={handleChange} disabled={isEditing} required />
            </div>

            <div className="form-group">
              <label className="form-label">Primer Nombre *</label>
              <input type="text" name="employee_first_name" className="form-input" value={formData.employee_first_name || ''} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label className="form-label">Apellidos *</label>
              <input type="text" name="employee_last_name" className="form-input" value={formData.employee_last_name || ''} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label className="form-label">Correo Electrónico *</label>
              <input type="email" name="employee_email" className="form-input" value={formData.employee_email || ''} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label className="form-label">Teléfono Celular *</label>
              <input type="text" name="employee_phone" className="form-input" value={formData.employee_phone || ''} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label className="form-label">EPS *</label>
              <input type="text" name="employee_eps" className="form-input" value={formData.employee_eps || ''} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label className="form-label">Cargo Ocupacional *</label>
              <select name="position_id" className="form-input" value={formData.position_id || ''} onChange={handleChange} required>
                <option value="">Seleccione un cargo...</option>
                {positions.map(p => <option key={p.position_id} value={p.position_id}>{p.position_name}</option>)}
              </select>
            </div>
          </div>

          <div className="form-footer">
            <button type="button" className="btn-cancel" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn-submit" disabled={cargando}>{isEditing ? 'Guardar Cambios' : 'Registrar Empleado'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeForm;