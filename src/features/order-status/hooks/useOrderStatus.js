import { useState, useEffect, useCallback } from 'react';
import { orderStatusService } from '../services/orderStatusService';
import { useAlertModal } from "../../../shared/alertModal";

export const useOrderStatus = () => {
  const { showSuccess, showError, showConfirm } = useAlertModal();
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
      setError(err.message || 'Error al cargar estados de pedido');
      console.error("Error al cargar estados de pedido:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const eliminarOrderStatus = async (id) => {
    if (!await showConfirm('¿Estás seguro de que deseas eliminar este estado de pedido?')) return false;
    try {
      await orderStatusService.eliminar(id);
      await cargarOrderStatus();
      await showSuccess("Estado de pedido eliminado correctamente.");
      return true;
    } catch (err) {
      await showError(err.response?.data?.error || "No se pudo eliminar el estado de pedido.");
      console.error("Error al eliminar estado de pedido:", err);
      return false;
    }
  };

  useEffect(() => {
    cargarOrderStatus();
  }, [cargarOrderStatus]);

  return {
    orderStatus,
    loading,
    error,
    cargarOrderStatus,
    eliminarOrderStatus
  };
};