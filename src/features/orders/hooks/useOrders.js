import { useState, useCallback, useEffect} from "react";
import api from "../../../shared/services/api";
import { orderService } from "../services/orderService";
import { useAlertModal } from "../../../shared/alertModal";

export const useOrders = () => {
  const { showConfirm, showSuccess, showError } = useAlertModal();
  const [orders, setOrders] = useState([]);
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

  const handleError = (err) => {
    const message = err.response?.data?.error || err.response?.data?.message || err.message || "Error desconocido";
    setError(message);
    throw err;
  };

  const cargarPedidos = useCallback(async () => {
    try {
      const datos = await orderService.obtenerTabla(page, limit, search);
      setOrders(datos.data);
      setPagination(datos.pagination);
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  }, [page, limit, search]);

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

  const crearPedidoCompleto = async (pedidoData) => {
    try {
      const { data } = await api.post("/orders/complete", pedidoData);
      await cargarPedidos();
      return data;
    } catch (err) {
      handleError(err);
    }
  };

  const eliminarPedido = async (id) => {
    if (!await showConfirm(
      "¿Estás seguro de que deseas eliminar este pedido?\n\nEsta acción no se puede deshacer.\nSe eliminarán todos los datos asociados incluyendo pagos y cortes."
    )) return;
    try {
      await api.delete(`/orders/${id}`);
      await cargarPedidos();
      await showSuccess("Pedido eliminado correctamente.");
    } catch (err) {
      const mensaje =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "No se puede eliminar este pedido.";
      setError(mensaje);
      await showError(mensaje);
    }
  };

  const obtenerPedidoCompleto = async (id) => {
    try {
      const { data } = await api.get(`/orders/${id}/full`);
      return data;
    } catch (err) {
      handleError(err);
    }
  };

  const anularPedido = async (id) => {
    if (!await showConfirm(
      `¿Está seguro de que desea anular este pedido?

Esta acción no se puede deshacer.

• Toda la maquinaria será devuelta automáticamente al inventario.
• El pedido quedará bloqueado y no podrá modificarse.
• No será posible registrar devoluciones, cortes ni pagos.

¿Desea continuar?`
    )) return;
    try {
      await orderService.anular(id);
      await cargarPedidos(
        pagination.page,
        pagination.limit,
        search
      );
      return {
        success: true,
        message: "Pedido anulado correctamente."
      };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.error ||
          error.response?.data?.message ||
          "Error al anular el pedido."
      };
    }
  };

  useEffect(() => {
  cargarPedidos();
}, [cargarPedidos]);

  return { 
    orders, 
    loading, 
    error, 
    cargarPedidos, 
    crearPedidoCompleto,
    eliminarPedido,
    obtenerPedidoCompleto, 
    anularPedido,
    page,
    cambiarPagina,
    cambiarBusqueda,
    pagination
  };
};