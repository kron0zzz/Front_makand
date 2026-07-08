// // Las llamadas a la API
// export const customerService = {
//   obtenerTodos: async () => {
//     const token = localStorage.getItem("token");
//     const response = await fetch('http://localhost:3000/api/customers/table', {
//       headers: { 'Authorization': `Bearer ${token}` }
//     });
//     return response.ok ? await response.json() : [];
//   },
//   crear: async (data) => console.log("Creando:", data),
//   actualizar: async (id, data) => console.log("Actualizando:", id, data),
//   eliminar: async (id) => console.log("Eliminando:", id),
// };


import { apiClient } from "../../../shared/services/api";

export const customerService = {
  // Obtener todos los clientes (la tabla)
  obtenerTodos: async () => {
    try {
      const { data } = await apiClient.get('/customers/table');
      return data || [];
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