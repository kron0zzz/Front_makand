import { X } from 'lucide-react';
import { useVehicles } from "../../hooks/useVehicles";
import { vehiculosService } from "../../services/vehiculosService";
import './VehiculoForm.css';
import { useAlertModal } from "../../../../shared/alertModal";

const VehiculoForm = ({ isOpen, onClose, formData, setFormData, isEditing }) => {
  const { showAlert } = useAlertModal();
  const { cargarVehiculos } = useVehicles();

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const dataToSend = {
      marca: formData.marca,
      modelo: formData.modelo,
      placa: formData.placa,
      capacidadKg: formData.capacidadKg !== undefined && formData.capacidadKg !== null && formData.capacidadKg !== ''
        ? parseFloat(formData.capacidadKg)
        : null,
      estado: formData.estado !== undefined ? formData.estado : true
    };

    console.log('Datos a enviar:', dataToSend);

    try {
      if (isEditing) {
        const response = await vehiculosService.actualizar(formData.id, dataToSend);
        console.log('Respuesta actualizar:', response);
        await showAlert('¡Vehículo actualizado con éxito!');
      } else {
        const response = await vehiculosService.crear(dataToSend);
        console.log('Respuesta crear:', response);
        await showAlert('¡Vehículo creado con éxito!');
      }
      await cargarVehiculos();
      onClose();
    } catch (error) {
      console.error("Error al guardar vehículo:", error.response?.data || error.message);
      await showAlert(`Error al guardar el vehículo: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <div className="form-modal-overlay">
      <div className="form-modal-container">
        <div className="form-header">
          <h2>
            {isEditing ? 'Editar Información del Vehículo' : 'Registrar Nuevo Vehículo'}
          </h2>
          <button onClick={onClose} className="form-close-btn">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="form-body">
          <div className="form-grid">
            <div>
              <label className="form-label">Placa *</label>
              <input
                type="text"
                name="placa"
                className="form-input"
                value={formData.placa || ''}
                onChange={handleChange}
                required
                disabled={isEditing}
              />
            </div>

            <div>
              <label className="form-label">Marca *</label>
              <input
                name="marca"
                type="text"
                className="form-input"
                value={formData.marca || ''}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="form-label">Modelo *</label>
              <input
                name="modelo"
                type="text"
                className="form-input"
                value={formData.modelo || ''}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="form-label">Capacidad (kg) *</label>
              <input
                name="capacidadKg"
                type="number"
                className="form-input"
                value={formData.capacidadKg || ''}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-full-width estado-field-container">
              <label className="form-label">Estado del Vehículo</label>
              <div className="switch-with-text">
                <label className="switch">
                  <input
                    type="checkbox"
                    name="estado"
                    checked={formData.estado !== false}
                    onChange={(e) => setFormData({ ...formData, estado: e.target.checked })}
                  />
                  <span className="slider round"></span>
                </label>
                <span className={formData.estado !== false ? "text-active" : "text-inactive"}>
                  {formData.estado !== false ? 'Activo' : 'Inactivo'}
                </span>
              </div>
            </div>
          </div>

          <div className="form-footer">
            <button type="button" onClick={onClose} className="btn-cancel">
              Cancelar
            </button>
            <button type="submit" className="btn-submit">
              {isEditing ? 'Guardar Cambios' : 'Registrar Vehículo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VehiculoForm;
