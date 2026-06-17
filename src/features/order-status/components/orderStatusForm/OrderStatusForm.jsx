import { X } from 'lucide-react';
import { useOrderStatus } from "../../hooks/useOrderStatus";
import { orderStatusService } from "../../services/orderStatusService";
import './OrderStatusForm.css';

const OrderStatusForm = ({ isOpen, onClose, formData, setFormData, isEditing }) => {
  const { cargarOrderStatus } = useOrderStatus();

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dataToSend = {
      order_status_name: formData.order_status_name,
    };

    try {
      if (isEditing) {
        await orderStatusService.actualizar(formData.order_status_id, dataToSend);
        alert('Estado de pedido actualizado con éxito.');
      } else {
        await orderStatusService.crear(dataToSend);
        alert('Estado de pedido creado con éxito.');
      }
      await cargarOrderStatus();
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
            {isEditing ? 'Editar Estado de Pedido' : 'Registrar Nuevo Estado de Pedido'}
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
                value={isEditing ? `ID: ${formData.order_status_id}` : 'Asignado automáticamente'}
                disabled
              />
            </div>

            <div>
              <label className="form-label">Nombre del Estado *</label>
              <input
                name="order_status_name"
                type="text"
                className="form-input"
                value={formData.order_status_name || ''}
                onChange={handleChange}
                required
                placeholder="Ej: Pendiente, En proceso, Completado..."
              />
            </div>

          </div>

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

export default OrderStatusForm;