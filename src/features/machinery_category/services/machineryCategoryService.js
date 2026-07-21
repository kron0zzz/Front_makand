import { apiClient } from "../../../shared/services/api";

export const machineryCategoryService = {

  // implementando paginación
  obtenerTabla: async (page = 1, limit = 9, search="") => {
    const { data } = await apiClient.get(
      `/machine-categories/table?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`
    );

    return data;
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