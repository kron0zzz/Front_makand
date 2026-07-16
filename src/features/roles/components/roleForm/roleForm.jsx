import { X } from 'lucide-react';
import { apiClient } from "../../../../shared/services/api"; 
import PermissionsSelector from '../roleDetail/PermissionsSelector'; 
import './roleForm.css';

const RoleForm = ({ isOpen, onClose, formData, setFormData, isEditing, cargarRoles }) => {
  
  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const dataToSend = { 
      role_name: formData.role_name,
      role_status: formData.role_status ?? true 
    };

    try {
      if (isEditing) {
        await apiClient.put(`roles/${formData.role_id}`, dataToSend);
        alert('¡Rol actualizado con éxito!');
      } else {
        await apiClient.post('roles', dataToSend);
        alert('¡Rol creado con éxito!');
      }
      
      if (typeof cargarRoles === 'function') await cargarRoles();
      onClose();
    } catch (error) {
      console.error("Error en la petición:", error);
      alert('Error del servidor: ' + (error.response?.data?.message || 'Revisa los campos'));
    }
  };
  console.log("DEBUG RoleForm - Valor de formData:", formData);
  console.log("DEBUG: ID que estoy enviando al selector:", formData.role_id);
  return (
    <div className="form-modal-overlay">
      <div className="form-modal-container">
        <div className="form-header">
          <h2>{isEditing ? 'Editar Información del Rol' : 'Registrar Nuevo Rol'}</h2>
          <button onClick={onClose} className="form-close-btn"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="form-body">
          <div className="form-grid">
            <div>
              <label className="form-label">Código Interno</label>
              <input type="text" className="form-input form-input-disabled" value={isEditing ? `ID: ${formData.role_id}` : 'Auto'} disabled />
            </div>

            <div>
              <label className="form-label">Nombre del Rol*</label>
              <input name="role_name" type="text" className="form-input" value={formData.role_name || ''} onChange={handleChange} required />
            </div>

            {isEditing && (
              <div className="permissions-section">
                <h3>Permisos del Rol</h3>
                <div className="permissions-list-container">
                  <PermissionsSelector roleId={formData.role_id} isEditable={true} />
                </div>
              </div>
            )}

            <div className="form-checkbox-container">
              <label className="form-label">
                <input name="role_status" type="checkbox" checked={formData.role_status ?? true} onChange={handleChange} />
                Rol Activo
              </label>
            </div>
          </div>

          <div className="form-footer">
            <button type="button" onClick={onClose} className="btn-cancel">Cancelar</button>
            <button type="submit" className="btn-submit">{isEditing ? 'Guardar Cambios' : 'Registrar Rol'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RoleForm;