// //Las llamadas a la API/Mocks



// export const PositionService = {
//   obtenerTodos: async () => {
//     // Por ahora, devolvemos un array vacío para que no falle al cargar
//     return []; 
//   },
//   crear: async (data) => console.log("Creando:", data),
//   actualizar: async (id, data) => console.log("Actualizando:", id, data),
//   eliminar: async (id) => console.log("Eliminando:", id),
// };


// src/features/positions/services/PositionService.js
import { apiClient } from "../../../shared/services/api";

export const PositionService = {
  obtenerTodos: async () => {
    // La URL resultante será: http://localhost:3000/api/positions
    const { data } = await apiClient.get('/positions');
    return data;
  },

  crear: async (data) => {
    const { data: responseData } = await apiClient.post('/positions', data);
    return responseData;
  },

  actualizar: async (id, data) => {
    const { data: responseData } = await apiClient.put(`/positions/${id}`, data);
    return responseData;
  },

  eliminar: async (id) => {
    const { data } = await apiClient.delete(`/positions/${id}`);
    return data;
  },
};