import { apiClient } from "../../../shared/services/api";

export const userService = {
  obtenerTodos: async (page = 1, limit = 9, search="") => {
    try {
      const { data } = await apiClient.get(
        `/users/table?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`
      );
      return data;
      
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      throw error;
    }
  },
  
  obtenerPorId: async (id) => {
    try {
      // Ruta corregida: sin /api
      const { data } = await apiClient.get(`/users/${id}`);
      return data;
    } catch (error) {
      console.error('Error al obtener usuario por ID:', error);
      throw error;
    }
  },
  
  crear: async (datos) => {
    try {
      const payload = {
        user_email: datos.user_email,
        user_password: datos.password,
        user_status: datos.user_status,
        role_id: datos.role_id,
        employee_id: datos.employee_id,
      };
      // Ruta corregida: sin /api
      return await apiClient.post('/users', payload);
    } catch (error) {
      console.error('Error al crear usuario:', error);
      throw error;
    }
  },
  
  actualizar: async (id, datos) => {
    try {
      const payload = {
        user_email: datos.user_email,
        user_password: datos.password,
        user_status: datos.user_status,
        role_id: datos.role_id,
        employee_id: datos.employee_id,
      };
      // Ruta corregida: sin /api
      return await apiClient.put(`/users/${id}`, payload);
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      throw error;
    }
  },
  
  eliminar: async (id) => {
    try {
      // Ruta corregida: sin /api
      return await apiClient.delete(`/users/${id}`);
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      throw error;
    }
  }
};