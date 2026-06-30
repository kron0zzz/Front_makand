import { X, Building, Phone, MapPin, User, Activity } from 'lucide-react';
import './ProjectDetail.css';

const ProjectDetail = ({ isOpen, onClose, proyecto, onEdit }) => {
  if (!isOpen || !proyecto) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>Detalle del Proyecto</h2>
          <button onClick={onClose} className="close-button">
            <X size={20} />
          </button>
        </div>

        <div className="modal-content">
          <div className="detail-grid">
            <div className="full-width user-avatar-section">
              <div className="avatar-icon-wrapper">
                <Building size={24} />
              </div>
              <div>
                <p className="label-text">Nombre del Proyecto</p>
                <p className="value-text value-text-large">{proyecto.project_name}</p>
              </div>
            </div>

            <div>
              <div className="info-item-header">
                <User size={16} color="#9ca3af" />
                <p className="label-text">Cliente</p>
              </div>
              <p className="value-text">
                {proyecto.customer_first_name} {proyecto.customer_last_name}
              </p>
            </div>

            <div>
              <div className="info-item-header">
                <Phone size={16} color="#9ca3af" />
                <p className="label-text">Teléfono</p>
              </div>
              <p className="value-text">{proyecto.project_phone || 'Sin teléfono'}</p>
            </div>

            <div>
              <div className="info-item-header">
                <MapPin size={16} color="#9ca3af" />
                <p className="label-text">Ciudad</p>
              </div>
              <p className="value-text">{proyecto.project_city || 'No especificada'}</p>
            </div>

            <div className="full-width">
              <div className="info-item-header">
                <MapPin size={16} color="#9ca3af" />
                <p className="label-text">Dirección</p>
              </div>
              <p className="value-text">{proyecto.project_address || 'Sin dirección'}</p>
            </div>

            <div>
              <div className="info-item-header">
                <Activity size={16} color="#9ca3af" />
                <p className="label-text">Estado en Sistema</p>
              </div>
              <span className={`status-badge ${proyecto.project_status ? 'status-active' : 'status-inactive'}`}>
                {proyecto.project_status ? 'ACTIVO' : 'INACTIVO'}
              </span>
            </div>
          </div>

          <div className="action-buttons">
            <button onClick={() => onEdit(proyecto)} className="btn-primary">
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

export default ProjectDetail;