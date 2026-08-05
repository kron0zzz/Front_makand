import { apiClient } from "../../../shared/services/api";

export const maintenanceService = {
  obtenerTodos: async () => {
    try {
      const { data } = await apiClient.get('/maintenances');
      return data || [];
    } catch (error) {
      console.error('Error al obtener mantenimientos:', error);
      throw error;
    }
  },

  obtenerPorId: async (id) => {
    try {
      const { data } = await apiClient.get(`/maintenances/${id}`);
      return data;
    } catch (error) {
      console.error('Error al obtener mantenimiento por ID:', error);
      throw error;
    }
  },

  crear: async (datos) => {
    try {
      const payload = {
        stock_id: datos.stock_id,
        maintenance_date: datos.maintenance_date,
        revision_notes: datos.revision_notes,
      };
      return await apiClient.post('/maintenances', payload);
    } catch (error) {
      console.error('Error al crear mantenimiento:', error);
      throw error;
    }
  },

  actualizar: async (id, datos) => {
    try {
      const payload = {
        stock_id: datos.stock_id,
        maintenance_date: datos.maintenance_date,
        revision_notes: datos.revision_notes,
      };
      return await apiClient.put(`/maintenances/${id}`, payload);
    } catch (error) {
      console.error('Error al actualizar mantenimiento:', error);
      throw error;
    }
  },

  eliminar: async (id) => {
    try {
      return await apiClient.delete(`/maintenances/${id}`);
    } catch (error) {
      console.error('Error al eliminar mantenimiento:', error);
      throw error;
    }
  }
};