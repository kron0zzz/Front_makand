import { apiClient } from "../../../shared/services/api";

export const purchaseInvoiceService = {

  obtenerTabla: async (page=1, limit=10, search="") => {
    try {
      const { data } = await apiClient.get(
      `/purchase-invoices/table?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`
    );

    return data;
    } catch (error) {
      console.error('Error al obtener tabla de facturas:', error);
      throw error;
    }
  },

  obtenerPorId: async (id) => {
    try {
      const { data } = await apiClient.get(`/purchase-invoices/${id}`);
      return data;
    } catch (error) {
      console.error('Error al obtener factura por ID:', error);
      throw error;
    }
  },
  
  crear: async (datos) => {
    try {
      const { data } = await apiClient.post('/purchase-invoices', datos);
      return data;
    } catch (error) {
      console.error('Error al crear factura:', error);
      throw error;
    }
  },
  
  actualizar: async (id, datos) => {
    try {
      const { data } = await apiClient.put(`/purchase-invoices/${id}`, datos);
      return data;
    } catch (error) {
      console.error('Error al actualizar factura:', error);
      throw error;
    }
  },
  
  eliminar: async (id) => {
    try {
      const { data } = await apiClient.delete(`/purchase-invoices/${id}`);
      return data;
    } catch (error) {
      console.error('Error al eliminar factura:', error);
      throw error;
    }
  },

  crearCompleta: async (datos) => {
    try {
      const { data } = await apiClient.post('/purchase-invoices/complete', datos);
      return data;
    } catch (error) {
      console.error('Error al crear factura completa:', error);
      throw error;
    }
  }
};