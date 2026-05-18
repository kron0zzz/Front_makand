import React from 'react';
import { X, User, Mail, Phone, MapPin, CreditCard, Briefcase, Activity } from 'lucide-react';

const SupplierDetail = ({ isOpen, onClose, proveedor, onEdit }) => {
  if (!isOpen || !proveedor) return null;

  // Estilos de la interfaz Luna Llena
  const labelStyle = { fontSize: '12px', color: '#6b7280', marginBottom: '2px', fontWeight: '500' };
  const valueStyle = { fontSize: '14px', color: '#111827', fontWeight: '600' };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100 }}>
      <div style={{ backgroundColor: 'white', borderRadius: '12px', width: '90%', maxWidth: '550px', overflow: 'hidden', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
        
        {/* Header Naranja Luna Llena */}
        <div style={{ backgroundColor: '#ff6b35', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'white' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', margin: 0 }}>Ficha del Proveedor</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'white' }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ padding: '24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            
            {/* Nombre Completo */}
            <div style={{ gridColumn: 'span 2', display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid #f3f4f6', paddingBottom: '15px' }}>
              <div style={{ backgroundColor: '#fff7ed', padding: '10px', borderRadius: '50%', color: '#ff6b35' }}>
                <User size={24} />
              </div>
              <div>
                <p style={labelStyle}>Nombre Completo</p>
                <p style={{ ...valueStyle, fontSize: '18px' }}>
                  {proveedor.supplier_name}
                </p>
              </div>
            </div>

            {/* Documento */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <CreditCard size={16} color="#9ca3af" />
                <p style={labelStyle}>Documento</p>
              </div>
              <p style={valueStyle}>
                {/* Se asegura de usar customer_document_type */}
                <span style={{ color: '#ff6b35', marginRight: '4px' }}>{proveedor.document_type}:</span> 
                {proveedor.document_number}
              </p>
            </div>

            {/* Tipo de Organización */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <Briefcase size={16} color="#9ca3af" />
                <p style={labelStyle}>Localización</p>
              </div>
              <p style={valueStyle}>{proveedor.supplier_state || 'No especificado'} - {proveedor.supplier_city}</p>
            </div>

            {/* Teléfono */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <Phone size={16} color="#9ca3af" />
                <p style={labelStyle}>Teléfono</p>
              </div>
              <p style={valueStyle}>{proveedor.supplier_phone || 'Sin teléfono'}</p>
            </div>

            {/* Email */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <Mail size={16} color="#9ca3af" />
                <p style={labelStyle}>Email</p>
              </div>
              <p style={valueStyle}>{proveedor.supplier_email || 'No registra'}</p>
            </div>

            {/* Dirección */}
            <div style={{ gridColumn: 'span 2' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <MapPin size={16} color="#9ca3af" />
                <p style={labelStyle}>Dirección</p>
              </div>
              <p style={valueStyle}>{proveedor.supplier_address || 'Sin dirección'}</p>
            </div>

            {/* Estado */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <Activity size={16} color="#9ca3af" />
                <p style={labelStyle}>Estado en Sistema</p>
              </div>
              <span style={{ 
                padding: '4px 12px', 
                borderRadius: '12px', 
                fontSize: '12px', 
                fontWeight: 'bold',
                backgroundColor: proveedor.supplier_status ? '#dcfce7' : '#fee2e2',
                color: proveedor.supplier_status ? '#166534' : '#991b1b'
              }}>
                {proveedor.supplier_status ? 'ACTIVO' : 'INACTIVO'}
              </span>
            </div>
          </div>

          {/* Botones de Acción */}
          <div style={{ marginTop: '32px', display: 'flex', gap: '12px' }}>
            <button 
              onClick={() => onEdit(proveedor)}
              style={{ flex: 1, padding: '12px', borderRadius: '8px', border: 'none', backgroundColor: '#ff6b35', color: 'white', fontWeight: '600', cursor: 'pointer', transition: '0.2s' }}
            >
              Editar
            </button>
            <button 
              onClick={onClose}
              style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db', backgroundColor: '#f9fafb', fontWeight: '600', cursor: 'pointer', color: '#374151' }}
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupplierDetail;