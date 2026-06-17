import { apiClient } from "../../../shared/services/api";

export const projectService = {
  obtenerTodos: async () => {
    try {
      const response = await apiClient.get('/api/projects/table');
      return response.data || [];
    } catch (error) {
      console.error('Error al obtener proyectos:', error);
      throw error;
    }
  },

  obtenerPorId: async (id) => {
    try {
      const response = await apiClient.get(`/api/projects/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener proyecto por ID:', error);
      throw error;
    }
  },

  crear: async (datos) => {
    try {
      const payload = {
        project_name: datos.project_name,
        project_address: datos.project_address,
        project_phone: datos.project_phone,
        project_city: datos.project_city,
        customer_id: datos.customer_id,
        project_status: datos.project_status !== undefined ? datos.project_status : true,
      };
      return await apiClient.post('/api/projects', payload);
    } catch (error) {
      console.error('Error al crear proyecto:', error);
      throw error;
    }
  },

  actualizar: async (id, datos) => {
    try {
      const payload = {
        project_name: datos.project_name,
        project_address: datos.project_address,
        project_phone: datos.project_phone,
        project_city: datos.project_city,
        customer_id: datos.customer_id,
        project_status: datos.project_status,
      };
      return await apiClient.put(`/api/projects/${id}`, payload);
    } catch (error) {
      console.error('Error al actualizar proyecto:', error);
      throw error;
    }
  },

  eliminar: async (id) => {
    try {
      return await apiClient.delete(`/api/projects/${id}`);
    } catch (error) {
      console.error('Error al eliminar proyecto:', error);
      throw error;
    }
  },
};