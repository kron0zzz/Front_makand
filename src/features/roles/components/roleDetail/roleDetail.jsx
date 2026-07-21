import { X, Shield, Activity, ListChecks } from 'lucide-react';
import PermissionsSelector from './PermissionsSelector';
import './roleDetail.css';

export const RoleDetail = ({ role, onClose, onEdit }) => {
  if (!role) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>Detalle del Rol</h2>
          <button onClick={onClose} className="close-button">
            <X size={20} />
          </button>
        </div>

        <div className="modal-content">
          <div className="detail-grid">
            <div className="full-width user-avatar-section">
              <div className="avatar-icon-wrapper">
                <Shield size={24} />
              </div>
              <div>
                <p className="label-text">Nombre del Rol</p>
                <p className="value-text value-text-large">{role.role_name}</p>
              </div>
            </div>

            <div>
              <div className="info-item-header">
                <Activity size={16} color="#9ca3af" />
                <p className="label-text">Estado en Sistema</p>
              </div>
              <span className={`status-badge ${role.role_status ? 'status-active' : 'status-inactive'}`}>
                {role.role_status ? 'ACTIVO' : 'INACTIVO'}
              </span>
            </div>

            <div className="full-width">
              <div className="info-item-header">
                <ListChecks size={16} color="#9ca3af" />
                <p className="label-text">Permisos Asignados</p>
              </div>
              <div className="permissions-container-view">
                <PermissionsSelector roleId={role.role_id} isEditable={false} />
              </div>
            </div>
          </div>

          <div className="action-buttons">
            {/* Se ejecuta onEdit pasando el objeto role */}
            <button onClick={() => onEdit(role)} className="btn-primary">Editar</button>
            <button onClick={onClose} className="btn-secondary">Cerrar</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleDetail;