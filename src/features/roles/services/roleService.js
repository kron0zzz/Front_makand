import { apiClient } from "../../../shared/services/api";

export const roleService = {
  obtenerTodos: async (page =1, limit=10, search="") => {
    // Al usar apiClient, el interceptor inyecta el token automáticamente
    const response = await apiClient.get(`/roles/table?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`);
    return response.data;
  },
  
  crear: async (data) => {
    const response = await apiClient.post('/roles', data);
    return response.status === 201 || response.status === 200;
  },

  actualizar: async (id, data) => {
    const response = await apiClient.put(`/roles/${id}`, data);
    return response.status === 200;
  },

  eliminar: async (id) => {
    const response = await apiClient.delete(`/roles/${id}`);
    return response.status === 200;
  },

  obtenerPermisos: async () => {
    const response = await apiClient.get('/permissions');
    return response.data;
  },

  actualizarPermisosRol: async (roleId, permissionIds) => {
    const response = await apiClient.put(`/roles/${roleId}/permissions`, { 
      permissions: permissionIds 
    });
    return response.status === 200;
  }
};
