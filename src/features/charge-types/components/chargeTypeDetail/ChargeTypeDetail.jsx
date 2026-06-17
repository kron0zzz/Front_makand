import { X, Tag } from 'lucide-react';
import './ChargeTypeDetail.css';

const ChargeTypeDetail = ({ isOpen, onClose, tipoCobro, onEdit }) => {
  if (!isOpen || !tipoCobro) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">

        <div className="modal-header">
          <h2>Detalle del Tipo de Cobro</h2>
          <button onClick={onClose} className="close-button">
            <X size={20} />
          </button>
        </div>

        <div className="modal-content">
          <div className="detail-grid">

            <div className="full-width user-avatar-section">
              <div className="avatar-icon-wrapper">
                <Tag size={24} />
              </div>
              <div>
                <p className="label-text">Nombre del Tipo de Cobro</p>
                <p className="value-text value-text-large">
                  {tipoCobro.charge_type_name}
                </p>
              </div>
            </div>

            <div>
              <div className="info-item-header">
                <p className="label-text">ID del Tipo de Cobro</p>
              </div>
              <p className="value-text">
                <span className="doc-type-tag">#{tipoCobro.charge_type_id}</span>
              </p>
            </div>

          </div>

          <div className="action-buttons">
            <button onClick={() => onEdit(tipoCobro)} className="btn-primary">
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

export default ChargeTypeDetail;
