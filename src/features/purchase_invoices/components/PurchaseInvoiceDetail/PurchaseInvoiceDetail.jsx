import { useState, useEffect } from 'react';
import { Calendar, Shield, FileImage, ZoomIn } from 'lucide-react';
import { purchaseInvoiceService } from '../../services/purchaseInvoiceService';
import './PurchaseInvoiceDetail.css';

const PurchaseInvoiceDetail = ({ isOpen, onClose, invoice, onEdit }) => {
  const [invoiceCompleta, setInvoiceCompleta] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [zoomOpen, setZoomOpen] = useState(false); // 🔍 Estado para el visor de la imagen

  useEffect(() => {
    const cargarDetalleCompleto = async () => {
      if (!isOpen || !invoice?.invoice_id) return;
      setCargando(true);
      try {
        const data = await purchaseInvoiceService.obtenerPorId(invoice.invoice_id);
        setInvoiceCompleta(data);
      } catch (error) {
        console.error("Error al cargar detalles de la factura:", error);
        setInvoiceCompleta(invoice);
      } finally {
        setCargando(false);
      }
    };

    cargarDetalleCompleto();

    return () => {
      setInvoiceCompleta(null);
      setZoomOpen(false); // Reseteamos el zoom al cerrar
    };
  }, [isOpen, invoice]);

  if (!isOpen || !invoice) return null;

  const datos = invoiceCompleta || invoice;

  const formatearFecha = (fechaStr) => {
    if (!fechaStr) return '';
    const date = new Date(fechaStr);
    return date.toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>Detalles de Factura de Compra</h2>
          <button className="close-button" onClick={onClose} aria-label="Cerrar">&times;</button>
        </div>

        <div className="modal-content">
          <div className="machinery-main-header full-width">
            <div className="avatar-icon-wrapper">
              <Shield size={32} />
            </div>
            <h1 className="machinery-title">Factura #{datos.invoice_id}</h1>
            <span className="machinery-code">{datos.supplier_name || 'Proveedor Asociado'}</span>
          </div>

          <br />

          <div className="detail-grid">
          
            {/* Fecha de compra */}
            <div className="info-card">
              <div className="info-item-header">
                <Calendar size={16} />
                <span className="label-text">Fecha de Transacción</span>
              </div>
              <span className="value-text">{formatearFecha(datos.purchase_date)}</span>
            </div>

            {/* Imagen de la factura con interacción de Zoom */}
            <div className="info-card full-width description-card">
              <div className="info-item-header">
                <FileImage size={16} />
                <span className="label-text">Soporte Digital (Factura Física)</span>
              </div>
              {cargando ? (
                <span className="value-text">Cargando soporte...</span>
              ) : datos.invoice_photo ? (
                <div style={{ marginTop: '10px', textAlign: 'center' }}>
                  <div 
                    onClick={() => setZoomOpen(true)}
                    style={{ 
                      position: 'relative', 
                      display: 'inline-block', 
                      cursor: 'zoom-in',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      border: '1px solid #cbd5e1',
                      boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
                    }}
                  >
                    <img 
                      src={datos.invoice_photo} 
                      alt="Soporte de factura" 
                      style={{ 
                        maxWidth: '100%', 
                        maxHeight: '220px', 
                        display: 'block',
                        transition: 'transform 0.3s ease'
                      }} 
                    />
                    <div className="zoom-overlay-hint" style={{
                      position: 'absolute',
                      bottom: '8px',
                      right: '8px',
                      background: 'rgba(0, 0, 0, 0.6)',
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <ZoomIn size={14} /> Ampliar
                    </div>
                  </div>
                </div>
              ) : (
                <span className="value-text" style={{ fontStyle: 'italic', color: '#64748b' }}>
                  No se ha adjuntado ninguna imagen de soporte para esta factura.
                </span>
              )}
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
              Editar Factura
            </button>
          </div>
        </div>
      </div>

      {/* 🔍 VISOR FLOTANTE (LIGHTBOX) PARA AMPLIAR LA IMAGEN */}
      {zoomOpen && (
        <div 
          onClick={() => setZoomOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 99999,
            backdropFilter: 'blur(4px)',
            padding: '20px'
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()} 
            style={{ position: 'relative', maxWidth: '90vw', maxHeight: '90vh' }}
          >
            <button 
              onClick={() => setZoomOpen(false)}
              style={{
                position: 'absolute',
                top: '-45px',
                right: '0',
                background: '#ffffff',
                border: 'none',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '18px',
                boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#1e293b'
              }}
            >
              &times;
            </button>
            <img 
              src={datos.invoice_photo} 
              alt="Soporte digital en grande" 
              style={{ 
                maxHeight: '85vh', 
                maxWidth: '85vw', 
                borderRadius: '8px',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
                objectFit: 'contain',
                backgroundColor: '#ffffff'
              }} 
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PurchaseInvoiceDetail;