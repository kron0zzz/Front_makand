import { apiClient } from "../../../shared/services/api";

export const subRentalService = {
  obtenerTabla: async (page=1, limit=10, search="") => {
    try {
      const { data } = await apiClient.get(
        `/sub-rentals/table?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`
      );
      return data;
    } catch (error) {
      console.error('Error al obtener tabla de subalquileres:', error);
      throw error;
    }
  },

  obtenerPorId: async (id) => {
    try {
      const { data } = await apiClient.get(`/sub-rentals/${id}`);
      return data;
    } catch (error) {
      console.error('Error al obtener subalquiler por ID:', error);
      throw error;
    }
  },
  
  crear: async (datos) => {
    try {
      const { data } = await apiClient.post('/sub-rentals', datos);
      return data;
    } catch (error) {
      console.error('Error al crear subalquiler:', error);
      throw error;
    }
  },
  
  actualizar: async (id, datos) => {
    try {
      const { data } = await apiClient.put(`/sub-rentals/${id}`, datos);
      return data;
    } catch (error) {
      console.error('Error al actualizar subalquiler:', error);
      throw error;
    }
  },
  
  eliminar: async (id) => {
    try {
      const { data } = await apiClient.delete(`/sub-rentals/${id}`);
      return data;
    } catch (error) {
      console.error('Error al eliminar subalquiler:', error);
      throw error;
    }
  }
};