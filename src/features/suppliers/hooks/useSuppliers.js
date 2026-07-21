import { useState, useCallback, useEffect} from 'react';
import { supplierService } from '../services/suppliersService';

export const useSuppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
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


  const cargarProveedores = useCallback(async () => {
    setLoading(true);
    try {
      //ahora se carga con los datos requeridos para paginación
      const datos = await supplierService.obtenerTabla(page, limit, search);
      setSuppliers(datos.data);
      setPagination(datos.pagination);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [page, limit, search]);

  

  const toggleProveedorEstado = async (id, estadoActual) => {
  if (
    !window.confirm(
      `¿Estás seguro de que deseas ${
        estadoActual ? "desactivar" : "activar"
      } este proveedor?`
    )
  ) {
    return;
  }

  try {
    const proveedor = await supplierService.obtenerPorId(id);

    proveedor.supplier_status = !estadoActual;

    await supplierService.actualizar(id, proveedor);

    await cargarProveedores();

  } catch (err) {
    console.error(err);
    alert("No se pudo actualizar el estado.");
  }
};



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




  const eliminarProveedor = async (id) => {
    if (window.confirm('¿Seguro que deseas eliminar este proveedor?')) {
      try {
        await supplierService.eliminar(id);
        setSuppliers(prev => prev.filter(s => s.supplier_id !== id));
      } catch (err) {
        console.error("Error al eliminar:", err);
      }
    }
  };

  useEffect(() => {
    cargarProveedores();
  }, [cargarProveedores]);

  return { 
    suppliers, 
    loading, 
    error, 
    cargarProveedores, 
    toggleProveedorEstado, 
    eliminarProveedor,
    
    page,
    cambiarPagina,
    cambiarBusqueda,
    pagination
  };
};