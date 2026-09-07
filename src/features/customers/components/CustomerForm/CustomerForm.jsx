import { useState } from 'react';
import { X } from 'lucide-react';
import { useCustomers } from "../../hooks/useCustomers";
import './CustomerForm.css';
import { useAlertModal } from "../../../../shared/alertModal";

const CustomerForm = ({ isOpen, onClose, formData, setFormData, isEditing }) => {
  const { showSuccess, showError } = useAlertModal();
  const { cargarClientes } = useCustomers();
  const [errores, setErrores] = useState({});

  const validarCampo = (name, value) => {
    let error = "";
    if (name === "customer_document_number") {
      if (!value.trim()) error = "Este campo es obligatorio.";
      else if (value.length > 10) error = "Máximo 10 dígitos.";
      else if (!/^\d+$/.test(value)) error = "Solo se permiten números.";
    }
    if (name === "customer_email") {
      if (value.length > 60) error = "Máximo 60 caracteres.";
      else if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = "Formato de correo inválido.";
    }
    if (name === "customer_phone") {
      if (!value.trim()) error = "Este campo es obligatorio.";
      else if (value.length > 10) error = "Máximo 10 dígitos.";
      else if (!/^\d+$/.test(value)) error = "Solo se permiten números.";
    }
    setErrores(prev => ({ ...prev, [name]: error }));
  };

  if (!isOpen) return null;

  const handleChange = (e) => {
  const { name, value } = e.target;
  let valor = value;
  if (name === "customer_document_number" || name === "customer_phone") {
    valor = value.replace(/\D/g, '');
    if (valor.length > 10) valor = valor.slice(0, 10);
  }

  if (name === "organization_type") {
    setFormData({
      ...formData,
      organization_type: value,
      customer_document_type:
        value === "Jurídica" ? "NIT" : "CC",
      legal_representative:
        value === "Natural"
          ? ""
          : formData.legal_representative
    });

    return;
  }

  setFormData({
    ...formData,
    [name]: valor
  });
  validarCampo(name, valor);
};

  const handleSubmit = async (e) => {
    e.preventDefault();

    const nuevosErrores = {};
    if (!formData.customer_document_number || !/^\d+$/.test(formData.customer_document_number) || formData.customer_document_number.length > 10) {
      nuevosErrores.customer_document_number = "Máximo 10 dígitos y solo números.";
    }
    if ((formData.customer_email || '').length > 60 || (formData.customer_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customer_email))) {
      nuevosErrores.customer_email = "Máximo 60 caracteres y formato de correo válido.";
    }
    if (!formData.customer_phone || !/^\d+$/.test(formData.customer_phone) || formData.customer_phone.length > 10) {
      nuevosErrores.customer_phone = "Máximo 10 dígitos y solo números.";
    }
    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length > 0) return;

    const token = localStorage.getItem("token"); 
    const dataToSend = {
      organization_type: formData.organization_type,
      customer_name: formData.customer_name,
      legal_representative:
        formData.organization_type === "Jurídica"
          ? formData.legal_representative
          : null,
      customer_document_type: formData.customer_document_type,
      customer_document_number: formData.customer_document_number,
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
        await showSuccess(isEditing ? '¡Cliente actualizado con éxito!' : '¡Cliente creado con éxito!');
        await cargarClientes();
        onClose();
      } else {
        const errorData = await response.json();
        await showError(`Error del servidor: ${errorData.error || 'No se pudo procesar la solicitud'}`);
      }
    } catch (error) {
      console.error("Error en la petición:", error);
      await showError("Error de conexión: Asegúrate de que el servidor de Makand esté corriendo.");
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

            {/* Nombre o Razón Social */}
            <div>
              <label className="form-label">
                {formData.organization_type === "Jurídica"
                  ? "Razón Social *"
                  : "Nombre Completo *"}
              </label>

              <input
                name="customer_name"
                type="text"
                className="form-input"
                value={formData.customer_name || ""}
                onChange={handleChange}
                required
              />
            </div>

            {/* Representante legal (solo persona jurídica) */}
            {formData.organization_type === "Jurídica" && (
              <div>
                <label className="form-label">
                  Representante Legal *
                </label>

                <input
                  name="legal_representative"
                  type="text"
                  className="form-input"
                  value={formData.legal_representative || ""}
                  onChange={handleChange}
                  required
                />
              </div>
            )}

            {/* Tipo de Identificación */}
            <div>
              <label className="form-label">
                Tipo Documento *
              </label>

              <select
                name="customer_document_type"
                className="form-input"
                value={formData.customer_document_type || "CC"}
                onChange={handleChange}
                disabled={formData.organization_type === "Jurídica"}
              >
                <option value="CC">Cédula de Ciudadanía</option>
                <option value="CE">Cédula de Extranjería</option>
                <option value="NIT">NIT</option>
              </select>
            </div>

            {/* Número de Identificación */}
            <div>
              <label className="form-label">Número de Documento *</label>
              <input name="customer_document_number" type="text" className={`form-input ${errores.customer_document_number ? 'input-error' : ''}`} maxLength={10} value={formData.customer_document_number || ''} onChange={handleChange} required />
              {errores.customer_document_number && <span className="error-text">{errores.customer_document_number}</span>}
            </div>

            {/* Teléfono de Contacto */}
            <div>
              <label className="form-label">Teléfono / Celular *</label>
              <input name="customer_phone" type="text" className={`form-input ${errores.customer_phone ? 'input-error' : ''}`} maxLength={10} inputMode="numeric" value={formData.customer_phone || ''} onChange={handleChange} required />
              {errores.customer_phone && <span className="error-text">{errores.customer_phone}</span>}
            </div>

            {/* Correo Electrónico */}
            <div>
              <label className="form-label">Correo Electrónico</label>
              <input name="customer_email" type="email" className={`form-input ${errores.customer_email ? 'input-error' : ''}`} maxLength={60} value={formData.customer_email || ''} onChange={handleChange} />
              {errores.customer_email && <span className="error-text">{errores.customer_email}</span>}
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
                      onChange={(e) => setFormData({...formData, customer_status: e.target.checked})} 
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