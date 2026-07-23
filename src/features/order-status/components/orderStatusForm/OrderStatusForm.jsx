import { X } from 'lucide-react';
import { orderStatusService } from "../../services/orderStatusService";
import './OrderStatusForm.css';

const OrderStatusForm = ({ isOpen, onClose, formData, setFormData, isEditing, cargarOrderStatus }) => {
  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await orderStatusService.actualizar(formData.order_status_id, { order_status_name: formData.order_status_name });
        alert('Estado de pedido actualizado.');
      } else {
        await orderStatusService.crear({ order_status_name: formData.order_status_name });
        alert('Estado de pedido creado.');
      }
      await cargarOrderStatus();
      onClose();
    } catch (error) {
      console.error("Error:", error);
      alert(error.message || "Error al procesar la solicitud.");
    }
  };
  
  return (
    <div className="form-modal-overlay">
      <div className="form-modal-container">
        <div className="form-header">
          <h2>{isEditing ? 'Editar Estado' : 'Registrar Nuevo Estado'}</h2>
          <button onClick={onClose} className="form-close-btn"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="form-body">
          <div className="form-grid">
            <div>
              <label className="form-label">ID</label>
              <input type="text" className="form-input form-input-disabled" value={isEditing ? formData.order_status_id : 'Automático'} disabled />
            </div>
            <div>
              <label className="form-label">Nombre del Estado *</label>
              <input name="order_status_name" type="text" className="form-input" value={formData.order_status_name || ''} onChange={handleChange} required />
            </div>
          </div>
          <div className="form-footer">
            <button type="button" onClick={onClose} className="btn-cancel">Cancelar</button>
            <button type="submit" className="btn-submit">{isEditing ? 'Guardar' : 'Registrar'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrderStatusForm;