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

  const [stockList, setStockList] = useState([]);
  const [stockPagination, setStockPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loadingStock, setLoadingStock] = useState(false);

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

  const cargarStockPorMaquinaria = useCallback(async (machineryId, machineryName) => {
    setLoadingStock(true);
    try {
      const datos = await machineryService.obtenerStockPorMaquinaria(machineryId, machineryName);
      setStockList(datos.data);
      setStockPagination(datos.pagination);
    } catch (err) {
      await showAlert(err.message || 'Error al cargar el stock de la maquinaria');
    } finally {
      setLoadingStock(false);
    }
  }, [showAlert]);

  const cambiarPaginaStock = useCallback((nuevaPagina) => {
    setStockPagination((prev) => {
      if (nuevaPagina >= 1 && nuevaPagina <= prev.totalPages) {
        return { ...prev, page: nuevaPagina };
      }
      return prev;
    });
  }, []);

  const eliminarMaquinaria = async (id) => {
    if (!await showConfirm('¿Estás seguro de que deseas eliminar esta maquinaria?.')) return;
    try {
      await machineryService.eliminar(id);
      setMachineries(prev => prev.filter(item => item.machinery_id !== id));
      await showSuccess("Maquinaria eliminada correctamente.");
    } catch (err) {
      await showError("No se puede eliminar esta maquinaria. Verifica que no tenga pedidos, compras o mantenimientos asociados.");

    }
  };

  const crearMaquinaria = async (maquinariaData, stockData) => {
    try {
      await machineryService.crearCompleta(maquinariaData, stockData);
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
    pagination,

    stockList,
    stockPagination,
    loadingStock,
    cargarStockPorMaquinaria,
    cambiarPaginaStock
  };
};