import { useState, useEffect, useCallback } from 'react';
import { PositionService } from '../services/PositionsService';
import { useAlertModal } from "../../../shared/alertModal";

export const usePositions = () => {
  const { showConfirm, showSuccess, showError } = useAlertModal();
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [page, setPage] = useState(1);
  const [limit] = useState(9);
  const [search, setSearch] = useState("");

  const [pagination, setPagination] = useState({
      page: 1,
      totalPages: 1,
      total: 0
  });


  const cargarCargos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const datos = await PositionService.obtenerTodos(page, limit, search);
      setPositions(datos.data);
      setPagination(datos.pagination);
    } catch (err) {
      setError(err.response?.status === 403 ? "Sin permisos." : "Error al cargar cargos.");
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



  const eliminarCargo = async (id) => {
    if (!await showConfirm("¿Estás seguro de que deseas eliminar este cargo?")) return;

    try {
      await PositionService.eliminar(id);
      await showSuccess("Cargo eliminado correctamente.");
      await cargarCargos();
    } catch (err) {
      await showError(err.response?.data?.message || "No se puede eliminar este cargo. Verifica que no hayan empleados con este cargo asignado.");
    }
  };

  useEffect(() => {
    cargarCargos();
  }, [cargarCargos]);

  return { 
    positions, 
    loading, 
    error, 
    cargarCargos, 
    eliminarCargo,
  
    page,
    cambiarPagina,
    cambiarBusqueda,
    pagination
  };
};