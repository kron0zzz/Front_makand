import { useState, useEffect } from 'react';
import { Calendar, Shield, FileText } from 'lucide-react';
import { maintenanceService } from '../../services/maintenanceService';
import { formatDate } from '../../../../shared/utils/dateUtils';
import './MaintenanceDetail.css';

const MaintenanceDetail = ({ isOpen, onClose, maintenance, onEdit }) => {
  const [maintenanceCompleta, setMaintenanceCompleta] = useState(null);
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    const cargarDetalleCompleto = async () => {
      if (!isOpen || !maintenance?.maintenance_id) return;
      setCargando(true);
      try {
        const data = await maintenanceService.obtenerPorId(maintenance.maintenance_id);
        setMaintenanceCompleta(data);
      } catch (error) {
        console.error("Error al cargar detalles del mantenimiento:", error);
        setMaintenanceCompleta(maintenance);
      } finally {
        setCargando(false);
      }
    };

    cargarDetalleCompleto();

    return () => {
      setMaintenanceCompleta(null);
    };
  }, [isOpen, maintenance]);

  if (!isOpen || !maintenance) return null;

  const datos = maintenanceCompleta || maintenance;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>Detalles de Mantenimiento</h2>
          <button className="close-button" onClick={onClose} aria-label="Cerrar">&times;</button>
        </div>

        <div className="modal-content">
          <div className="machinery-main-header full-width">
            <div className="avatar-icon-wrapper">
              <Shield size={32} />
            </div>
            <h1 className="machinery-title">Mantenimiento #{datos.maintenance_id}</h1>
            <span className="machinery-code">{datos.machinery_name || 'Maquinaria Asociada'}</span>
          </div>

          <br />

          <div className="detail-grid">
            {/* Fecha de mantenimiento formateada */}
            <div className="info-card">
              <div className="info-item-header">
                <Calendar size={16} />
                <span className="label-text">Fecha de Mantenimiento</span>
              </div>
              <span className="value-text">{formatDate(datos.maintenance_date)}</span>
            </div>

            <div className="info-card">
              <div className="info-item-header">
                <Calendar size={16} />
                <span className="label-text">Serial de este equipo</span>
              </div>
              <span className="value-text">{datos.serial_number}</span>
            </div>

            {/* Notas de revisión detalladas */}
            <div className="info-card full-width description-card">
              <div className="info-item-header">
                <FileText size={16} />
                <span className="label-text">Notas de Revisión</span>
              </div>
              <span className="value-text" style={{ whiteSpace: 'pre-wrap', display: 'block', marginTop: '8px' }}>
                {datos.revision_notes || 'No se registraron notas para este mantenimiento.'}
              </span>
            </div>
          </div>

          <div className="action-buttons">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cerrar
            </button>
            <button 
              type="button" 
              className="btn-primary" 
              onClick={() => onEdit(datos)}
              disabled={cargando}
            >
              Editar Mantenimiento
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaintenanceDetail;