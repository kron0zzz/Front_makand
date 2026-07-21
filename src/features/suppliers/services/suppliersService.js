import { apiClient } from "../../../shared/services/api";

export const supplierService = {
  
  obtenerTabla: async (page=1, limit=10, search="") => {
    const { data } = await apiClient.get(
      `/suppliers/table?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`
    );
    return data;
  },

  obtenerPorId: async (id) => {
    const { data } = await apiClient.get(`/suppliers/${id}`);
    return data;
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