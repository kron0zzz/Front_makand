import { useState, useCallback, useEffect} from "react";
import api from "../../../shared/services/api";  //ojoooooo, que maldita mierda hice aquí
import { orderService } from "../services/orderService";

export const useOrders = () => {
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
    const message = err.response?.data?.message || err.message || "Error desconocido";
    setError(message);
    throw err;
  };

  const cargarPedidos = useCallback(async () => {
    try {
      //ahora se carga con los datos requeridos para paginación
      const datos = await orderService.obtenerTabla(page, limit, search);
      setOrders(datos.data);
      setPagination(datos.pagination);
    } catch (err) {
      handleError(err);
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


  const crearPedidoCompleto = async (pedidoData) => {
    try {
      // baseURL es /api + esta ruta = /api/orders/complete
      const { data } = await api.post("/orders/complete", pedidoData);
      await cargarPedidos();
      return data;
    } catch (err) {
      handleError(err);
    }
  };

  const eliminarPedido = async (id) => {
    if (!window.confirm("¿Deseas eliminar este pedido?")) return;
    try {
      // baseURL es /api + esta ruta = /api/orders/:id
      await api.delete(`/orders/${id}`);
      await cargarPedidos();
    } catch (err) {
      handleError(err);
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
    if (!window.confirm(`¿Está seguro de que desea anular este pedido?

      Esta acción no se puede deshacer.

      • Toda la maquinaria será devuelta automáticamente al inventario.
      • El pedido quedará bloqueado y no podrá modificarse.
      • No será posible registrar devoluciones, cortes ni pagos.

      ¿Desea continuar?`)) return;
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