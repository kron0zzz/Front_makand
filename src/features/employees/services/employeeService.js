import { apiClient } from "../../../shared/services/api";

export const employeeService = {
  obtenerTodos: async (page=1, limit=10, search="") => {
    const { data } = await apiClient.get(
      `/employees/table?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`
    );
    return data;
  },

  obtenerPorId: async (id) => {
    const { data } = await apiClient.get(`/employees/${id}`);
    return data;
  },

  crear: async (datos) => {
    const { data } = await apiClient.post('/employees', datos);
    return data;
  },

  actualizar: async (id, datos) => {
    const { data } = await apiClient.put(`/employees/${id}`, datos);
    return data;
  },

  eliminar: async (id) => {
    const { data } = await apiClient.delete(`/employees/${id}`);
    return data;
  }
};