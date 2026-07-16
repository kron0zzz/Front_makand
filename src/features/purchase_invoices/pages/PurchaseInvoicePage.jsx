import { useState, useMemo, useEffect } from 'react';
import { Plus, Search, Eye, Edit, Trash2 } from 'lucide-react';
import { usePurchaseInvoices } from '../hooks/usePurchaseInvoices';
import { useAuth } from "../../../shared/context/AuthContext";
import { purchaseInvoiceService } from '../services/purchaseInvoiceService';

import PurchaseInvoiceForm from '../components/PurchaseInvoiceForm/PurchaseInvoiceForm';
import PurchaseInvoiceDetail from '../components/PurchaseInvoiceDetail/PurchaseInvoiceDetail';
import './PurchaseInvoicePage.css';

import Pagination from '../../../shared/components/pagination/Pagination';
import useDebounce from "../../../shared/hooks/useDebounce";

const PurchaseInvoicePage = () => {
  const { 
    invoices, 
    loading, 
    error, 
    cargarFacturas, 
    eliminarFactura,

    page,
    cambiarPagina,
    cambiarBusqueda,
    pagination

  } = usePurchaseInvoices();
  const { hasPermission } = useAuth();
  const [busqueda, setBusqueda] = useState('');
  const [formData, setFormData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [mostrarModalForm, setMostrarModalForm] = useState(false);
  const [mostrarModalDetalle, setMostrarModalDetalle] = useState(false);
  const [invoiceSeleccionado, setInvoiceSeleccionado] = useState(null);


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



  const cargarCompra = async (id, accion) => {
      try {
        const compra = await purchaseInvoiceService.obtenerPorId(id);
  
        if (accion === "detalle") {
          setInvoiceSeleccionado(compra);
          setMostrarModalDetalle(true);
        }
  
        if (accion === "editar") {
          setFormData(compra);
          setIsEditing(true);
          setMostrarModalForm(true);
        }
  
      } catch (error) {
        console.error(error);
        alert("No se pudo cargar la información de la compra.");
      }
    };

  const formatearFecha = (fechaStr) => {
    if (!fechaStr) return '';
    const date = new Date(fechaStr);
    return date.toLocaleDateString('es-CO');
  };

  const busquedaDebounce = useDebounce(busqueda, 300);
  useEffect(() => {
    cambiarBusqueda(busquedaDebounce);
  }, [busquedaDebounce]);

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
              {invoices.length > 0 ? (
                invoices.map((invoice) => (
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
                          onClick={() => cargarCompra(invoice.invoice_id, "detalle")}
                        >
                          <Eye size={18} />
                        </button>
                      )}
                      {hasPermission('Editar Factura de Compra') && (
                        <button 
                          type="button"
                          className="action-btn edit" 
                          title="Editar" 
                          onClick={() => cargarCompra(invoice.invoice_id, "editar")}
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

      <Pagination
        page={page}
        totalPages={pagination.totalPages}
        total={pagination.total}
        onPageChange={cambiarPagina}
      />

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