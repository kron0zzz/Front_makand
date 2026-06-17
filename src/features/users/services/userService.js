import { apiClient } from "../../../shared/services/api";

export const userService = {
  obtenerTodos: async () => {
    try {
      const response = await apiClient.get('/api/users');
      return response.data || [];
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      throw error;
    }
  },
  
  obtenerPorId: async (id) => {
    try {
      const response = await apiClient.get(`/api/users/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener usuario por ID:', error);
      throw error;
    }
  },
  
  crear: async (datos) => {
    try {
      const payload = {
        user_email: datos.user_email,
        password: datos.password,
        user_status: datos.user_status,
        role_id: datos.role_id,
        employee_id: datos.employee_id,
      };
      return await apiClient.post('/api/users', payload);
    } catch (error) {
      console.error('Error al crear usuario:', error);
      throw error;
    }
  },
  
  actualizar: async (id, datos) => {
    try {
      const payload = {
        user_email: datos.user_email,
        password: datos.password,
        user_status: datos.user_status,
        role_id: datos.role_id,
        employee_id: datos.employee_id,
      };
      return await apiClient.put(`/api/users/${id}`, payload);
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      throw error;
    }
  },
  
  eliminar: async (id) => {
    try {
      return await apiClient.delete(`/api/users/${id}`);
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      throw error;
    }
  }
};