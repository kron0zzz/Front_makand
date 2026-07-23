import { apiClient } from "../../../shared/services/api";

export const chargeTypeService = {
  obtenerTodos: async (page=1, limit= 10, search="") => {
    try {
      const { data } = await apiClient.get(
        `/charge-types/table?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`
      );
      return data;
    } catch (error) {
      console.error('Error al obtener tipos de cobro:', error);
      throw error;
    }
  },
  
  obtenerPorId: async (id) => {
    try {
      const { data } = await apiClient.get(`/charge-types/${id}`);
      return data;
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
      const { data } = await apiClient.post('/charge-types', payload);
      return data;
    } catch (error) {
      const mensajeError = error.response?.data?.message || error.response?.data?.error || error.message || 'Error al crear tipo de cobro';
      console.error('Error al crear tipo de cobro:', mensajeError);
      throw new Error(mensajeError);
    }
  },
  
  actualizar: async (id, datos) => {
    try {
      const payload = {
        charge_type_name: datos.charge_type_name,
      };
      const { data } = await apiClient.put(`/charge-types/${id}`, payload);
      return data;
    } catch (error) {
      const mensajeError = error.response?.data?.message || error.response?.data?.error || error.message || 'Error al actualizar tipo de cobro';
      console.error('Error al actualizar tipo de cobro:', mensajeError);
      throw new Error(mensajeError);
    }
  },
  
  eliminar: async (id) => {
    try {
      return await apiClient.delete(`/charge-types/${id}`);
    } catch (error) {
      console.error('Error al eliminar tipo de cobro:', error);
      throw error;
    }
  }
};