import { X, User, Mail, Phone, MapPin, CreditCard, Briefcase, Activity } from 'lucide-react';
import './SupplierDetail.css';

const SupplierDetail = ({ isOpen, onClose, proveedor, onEdit }) => {
  if (!isOpen || !proveedor) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
    
        {/* Header Naranja Luna Llena */}
        <div className="modal-header">
          <h2>Detalle del Proveedor</h2>
          <button onClick={onClose} className="close-button">
            <X size={20} />
          </button>
        </div>

        <div className="modal-content">
          <div className="detail-grid">
            
            {/* Nombre Completo */}
            <div className="full-width user-avatar-section">
              <div className="avatar-icon-wrapper">
                <User size={24} />
              </div>
              <div>
                <p className="label-text">Nombre Completo</p>
                <p className="value-text value-text-large">
                  {proveedor.supplier_name}
                </p>
              </div>
            </div>
            
            {/* Documento */}
            <div>
              <div className="info-item-header">
                <CreditCard size={16} color="#9ca3af" />
                <p className="label-text">Documento</p>
              </div>
              <p className="value-text">
                <span className="doc-type-tag">{proveedor.document_type}:</span> 
                {proveedor.document_number}
              </p>
            </div>

            {/* Localización */}
            <div>
              <div className="info-item-header">
                <Briefcase size={16} color="#9ca3af" />
                <p className="label-text">Ubicación proveedor</p>
              </div>
              <p className="value-text">{proveedor.supplier_state || 'No especificado'} - {proveedor.supplier_city}</p>
            </div>

            {/* Teléfono */}
            <div>
              <div className="info-item-header">
                <Phone size={16} color="#9ca3af" />
                <p className="label-text">Teléfono</p>
              </div>
              <p className="value-text">{proveedor.supplier_phone || 'Sin teléfono'}</p>
            </div>

            {/* Email */}
            <div>
              <div className="info-item-header">
                <Mail size={16} color="#9ca3af" />
                <p className="label-text">Email</p>
              </div>
              <p className="value-text">{proveedor.supplier_email || 'No registra'}</p>
            </div>

            {/* Dirección */}
            <div className="full-width">
              <div className="info-item-header">
                <MapPin size={16} color="#9ca3af" />
                <p className="label-text">Dirección</p>
              </div>
              <p className="value-text">{proveedor.supplier_address || 'Sin dirección'}</p>
            </div>

            {/* Estado */}
            <div>
              <div className="info-item-header">
                <Activity size={16} color="#9ca3af" />
                <p className="label-text">Estado en Sistema</p>
              </div>
              <span className={`status-badge ${proveedor.supplier_status ? 'status-active' : 'status-inactive'}`}>
                {proveedor.supplier_status ? 'ACTIVO' : 'INACTIVO'}
              </span>
            </div>
          </div>

          {/* Botones de Acción */}
          <div className="action-buttons">
            <button onClick={() => onEdit(proveedor)} className="btn-primary">
              Editar
            </button>
            <button onClick={onClose} className="btn-secondary">
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupplierDetail;