// //Las llamadas a la API/Mocks



// export const supplierService = {
//   obtenerTodos: async () => {
//     // Por ahora, devolvemos un array vacío para que no falle al cargar
//     return []; 
//   },
//   crear: async (data) => console.log("Creando:", data),
//   actualizar: async (id, data) => console.log("Actualizando:", id, data),
//   eliminar: async (id) => console.log("Eliminando:", id),
// };



import { apiClient } from "../../../shared/services/api";

export const supplierService = {
  obtenerTodos: async () => {
    const { data } = await apiClient.get('/suppliers');
    return data || [];
  },

  crear: async (datos) => {
    const { data } = await apiClient.post('/suppliers', datos);
    return data;
  },

  actualizar: async (id, datos) => {
    const { data } = await apiClient.put(`/suppliers/${id}`, datos);
    return data;
  },

  eliminar: async (id) => {
    const { data } = await apiClient.delete(`/suppliers/${id}`);
    return data;
  }
};