// //Las llamadas a la API/Mocks

// export const machineryCategoryService = {
//   obtenerTodos: async () => {
//     // Por ahora, devolvemos un array vacío para que no falle al cargar
//     return []; 
//   },
//   crear: async (data) => console.log("Creando:", data),
//   actualizar: async (id, data) => console.log("Actualizando:", id, data),
//   eliminar: async (id) => console.log("Eliminando:", id),
// };


import { apiClient } from "../../../shared/services/api";

export const machineryCategoryService = {
  obtenerTabla: async () => {
    const { data } = await apiClient.get('/machine-categories/table');
    return data || [];
  },

  crear: async (datos) => {
    const { data } = await apiClient.post('/machine-categories', datos);
    return data;
  },

  actualizar: async (id, datos) => {
    const { data } = await apiClient.put(`/machine-categories/${id}`, datos);
    return data;
  },

  eliminar: async (id) => {
    const { data } = await apiClient.delete(`/machine-categories/${id}`);
    return data;
  }
};