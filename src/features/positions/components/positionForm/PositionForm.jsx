import { X } from 'lucide-react';
import { apiClient } from "../../../../shared/services/api"; 
import './PositionForm.css';

const PositionForm = ({ isOpen, onClose, formData, setFormData, isEditing, cargarCargos }) => {
  
  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const dataToSend = { position_name: formData.position_name };

    try {
      if (isEditing) {
        await apiClient.put(`/api/positions/${formData.position_id}`, dataToSend);
        alert('¡Cargo actualizado con éxito!');
      } else {
        await apiClient.post('/api/positions', dataToSend);
        alert('¡Cargo creado con éxito!');
      }
      
      // Validación segura: solo ejecuta si la función existe
      if (typeof cargarCargos === 'function') {
        await cargarCargos();
      }
      
      onClose();
      
    } catch (error) {
      console.error("Error en la petición:", error);
      const mensajeError = error.response?.data?.message || 'No se pudo procesar la solicitud';
      alert(`Error del servidor: ${mensajeError}`);
    }
  };

  return (
    <div className="form-modal-overlay">
      <div className="form-modal-container">
        <div className="form-header">
          <h2>{isEditing ? 'Editar Información del Cargo' : 'Registrar Nuevo Cargo'}</h2>
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
                value={isEditing ? `ID: ${formData.position_id}` : 'Asignado automáticamente'} 
                disabled 
              />
            </div>

            <div>
              <label className="form-label">Nombre del cargo*</label>
              <input 
                name="position_name" 
                type="text" 
                className="form-input" 
                value={formData.position_name || ''} 
                onChange={handleChange} 
                required 
              />
            </div>
          </div>

          <div className="form-footer">
            <button type="button" onClick={onClose} className="btn-cancel">Cancelar</button>
            <button type="submit" className="btn-submit">
              {isEditing ? 'Guardar Cambios' : 'Registrar Cargo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PositionForm;