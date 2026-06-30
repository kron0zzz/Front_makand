import { X } from 'lucide-react';
import { userService } from "../../services/userService";
import './UserForm.css';

const UserForm = ({ 
  isOpen, 
  onClose, 
  formData, 
  setFormData, 
  isEditing, 
  cargarUsers, 
  employees = [], 
  // roles = [] 
}) => {
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
      role_id: parseInt(formData.role_id),
      employee_id: parseInt(formData.employee_id),
    };

    // Solo agregamos la contraseña si el campo no está vacío
    if (formData.password && formData.password.trim() !== "") {
      dataToSend.password = formData.password;
    }

    try {
      if (isEditing) {
        await userService.actualizar(formData.user_id, dataToSend);
        alert('Usuario actualizado con éxito.');
      } else {
        await userService.crear(dataToSend);
        alert('Usuario creado con éxito.');
      }
      
      if (cargarUsers) await cargarUsers();
      onClose();
    } catch (error) {
      console.error("Error en la petición:", error);
      alert("Error de conexión o datos inválidos. Revisa la consola.");
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
            {/* Campo ID */}
            <div>
              <label className="form-label">ID</label>
              <input
                type="text"
                className="form-input form-input-disabled"
                value={isEditing ? `ID: ${formData.user_id}` : 'Asignado automáticamente'}
                disabled
              />
            </div>

            {/* Búsqueda Predictiva de Empleado */}
            <div className="form-full-width">
              <label className="form-label">Empleado *</label>
              <input
                type="text"
                className="form-input"
                placeholder="Escribe el nombre del empleado..."
                list="employees-list"
                required
                value={employees.find(e => e.employee_id == formData.employee_id)?.employee_full_name || ''}
                onChange={(e) => {
                  const name = e.target.value;
                  const found = employees.find(e => e.employee_full_name === name);
                  if (found) {
                    setFormData({ ...formData, employee_id: found.employee_id });
                  }
                }}
              />
              <datalist id="employees-list">
                {employees.map(emp => (
                  <option key={emp.employee_id} value={emp.employee_full_name} />
                ))}
              </datalist>
            </div>

        {/*  --------------------- Selector falso de Rol --------------------- */}
            {/* Selector de Rol - MARCA PARA FUTURA INTEGRACIÓN */}
            <div className="form-full-width">
              <label className="form-label">Rol *</label>
              <select 
                name="role_id" 
                className="form-input" 
                value={formData.role_id || ''} 
                onChange={handleChange} 
                required
              >
                <option value="">Seleccione un rol</option>
                {/*CAMBIAR ESTAS OPCIONES FIJAS POR UN MAPEO DE ROLES REAL */}
                <option value="1">Administrador</option>
                <option value="2">Empleado</option>
                
                {/* {roles.map(role => (
                  <option key={role.role_id} value={role.role_id}>{role.role_name}</option>
                ))} */}
              </select>
            </div>





            {/* Email y Contraseña */}
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
                placeholder={isEditing ? "Dejar vacío para no cambiar" : ""}
                required={!isEditing}
              />
            </div>

            {/* Estado */}
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
            <button type="button" onClick={onClose} className="btn-cancel">Cancelar</button>
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