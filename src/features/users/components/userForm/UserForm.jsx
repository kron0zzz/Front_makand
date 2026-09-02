import { useEffect } from 'react';
import { X } from 'lucide-react';
import { useRoles } from "../../../roles/hooks/useRoles";
import { userService } from '../../services/userService'; // 🌟 Asegúrate de tener esta importación
import './UserForm.css';
import { useAlertModal } from "../../../../shared/alertModal";

const UserForm = ({
  isOpen,
  onClose, 
  formData, 
  setFormData, 
  isEditing, 
  cargarUsers, 
  employees = [], 
}) => {
  const { showAlert, showConfirm } = useAlertModal();
  const { roles, cargarRoles } = useRoles();
  const [errores, setErrores] = useState({});

  const validarCampo = (name, value) => {
    let error = "";
    if (name === "user_email") {
      if (value.length > 60) error = "Máximo 60 caracteres.";
      else if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = "Formato de correo inválido.";
    }
    setErrores(prev => ({ ...prev, [name]: error }));
  };

  useEffect(() => {
    if (isOpen) {
      cargarRoles();
    }
  }, [isOpen, cargarRoles]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    validarCampo(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const nuevosErrores = {};
    if ((formData.user_email || '').length > 60 || (formData.user_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.user_email))) {
      nuevosErrores.user_email = "Máximo 60 caracteres y formato de correo válido.";
    }
    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length > 0) return;

    const dataToSend = {
      user_email: formData.user_email,
      password: formData.password || "", // Si está vacío, se envía vacío para que el backend lo respete
      user_status: formData.user_status ?? true,
      role_id: parseInt(formData.role_id),
      employee_id: parseInt(formData.employee_id),
    };

    try {
      if (isEditing) {
        // 🌟 Usamos formData.user_id para asegurarnos de enviar el ID correcto al actualizar
        await userService.actualizar(formData.user_id, dataToSend);
        await showAlert('Usuario actualizado con éxito.');
      } else {
        await userService.crear(dataToSend);
        await showAlert('Usuario creado con éxito.');
      }
      
      if (cargarUsers) await cargarUsers();
      onClose();
    } catch (error) {
      console.error("Error en la petición:", error);
      await showAlert("Error de conexión o datos inválidos. Revisa la consola.");
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
                    setFormData({ 
                      ...formData, 
                      employee_id: found.employee_id,
                      user_email: found.employee_email || formData.user_email 
                    });
                  } else {
                    setFormData({ ...formData, employee_id: '' });
                  }
                }}
              />
              <datalist id="employees-list">
                {employees.map(emp => (
                  <option key={emp.employee_id} value={emp.employee_full_name} />
                ))}
              </datalist>
            </div>

            {/* Selector de Rol Dinámico */}
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
                {roles.map(role => (
                  <option key={role.role_id} value={role.role_id}>
                    {role.role_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Email y Contraseña */}
            <div>
              <label className="form-label">Email *</label>
              <input
                name="user_email"
                type="email"
                className={`form-input ${errores.user_email ? 'input-error' : ''}`}
                maxLength={60}
                value={formData.user_email || ''}
                onChange={handleChange}
                required
              />
              {errores.user_email && <span className="error-text">{errores.user_email}</span>}
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
                autoComplete="new-password"
              />
            </div>

            {/* Estado Switch */}
            <div className="form-full-width" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '10px' }}>
              <label className="form-label" style={{ margin: 0 }}>Estado ({formData.user_status ? 'Activo' : 'Inactivo'})</label>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={formData.user_status ?? true}
                  onChange={(e) => setFormData({ ...formData, user_status: e.target.checked })}
                />
                <span className="slider round"></span>
              </label>
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