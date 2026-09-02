import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useProjects } from '../../hooks/useProjects';
import { projectService } from '../../services/projectService';
import './ProjectForm.css';
import { useAlertModal } from "../../../../shared/alertModal";

const ProjectForm = ({ isOpen, onClose, formData, setFormData, isEditing }) => {
  const { showAlert, showConfirm } = useAlertModal();
  const { cargarProyectos } = useProjects();
  const [customers, setCustomers] = useState([]);
  const [departamentos, setDepartamentos] = useState([]);
  const [ciudades, setCiudades] = useState([]);
  const [errores, setErrores] = useState({});

  const validarCampo = (name, value) => {
    let error = "";
    if (name === "project_phone") {
      if (!value.trim()) error = "Este campo es obligatorio.";
      else if (value.length > 10) error = "Máximo 10 dígitos.";
      else if (!/^\d+$/.test(value)) error = "Solo se permiten números.";
    }
    setErrores(prev => ({ ...prev, [name]: error }));
  };

  // 1. Cargar Clientes (API Interna)
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch('http://localhost:3000/api/customers', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setCustomers(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error("Error al cargar clientes:", error);
      }
    };
    if (isOpen) fetchCustomers();
  }, [isOpen]);

  // 2. Cargar Departamentos (API Externa)
  useEffect(() => {
    const fetchDepartamentos = async () => {
      try {
        const response = await fetch('https://api-colombia.com/api/v1/Department');
        const data = await response.json();
        setDepartamentos(data);
      } catch (error) {
        console.error('Error cargando departamentos:', error);
      }
    };
    if (isOpen) fetchDepartamentos();
  }, [isOpen]);

  // 3. Cargar Ciudades al cambiar el departamento o al abrir en edición
  useEffect(() => {
    const cargarCiudades = async () => {
      if (!formData.project_state || departamentos.length === 0) return;
      
      try {
        const response = await fetch('https://api-colombia.com/api/v1/City');
        const data = await response.json();
        
        const depSeleccionado = departamentos.find(dep => dep.name === formData.project_state);
        if (depSeleccionado) {
          const filtradas = data.filter(city => city.departmentId === depSeleccionado.id);
          setCiudades(filtradas);
        }
      } catch (error) {
        console.error('Error cargando ciudades:', error);
      }
    };
    cargarCiudades();
  }, [formData.project_state, departamentos, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let valor = value;
    if (name === 'project_phone') {
      valor = value.replace(/\D/g, '');
      if (valor.length > 10) valor = valor.slice(0, 10);
    }
    if (name === 'project_state') {
      setFormData(prev => ({ ...prev, [name]: valor, project_city: '' }));
    } else {
      setFormData(prev => ({ ...prev, [name]: valor }));
    }
    validarCampo(name, valor);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const nuevosErrores = {};
    if (!formData.project_phone || !/^\d+$/.test(formData.project_phone) || formData.project_phone.length > 10) {
      nuevosErrores.project_phone = "Máximo 10 dígitos y solo números.";
    }
    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length > 0) return;

    const dataToSend = {
      project_name: formData.project_name,
      project_address: formData.project_address,
      project_phone: formData.project_phone,
      project_city: formData.project_city,
      project_state: formData.project_state,
      customer_id: parseInt(formData.customer_id),
      project_status: formData.project_status !== undefined ? formData.project_status : true
    };

    try {
      if (isEditing) {
        await projectService.actualizar(formData.project_id, dataToSend);
        await showAlert('¡Proyecto actualizado con éxito!');
      } else {
        await projectService.crear(dataToSend);
        await showAlert('¡Proyecto creado con éxito!');
      }
      await cargarProyectos();
      onClose();
    } catch (error) {
      console.error("Error en la petición:", error);
      await showAlert("Error al guardar. Verifica la conexión.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="form-modal-overlay">
      <div className="form-modal-container">
        <div className="form-header">
          <h2>{isEditing ? 'Editar Información del Proyecto' : 'Registrar Nuevo Proyecto'}</h2>
          <button onClick={onClose} className="form-close-btn"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="form-body">
          <div className="form-grid">
            <div>
              <label className="form-label">Código Interno</label>
              <input type="text" className="form-input form-input-disabled" 
                value={isEditing ? `ID: ${formData.project_id}` : 'Asignado automáticamente'} disabled />
            </div>

            <div>
              <label className="form-label">Nombre del Proyecto *</label>
              <input name="project_name" className="form-input" value={formData.project_name || ''} onChange={handleChange} required />
            </div>

            <div>
              <label className="form-label">Cliente *</label>
              <select name="customer_id" className="form-input" value={formData.customer_id || ''} onChange={handleChange} required>
                <option value="">Seleccione un cliente</option>
                {customers.map(c => (
                  <option key={c.customer_id} value={c.customer_id}>{c.customer_name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="form-label">Departamento <br/> (este campo solo sirve como filtro)</label>
              <select name="project_state" className="form-input" value={formData.project_state || ''} onChange={handleChange}>
                <option value="">Seleccione un departamento...</option>
                {departamentos.map(dep => <option key={dep.id} value={dep.name}>{dep.name}</option>)}
              </select>
            </div>

            <div>
              <label className="form-label">Ciudad *</label>
              <select name="project_city" className="form-input" value={formData.project_city || ''} onChange={handleChange} required disabled={!formData.project_state}>
                <option value="">Seleccione una ciudad...</option>
                {ciudades.map(city => <option key={city.id} value={city.name}>{city.name}</option>)}
              </select>
            </div>

            <div>
              <label className="form-label">Teléfono *</label>
              <input name="project_phone" className={`form-input ${errores.project_phone ? 'input-error' : ''}`} maxLength={10} inputMode="numeric" value={formData.project_phone || ''} onChange={handleChange} required />
              {errores.project_phone && <span className="error-text">{errores.project_phone}</span>}
            </div>

            <div className="form-full-width">
              <label className="form-label">Dirección Completa</label>
              <input name="project_address" className="form-input" value={formData.project_address || ''} onChange={handleChange} />
            </div>
          </div>

          <div className="form-footer">
            <button type="button" onClick={onClose} className="btn-cancel">Cancelar</button>
            <button type="submit" className="btn-submit">{isEditing ? 'Guardar Cambios' : 'Registrar Proyecto'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectForm;