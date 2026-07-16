import { useState, useCallback, useEffect} from 'react';
import { purchaseInvoiceService } from '../services/purchaseInvoiceService';

export const usePurchaseInvoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // asignar estados para paginación
  const [page, setPage] = useState(1);
  const [limit] = useState(9);
  const [search, setSearch] = useState("");

  const [pagination, setPagination] = useState({
      page: 1,
      totalPages: 1,
      total: 0
  });

  const cargarFacturas = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      //ahora se carga con los datos requeridos para paginación
      const datos = await purchaseInvoiceService.obtenerTabla(page, limit, search);
      setInvoices(datos.data);
      setPagination(datos.pagination);
    } catch (err) {
      setError(err.message || 'Error al cargar facturas');
    } finally {
      setLoading(false);
    }
  }, [page, limit, search]);


  //función para cambiar de página
  const cambiarPagina = (nuevaPagina) => {
    if (
        nuevaPagina !== page &&
        nuevaPagina >= 1 &&
        nuevaPagina <= pagination.totalPages
    ) {
        setPage(nuevaPagina);
    }
  };



  const cambiarBusqueda = useCallback((texto) => {
    setSearch(texto);
    setPage(1);
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

  useEffect(() => {
    cargarFacturas();
  }, [cargarFacturas]);


  return {
    invoices,
    loading,
    error,
    cargarFacturas,
    eliminarFactura,

    page,
    cambiarPagina,
    cambiarBusqueda,
    pagination
  };
};