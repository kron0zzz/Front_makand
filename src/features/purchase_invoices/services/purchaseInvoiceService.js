// // src/features/purchase_invoices/services/purchaseInvoiceService.js
// import { apiClient } from "../../../shared/services/api";

// // 🔑 Función interna para buscar el token donde sea que esté escondido
// const getCleanToken = () => {
//   // 1. Intentamos buscar si ya existe en los encabezados globales de Axios
//   const headerToken = apiClient.defaults.headers.common['Authorization'] || 
//                       apiClient.defaults.headers['Authorization'];
  
//   if (headerToken) {
//     // Si viene con la palabra 'Bearer ', se la quitamos para procesarla limpio
//     return headerToken.replace(/^Bearer\s+/i, '').replace(/^"|"$/g, '');
//   }

//   // 2. Si no estaba en Axios, lo buscamos en el localStorage por si acaso
//   const localToken = localStorage.getItem('token');
//   if (localToken) {
//     return localToken.replace(/^"|"$/g, '');
//   }

//   return null;
// };

// export const purchaseInvoiceService = {
//   obtenerTabla: async () => {
//     try {
//       const token = getCleanToken();

//       const response = await apiClient.get('/api/purchase-invoices/table', {
//         headers: {
//           'Authorization': token ? `Bearer ${token}` : ''
//         }
//       });
//       return response.data || [];
//     } catch (error) {
//       console.error('Error al obtener tabla de facturas:', error);
//       throw error;
//     }
//   },

//   obtenerPorId: async (id) => {
//     try {
//       const token = getCleanToken();
//       const response = await apiClient.get(`/api/purchase-invoices/${id}`, {
//         headers: {
//           'Authorization': token ? `Bearer ${token}` : ''
//         }
//       });
//       return response.data;
//     } catch (error) {
//       console.error('Error al obtener factura por ID:', error);
//       throw error;
//     }
//   },
  
//   crear: async (datos) => {
//     try {
//       const token = getCleanToken();
//       const response = await apiClient.post('/api/purchase-invoices', datos, {
//         headers: {
//           'Authorization': token ? `Bearer ${token}` : ''
//         }
//       });
//       return response.data;
//     } catch (error) {
//       console.error('Error al crear factura:', error);
//       throw error;
//     }
//   },
  
//   actualizar: async (id, datos) => {
//     try {
//       const token = getCleanToken();
//       const response = await apiClient.put(`/api/purchase-invoices/${id}`, datos, {
//         headers: {
//           'Authorization': token ? `Bearer ${token}` : ''
//         }
//       });
//       return response.data;
//     } catch (error) {
//       console.error('Error al actualizar factura:', error);
//       throw error;
//     }
//   },
  
//   eliminar: async (id) => {
//     try {
//       const token = getCleanToken();
//       const response = await apiClient.delete(`/api/purchase-invoices/${id}`, {
//         headers: {
//           'Authorization': token ? `Bearer ${token}` : ''
//         }
//       });
//       return response.data;
//     } catch (error) {
//       console.error('Error al eliminar factura:', error);
//       throw error;
//     }
//   }
// };


import { apiClient } from "../../../shared/services/api";

export const purchaseInvoiceService = {
  obtenerTabla: async () => {
    try {
      // Ya no hace falta pasarle el token, el interceptor lo hace por ti
      const { data } = await apiClient.get('/purchase-invoices/table');
      return data || [];
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
  }
};