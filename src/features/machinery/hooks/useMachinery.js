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

  // Dar de baja de maquinaria NO motorizada: se descuentan unidades del stock.
  const darDeBajaMaquinaria = async (machinery, cantidad) => {
    const stock = (machinery?.stock_details || [])[0];

    if (!stock) {
      await showError("No se encontró el registro de stock de esta maquinaria.");
      return false;
    }

    const disponibles = Number(machinery.total_stock ?? stock.stock_quantity ?? 0);
    const valor = parseInt(cantidad, 10);

    if (!Number.isInteger(valor) || valor <= 0) {
      await showError("La cantidad a dar de baja debe ser un número entero mayor a cero.");
      return false;
    }

    if (valor > disponibles) {
      await showError(`La cantidad a dar de baja (${valor}) no puede ser superior a la cantidad disponible (${disponibles}).`);
      return false;
    }

    const confirmado = await showConfirm(
      `¿Estás seguro de que deseas dar de baja ${valor} unidad(es) de "${machinery.machinery_name}"? Esta acción no se puede deshacer.`
    );
    if (!confirmado) return false;

    try {
      await machineryService.darDeBajaStock(stock.stock_id, valor);
      await cargarMaquinarias();
      await showSuccess(`${valor} unidad(es) de "${machinery.machinery_name}" se dieron de baja correctamente.`);
      return true;
    } catch (err) {
      console.error("Error al dar de baja la maquinaria:", err);
      await showError(err.response?.data?.error || "No se pudo dar de baja la maquinaria.");
      return false;
    }
  };

  // Dar de baja de maquinaria motorizada: cada registro es una unidad física (cantidad 1).
  const darDeBajaEquipoMotorizado = async (machinery, stock) => {
    const equipo = stock.serial_number || `#${stock.stock_id}`;

    const confirmado = await showConfirm(
      `¿Estás seguro de que deseas dar de baja el equipo ${equipo} de "${machinery?.machinery_name}"? Esta acción no se puede deshacer.`
    );
    if (!confirmado) return false;

    try {
      await machineryService.darDeBajaStock(stock.stock_id, 1);
      await cargarMaquinarias();
      if (machinery?.machinery_id) {
        await cargarStockPorMaquinaria(machinery.machinery_id, machinery.machinery_name);
      }
      await showSuccess(`El equipo ${equipo} se dio de baja correctamente.`);
      return true;
    } catch (err) {
      console.error("Error al dar de baja el equipo motorizado:", err);
      await showError(err.response?.data?.error || "No se pudo dar de baja el equipo motorizado.");
      return false;
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
    darDeBajaMaquinaria,
    darDeBajaEquipoMotorizado,

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