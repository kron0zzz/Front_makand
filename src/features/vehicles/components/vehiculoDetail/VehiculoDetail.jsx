import { X, Car, Ruler, Settings, Activity } from 'lucide-react';
import './VehiculoDetail.css';

const VehiculoDetail = ({ isOpen, onClose, vehiculo, onEdit }) => {
  if (!isOpen || !vehiculo) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>Detalle del Vehículo</h2>
          <button onClick={onClose} className="close-button">
            <X size={20} />
          </button>
        </div>

        <div className="modal-content">
          <div className="detail-grid">
            <div className="full-width user-avatar-section">
              <div className="avatar-icon-wrapper">
                <Car size={24} />
              </div>
              <div>
                <p className="label-text">Placa del Vehículo</p>
                <p className="value-text value-text-large">
                  {vehiculo.placa}
                </p>
              </div>
            </div>

            <div>
              <div className="info-item-header">
                <Car size={16} color="#9ca3af" />
                <p className="label-text">Marca</p>
              </div>
              <p className="value-text">{vehiculo.marca}</p>
            </div>

            <div>
              <div className="info-item-header">
                <Settings size={16} color="#9ca3af" />
                <p className="label-text">Modelo</p>
              </div>
              <p className="value-text">{vehiculo.modelo}</p>
            </div>

            <div>
              <div className="info-item-header">
                <Ruler size={16} color="#9ca3af" />
                <p className="label-text">Capacidad</p>
              </div>
              <p className="value-text">
                {vehiculo.capacidadKg ? Number(vehiculo.capacidadKg).toLocaleString() + ' kg' : '—'}
              </p>
            </div>

            <div>
              <div className="info-item-header">
                <Activity size={16} color="#9ca3af" />
                <p className="label-text">Estado en Sistema</p>
              </div>
              <span className={`status-badge ${vehiculo.estado === 'Activo' ? 'status-active' : 'status-inactive'}`}>
                {vehiculo.estado === 'Activo' ? 'ACTIVO' : 'INACTIVO'}
              </span>
            </div>
          </div>

          <div className="action-buttons">
            <button onClick={() => onEdit(vehiculo)} className="btn-primary">
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

export default VehiculoDetail;
