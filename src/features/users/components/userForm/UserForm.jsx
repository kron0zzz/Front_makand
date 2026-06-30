import { X } from 'lucide-react';
import { userService } from "../../services/userService";
import './UserForm.css';

const UserForm = ({ isOpen, onClose, formData, setFormData, isEditing, cargarUsers }) => {
  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dataToSend = {
      user_email: formData.user_email,
      password: formData.password,
      user_status: formData.user_status,
      role_id: formData.role_id,
      employee_id: formData.employee_id,
    };

    try {
      if (isEditing) {
        await userService.actualizar(formData.user_id, dataToSend);
        alert('Usuario actualizado con éxito.');
      } else {
        await userService.crear(dataToSend);
        alert('Usuario creado con éxito.');
      }
      
      // Recargamos los datos y cerramos
      if (cargarUsers) await cargarUsers();
      onClose();
    } catch (error) {
      console.error("Error en la petición:", error);
      alert("Error de conexión: Asegúrate de que el servidor esté corriendo.");
    }
  };

  return (
    <div className="form-modal-overlay">
      <div className="form-modal-container">
        <div className="form-header">
          <h2>{isEditing ? 'Editar Usuario' : 'Registrar Nuevo Usuario'}</h2>
          <button onClick={onClose} className="form-close-btn">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="form-body">
          <div className="form-grid">
            <div>
              <label className="form-label">ID</label>
              <input
                type="text"
                className="form-input form-input-disabled"
                value={isEditing ? `ID: ${formData.user_id}` : 'Asignado automáticamente'}
                disabled
              />
            </div>

            <div>
              <label className="form-label">Email *</label>
              <input
                name="user_email"
                type="email"
                className="form-input"
                value={formData.user_email || ''}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="form-label">Contraseña *</label>
              <input
                name="password"
                type="password"
                className="form-input"
                value={formData.password || ''}
                onChange={handleChange}
                required={!isEditing}
              />
            </div>

            <div>
              <label className="form-label">Role ID *</label>
              <input
                name="role_id"
                type="number"
                className="form-input"
                value={formData.role_id || ''}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="form-label">Employee ID *</label>
              <input
                name="employee_id"
                type="number"
                className="form-input"
                value={formData.employee_id || ''}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="form-label">Estado</label>
              <select
                name="user_status"
                className="form-input"
                value={formData.user_status ? 'true' : 'false'}
                onChange={(e) => setFormData({ ...formData, user_status: e.target.value === 'true' })}
              >
                <option value="true">Activo</option>
                <option value="false">Inactivo</option>
              </select>
            </div>
          </div>

          <div className="form-footer">
            <button type="button" onClick={onClose} className="btn-cancel">
              Cancelar
            </button>
            <button type="submit" className="btn-submit">
              {isEditing ? 'Guardar Cambios' : 'Registrar Usuario'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserForm;