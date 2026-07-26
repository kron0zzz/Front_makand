import { X } from 'lucide-react';
import { useMachineryStatuses } from "../hooks/useMachineryStatuses";
import './MachineryStatusForm.css'; // Mantiene tus mismos estilos del modal
import { useAlertModal } from "../../../shared/alertModal";

const MachineryStatusForm = ({ isOpen, onClose, formData, setFormData, isEditing }) => {
  const { showAlert, showConfirm } = useAlertModal();
  // Consumimos el hook que crearemos para los estados de maquinaria
  const { cargarEstados } = useMachineryStatuses();

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Mapeo de datos alineado con tu base de datos y backend de Node.js
    const dataToSend = {
      status_name: formData.statusName
    };

    // Apuntamos a la URL de machine-statuses que configuramos en tu servidor Express
    const url = isEditing 
      ? `http://localhost:3000/api/machine-statuses/${formData.status_id}` 
      : 'http://localhost:3000/api/machine-statuses';
    
    const method = isEditing ? 'PUT' : 'POST';
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(dataToSend)
      });

      if (response.ok) {
        await showAlert(isEditing ? '¡Estado de maquinaria actualizado!' : '¡Estado de maquinaria creado!');
        await cargarEstados(); // Recarga la tabla de inmediato
        onClose();
      } else {
        const errorData = await response.json();
        await showAlert(`Error del servidor: ${errorData.error || 'No se pudo procesar la solicitud'}`);
      }
    } catch (error) {
      console.error("Error en la petición:", error);
      await showAlert("Error de conexión: Asegúrate de que el servidor de Makand esté corriendo.");
    }
  };

  return (
    <div className="form-modal-overlay">
      <div className="form-modal-container">
        
        {/* Header del Modal */}
        <div className="form-header">
          <h2>
            {isEditing ? 'Editar Estado de Maquinaria' : 'Registrar Nuevo Estado'}
          </h2>
          <button onClick={onClose} className="form-close-btn">
            <X size={20} />
          </button>
        </div>

        {/* Cuerpo del Formulario */}
        <form onSubmit={handleSubmit} className="form-body">
          <div className="form-grid">
            
            {/* ID del Estado (Solo lectura) */}
            <div>
              <label className="form-label">Código Interno</label>
              <input 
                type="text" 
                className="form-input form-input-disabled"
                value={isEditing ? `ID: ${formData.status_id}` : 'Asignado automáticamente'} 
                disabled 
              />
            </div>

            {/* Nombre del Estado */}
            <div>
              <label className="form-label">Nombre del Estado *</label>
              <input 
                name="statusName" 
                type="text" 
                className="form-input" 
                placeholder="Ej: Disponible, En Mantenimiento..."
                value={formData.statusName || ''} 
                onChange={handleChange} 
                required 
              />
            </div>

          </div>

          {/* Botones de Acción */}
          <div className="form-footer">
            <button type="button" onClick={onClose} className="btn-cancel">
              Cancelar
            </button>
            <button type="submit" className="btn-submit">
              {isEditing ? 'Guardar Cambios' : 'Registrar Estado'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MachineryStatusForm;