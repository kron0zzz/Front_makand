// // src/features/purchase_invoices/components/PurchaseInvoiceDetail/PurchaseInvoiceDetail.jsx
// import { useState, useEffect } from 'react';
// import { Calendar, Tag, Shield, FileImage, Briefcase } from 'lucide-react';
// import { purchaseInvoiceService } from '../../services/purchaseInvoiceService';
// import './PurchaseInvoiceDetail.css';

// const PurchaseInvoiceDetail = ({ isOpen, onClose, invoice, onEdit }) => {
//   const [invoiceCompleta, setInvoiceCompleta] = useState(null);
//   const [cargando, setCargando] = useState(false);

//   useEffect(() => {
//     const cargarDetalleCompleto = async () => {
//       if (!isOpen || !invoice?.invoice_id) return;
//       setCargando(true);
//       try {
//         const data = await purchaseInvoiceService.obtenerPorId(invoice.invoice_id);
//         setInvoiceCompleta(data);
//       } catch (error) {
//         console.error("Error al cargar detalles de la factura:", error);
//         setInvoiceCompleta(invoice);
//       } finally {
//         setCargando(false);
//       }
//     };

//     if (isOpen) {
//       cargarDetalleCompleto();
//     } else {
//       setInvoiceCompleta(null);
//     }
//   }, [isOpen, invoice]);

//   if (!isOpen || !invoice) return null;

//   const datos = invoiceCompleta || invoice;

//   const formatearFecha = (fechaStr) => {
//     if (!fechaStr) return '';
//     const date = new Date(fechaStr);
//     return date.toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' });
//   };

//   return (
//     <div className="modal-overlay">
//       <div className="modal-container">
//         <div className="modal-header">
//           <h2>Detalles de Factura de Compra</h2>
//           <button className="close-button" onClick={onClose} aria-label="Cerrar">&times;</button>
//         </div>

//         <div className="modal-content">
//           <div className="machinery-main-header full-width">
//             <div className="avatar-icon-wrapper">
//               <Shield size={32} />
//             </div>
//             <h1 className="machinery-title">Factura #{datos.invoice_id}</h1>
//             <span className="machinery-code">{datos.supplier_name || 'Proveedor Asociado'}</span>
//           </div>

//           <br />

//           <div className="detail-grid">
//             {/* Maquinaria */}
//             <div className="info-card">
//               <div className="info-item-header">
//                 <Briefcase size={16} />
//                 <span className="label-text">Maquinaria Adquirida</span>
//               </div>
//               <span className="value-text">{datos.machinery_name}</span>
//             </div>

//             {/* Fecha de compra */}
//             <div className="info-card">
//               <div className="info-item-header">
//                 <Calendar size={16} />
//                 <span className="label-text">Fecha de Transacción</span>
//               </div>
//               <span className="value-text">{formatearFecha(datos.purchase_date)}</span>
//             </div>

//             {/* Imagen de la factura */}
//             <div className="info-card full-width description-card">
//               <div className="info-item-header">
//                 <FileImage size={16} />
//                 <span className="label-text">Soporte Digital (Factura Física)</span>
//               </div>
//               {cargando ? (
//                 <span className="value-text">Cargando soporte...</span>
//               ) : datos.invoice_photo ? (
//                 <div style={{ marginTop: '10px', textAlign: 'center' }}>
//                   <img 
//                     src={datos.invoice_photo} 
//                     alt="Soporte de factura" 
//                     style={{ maxWidth: '100%', maxHeight: '250px', borderRadius: '12px', border: '1px solid #cbd5e1', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }} 
//                   />
//                 </div>
//               ) : (
//                 <span className="value-text" style={{ fontStyle: 'italic', color: '#64748b' }}>
//                   No se ha adjuntado ninguna imagen de soporte para esta factura.
//                 </span>
//               )}
//             </div>
//           </div>

//           <div className="action-buttons">
//             <button type="button" className="btn-secondary" onClick={onClose}>
//               Cerrar
//             </button>
//             <button 
//               type="button" 
//               className="btn-primary" 
//               onClick={() => onEdit(datos)}
//               disabled={cargando}
//             >
//               Editar Factura
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PurchaseInvoiceDetail;









// src/features/purchase_invoices/components/PurchaseInvoiceDetail/PurchaseInvoiceDetail.jsx
import { useState, useEffect } from 'react';
import { Calendar, Shield, FileImage, Briefcase } from 'lucide-react';
import { purchaseInvoiceService } from '../../services/purchaseInvoiceService';
import './PurchaseInvoiceDetail.css';

const PurchaseInvoiceDetail = ({ isOpen, onClose, invoice, onEdit }) => {
  const [invoiceCompleta, setInvoiceCompleta] = useState(null);
  const [cargando, setCargando] = useState(false);

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

    // 🌟 Función de limpieza segura para resetear el estado al cerrar o cambiar de factura
    return () => {
      setInvoiceCompleta(null);
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
            {/* Maquinaria */}
            <div className="info-card">
              <div className="info-item-header">
                <Briefcase size={16} />
                <span className="label-text">Maquinaria Adquirida</span>
              </div>
              <span className="value-text">{datos.machinery_name}</span>
            </div>

            {/* Fecha de compra */}
            <div className="info-card">
              <div className="info-item-header">
                <Calendar size={16} />
                <span className="label-text">Fecha de Transacción</span>
              </div>
              <span className="value-text">{formatearFecha(datos.purchase_date)}</span>
            </div>

            {/* Imagen de la factura */}
            <div className="info-card full-width description-card">
              <div className="info-item-header">
                <FileImage size={16} />
                <span className="label-text">Soporte Digital (Factura Física)</span>
              </div>
              {cargando ? (
                <span className="value-text">Cargando soporte...</span>
              ) : datos.invoice_photo ? (
                <div style={{ marginTop: '10px', textAlign: 'center' }}>
                  <img 
                    src={datos.invoice_photo} 
                    alt="Soporte de factura" 
                    style={{ maxWidth: '100%', maxHeight: '250px', borderRadius: '12px', border: '1px solid #cbd5e1', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }} 
                  />
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
    </div>
  );
};

export default PurchaseInvoiceDetail;