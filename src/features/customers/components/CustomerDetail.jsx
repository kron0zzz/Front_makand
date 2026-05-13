import React from 'react';
import { X } from 'lucide-react';

const CustomerDetail = ({ isOpen, onClose, cliente, onEdit }) => {
  // Si el modal no está abierto o no hay un cliente seleccionado, no renderizamos nada
  if (!isOpen || !cliente) return null;

  // Estilos compartidos para mantener consistencia visual
  const labelStyle = {
    fontSize: '12px',
    color: '#9ca3af',
    marginBottom: '4px',
    display: 'block',
    fontWeight: '400'
  };

  const valueStyle = {
    fontSize: '14px',
    fontWeight: '500',
    color: '#374151',
    marginBottom: '16px',
    display: 'block'
  };

  // Función para manejar el paso a la edición
  const handleEdit = () => {
    onEdit(cliente); // Llama a la función del padre para abrir el formulario
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fondo oscurecido (overlay)
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      backdropFilter: 'blur(2px)'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        width: '90%',
        maxWidth: '750px', // Ancho ajustado según image_2e0338.png
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        overflow: 'hidden',
        animation: 'modalAppear 0.3s ease-out'
      }}>
        
        {/* CABECERA DEL MODAL */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '20px 24px',
          borderBottom: '1px solid #f3f4f6'
        }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', margin: 0 }}>
            Detalles del Cliente
          </h2>
          <button 
            onClick={onClose} 
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', padding: '4px' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* CUERPO DEL MODAL */}
        <div style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#1f2937', marginBottom: '20px' }}>
            Información General
          </h3>

          {/* Tarjeta Gris con Datos (Grid de 2 columnas) */}
          <div style={{ 
            background: '#f9fafb', 
            borderRadius: '12px', 
            padding: '24px',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr', // Dos columnas iguales
            gap: '10px 40px'
          }}>
            
            {/* COLUMNA IZQUIERDA */}
            <div>
              <label style={labelStyle}>ID Cliente</label>
              <span style={valueStyle}>{cliente.customId || `CLI-00${cliente.id}`}</span>

              <label style={labelStyle}>Nombres</label>
              <span style={valueStyle}>{cliente.firstName || 'N/A'}</span>

              <label style={labelStyle}>Documento</label>
              <span style={valueStyle}>{cliente.documento || 'N/A'}</span>

              <label style={labelStyle}>Email</label>
              <span style={{...valueStyle, color: '#3b82f6'}}>{cliente.email || 'No registrado'}</span>

              <label style={labelStyle}>Dirección</label>
              <span style={{...valueStyle, marginBottom: 0}}>{cliente.direccion || 'Sin dirección registrada'}</span>
            </div>

            {/* COLUMNA DERECHA */}
            <div>
              <label style={labelStyle}>Tipo Organización</label>
              <span style={valueStyle}>{cliente.tipoOrganizacion || 'Persona Natural'}</span>

              <label style={labelStyle}>Apellidos</label>
              <span style={valueStyle}>{cliente.lastName || 'N/A'}</span>

              <label style={labelStyle}>Celular</label>
              <span style={valueStyle}>{cliente.telefono || 'Sin teléfono'}</span>

              <label style={labelStyle}>Estado</label>
              <div style={{ marginTop: '4px' }}>
                <span style={{
                  backgroundColor: cliente.estado ? '#dcfce7' : '#fee2e2',
                  color: cliente.estado ? '#16a34a' : '#dc2626',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: '600',
                  display: 'inline-block'
                }}>
                  {cliente.estado ? 'Activo' : 'Inactivo'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* PIE DEL MODAL (BOTONES) */}
        <div style={{
          padding: '16px 24px',
          borderTop: '1px solid #f3f4f6',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '12px',
          backgroundColor: '#fff'
        }}>
          <button 
            onClick={onClose} 
            style={{
              padding: '10px 24px',
              borderRadius: '8px',
              border: '1px solid #d1d5db',
              backgroundColor: 'white',
              color: '#374151',
              fontWeight: '600',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Cerrar
          </button>
          
          <button 
            onClick={handleEdit}
            style={{
              padding: '10px 24px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: '#ff6b35', // Color naranja corporativo Makand
              color: 'white',
              fontWeight: '600',
              cursor: 'pointer',
              fontSize: '14px',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#e85a2a'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#ff6b35'}
          >
            Editar
          </button>
        </div>
      </div>

      {/* Estilo para la animación de entrada */}
      <style>
        {`
          @keyframes modalAppear {
            from { opacity: 0; transform: translateY(-20px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </div>
  );
};

export default CustomerDetail;