import { X } from 'lucide-react';
import { useSuppliers } from "../../hooks/useSuppliers";
import './SupplierForm.css';
import { useEffect, useState } from 'react';
import { useAlertModal } from "../../../../shared/alertModal";

const SupplierForm = ({ isOpen, onClose, formData, setFormData, isEditing }) => {
  const { showAlert, showConfirm } = useAlertModal();
  const { cargarProveedores } = useSuppliers();
  const [departamentos, setDepartamentos] = useState([]);
  const [ciudades, setCiudades] = useState([]);
  const [errores, setErrores] = useState({});

  useEffect(() => {
    if (!isOpen) return;
  
    const cargarDepartamentos = async () => {
      try {
        const response = await fetch('https://api-colombia.com/api/v1/Department');
        const data = await response.json();
        setDepartamentos(data);
      } catch (error) {
        console.error('Error cargando departamentos:', error);
      }
    };
    cargarDepartamentos();
}, [isOpen]);


  useEffect(() => {
    const cargarCiudades = async () => {
      if (!formData.supplier_state) return;
      try {
        const response = await fetch('https://api-colombia.com/api/v1/City');
        const data = await response.json();
        const departamentoSeleccionado = departamentos.find(dep => dep.name === formData.supplier_state);
        const ciudadesFiltradas = data.filter(city => city.departmentId === departamentoSeleccionado?.id);
        setCiudades(ciudadesFiltradas);
      } catch (error) {
        console.error('Error cargando ciudades:', error);
      }
    };
    cargarCiudades();
  }, [formData.supplier_state, departamentos]);

  const validarCampo = (name, value) => {
    let error = "";    
    if (name === "document_number" && value.length > 10) error = "El número es demasiado largo (máx 10).";
    if (name === "supplier_phone" && value.length > 10) error = "El teléfono es demasiado largo (máx 10).";
    if (name === "supplier_email" && value && !/\S+@\S+\.\S+/.test(value)) error = "Formato de correo inválido.";
    
    setErrores(prev => ({ ...prev, [name]: error }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    validarCampo(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (Object.values(errores).some(e => e !== "")) {
      await showAlert("Por favor, corrige los errores antes de guardar.");
      return;
    }

    const dataToSend = {
      document_number: formData.document_number,
      document_type: formData.document_type || 'CC', 
      supplier_name: formData.supplier_name,
      supplier_phone: formData.supplier_phone,
      supplier_address: formData.supplier_address,
      supplier_email: formData.supplier_email,
      supplier_state: formData.supplier_state || 'Antioquia',
      supplier_city: formData.supplier_city || 'Medellín',
      supplier_status: formData.supplier_status !== undefined ? formData.supplier_status : true
    };

    const url = isEditing ? `http://localhost:3000/api/suppliers/${formData.supplier_id}` : 'http://localhost:3000/api/suppliers';
    const method = isEditing ? 'PUT' : 'POST';
    
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(dataToSend)
      });

      if (response.ok) {
        await showAlert(isEditing ? '¡Proveedor actualizado con éxito!' : '¡Proveedor creado con éxito!');
        await cargarProveedores();
        onClose();
      } else {
        const errorData = await response.json();
        await showAlert(`Error al guardar: ${errorData.error || 'Verifica que todos los campos cumplan con el formato requerido.'}`);
      }
    } catch (error) {
      await showAlert("Error de conexión: El servidor no responde.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="form-modal-overlay">
      <div className="form-modal-container">
        <div className="form-header">
          <h2>{isEditing ? 'Editar Proveedor' : 'Registrar Nuevo Proveedor'}</h2>
          <button onClick={onClose} className="form-close-btn"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="form-body">
          <div className="form-grid">
            <div>
              <label className="form-label">Código Interno</label>
              <input type="text" className="form-input form-input-disabled" value={isEditing ? `ID: ${formData.supplier_id}` : 'Asignado automáticamente'} disabled />
            </div>

            <div>
              <label className="form-label">Departamento *</label>
              <select name="supplier_state" className="form-input" value={formData.supplier_state || ''} onChange={handleChange} required>
                <option value="">Seleccione...</option>
                {departamentos.map(dep => <option key={dep.id} value={dep.name}>{dep.name}</option>)}
              </select>
            </div>

            <div>
              <label className="form-label">Ciudad *</label>
              <select name="supplier_city" className="form-input" value={formData.supplier_city || ''} onChange={handleChange} required>
                <option value="">Seleccione...</option>
                {ciudades.map(city => <option key={city.id} value={city.name}>{city.name}</option>)}
              </select>
            </div>

            <div>
              <label className="form-label">Nombre *</label>
              <input name="supplier_name" type="text" className="form-input" value={formData.supplier_name || ''} onChange={handleChange} required />
            </div>

            <div>
              <label className="form-label">Tipo Documento *</label>
              <select name="document_type" className="form-input" value={formData.document_type || 'CC'} onChange={handleChange}>
                <option value="CC">Cédula de Ciudadanía</option>
                <option value="NIT">NIT</option>
                <option value="CE">Cédula de Extranjería</option>
              </select>
            </div>

            <div>
              <label className="form-label">Número de Documento *</label>
              <input name="document_number" className={`form-input ${errores.document_number ? 'input-error' : ''}`} value={formData.document_number || ''} onChange={handleChange} required />
              {errores.document_number && <span className="error-text">{errores.document_number}</span>}
            </div>

            <div>
              <label className="form-label">Teléfono *</label>
              <input name="supplier_phone" className={`form-input ${errores.supplier_phone ? 'input-error' : ''}`} value={formData.supplier_phone || ''} onChange={handleChange} required />
              {errores.supplier_phone && <span className="error-text">{errores.supplier_phone}</span>}
            </div>

            <div>
              <label className="form-label">Correo</label>
              <input name="supplier_email" className={`form-input ${errores.supplier_email ? 'input-error' : ''}`} value={formData.supplier_email || ''} onChange={handleChange} />
              {errores.supplier_email && <span className="error-text">{errores.supplier_email}</span>}
            </div>

            <div className="form-full-width">
              <label className="form-label">Dirección</label>
              <input name="supplier_address" type="text" className="form-input" value={formData.supplier_address || ''} onChange={handleChange} />
            </div>

            {isEditing && (
              <div className="form-full-width">
                <label className="form-label">Estado</label>
                <input type="checkbox" checked={formData.supplier_status} onChange={(e) => setFormData({...formData, supplier_status: e.target.checked})} />
                <span>{formData.supplier_status ? ' Activo' : ' Inactivo'}</span>
              </div>
            )}
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

export default SupplierForm;