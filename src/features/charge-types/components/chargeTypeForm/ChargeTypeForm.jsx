import { X } from 'lucide-react';
import { useChargeTypes } from "../../hooks/useChargeTypes";
import { chargeTypeService } from "../../services/chargeTypeService";
import './ChargeTypeForm.css';

const ChargeTypeForm = ({ isOpen, onClose, formData, setFormData, isEditing }) => {
  const { cargarTiposCobro } = useChargeTypes();

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dataToSend = {
      charge_type_name: formData.charge_type_name,
    };

    try {
      if (isEditing) {
        await chargeTypeService.actualizar(formData.charge_type_id, dataToSend);
        alert('Tipo de cobro actualizado con éxito.');
      } else {
        await chargeTypeService.crear(dataToSend);
        alert('Tipo de cobro creado con éxito.');
      }
      await cargarTiposCobro();
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
            {isEditing ? 'Editar Tipo de Cobro' : 'Registrar Nuevo Tipo de Cobro'}
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
                value={isEditing ? `ID: ${formData.charge_type_id}` : 'Asignado automáticamente'}
                disabled
              />
            </div>

            <div>
              <label className="form-label">Nombre del Tipo de Cobro *</label>
              <input
                name="charge_type_name"
                type="text"
                className="form-input"
                value={formData.charge_type_name || ''}
                onChange={handleChange}
                required
                placeholder="Ej: Alquiler por día, Transporte..."
              />
            </div>

          </div>

          <div className="form-footer">
            <button type="button" onClick={onClose} className="btn-cancel">
              Cancelar
            </button>
            <button type="submit" className="btn-submit">
              {isEditing ? 'Guardar Cambios' : 'Registrar Tipo de Cobro'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChargeTypeForm;
