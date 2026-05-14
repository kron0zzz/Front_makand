import React from 'react';
import { X } from 'lucide-react';
import { useCustomers } from '../hooks/useCustomers';

const CustomerForm = ({ isOpen, onClose, formData, setFormData, isEditing }) => {
  const { cargarClientes } = useCustomers();

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // LÓGICA DE ENVÍO AL BACKEND
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Mapeo exhaustivo para asegurar que ninguna columna llegue nula al Backend
    const dataToSend = {
    // Estas son las claves que el repositorio buscará en el backend
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

    // Construcción de URL según modo (Edición o Creación)
    const url = isEditing 
      ? `http://localhost:3000/api/customers/${formData.customer_id}` 
      : 'http://localhost:3000/api/customers';
    
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend)
      });

      if (response.ok) {
        alert(isEditing ? '¡Cliente actualizado con éxito!' : '¡Cliente creado con éxito!');
        await cargarClientes(); // Refresca la tabla principal
        onClose(); // Cierra el modal
      } else {
        const errorData = await response.json();
        // Esto mostrará el error exacto de PostgreSQL si algo falla
        alert(`Error del servidor: ${errorData.error || 'No se pudo procesar la solicitud'}`);
      }
    } catch (error) {
      console.error("Error en la petición:", error);
      alert("Error de conexión: Asegúrate de que el servidor de Makand esté corriendo.");
    }
  };

  // Estilos consistentes con la interfaz de Luna Llena
  const labelStyle = { display: 'block', fontSize: '13px', fontWeight: '500', color: '#6b7280', marginBottom: '6px' };
  const inputStyle = { width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '14px', color: '#374151', backgroundColor: '#f9fafb', outline: 'none', boxSizing: 'border-box' };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100 }}>
      <div style={{ backgroundColor: 'white', borderRadius: '12px', width: '90%', maxWidth: '750px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
        
        {/* Header del Modal */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid #f3f4f6' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', margin: 0, color: '#111827' }}>
            {isEditing ? 'Editar Información del Cliente' : 'Registrar Nuevo Cliente'}
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af' }}>
            <X size={20} />
          </button>
        </div>

        {/* Cuerpo del Formulario */}
        <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 30px' }}>
            
            {/* ID del Cliente (Solo lectura) */}
            <div>
              <label style={labelStyle}>Código Interno</label>
              <input 
                type="text" 
                style={{ ...inputStyle, backgroundColor: '#f3f4f6', cursor: 'not-allowed', color: '#9ca3af' }} 
                value={isEditing ? `ID: ${formData.client_id}` : 'Asignado automáticamente'} 
                disabled 
              />
            </div>

            {/* Tipo de Organización */}
            <div>
              <label style={labelStyle}>Tipo de Persona *</label>
              <select name="tipoOrganizacion" style={inputStyle} value={formData.tipoOrganizacion || 'Natural'} onChange={handleChange}>
                <option value="Natural">Persona Natural</option>
                <option value="Jurídica">Persona Jurídica</option>
              </select>
            </div>

            {/* Nombres */}
            <div>
              <label style={labelStyle}>Nombres *</label>
              <input name="firstName" type="text" style={inputStyle} value={formData.firstName || ''} onChange={handleChange} required />
            </div>

            {/* Apellidos */}
            <div>
              <label style={labelStyle}>Apellidos *</label>
              <input name="lastName" type="text" style={inputStyle} value={formData.lastName || ''} onChange={handleChange} required />
            </div>

            {/* Tipo de Identificación */}
            <div>
              <label style={labelStyle}>Tipo Documento *</label>
              <select name="tipoDocumento" style={inputStyle} value={formData.tipoDocumento || 'CC'} onChange={handleChange}>
                <option value="CC">Cédula de Ciudadanía</option>
                <option value="NIT">NIT</option>
                <option value="CE">Cédula de Extranjería</option>
              </select>
            </div>

            {/* Número de Identificación */}
            <div>
              <label style={labelStyle}>Número de Documento *</label>
              <input name="documento" type="text" style={inputStyle} value={formData.documento || ''} onChange={handleChange} required />
            </div>

            {/* Teléfono de Contacto */}
            <div>
              <label style={labelStyle}>Teléfono / Celular *</label>
              <input name="telefono" type="text" style={inputStyle} value={formData.telefono || ''} onChange={handleChange} required />
            </div>

            {/* Correo Electrónico */}
            <div>
              <label style={labelStyle}>Correo Electrónico</label>
              <input name="email" type="email" style={inputStyle} value={formData.email || ''} onChange={handleChange} />
            </div>

            {/* Dirección de Residencia/Oficina */}
            <div style={{ gridColumn: 'span 2' }}>
              <label style={labelStyle}>Dirección Completa</label>
              <input name="direccion" type="text" style={inputStyle} value={formData.direccion || ''} onChange={handleChange} />
            </div>

          </div>

          {/* Botones de Acción */}
          <div style={{ marginTop: '32px', display: 'flex', justifyContent: 'flex-end', gap: '12px', borderTop: '1px solid #f3f4f6', paddingTop: '20px' }}>
            <button 
              type="button" 
              onClick={onClose} 
              style={{ padding: '10px 24px', borderRadius: '8px', border: '1px solid #d1d5db', backgroundColor: 'white', fontWeight: '600', cursor: 'pointer', color: '#374151' }}
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              style={{ padding: '10px 24px', borderRadius: '8px', border: 'none', backgroundColor: '#ff6b35', color: 'white', fontWeight: '600', cursor: 'pointer', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}
            >
              {isEditing ? 'Guardar Cambios' : 'Registrar Cliente'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomerForm;


