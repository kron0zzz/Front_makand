import { apiClient } from "../../../shared/services/api";

export const machineryService = {
  obtenerTabla: async (page = 1, limit = 9, search="") => {
    const { data } = await apiClient.get(
      `/machines/table?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`
    );

    return data;
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