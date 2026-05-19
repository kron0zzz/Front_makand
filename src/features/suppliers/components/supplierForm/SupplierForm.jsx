import { X } from 'lucide-react';
import { useSuppliers } from "../../hooks/useSuppliers";
import './SupplierForm.css';

const SupplierForm = ({ isOpen, onClose, formData, setFormData, isEditing }) => {
  const { cargarProveedores } = useSuppliers();

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const dataToSend = {
      document_number: formData.document_number,
      document_type: formData.document_type || 'CC', 
      supplier_name: formData.supplier_name,
      supplier_phone: formData.supplier_phone,
      supplier_address: formData.supplier_address,
      supplier_email: formData.supplier_email,
      supplier_state: formData.supplier_state,
      supplier_city: formData.supplier_city,
      supplier_status: formData.supplier_status !== undefined ? formData.supplier_status : true
    };

    const url = isEditing 
      ? `http://localhost:3000/api/suppliers/${formData.supplier_id}` 
      : 'http://localhost:3000/api/suppliers';
    
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend)
      });

      if (response.ok) {
        alert(isEditing ? '¡Proveedor actualizado con éxito!' : '¡Proveedor creado con éxito!');
        await cargarProveedores();
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
            {isEditing ? 'Editar Información del Proveedor' : 'Registrar Nuevo Proveedor'}
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
                value={isEditing ? `ID: ${formData.supplier_id}` : 'Asignado automáticamente'} 
                disabled 
              />
            </div>

            {/* Departamento */}
            <div>
              <label className="form-label">Departamento *</label>
              <select 
                name="supplier_state" 
                className="form-input"
                value={formData.supplier_state || 'indefinido'} 
                onChange={handleChange}
              >
                <option value="Antioquia">Antioquia</option>
                <option value="Chocó">Chocó</option>
              </select>
            </div>

            {/* Ciudad */}
            <div>
              <label className="form-label">Ciudad *</label>
              <select 
                name="supplier_city" 
                className="form-input"
                value={formData.supplier_city || 'indefinido'} 
                onChange={handleChange}
              >
                <option value="Medellin">Medayork</option>
                <option value="Barrancabermeja">Barrancabermeja</option>
              </select>
            </div>



            {/* Nombres */}
            <div>
              <label className="form-label">Nombre *</label>
              <input name="supplier_name" type="text" className="form-input" value={formData.supplier_name || ''} onChange={handleChange} required />
            </div>


            {/* Tipo de Identificación */}
            <div>
              <label className="form-label">Tipo Documento *</label>
              <select name="document_type" className="form-input" value={formData.document_type || 'CC'} onChange={handleChange}>
                <option value="CC">Cédula de Ciudadanía</option>
                <option value="NIT">NIT</option>
                <option value="CE">Cédula de Extranjería</option>
              </select>
            </div>

            {/* Número de Identificación */}
            <div>
              <label className="form-label">Número de Documento *</label>
              <input name="document_number" type="text" className="form-input" value={formData.document_number || ''} onChange={handleChange} required />
            </div>

            {/* Teléfono de Contacto */}
            <div>
              <label className="form-label">Teléfono / Celular *</label>
              <input name="supplier_phone" type="text" className="form-input" value={formData.supplier_phone || ''} onChange={handleChange} required />
            </div>

            {/* Correo Electrónico */}
            <div>
              <label className="form-label">Correo Electrónico</label>
              <input name="supplier_email" type="email" className="form-input" value={formData.supplier_email || ''} onChange={handleChange} />
            </div>

            {/* Dirección de Residencia/Oficina */}
            <div className="form-full-width">
              <label className="form-label">Dirección Completa</label>
              <input name="supplier_address" type="text" className="form-input" value={formData.supplier_address || ''} onChange={handleChange} />
            </div>

            {/* --- NUEVO CAMPO: ESTADO (Solo visible al editar) --- */}
            {isEditing && (
              <div className="form-full-width estado-field-container">
                <label className="form-label">Estado del Proveedor</label>
                <div className="switch-with-text">
                  <label className="switch">
                    <input 
                      type="checkbox" 
                      name="supplier_status"
                      checked={formData.supplier_status} 
                      onChange={(e) => setFormData({...formData, supplier_status: e.target.checked})} 
                    />
                    <span className="slider round"></span>
                  </label>
                  <span className={formData.supplier_status ? "text-active" : "text-inactive"}>
                    {formData.supplier_status ? 'Activo' : 'Inactivo'}
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
              {isEditing ? 'Guardar Cambios' : 'Registrar Proveedor'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SupplierForm;