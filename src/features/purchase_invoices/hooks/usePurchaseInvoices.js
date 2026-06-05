// import { useState, useCallback } from 'react';
// import { purchaseInvoiceService } from '../services/purchaseInvoiceService';

// export const usePurchaseInvoices = () => {
//   const [invoices, setInvoices] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const cargarFacturas = useCallback(async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const datos = await purchaseInvoiceService.obtenerTabla();
//       setInvoices(datos);
//     } catch (err) {
//       setError(err.message || 'Error al cargar facturas');
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   const eliminarFactura = useCallback(async (id) => {
//     if (window.confirm('¿Estás seguro de que deseas eliminar esta factura de compra?')) {
//       try {
//         await purchaseInvoiceService.eliminar(id);
//         setInvoices(prev => prev.filter(invoice => invoice.invoice_id !== id));
//       } catch (err) {
//         setError(err.message || 'Error al intentar eliminar la factura');
//       }
//     }
//   }, []);

//   return {
//     invoices,
//     loading,
//     error,
//     cargarFacturas,
//     eliminarFactura
//   };
// };












// src/features/purchase_invoices/hooks/usePurchaseInvoices.js
import { useState, useCallback } from 'react';
import { purchaseInvoiceService } from '../services/purchaseInvoiceService';

export const usePurchaseInvoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const cargarFacturas = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const datos = await purchaseInvoiceService.obtenerTabla();
      setInvoices(datos);
    } catch (err) {
      setError(err.message || 'Error al cargar facturas');
    } finally {
      setLoading(false);
    }
  }, []);

  const eliminarFactura = useCallback(async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta factura de compra?')) {
      try {
        await purchaseInvoiceService.eliminar(id);
        setInvoices(prev => prev.filter(invoice => invoice.invoice_id !== id));
      } catch (err) {
        setError(err.message || 'Error al intentar eliminar la factura');
      }
    }
  }, []);

  return {
    invoices,
    loading,
    error,
    cargarFacturas,
    eliminarFactura
  };
};