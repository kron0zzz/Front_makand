import { X } from 'lucide-react';
import { useCustomers } from "../../hooks/useCustomers";
import './CustomerForm.css';

const CustomerForm = ({ isOpen, onClose, formData, setFormData, isEditing }) => {
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
      customer_first_name: formData.firstName,
      customer_last_name: formData.lastName,
      customer_document_type: formData.tipoDocumento || 'CC', 
      customer_document_number: formData.documento,
      organization_type: formData.tipoOrganizacion || 'Natural',
      customer_phone: formData.telefono,
      customer_email: formData.email,
      customer_address: formData.direccion,
      customer_status: formData.estado !== undefined ? formData.estado : true
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
        alert(isEditing ? '¡Cliente actualizado con éxito!' : '¡Cliente creado con éxito!');
        await cargarClientes();
        onClose();
      } else {
        const errorData = await response.json();
        alert(`Error del servidor: ${errorData.error || 'No se pudo procesar la solicitud'}`);
      }
    } catch (error) {
      console.error("Error en la petición:", error);
      alert("Error de conexión: Asegúrate de que el servidor de Makand esté corriendo.");
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
                name="tipoOrganizacion" 
                className="form-input"
                value={formData.tipoOrganizacion || 'Natural'} 
                onChange={handleChange}
              >
                <option value="Natural">Persona Natural</option>
                <option value="Jurídica">Persona Jurídica</option>
              </select>
            </div>

            {/* Nombres */}
            <div>
              <label className="form-label">Nombres *</label>
              <input name="firstName" type="text" className="form-input" value={formData.firstName || ''} onChange={handleChange} required />
            </div>

            {/* Apellidos */}
            <div>
              <label className="form-label">Apellidos *</label>
              <input name="lastName" type="text" className="form-input" value={formData.lastName || ''} onChange={handleChange} required />
            </div>

            {/* Tipo de Identificación */}
            <div>
              <label className="form-label">Tipo Documento *</label>
              <select name="tipoDocumento" className="form-input" value={formData.tipoDocumento || 'CC'} onChange={handleChange}>
                <option value="CC">Cédula de Ciudadanía</option>
                <option value="NIT">NIT</option>
                <option value="CE">Cédula de Extranjería</option>
              </select>
            </div>

            {/* Número de Identificación */}
            <div>
              <label className="form-label">Número de Documento *</label>
              <input name="documento" type="text" className="form-input" value={formData.documento || ''} onChange={handleChange} required />
            </div>

            {/* Teléfono de Contacto */}
            <div>
              <label className="form-label">Teléfono / Celular *</label>
              <input name="telefono" type="text" className="form-input" value={formData.telefono || ''} onChange={handleChange} required />
            </div>

            {/* Correo Electrónico */}
            <div>
              <label className="form-label">Correo Electrónico</label>
              <input name="email" type="email" className="form-input" value={formData.email || ''} onChange={handleChange} />
            </div>

            {/* Dirección de Residencia/Oficina */}
            <div className="form-full-width">
              <label className="form-label">Dirección Completa</label>
              <input name="direccion" type="text" className="form-input" value={formData.direccion || ''} onChange={handleChange} />
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
                      checked={formData.estado} 
                      onChange={(e) => setFormData({...formData, estado: e.target.checked})} 
                    />
                    <span className="slider round"></span>
                  </label>
                  <span className={formData.estado ? "text-active" : "text-inactive"}>
                    {formData.estado ? 'Activo' : 'Inactivo'}
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