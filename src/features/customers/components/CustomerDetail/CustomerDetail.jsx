import { X, User, Mail, Phone, MapPin, CreditCard, Briefcase, Activity } from 'lucide-react';
import './CustomerDetail.css'; // Importamos los estilos de la feature

const CustomerDetail = ({ isOpen, onClose, cliente, onEdit }) => {
  if (!isOpen || !cliente) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
    
        {/* Header Naranja Luna Llena */}
        <div className="modal-header">
          <h2>Detalle del Cliente</h2>
          <button onClick={onClose} className="close-button">
            <X size={20} />
          </button>
        </div>

        <div className="modal-content">
          <div className="detail-grid">
            
      
            {/* Cliente */}
            <div className="full-width user-avatar-section">
              <div className="avatar-icon-wrapper">
                <User size={24} />
              </div>

              <div>
                <p className="label-text">
                  {cliente.organization_type === "Jurídica"
                    ? "Razón Social"
                    : "Cliente"}
                </p>

                <p className="value-text value-text-large">
                  {cliente.customer_name}
                </p>

                {cliente.organization_type === "Jurídica" &&
                  cliente.legal_representative && (
                    <p
                      className="value-text"
                      style={{
                        marginTop: "4px",
                        color: "#6b7280",
                        fontSize: "0.9rem"
                      }}
                    >
                      <strong>Representante legal:</strong>{" "}
                      {cliente.legal_representative}
                    </p>
                  )}
              </div>
            </div>
            
            {/* Documento */}
            <div>
              <div className="info-item-header">
                <CreditCard size={16} color="#9ca3af" />
                <p className="label-text">Documento</p>
              </div>
              <p className="value-text">
                <span className="doc-type-tag">
                  {cliente.customer_document_type}
                </span>{" "}
                {cliente.customer_document_number}
              </p>
            </div>

            {/* Tipo de Organización */}
            <div>
              <div className="info-item-header">
                <Briefcase size={16} color="#9ca3af" />
                <p className="label-text">Tipo de Persona</p>
              </div>
              <p className="value-text">{cliente.organization_type || 'No especificado'}</p>
            </div>

            {/* Teléfono */}
            <div>
              <div className="info-item-header">
                <Phone size={16} color="#9ca3af" />
                <p className="label-text">Teléfono</p>
              </div>
              <p className="value-text">{cliente.customer_phone || 'Sin teléfono'}</p>
            </div>

            {/* Email */}
            <div>
              <div className="info-item-header">
                <Mail size={16} color="#9ca3af" />
                <p className="label-text">Email</p>
              </div>
              <p className="value-text">{cliente.customer_email || 'No registra'}</p>
            </div>

            {/* Dirección */}
            <div className="full-width">
              <div className="info-item-header">
                <MapPin size={16} color="#9ca3af" />
                <p className="label-text">Dirección</p>
              </div>
              <p className="value-text">{cliente.customer_address || 'Sin dirección'}</p>
            </div>

            {/* Estado */}
            <div>
              <div className="info-item-header">
                <Activity size={16} color="#9ca3af" />
                <p className="label-text">Estado en Sistema</p>
              </div>
              <span className={`status-badge ${cliente.customer_status ? 'status-active' : 'status-inactive'}`}>
                {cliente.customer_status ? 'ACTIVO' : 'INACTIVO'}
              </span>
            </div>
            
          </div>

          {/* Botones de Acción */}
          <div className="action-buttons">
            <button onClick={() => onEdit(cliente)} className="btn-primary">
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

export default CustomerDetail;