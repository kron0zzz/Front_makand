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

  crearCompleta: async (machineryData, stockData) => {
    const { data } = await apiClient.post('/machines/complete', {
      machineryData,
      stockData,
    });
    return data;
  },

  actualizar: async (id, datos) => {
    const { data } = await apiClient.put(`/machines/${id}`, datos);
    return data;
  },

  eliminar: async (id) => {
    const { data } = await apiClient.delete(`/machines/${id}`);
    return data;
  },

  obtenerStockPorMaquinaria: async (machineryId, machineryName) => {
    const { data } = await apiClient.get(
      `/stock/table?search=${encodeURIComponent(machineryName || '')}`
    );
    const stocksFiltrados = (data.data || []).filter(
      (s) => s.machinery_id === Number(machineryId)
    );
    return {
      data: stocksFiltrados,
      pagination: data.pagination || { page: 1, totalPages: 1, total: stocksFiltrados.length }
    };
  },

  generarPdf: async (id) => {
    const response = await apiClient.get(`/machines/${id}/pdf`, {
      responseType: 'blob',
    });
    return response.data;
  }
};