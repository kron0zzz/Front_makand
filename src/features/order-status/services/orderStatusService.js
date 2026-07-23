import { apiClient } from "../../../shared/services/api";

export const orderStatusService = {
  obtenerTodos: async () => {
    try {
      const { data } = await apiClient.get('/order-status');
      return data || [];
    } catch (error) {
      console.error('Error al obtener estados de pedido:', error);
      throw error;
    }
  },
  
  obtenerPorId: async (id) => {
    try {
      const { data } = await apiClient.get(`/order-status/${id}`);
      return data;
    } catch (error) {
      console.error('Error al obtener estado de pedido por ID:', error);
      throw error;
    }
  },
  
  crear: async (datos) => {
    try {
      const payload = {
        order_status_name: datos.order_status_name,
      };
      const { data } = await apiClient.post('/order-status', payload);
      return data;
    } catch (error) {
      const mensajeError = error.response?.data?.message || error.response?.data?.error || error.message || 'Error al crear estado de pedido';
      console.error('Error al crear estado de pedido:', mensajeError);
      throw new Error(mensajeError);
    }
  },
  
  actualizar: async (id, datos) => {
    try {
      const payload = {
        order_status_name: datos.order_status_name,
      };
      const { data } = await apiClient.put(`/order-status/${id}`, payload);
      return data;
    } catch (error) {
      const mensajeError = error.response?.data?.message || error.response?.data?.error || error.message || 'Error al actualizar estado de pedido';
      console.error('Error al actualizar estado de pedido:', mensajeError);
      throw new Error(mensajeError);
    }
  },
  
  eliminar: async (id) => {
    try {
      return await apiClient.delete(`/order-status/${id}`);
    } catch (error) {
      console.error('Error al eliminar estado de pedido:', error);
      throw error;
    }
  }
};