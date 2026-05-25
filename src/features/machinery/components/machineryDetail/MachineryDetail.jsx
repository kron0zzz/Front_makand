import { X, Wrench, Calendar, DollarSign, Scale, Layers, Activity, FileText, Cpu } from 'lucide-react';
import './MachineryDetail.css'; // Puedes copiar tus estilos base de SupplierDetail.css

const MachineryDetail = ({ isOpen, onClose, machinery, onEdit }) => {
  if (!isOpen || !machinery) return null;

  // Formateador de moneda local para los precios
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(value || 0);
  };

  // Formateador visual para fechas limpias
  const formatDate = (dateStr) => {
    if (!dateStr) return 'No programada';
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        
        {/* Header del Modal */}
        <div className="modal-header">
          <h2>Detalle de la Maquinaria</h2>
          <button onClick={onClose} className="close-button">
            <X size={20} />
          </button>
        </div>

        {/* Contenido del Detalle */}
        <div className="modal-content">
          <div className="detail-grid">
            
            {/* Nombre e ID de la Maquinaria */}
            <div className="full-width user-avatar-section">
              <div className="avatar-icon-wrapper">
                <Wrench size={24} />
              </div>
              <div>
                <p className="label-text">Nombre del Equipo (Código Interno: #{machinery.machinery_id})</p>
                <p className="value-text value-text-large">
                  {machinery.machinery_name}
                </p>
              </div>
            </div>
            
            {/* Categoría */}
            <div>
              <div className="info-item-header">
                <Cpu size={16} color="#9ca3af" />
                <p className="label-text">Categoría / Tipo</p>
              </div>
              <p className="value-text">{machinery.category_name || 'Sin categoría asignada'}</p>
            </div>

            {/* Cantidad disponible en Inventario */}
            <div>
              <div className="info-item-header">
                <Layers size={16} color="#9ca3af" />
                <p className="label-text">Stock Disponible</p>
              </div>
              <p className="value-text"><strong>{machinery.stock_quantity}</strong> unidades</p>
            </div>

            {/* Precio de Venta */}
            <div>
              <div className="info-item-header">
                <DollarSign size={16} color="#9ca3af" />
                <p className="label-text">Precio de Venta</p>
              </div>
              <p className="value-text">{formatCurrency(machinery.sale_price)}</p>
            </div>

            {/* Precio de Alquiler Diario */}
            <div>
              <div className="info-item-header">
                <DollarSign size={16} color="#9ca3af" />
                <p className="label-text">Alquiler por Día</p>
              </div>
              <p className="value-text">{formatCurrency(machinery.daily_rental_price)}</p>
            </div>

            {/* Peso */}
            <div>
              <div className="info-item-header">
                <Scale size={16} color="#9ca3af" />
                <p className="label-text">Peso Neto</p>
              </div>
              <p className="value-text">{machinery.weight_kg ? `${machinery.weight_kg} Kg` : 'No especificado'}</p>
            </div>

            {/* Próxima Revisión */}
            <div>
              <div className="info-item-header">
                <Calendar size={16} color="#9ca3af" />
                <p className="label-text">Próxima Revisión Técnica</p>
              </div>
              <p className="value-text">{formatDate(machinery.next_revision_date)}</p>
            </div>

            {/* Atributos Booleanos (Motorizado / Propiedad) */}
            <div>
              <div className="info-item-header">
                <Wrench size={16} color="#9ca3af" />
                <p className="label-text">Propiedades del Equipo</p>
              </div>
              <p className="value-text" style={{ fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span>⚡ <strong>Motorizado:</strong> {machinery.is_motorized ? 'Sí' : 'No'}</span>
                <span>🏢 <strong>Origen:</strong> {machinery.is_owned ? 'Propio de la Empresa' : 'Subcontratado / Externo'}</span>
              </p>
            </div>

            {/* Estado actual en el sistema */}
            <div>
              <div className="info-item-header">
                <Activity size={16} color="#9ca3af" />
                <p className="label-text">Estado Actual</p>
              </div>
              <span className={`status-badge status-${machinery.status_name?.toLowerCase().replace(/\s+/g, '-')}`}>
                {machinery.status_name || 'DESCONOCIDO'}
              </span>
            </div>

            {/* Descripción Completa */}
            <div className="full-width">
              <div className="info-item-header">
                <FileText size={16} color="#9ca3af" />
                <p className="label-text">Descripción y Especificaciones Técnicas</p>
              </div>
              <p className="value-text" style={{ whiteSpace: 'pre-line', fontStyle: machinery.machinery_description ? 'normal' : 'italic' }}>
                {machinery.machinery_description || 'Sin especificaciones o descripciones adicionales registradas.'}
              </p>
            </div>

          </div>

          {/* Botones de Acción */}
          <div className="action-buttons">
            <button onClick={() => onEdit(machinery)} className="btn-primary">
              Editar Equipo
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

export default MachineryDetail;