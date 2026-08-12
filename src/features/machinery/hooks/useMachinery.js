import { useState, useCallback, useEffect } from 'react';
import { machineryService } from '../services/machineryService';
import { useAlertModal } from "../../../shared/alertModal";

export const useMachinery = () => {
  const { showAlert, showConfirm, showSuccess, showError } = useAlertModal();
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
    if (!await showConfirm('¿Estás seguro de que deseas eliminar esta maquinaria?')) return;
    try {
      await machineryService.eliminar(id);
      setMachineries(prev => prev.filter(item => item.machinery_id !== id));
      await showSuccess("Maquinaria eliminada correctamente.");
    } catch (err) {
      await showError("No se puede eliminar esta maquinaria. Verifica que no tenga pedidos o datos asociados.");
    }
  };

  const crearMaquinaria = async (maquinariaData) => {
    try {
      await machineryService.crear(maquinariaData);
      await cargarMaquinarias();
      await showSuccess("Maquinaria creada correctamente.");
      return true;
    } catch (err) {
      await showError(err.message || "No se pudo crear la maquinaria.");
      return false;
    }
  };

  const actualizarMaquinaria = async (id, maquinariaData) => {
    try {
      await machineryService.actualizar(id, maquinariaData);
      await cargarMaquinarias();
      await showSuccess("Maquinaria actualizada correctamente.");
      return true;
    } catch (err) {
      await showError(err.message || "No se pudo actualizar la maquinaria.");
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