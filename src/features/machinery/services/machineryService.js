// // Capa de servicios para interactuar con el endpoint de maquinaria en el backend.

// export const machineryService = {
//   obtenerTodos: async () => {
//     return []; 
//   },
//   crear: async (data) => console.log("Creando Maquinaria:", data),
//   actualizar: async (id, data) => console.log("Actualizando Maquinaria:", id, data),
//   eliminar: async (id) => console.log("Eliminando Maquinaria:", id),
// };

// export default machineryService;

import { apiClient } from "../../../shared/services/api";

export const machineryService = {
  obtenerTabla: async () => {
    const { data } = await apiClient.get('/machines/table');
    return data || [];
  },

  crear: async (datos) => {
    const { data } = await apiClient.post('/machines', datos);
    return data;
  },

  actualizar: async (id, datos) => {
    const { data } = await apiClient.put(`/machines/${id}`, datos);
    return data;
  },

  eliminar: async (id) => {
    const { data } = await apiClient.delete(`/machines/${id}`);
    return data;
  }
};