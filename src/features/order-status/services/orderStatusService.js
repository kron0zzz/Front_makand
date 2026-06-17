import { apiClient } from "../../../shared/services/api";

export const orderStatusService = {
  obtenerTodos: async () => {
    try {
      const response = await apiClient.get('/api/order-status');
      return response.data || [];
    } catch (error) {
      console.error('Error al obtener estados de pedido:', error);
      throw error;
    }
  },
  
  obtenerPorId: async (id) => {
    try {
      const response = await apiClient.get(`/api/order-status/${id}`);
      return response.data;
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
      return await apiClient.post('/api/order-status', payload);
    } catch (error) {
      console.error('Error al crear estado de pedido:', error);
      throw error;
    }
  },
  
  actualizar: async (id, datos) => {
    try {
      const payload = {
        order_status_name: datos.order_status_name,
      };
      return await apiClient.put(`/api/order-status/${id}`, payload);
    } catch (error) {
      console.error('Error al actualizar estado de pedido:', error);
      throw error;
    }
  },
  
  eliminar: async (id) => {
    try {
      return await apiClient.delete(`/api/order-status/${id}`);
    } catch (error) {
      console.error('Error al eliminar estado de pedido:', error);
      throw error;
    }
  }
};