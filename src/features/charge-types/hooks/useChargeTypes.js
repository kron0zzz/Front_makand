import { useState, useEffect, useCallback } from 'react';
import { chargeTypeService } from '../services/chargeTypeService';
import { useAlertModal } from "../../../shared/alertModal";

export const useChargeTypes = () => {
  const { showConfirm, showSuccess, showError } = useAlertModal();
  const [chargeTypes, setChargeTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  // asignar estados para paginación
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState("");

  const [pagination, setPagination] = useState({
      page: 1,
      totalPages: 1,
      total: 0
  });

  const cargarTiposCobro = useCallback(async () => {
    setLoading(true);
    try {
      const datos = await chargeTypeService.obtenerTodos(page, limit, search);
      setChargeTypes(datos.data);
      setPagination(datos.pagination);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [page, limit, search]);

  useEffect(() => {
    cargarTiposCobro();
  }, [cargarTiposCobro]);
  


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


  const eliminarTipoCobro = useCallback(async (id) => {
    if (!await showConfirm('¿Estás seguro de que deseas eliminar este tipo de cobro?')) return;
    try {
      await chargeTypeService.eliminar(id);
      setChargeTypes(prev => prev.filter(item => item.charge_type_id !== id));
      await showSuccess("Tipo de cobro eliminado correctamente.");
    } catch (err) {
      await showError(err.message || 'No se puede eliminar este tipo de cobro.');
    }
  }, []);



  const cambiarBusqueda = useCallback((texto) => {
    setSearch(texto);
    setPage(1);
  }, []);

  return { 
    chargeTypes, 
    loading, 
    error, 
    cargarTiposCobro,
    eliminarTipoCobro,
    
    page,
    cambiarPagina,
    cambiarBusqueda,
    pagination
  };
};