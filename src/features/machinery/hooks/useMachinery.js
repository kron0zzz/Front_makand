import { useState, useCallback, useEffect } from 'react';
import { machineryService } from '../services/machineryService';

export const useMachinery = () => {
  const [machineries, setMachineries] = useState([]);
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

  const cargarMaquinarias = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      //ahora se carga con los datos requeridos para paginación
      const datos = await machineryService.obtenerTabla(page, limit, search);
      setMachineries(datos.data);
      setPagination(datos.pagination);
    } catch (err) {
      setError(err.message || 'Error al cargar maquinarias');
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

  const eliminarMaquinaria = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar esta maquinaria?')) return;
    try {
      await machineryService.eliminar(id);
      setMachineries(prev => prev.filter(item => item.machinery_id !== id));
    } catch (err) {
      alert("No se pudo eliminar la maquinaria.");
    }
  };

  const crearMaquinaria = async (maquinariaData) => {
    try {
      await machineryService.crear(maquinariaData);
      await cargarMaquinarias();
      return true;
    } catch (err) {
      alert(err.message);
      return false;
    }
  };

  const actualizarMaquinaria = async (id, maquinariaData) => {
    try {
      await machineryService.actualizar(id, maquinariaData);
      await cargarMaquinarias();
      return true;
    } catch (err) {
      alert(err.message);
      return false;
    }
  };

  useEffect(() => {
    cargarMaquinarias();
  }, [cargarMaquinarias]);

  return { 
    machineries, 
    loading, 
    error, 
    cargarMaquinarias, 
    eliminarMaquinaria, 
    crearMaquinaria, 
    actualizarMaquinaria, 

    page,
    cambiarPagina,
    cambiarBusqueda,
    pagination
  };
};