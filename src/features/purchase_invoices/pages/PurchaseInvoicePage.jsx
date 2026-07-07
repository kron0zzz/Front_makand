// // src/features/purchase_invoices/pages/PurchaseInvoicePage.jsx
// import { useState, useMemo, useEffect } from 'react';
// import { Plus, Search, Eye, Edit, Trash2 } from 'lucide-react';
// import { usePurchaseInvoices } from '../hooks/usePurchaseInvoices';
// import PurchaseInvoiceForm from '../components/PurchaseInvoiceForm/PurchaseInvoiceForm';
// import PurchaseInvoiceDetail from '../components/PurchaseInvoiceDetail/PurchaseInvoiceDetail';
// import './PurchaseInvoicePage.css';

// const PurchaseInvoicePage = () => {
//   const { invoices, loading, error, cargarFacturas, eliminarFactura } = usePurchaseInvoices();
//   const [busqueda, setBusqueda] = useState('');
//   const [formData, setFormData] = useState({});
//   const [isEditing, setIsEditing] = useState(false);
//   const [mostrarModalForm, setMostrarModalForm] = useState(false);
//   const [mostrarModalDetalle, setMostrarModalDetalle] = useState(false);
//   const [invoiceSeleccionado, setInvoiceSeleccionado] = useState(null);

//   useEffect(() => {
//     // 🌟 CANDADO DE SEGURIDAD: Recupera el token para validar la sesión activa
//     const token = localStorage.getItem('token');
    
//     // Si no hay un token válido, frena la ejecución para no gastar recursos innecesarios
//     if (!token) return;

//     cargarFacturas();
//   }, [cargarFacturas]);

//   const facturasFiltradas = useMemo(() => {
//     const datos = Array.isArray(invoices) ? invoices : [];
//     const termino = busqueda.toLowerCase();

//     return datos.filter(i => {
//       const id = i.invoice_id?.toString() || '';
//       const supplier = i.supplier_name?.toLowerCase() || '';
      
//       return id.includes(termino) || supplier.includes(termino);
//     });
//   }, [invoices, busqueda]);

//   const prepararEdicion = (invoice) => {
//     // 🌟 Cerramos el modal de detalles primero si venimos desde ahí
//     setMostrarModalDetalle(false);
//     setIsEditing(true);
//     setFormData({
//       invoice_id: invoice.invoice_id,
//       supplier_id: invoice.supplier_id,
//       purchase_date: invoice.purchase_date,
//       invoice_photo: invoice.invoice_photo
//     });
//     setMostrarModalForm(true);
//   };

//   const formatearFecha = (fechaStr) => {
//     if (!fechaStr) return '';
//     const date = new Date(fechaStr);
//     return date.toLocaleDateString('es-CO');
//   };

//   return (
//     <div className="page-container">
//       <div className="header-container">
//         <div className="header-text">
//           <h1>Facturas de Compra</h1>
//           <p>Gestión de Compras - Makand</p>
//         </div>

//         <div className="header-actions">
//           <div className="search-container-small">
//             <Search size={18} color="#9ca3af" />
//             <input 
//               type="text" 
//               className="search-input"
//               placeholder="Buscar por ID, o proveedor..." 
//               value={busqueda}
//               onChange={(e) => setBusqueda(e.target.value)}
//             />
//           </div>
          
//           <button 
//             className="btn-nuevo"
//             type="button"
//             onClick={() => {
//               setIsEditing(false);
//               setFormData({}); 
//               setMostrarModalForm(true);
//             }}
//           >
//             <Plus size={20} />
//             Nueva Factura
//           </button>
//         </div>
//       </div>

//       {loading && <div style={{ textAlign: 'center', padding: '20px' }}>Cargando facturas...</div>}
//       {error && <div style={{ color: 'red', textAlign: 'center', padding: '20px' }}>{error}</div>}

//       {!loading && !error && (
//         <div className="table-wrapper">
//           <table className="custom-table">
//             <thead>
//               <tr>
//                 <th>ID</th>
//                 <th>Proveedor</th>
//                 <th>Fecha de Compra</th>
//                 <th>Gestión</th>
//               </tr>
//             </thead>
//             <tbody>
//               {facturasFiltradas.length > 0 ? (
//                 facturasFiltradas.map((invoice) => (
//                   <tr key={invoice.invoice_id}>
//                     <td>#{invoice.invoice_id}</td>
//                     <td>
//                       <span className="badge-position">{invoice.supplier_name}</span>
//                     </td>
//                     <td>{formatearFecha(invoice.purchase_date)}</td>
//                     <td className="actions-cell">
//                       <button 
//                         type="button"
//                         className="action-btn view" 
//                         title="Ver Detalles" 
//                         onClick={() => { setInvoiceSeleccionado(invoice); setMostrarModalDetalle(true); }}
//                       >
//                         <Eye size={18} />
//                       </button>
//                       <button 
//                         type="button"
//                         className="action-btn edit" 
//                         title="Editar" 
//                         onClick={() => prepararEdicion(invoice)}
//                       >
//                         <Edit size={18} />
//                       </button>
//                       <button 
//                         type="button"
//                         className="action-btn delete" 
//                         title="Eliminar" 
//                         onClick={() => eliminarFactura(invoice.invoice_id)}
//                       >
//                         <Trash2 size={18} />
//                       </button>
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="5" className="empty-row" style={{ textAlign: 'center', padding: '40px' }}>
//                     No se encontraron coincidencias para "{busqueda}"
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       )}

//       <PurchaseInvoiceForm 
//         isOpen={mostrarModalForm} 
//         onClose={async () => { setMostrarModalForm(false); await cargarFacturas(); }}
//         formData={formData}
//         setFormData={setFormData}
//         isEditing={isEditing}
//       />
      
//       <PurchaseInvoiceDetail 
//         isOpen={mostrarModalDetalle}
//         onClose={() => setMostrarModalDetalle(false)}
//         invoice={invoiceSeleccionado}
//         onEdit={prepararEdicion} // 🌟 Pasamos directamente la referencia de la función limpia
//       />
//     </div>
//   );
// };

// export default PurchaseInvoicePage;


// src/features/purchase_invoices/pages/PurchaseInvoicePage.jsx
import { useState, useMemo, useEffect } from 'react';
import { Plus, Search, Eye, Edit, Trash2 } from 'lucide-react';
import { usePurchaseInvoices } from '../hooks/usePurchaseInvoices';
import { useAuth } from "../../../shared/context/AuthContext";
import PurchaseInvoiceForm from '../components/PurchaseInvoiceForm/PurchaseInvoiceForm';
import PurchaseInvoiceDetail from '../components/PurchaseInvoiceDetail/PurchaseInvoiceDetail';
import './PurchaseInvoicePage.css';

const PurchaseInvoicePage = () => {
  const { invoices, loading, error, cargarFacturas, eliminarFactura } = usePurchaseInvoices();
  const { hasPermission } = useAuth();
  const [busqueda, setBusqueda] = useState('');
  const [formData, setFormData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [mostrarModalForm, setMostrarModalForm] = useState(false);
  const [mostrarModalDetalle, setMostrarModalDetalle] = useState(false);
  const [invoiceSeleccionado, setInvoiceSeleccionado] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    cargarFacturas();
  }, [cargarFacturas]);

  const facturasFiltradas = useMemo(() => {
    const datos = Array.isArray(invoices) ? invoices : [];
    const termino = busqueda.toLowerCase();

    return datos.filter(i => {
      const id = i.invoice_id?.toString() || '';
      const supplier = i.supplier_name?.toLowerCase() || '';
      
      return id.includes(termino) || supplier.includes(termino);
    });
  }, [invoices, busqueda]);

  const prepararEdicion = (invoice) => {
    setMostrarModalDetalle(false);
    setIsEditing(true);
    setFormData({
      invoice_id: invoice.invoice_id,
      supplier_id: invoice.supplier_id,
      purchase_date: invoice.purchase_date,
      invoice_photo: invoice.invoice_photo
    });
    setMostrarModalForm(true);
  };

  const formatearFecha = (fechaStr) => {
    if (!fechaStr) return '';
    const date = new Date(fechaStr);
    return date.toLocaleDateString('es-CO');
  };

  return (
    <div className="page-container">
      <div className="header-container">
        <div className="header-text">
          <h1>Facturas de Compra</h1>
          <p>Gestión de Compras - Makand</p>
        </div>

        <div className="header-actions">
          <div className="search-container-small">
            <Search size={18} color="#9ca3af" />
            <input 
              type="text" 
              className="search-input"
              placeholder="Buscar por ID, o proveedor..." 
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
          
          {hasPermission('Crear Factura de Compra') && (
            <button 
              className="btn-nuevo"
              type="button"
              onClick={() => {
                setIsEditing(false);
                setFormData({}); 
                setMostrarModalForm(true);
              }}
            >
              <Plus size={20} />
              Nueva Factura
            </button>
          )}
        </div>
      </div>

      {loading && <div style={{ textAlign: 'center', padding: '20px' }}>Cargando facturas...</div>}
      {error && <div style={{ color: 'red', textAlign: 'center', padding: '20px' }}>{error}</div>}

      {!loading && !error && (
        <div className="table-wrapper">
          <table className="custom-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Proveedor</th>
                <th>Fecha de Compra</th>
                <th>Gestión</th>
              </tr>
            </thead>
            <tbody>
              {facturasFiltradas.length > 0 ? (
                facturasFiltradas.map((invoice) => (
                  <tr key={invoice.invoice_id}>
                    <td>#{invoice.invoice_id}</td>
                    <td>
                      <span className="badge-position">{invoice.supplier_name}</span>
                    </td>
                    <td>{formatearFecha(invoice.purchase_date)}</td>
                    <td className="actions-cell">
                      {hasPermission('Ver Detalle de Factura de Compra') && (
                        <button 
                          type="button"
                          className="action-btn view" 
                          title="Ver Detalles" 
                          onClick={() => { setInvoiceSeleccionado(invoice); setMostrarModalDetalle(true); }}
                        >
                          <Eye size={18} />
                        </button>
                      )}
                      {hasPermission('Editar Factura de Compra') && (
                        <button 
                          type="button"
                          className="action-btn edit" 
                          title="Editar" 
                          onClick={() => prepararEdicion(invoice)}
                        >
                          <Edit size={18} />
                        </button>
                      )}
                      {hasPermission('Eliminar Factura de Compra') && (
                        <button 
                          type="button"
                          className="action-btn delete" 
                          title="Eliminar" 
                          onClick={() => eliminarFactura(invoice.invoice_id)}
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="empty-row" style={{ textAlign: 'center', padding: '40px' }}>
                    No se encontraron coincidencias para "{busqueda}"
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <PurchaseInvoiceForm 
        isOpen={mostrarModalForm} 
        onClose={async () => { setMostrarModalForm(false); await cargarFacturas(); }}
        formData={formData}
        setFormData={setFormData}
        isEditing={isEditing}
      />
      
      <PurchaseInvoiceDetail 
        isOpen={mostrarModalDetalle}
        onClose={() => setMostrarModalDetalle(false)}
        invoice={invoiceSeleccionado}
        onEdit={prepararEdicion}
      />
    </div>
  );
};

export default PurchaseInvoicePage;