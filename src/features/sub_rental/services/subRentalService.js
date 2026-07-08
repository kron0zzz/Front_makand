// // src/features/sub_rentals/services/subRentalService.js
// import { apiClient } from "../../../shared/services/api";

// // 🔑 Función interna para buscar el token donde sea que esté escondido (Copiando tu lógica exacta)
// const getCleanToken = () => {
//   const headerToken = apiClient.defaults.headers.common['Authorization'] || 
//                       apiClient.defaults.headers['Authorization'];
  
//   if (headerToken) {
//     return headerToken.replace(/^Bearer\s+/i, '').replace(/^"|"$/g, '');
//   }

//   const localToken = localStorage.getItem('token');
//   if (localToken) {
//     return localToken.replace(/^"|"$/g, '');
//   }

//   return null;
// };

// export const subRentalService = {
//   obtenerTabla: async () => {
//     try {
//       const token = getCleanToken();

//       const response = await apiClient.get('/api/sub-rentals/table', {
//         headers: {
//           'Authorization': token ? `Bearer ${token}` : ''
//         }
//       });
//       return response.data || [];
//     } catch (error) {
//       console.error('Error al obtener tabla de subalquileres:', error);
//       throw error;
//     }
//   },

//   obtenerPorId: async (id) => {
//     try {
//       const token = getCleanToken();
//       const response = await apiClient.get(`/api/sub-rentals/${id}`, {
//         headers: {
//           'Authorization': token ? `Bearer ${token}` : ''
//         }
//       });
//       return response.data;
//     } catch (error) {
//       console.error('Error al obtener subalquiler por ID:', error);
//       throw error;
//     }
//   },
  
//   crear: async (datos) => {
//     try {
//       const token = getCleanToken();
//       const response = await apiClient.post('/api/sub-rentals', datos, {
//         headers: {
//           'Authorization': token ? `Bearer ${token}` : ''
//         }
//       });
//       return response.data;
//     } catch (error) {
//       console.error('Error al crear subalquiler:', error);
//       throw error;
//     }
//   },
  
//   actualizar: async (id, datos) => {
//     try {
//       const token = getCleanToken();
//       const response = await apiClient.put(`/api/sub-rentals/${id}`, datos, {
//         headers: {
//           'Authorization': token ? `Bearer ${token}` : ''
//         }
//       });
//       return response.data;
//     } catch (error) {
//       console.error('Error al actualizar subalquiler:', error);
//       throw error;
//     }
//   },
  
//   eliminar: async (id) => {
//     try {
//       const token = getCleanToken();
//       const response = await apiClient.delete(`/api/sub-rentals/${id}`, {
//         headers: {
//           'Authorization': token ? `Bearer ${token}` : ''
//         }
//       });
//       return response.data;
//     } catch (error) {
//       console.error('Error al eliminar subalquiler:', error);
//       throw error;
//     }
//   }
// };


import { apiClient } from "../../../shared/services/api";

export const subRentalService = {
  obtenerTabla: async () => {
    try {
      // Ruta relativa limpia: ya no lleva /api
      const { data } = await apiClient.get('/sub-rentals/table');
      return data || [];
    } catch (error) {
      console.error('Error al obtener tabla de subalquileres:', error);
      throw error;
    }
  },

  obtenerPorId: async (id) => {
    try {
      const { data } = await apiClient.get(`/sub-rentals/${id}`);
      return data;
    } catch (error) {
      console.error('Error al obtener subalquiler por ID:', error);
      throw error;
    }
  },
  
  crear: async (datos) => {
    try {
      const { data } = await apiClient.post('/sub-rentals', datos);
      return data;
    } catch (error) {
      console.error('Error al crear subalquiler:', error);
      throw error;
    }
  },
  
  actualizar: async (id, datos) => {
    try {
      const { data } = await apiClient.put(`/sub-rentals/${id}`, datos);
      return data;
    } catch (error) {
      console.error('Error al actualizar subalquiler:', error);
      throw error;
    }
  },
  
  eliminar: async (id) => {
    try {
      const { data } = await apiClient.delete(`/sub-rentals/${id}`);
      return data;
    } catch (error) {
      console.error('Error al eliminar subalquiler:', error);
      throw error;
    }
  }
};