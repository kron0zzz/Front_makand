import { useState, useEffect, useCallback } from 'react';
import { orderStatusService } from '../services/orderStatusService';

export const useOrderStatus = () => {
  const [orderStatus, setOrderStatus] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const cargarOrderStatus = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await orderStatusService.obtenerTodos();
      setOrderStatus(response);
    } catch (err) {
      setError(err.message);
      console.error("Error al cargar estados de pedido:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const load = async () => {
      await cargarOrderStatus();
    };
    load();
  }, [cargarOrderStatus]);

  const eliminarOrderStatus = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este estado de pedido?')) return false;
    try {
      await orderStatusService.eliminar(id);
      setOrderStatus(prev => prev.filter(c => c.order_status_id !== id));
      return true;
    } catch (err) {
      console.error("Error al eliminar estado de pedido:", err);
      return false;
    }
  };

  return {
    orderStatus,
    loading,
    error,
    cargarOrderStatus,
    eliminarOrderStatus
  };
};