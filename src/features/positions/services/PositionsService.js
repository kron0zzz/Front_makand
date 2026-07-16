import { apiClient } from "../../../shared/services/api";

export const PositionService = {
  obtenerTodos: async (page = 1, limit = 9, search="") => {
    const { data } = await apiClient.get(
      `/positions/table?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`
    );
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