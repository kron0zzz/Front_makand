import { apiClient } from "../../../shared/services/api";

export const chargeTypeService = {
  obtenerTodos: async () => {
    try {
      // Usando el endpoint recomendado para frontend
      const response = await apiClient.get('/api/charge-types/table');
      return response.data || [];
    } catch (error) {
      console.error('Error al obtener tipos de cobro:', error);
      throw error;
    }
  },
  
  obtenerPorId: async (id) => {
    try {
      const response = await apiClient.get(`/api/charge-types/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener tipo de cobro por ID:', error);
      throw error;
    }
  },
  
  crear: async (datos) => {
    try {
      const payload = {
        charge_type_name: datos.charge_type_name,
      };
      return await apiClient.post('/api/charge-types', payload);
    } catch (error) {
      console.error('Error al crear tipo de cobro:', error);
      throw error;
    }
  },
  
  actualizar: async (id, datos) => {
    try {
      const payload = {
        charge_type_name: datos.charge_type_name,
      };
      return await apiClient.put(`/api/charge-types/${id}`, payload);
    } catch (error) {
      console.error('Error al actualizar tipo de cobro:', error);
      throw error;
    }
  },
  
  eliminar: async (id) => {
    try {
      return await apiClient.delete(`/api/charge-types/${id}`);
    } catch (error) {
      console.error('Error al eliminar tipo de cobro:', error);
      throw error;
    }
  }
};