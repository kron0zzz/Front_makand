import { X } from 'lucide-react';
import { useMaintenances } from "../../hooks/useMaintenances";
import { maintenanceService } from "../../services/maintenanceService";
import './MaintenanceForm.css';

const MaintenanceForm = ({ isOpen, onClose, formData, setFormData, isEditing }) => {
  const { cargarMaintenances } = useMaintenances();

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
        alert('Mantenimiento actualizado con éxito.');
      } else {
        await maintenanceService.crear(dataToSend);
        alert('Mantenimiento creado con éxito.');
      }
      await cargarMaintenances();
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
            {isEditing ? 'Editar Mantenimiento' : 'Registrar Nuevo Mantenimiento'}
          </h2>
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
                value={isEditing ? `ID: ${formData.maintenance_id}` : 'Asignado automáticamente'}
                disabled
              />
            </div>

            <div>
              <label className="form-label">Machinery ID *</label>
              <input
                name="machinery_id"
                type="number"
                className="form-input"
                value={formData.machinery_id || ''}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="form-label">Fecha de Mantenimiento *</label>
              <input
                name="maintenance_date"
                type="date"
                className="form-input"
                value={formData.maintenance_date || ''}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="form-label">Notas de Revisión</label>
              <textarea
                name="revision_notes"
                className="form-input"
                value={formData.revision_notes || ''}
                onChange={handleChange}
                rows="3"
              />
            </div>

          </div>

          <div className="form-footer">
            <button type="button" onClick={onClose} className="btn-cancel">
              Cancelar
            </button>
            <button type="submit" className="btn-submit">
              {isEditing ? 'Guardar Cambios' : 'Registrar Mantenimiento'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MaintenanceForm;