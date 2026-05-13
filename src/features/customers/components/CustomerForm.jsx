// El formulario para crear/editar


import React from 'react';
import { X } from 'lucide-react';

const CustomerForm = ({ isOpen, onClose, formData, setFormData, isEditing, onSubmit }) => {
  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Estilos rápidos para las etiquetas (Labels)
  const labelStyle = {
    display: 'block',
    fontSize: '13px',
    fontWeight: '500',
    color: '#6b7280',
    marginBottom: '6px'
  };

  // Estilos para los inputs
  const inputStyle = {
    width: '100%',
    padding: '10px 12px',
    borderRadius: '8px',
    border: '1px solid #e5e7eb',
    fontSize: '14px',
    color: '#374151',
    backgroundColor: '#f9fafb',
    outline: 'none',
    boxSizing: 'border-box'
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex',
      alignItems: 'center', justifyContent: 'center', zIndex: 1100
    }}>
      <div style={{
        backgroundColor: 'white', borderRadius: '12px', width: '90%',
        maxWidth: '750px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)'
      }}>
        
        {/* Header */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '20px 24px', borderBottom: '1px solid #f3f4f6'
        }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', margin: 0 }}>
            {isEditing ? 'Editar Cliente' : 'Nuevo Cliente'}
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af' }}>
            <X size={20} />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '20px' }}>Información General</h3>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            gap: '16px 30px' 
          }}>
            
            {/* ID Cliente (Solo lectura en edición) */}
            <div>
              <label style={labelStyle}>ID Cliente</label>
              <input 
                type="text" 
                style={{ ...inputStyle, backgroundColor: '#f3f4f6', cursor: 'not-allowed' }} 
                value={formData.customId || 'CLI-001'} 
                readOnly 
              />
            </div>

            {/* Tipo Organización */}
            <div>
              <label style={labelStyle}>Tipo Organización *</label>
              <select 
                name="tipoOrganizacion"
                style={inputStyle}
                value={formData.tipoOrganizacion || 'Persona Natural'}
                onChange={handleChange}
              >
                <option value="Persona Natural">Persona Natural</option>
                <option value="Persona Jurídica">Persona Jurídica</option>
              </select>
            </div>

            {/* Nombres */}
            <div>
              <label style={labelStyle}>Nombres *</label>
              <input 
                name="firstName"
                type="text" 
                style={inputStyle} 
                value={formData.firstName} 
                onChange={handleChange}
                placeholder="Ej. Carlos Alberto"
              />
            </div>

            {/* Apellidos */}
            <div>
              <label style={labelStyle}>Apellidos *</label>
              <input 
                name="lastName"
                type="text" 
                style={inputStyle} 
                value={formData.lastName} 
                onChange={handleChange}
                placeholder="Ej. López García"
              />
            </div>

            {/* Documento */}
            <div>
              <label style={labelStyle}>Documento *</label>
              <input 
                name="documento"
                type="text" 
                style={inputStyle} 
                value={formData.documento} 
                onChange={handleChange}
                placeholder="001-000000-0000X"
              />
            </div>

            {/* Celular */}
            <div>
              <label style={labelStyle}>Celular *</label>
              <input 
                name="telefono"
                type="text" 
                style={inputStyle} 
                value={formData.telefono} 
                onChange={handleChange}
                placeholder="+505 0000-0000"
              />
            </div>

            {/* Email */}
            <div>
              <label style={labelStyle}>Email</label>
              <input 
                name="email"
                type="email" 
                style={inputStyle} 
                value={formData.email} 
                onChange={handleChange}
                placeholder="correo@ejemplo.com"
              />
            </div>

            {/* Dirección */}
            <div>
              <label style={labelStyle}>Dirección</label>
              <input 
                name="direccion"
                type="text" 
                style={inputStyle} 
                value={formData.direccion} 
                onChange={handleChange}
                placeholder="Ciudad, Barrio, Calle..."
              />
            </div>

          </div>

          {/* Footer del Formulario */}
          <div style={{
            marginTop: '32px',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '12px'
          }}>
            <button 
              type="button"
              onClick={onClose} 
              style={{
                padding: '10px 20px', borderRadius: '8px', border: '1px solid #d1d5db',
                backgroundColor: 'white', fontWeight: '600', cursor: 'pointer'
              }}
            >
              Cancelar
            </button>
            <button 
              type="submit"
              style={{
                padding: '10px 20px', borderRadius: '8px', border: 'none',
                backgroundColor: '#ff6b35', color: 'white', fontWeight: '600', cursor: 'pointer'
              }}
            >
              {isEditing ? 'Actualizar' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomerForm;