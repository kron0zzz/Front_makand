import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import Select from 'react-select'; // RECUERDA: npm install react-select
import { useMaintenances } from "../../hooks/useMaintenances";
import { maintenanceService } from "../../services/maintenanceService";
import './MaintenanceForm.css';

const MaintenanceForm = ({ isOpen, onClose, formData, setFormData, isEditing }) => {
  const { cargarMaintenances } = useMaintenances();
  const [maquinarias, setMaquinarias] = useState([]);

  // Carga de máquinas para los selectores
  useEffect(() => {
    if (isOpen) {
      fetch('http://localhost:3000/api/machines', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem("token")}` }
      })
      .then(res => res.json())
      .then(data => setMaquinarias(data))
      .catch(err => console.error("Error cargando máquinas:", err));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const dataToSend = {
      machinery_id: parseInt(formData.machinery_id),
      maintenance_date: formData.maintenance_date,
      revision_notes: formData.revision_notes || '',
    };
    try {
      if (isEditing) {
        await maintenanceService.actualizar(formData.maintenance_id, dataToSend);
      } else {
        await maintenanceService.crear(dataToSend);
      }
      await cargarMaintenances();
      onClose();
    } catch {
      alert("Error en la petición.");
    }
  };

  return (
    <div className="form-modal-overlay">
      <div className="form-modal-container">
        <div className="form-header">
          <h2>{isEditing ? 'Editar Mantenimiento' : 'Registrar Nuevo Mantenimiento'}</h2>
          <button onClick={onClose} className="form-close-btn"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="form-body">
          <div className="form-grid">
            {/* ID */}
            <div>
              <label className="form-label">ID</label>
              <input type="text" className="form-input form-input-disabled" 
                     value={isEditing ? `ID: ${formData.maintenance_id}` : 'Asignado automáticamente'} disabled />
            </div>

            {/* --- AQUÍ DEBES ELEGIR UNA DE LAS DOS OPCIONES ABAJO Y PEGARLA --- */}
            
            <div>
              <label className="form-label">Maquinaria *</label>
              
              <Select
                options={maquinarias.map(m => ({ value: m.machinery_id, label: m.machinery_name }))}
                value={maquinarias.find(m => m.machinery_id == formData.machinery_id) 
                       ? { value: formData.machinery_id, label: maquinarias.find(m => m.machinery_id == formData.machinery_id).machinery_name } 
                       : null}
                onChange={(opt) => setFormData({ ...formData, machinery_id: opt.value })}
                placeholder="Selecciona o busca..."
                isSearchable
                styles={{
                  control: (base) => ({
                    ...base,
                    height: '42px', // Ajusta esto al alto de tu clase .form-input
                    borderRadius: '8px',
                    borderColor: '#d1d5db',
                    boxShadow: 'none',
                    '&:hover': { borderColor: '#3b82f6' }
                  }),
                  option: (base, state) => ({
                    ...base,
                    backgroundColor: state.isFocused ? '#f3f4f6' : 'white',
                    color: '#374151',
                    cursor: 'pointer'
                  })
                }}
              />
              
            </div>

            {/* --- FIN DE LAS OPCIONES --- */}

            <div>
              <label className="form-label">Fecha de Mantenimiento *</label>
              <input name="maintenance_date" type="date" className="form-input" 
                     value={formData.maintenance_date || ''} onChange={handleChange} required />
            </div>

            <div>
              <label className="form-label">Notas de Revisión</label>
              <textarea name="revision_notes" className="form-input" 
                        value={formData.revision_notes || ''} onChange={handleChange} rows="3" />
            </div>
          </div>

          <div className="form-footer">
            <button type="button" onClick={onClose} className="btn-cancel">Cancelar</button>
            <button type="submit" className="btn-submit">{isEditing ? 'Guardar Cambios' : 'Registrar Mantenimiento'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MaintenanceForm;