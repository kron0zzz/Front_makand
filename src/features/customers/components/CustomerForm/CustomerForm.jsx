import { X } from 'lucide-react';
import { useCustomers } from "../../hooks/useCustomers";
import './CustomerForm.css';
import { useAlertModal } from "../../../../shared/alertModal";

const CustomerForm = ({ isOpen, onClose, formData, setFormData, isEditing }) => {
  const { showAlert, showConfirm } = useAlertModal();
  const { cargarClientes } = useCustomers();

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token"); 
    const dataToSend = {
      customer_first_name: formData.customer_first_name,
      customer_last_name: formData.customer_last_name,
      customer_document_type: formData.customer_document_type,
      customer_document_number: formData.customer_document_number,
      organization_type: formData.organization_type,
      customer_phone: formData.customer_phone,
      customer_email: formData.customer_email,
      customer_address: formData.customer_address,
      customer_status:
        formData.customer_status !== undefined
          ? formData.customer_status
          : true
    };

    const url = isEditing 
      ? `http://localhost:3000/api/customers/${formData.customer_id}` 
      : 'http://localhost:3000/api/customers';
    
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(dataToSend)
      });

      if (response.ok) {
        await showAlert(isEditing ? '¡Cliente actualizado con éxito!' : '¡Cliente creado con éxito!');
        await cargarClientes();
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
            {isEditing ? 'Editar Información del Cliente' : 'Registrar Nuevo Cliente'}
          </h2>
          <button onClick={onClose} className="form-close-btn">
            <X size={20} />
          </button>
        </div>

        {/* Cuerpo del Formulario */}
        <form onSubmit={handleSubmit} className="form-body">
          <div className="form-grid">
            
            {/* ID del Cliente (Solo lectura) */}
            <div>
              <label className="form-label">Código Interno</label>
              <input 
                type="text" 
                className="form-input form-input-disabled"
                value={isEditing ? `ID: ${formData.customer_id}` : 'Asignado automáticamente'} 
                disabled 
              />
            </div>

            {/* Tipo de Organización */}
            <div>
              <label className="form-label">Tipo de Persona *</label>
              <select 
                name="organization_type" 
                className="form-input"
                value={formData.organization_type || 'Natural'} 
                onChange={handleChange}
              >
                <option value="Natural">Persona Natural</option>
                <option value="Jurídica">Persona Jurídica</option>
              </select>
            </div>

            {/* Nombres */}
            <div>
              <label className="form-label">Nombres *</label>
              <input name="customer_first_name" type="text" className="form-input" value={formData.customer_first_name || ''} onChange={handleChange} required />
            </div>

            {/* Apellidos */}
            <div>
              <label className="form-label">Apellidos *</label>
              <input name="customer_last_name" type="text" className="form-input" value={formData.customer_last_name || ''} onChange={handleChange} required />
            </div>

            {/* Tipo de Identificación */}
            <div>
              <label className="form-label">Tipo Documento *</label>
              <select name="customer_document_type" className="form-input" value={formData.customer_document_type || 'CC'} onChange={handleChange}>
                <option value="CC">Cédula de Ciudadanía</option>
                <option value="NIT">NIT</option>
                <option value="CE">Cédula de Extranjería</option>
              </select>
            </div>

            {/* Número de Identificación */}
            <div>
              <label className="form-label">Número de Documento *</label>
              <input name="customer_document_number" type="text" className="form-input" value={formData.customer_document_number || ''} onChange={handleChange} required />
            </div>

            {/* Teléfono de Contacto */}
            <div>
              <label className="form-label">Teléfono / Celular *</label>
              <input name="customer_phone" type="text" className="form-input" value={formData.customer_phone || ''} onChange={handleChange} required />
            </div>

            {/* Correo Electrónico */}
            <div>
              <label className="form-label">Correo Electrónico</label>
              <input name="customer_email" type="email" className="form-input" value={formData.customer_email || ''} onChange={handleChange} />
            </div>

            {/* Dirección de Residencia/Oficina */}
            <div className="form-full-width">
              <label className="form-label">Dirección Completa</label>
              <input name="customer_address" type="text" className="form-input" value={formData.customer_address || ''} onChange={handleChange} />
            </div>

            {/* --- NUEVO CAMPO: ESTADO (Solo visible al editar) --- */}
            {isEditing && (
              <div className="form-full-width estado-field-container">
                <label className="form-label">Estado del Cliente</label>
                <div className="switch-with-text">
                  <label className="switch">
                    <input 
                      type="checkbox" 
                      name="estado"
                      checked={formData.customer_status} 
                      onChange={(e) => setFormData({...formData, estado: e.target.checked})} 
                    />
                    <span className="slider round"></span>
                  </label>
                  <span className={formData.estado ? "text-active" : "text-inactive"}>
                    {formData.customer_status ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
              </div>
            )}

          </div>

          {/* Botones de Acción */}
          <div className="form-footer">
            <button type="button" onClick={onClose} className="btn-cancel">
              Cancelar
            </button>
            <button type="submit" className="btn-submit">
              {isEditing ? 'Guardar Cambios' : 'Registrar Cliente'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomerForm;