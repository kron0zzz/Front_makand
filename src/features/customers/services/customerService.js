import { apiClient } from "../../../shared/services/api";

export const customerService = {
  // Obtener todos los clientes (la tabla)
  obtenerTodos: async (page=1, limit=10, search="") => {
    try {
      const { data } = await apiClient.get(
        `/customers/table?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`
      );
      return data;
    } catch (error) {
      console.error('Error al obtener clientes:', error);
      throw error;
    }
  },

  // Obtener un cliente por ID
  obtenerPorId: async (id) => {
    try {
      const { data } = await apiClient.get(`/customers/${id}`);
      return data;
    } catch (error) {
      console.error(`Error al obtener cliente ${id}:`, error);
      throw error;
    }
  },

  // Crear un nuevo cliente
  crear: async (datos) => {
    try {
      const { data } = await apiClient.post('/customers', datos);
      return data;
    } catch (error) {
      console.error('Error al crear cliente:', error);
      throw error;
    }
  },

  // Actualizar un cliente existente
  actualizar: async (id, datos) => {
    try {
      const { data } = await apiClient.put(`/customers/${id}`, datos);
      return data;
    } catch (error) {
      console.error(`Error al actualizar cliente ${id}:`, error);
      throw error;
    }
  },

  // Eliminar un cliente
  eliminar: async (id) => {
    try {
      const { data } = await apiClient.delete(`/customers/${id}`);
      return data;
    } catch (error) {
      console.error(`Error al eliminar cliente ${id}:`, error);
      throw error;
    }
  },
};