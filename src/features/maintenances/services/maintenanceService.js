// import { apiClient } from "../../../shared/services/api";

// export const maintenanceService = {
//   obtenerTodos: async () => {
//     try {
//       const response = await apiClient.get('/api/maintenances');
//       return response.data || [];
//     } catch (error) {
//       console.error('Error al obtener mantenimientos:', error);
//       throw error;
//     }
//   },
  
//   obtenerPorId: async (id) => {
//     try {
//       const response = await apiClient.get(`/api/maintenances/${id}`);
//       return response.data;
//     } catch (error) {
//       console.error('Error al obtener mantenimiento por ID:', error);
//       throw error;
//     }
//   },
  
//   crear: async (datos) => {
//     try {
//       const payload = {
//         machinery_id: datos.machinery_id,
//         maintenance_date: datos.maintenance_date,
//         revision_notes: datos.revision_notes,
//       };
//       return await apiClient.post('/api/maintenances', payload);
//     } catch (error) {
//       console.error('Error al crear mantenimiento:', error);
//       throw error;
//     }
//   },
  
//   actualizar: async (id, datos) => {
//     try {
//       const payload = {
//         machinery_id: datos.machinery_id,
//         maintenance_date: datos.maintenance_date,
//         revision_notes: datos.revision_notes,
//       };
//       return await apiClient.put(`/api/maintenances/${id}`, payload);
//     } catch (error) {
//       console.error('Error al actualizar mantenimiento:', error);
//       throw error;
//     }
//   },
  
//   eliminar: async (id) => {
//     try {
//       return await apiClient.delete(`/api/maintenances/${id}`);
//     } catch (error) {
//       console.error('Error al eliminar mantenimiento:', error);
//       throw error;
//     }
//   }
// };

import { apiClient } from "../../../shared/services/api";

export const maintenanceService = {
  obtenerTodos: async () => {
    try {
      // Ruta relativa limpia: sin el /api
      const { data } = await apiClient.get('/maintenances');
      return data || [];
    } catch (error) {
      console.error('Error al obtener mantenimientos:', error);
      throw error;
    }
  },
  
  obtenerPorId: async (id) => {
    try {
      const { data } = await apiClient.get(`/maintenances/${id}`);
      return data;
    } catch (error) {
      console.error('Error al obtener mantenimiento por ID:', error);
      throw error;
    }
  },
  
  crear: async (datos) => {
    try {
      const payload = {
        machinery_id: datos.machinery_id,
        maintenance_date: datos.maintenance_date,
        revision_notes: datos.revision_notes,
      };
      return await apiClient.post('/maintenances', payload);
    } catch (error) {
      console.error('Error al crear mantenimiento:', error);
      throw error;
    }
  },
  
  actualizar: async (id, datos) => {
    try {
      const payload = {
        machinery_id: datos.machinery_id,
        maintenance_date: datos.maintenance_date,
        revision_notes: datos.revision_notes,
      };
      return await apiClient.put(`/maintenances/${id}`, payload);
    } catch (error) {
      console.error('Error al actualizar mantenimiento:', error);
      throw error;
    }
  },
  
  eliminar: async (id) => {
    try {
      return await apiClient.delete(`/maintenances/${id}`);
    } catch (error) {
      console.error('Error al eliminar mantenimiento:', error);
      throw error;
    }
  }
};