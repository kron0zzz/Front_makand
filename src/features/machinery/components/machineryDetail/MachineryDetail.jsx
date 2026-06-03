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
          <button onClick={onClose} className="close-button" aria-label="Cerrar">
            <X size={20} />
          </button>
        </div>

        {/* Contenido del Detalle */}
        <div className="modal-content">
          <div className="detail-grid">
            
            {/* Nombre e ID de la Maquinaria - Destacado y Centrado */}
            <div className="machinery-main-header full-width">
              <div className="avatar-icon-wrapper">
                <Wrench size={32} />
              </div>
              <h1 className="machinery-title">{machinery.machinery_name}</h1>
              <span className="machinery-code">Código Interno: #{machinery.machinery_id}</span>
            </div>
            
            {/* Categoría */}
            <div className="info-card">
              <div className="info-item-header">
                <Cpu size={16} />
                <p className="label-text">Categoría / Tipo</p>
              </div>
              <p className="value-text">{machinery.category_name || 'Sin categoría asignada'}</p>
            </div>

            {/* Cantidad disponible en Inventario */}
            <div className="info-card">
              <div className="info-item-header">
                <Layers size={16} />
                <p className="label-text">Stock Disponible</p>
              </div>
              <p className="value-text"><strong>{machinery.stock_quantity}</strong> unidades</p>
            </div>

            {/* Precio de Venta */}
            <div className="info-card">
              <div className="info-item-header">
                <DollarSign size={16} />
                <p className="label-text">Precio de Venta</p>
              </div>
              <p className="value-text">{formatCurrency(machinery.sale_price)}</p>
            </div>

            {/* Precio de Alquiler Diario */}
            <div className="info-card">
              <div className="info-item-header">
                <DollarSign size={16} />
                <p className="label-text">Alquiler por Día</p>
              </div>
              <p className="value-text">{formatCurrency(machinery.daily_rental_price)}</p>
            </div>

            {/* Peso */}
            <div className="info-card">
              <div className="info-item-header">
                <Scale size={16} />
                <p className="label-text">Peso Neto</p>
              </div>
              <p className="value-text">{machinery.weight_kg ? `${machinery.weight_kg} Kg` : 'No especificado'}</p>
            </div>

            {/* Próxima Revisión */}
            <div className="info-card">
              <div className="info-item-header">
                <Calendar size={16} />
                <p className="label-text">Próxima Revisión Técnica</p>
              </div>
              <p className="value-text">{formatDate(machinery.next_revision_date)}</p>
            </div>

            {/* Atributos Booleanos (Motorizado / Propiedad) */}
            <div className="info-card">
              <div className="info-item-header">
                <Wrench size={16} />
                <p className="label-text">Propiedades del Equipo</p>
              </div>
              <div className="value-text value-text-list">
                <span>⚡ <strong>Motorizado:</strong> {machinery.is_motorized ? 'Sí' : 'No'}</span>
                <span>🏢 <strong>Origen:</strong> {machinery.is_owned ? 'Propio de la Empresa' : 'Subcontratado / Externo'}</span>
              </div>
            </div>

            {/* Estado actual en el sistema */}
            <div className="info-card">
              <div className="info-item-header">
                <Activity size={16} />
                <p className="label-text">Estado Actual</p>
              </div>
              <span className={`status-badge status-${machinery.status_name?.toLowerCase().replace(/\s+/g, '-')}`}>
                {machinery.status_name || 'DESCONOCIDO'}
              </span>
            </div>

            {/* Descripción Completa */}
            <div className="full-width info-card description-card">
              <div className="info-item-header">
                <FileText size={16} />
                <p className="label-text">Descripción y Especificaciones Técnicas</p>
              </div>
              <p className="value-text description-text" style={{ fontStyle: machinery.machinery_description ? 'normal' : 'italic' }}>
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