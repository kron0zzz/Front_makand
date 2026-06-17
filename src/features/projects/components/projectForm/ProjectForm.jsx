import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useProjects } from '../../hooks/useProjects';
import { projectService } from '../../services/projectService';
import './ProjectForm.css';

const ProjectForm = ({ isOpen, onClose, formData, setFormData, isEditing }) => {
  const { cargarProyectos } = useProjects();
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/customers/table');
        if (response.ok) {
          const data = await response.json();
          setCustomers(data);
        }
      } catch (error) {
        console.error("Error al cargar clientes:", error);
      }
    };
    if (isOpen) fetchCustomers();
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const dataToSend = {
      project_name: formData.project_name,
      project_address: formData.project_address,
      project_phone: formData.project_phone,
      project_city: formData.project_city,
      customer_id: parseInt(formData.customer_id),
      project_status: formData.project_status !== undefined ? formData.project_status : true
    };

    try {
      if (isEditing) {
        await projectService.actualizar(formData.project_id, dataToSend);
        alert('¡Proyecto actualizado con éxito!');
      } else {
        await projectService.crear(dataToSend);
        alert('¡Proyecto creado con éxito!');
      }
      await cargarProyectos();
      onClose();
    } catch (error) {
      console.error("Error en la petición:", error);
      alert("Error de conexión: Asegúrate de que el servidor de Makand esté corriendo.");
    }
  };

  return (
    <div className="form-modal-overlay">
      <div className="form-modal-container">
        <div className="form-header">
          <h2>
            {isEditing ? 'Editar Información del Proyecto' : 'Registrar Nuevo Proyecto'}
          </h2>
          <button onClick={onClose} className="form-close-btn">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="form-body">
          <div className="form-grid">
            <div>
              <label className="form-label">Código Interno</label>
              <input 
                type="text" 
                className="form-input form-input-disabled"
                value={isEditing ? `ID: ${formData.project_id}` : 'Asignado automáticamente'} 
                disabled 
              />
            </div>

            <div>
              <label className="form-label">Nombre del Proyecto *</label>
              <input name="project_name" type="text" className="form-input" value={formData.project_name || ''} onChange={handleChange} required />
            </div>

            <div>
              <label className="form-label">Cliente *</label>
              <select 
                name="customer_id" 
                className="form-input" 
                value={formData.customer_id || ''} 
                onChange={handleChange} 
                required
              >
                <option value="">Seleccione un cliente</option>
                {customers.map(c => (
                  <option key={c.customer_id} value={c.customer_id}>
                    {c.customer_first_name} {c.customer_last_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="form-label">Teléfono *</label>
              <input name="project_phone" type="text" className="form-input" value={formData.project_phone || ''} onChange={handleChange} required />
            </div>

            <div>
              <label className="form-label">Ciudad *</label>
              <input name="project_city" type="text" className="form-input" value={formData.project_city || ''} onChange={handleChange} required />
            </div>

            <div className="form-full-width">
              <label className="form-label">Dirección Completa</label>
              <input name="project_address" type="text" className="form-input" value={formData.project_address || ''} onChange={handleChange} />
            </div>

            {isEditing && (
              <div className="form-full-width estado-field-container">
                <label className="form-label">Estado del Proyecto</label>
                <div className="switch-with-text">
                  <label className="switch">
                    <input 
                      type="checkbox" 
                      name="project_status"
                      checked={formData.project_status} 
                      onChange={(e) => setFormData(prev => ({...prev, project_status: e.target.checked}))} 
                    />
                    <span className="slider round"></span>
                  </label>
                  <span className={formData.project_status ? "text-active" : "text-inactive"}>
                    {formData.project_status ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="form-footer">
            <button type="button" onClick={onClose} className="btn-cancel">
              Cancelar
            </button>
            <button type="submit" className="btn-submit">
              {isEditing ? 'Guardar Cambios' : 'Registrar Proyecto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectForm;