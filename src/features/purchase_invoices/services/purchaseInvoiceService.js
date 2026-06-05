// // // // src/features/purchase_invoices/services/purchaseInvoiceService.js
// // // import { apiClient } from "../../../shared/services/api";

// // // export const purchaseInvoiceService = {
// // //   obtenerTabla: async () => {
// // //     try {
// // //       const response = await apiClient.get('/api/purchase-invoices/table');
// // //       return response.data || [];
// // //     } catch (error) {
// // //       console.error('Error al obtener tabla de facturas:', error);
// // //       throw error;
// // //     }
// // //   },

// // //   obtenerPorId: async (id) => {
// // //     try {
// // //       const response = await apiClient.get(`/api/purchase-invoices/${id}`);
// // //       return response.data;
// // //     } catch (error) {
// // //       console.error('Error al obtener factura por ID:', error);
// // //       throw error;
// // //     }
// // //   },
  
// // //   crear: async (datos) => {
// // //     return await apiClient.post('/api/purchase-invoices', datos);
// // //   },
  
// // //   actualizar: async (id, datos) => {
// // //     return await apiClient.put(`/api/purchase-invoices/${id}`, datos);
// // //   },
  
// // //   eliminar: async (id) => {
// // //     return await apiClient.delete(`/api/purchase-invoices/${id}`);
// // //   }
// // // };








// // // src/features/purchase_invoices/services/purchaseInvoiceService.js
// // import { apiClient } from "../../../shared/services/api";

// // // 🌟 Función auxiliar para obtener las cabeceras con el token activo
// // const getAuthHeaders = () => {
// //   const token = localStorage.getItem('token');
// //   return {
// //     headers: {
// //       'Authorization': token ? `Bearer ${token}` : ''
// //     }
// //   };
// // };

// // export const purchaseInvoiceService = {
// //   obtenerTabla: async () => {
// //     try {
// //       // 🌟 Adjuntamos los headers de autorización a la petición GET
// //       const response = await apiClient.get('/api/purchase-invoices/table', getAuthHeaders());
// //       return response.data || [];
// //     } catch (error) {
// //       console.error('Error al obtener tabla de facturas:', error);
// //       throw error;
// //     }
// //   },

// //   obtenerPorId: async (id) => {
// //     try {
// //       const response = await apiClient.get(`/api/purchase-invoices/${id}`, getAuthHeaders());
// //       return response.data;
// //     } catch (error) {
// //       console.error('Error al obtener factura por ID:', error);
// //       throw error;
// //     }
// //   },
  
// //   crear: async (datos) => {
// //     return await apiClient.post('/api/purchase-invoices', datos, getAuthHeaders());
// //   },
  
// //   actualizar: async (id, datos) => {
// //     return await apiClient.put(`/api/purchase-invoices/${id}`, datos, getAuthHeaders());
// //   },
  
// //   eliminar: async (id) => {
// //     return await apiClient.delete(`/api/purchase-invoices/${id}`, getAuthHeaders());
// //   }
// // };































































// // src/features/purchase_invoices/services/purchaseInvoiceService.js
// import { apiClient } from "../../../shared/services/api";

// // 🔑 Función interna para obtener y limpiar el token de forma segura
// const getCleanToken = () => {
//   const token = localStorage.getItem('token');
//   if (!token) return null;
//   // Elimina comillas dobles al principio o al final si existen
//   return token.replace(/^"|"$/g, '');
// };

// export const purchaseInvoiceService = {
//   obtenerTabla: async () => {
//     try {
//       const token = getCleanToken();
//       if (!token) return [];

//       const response = await apiClient.get('/api/purchase-invoices/table', {
//         headers: {
//           'Authorization': `Bearer ${token}`
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
//     const token = getCleanToken();
//     return await apiClient.post('/api/purchase-invoices', datos, {
//       headers: {
//         'Authorization': token ? `Bearer ${token}` : ''
//       }
//     });
//   },
  
//   actualizar: async (id, datos) => {
//     const token = getCleanToken();
//     return await apiClient.put(`/api/purchase-invoices/${id}`, datos, {
//       headers: {
//         'Authorization': token ? `Bearer ${token}` : ''
//       }
//     });
//   },
  
//   eliminar: async (id) => {
//     const token = getCleanToken();
//     return await apiClient.delete(`/api/purchase-invoices/${id}`, {
//       headers: {
//         'Authorization': token ? `Bearer ${token}` : ''
//       }
//     });
//   }
// };























// src/features/purchase_invoices/services/purchaseInvoiceService.js
import { apiClient } from "../../../shared/services/api";

// 🔑 Función interna para buscar el token donde sea que esté escondido
const getCleanToken = () => {
  // 1. Intentamos buscar si ya existe en los encabezados globales de Axios
  const headerToken = apiClient.defaults.headers.common['Authorization'] || 
                      apiClient.defaults.headers['Authorization'];
  
  if (headerToken) {
    // Si viene con la palabra 'Bearer ', se la quitamos para procesarla limpio
    return headerToken.replace(/^Bearer\s+/i, '').replace(/^"|"$/g, '');
  }

  // 2. Si no estaba en Axios, lo buscamos en el localStorage por si acaso
  const localToken = localStorage.getItem('token');
  if (localToken) {
    return localToken.replace(/^"|"$/g, '');
  }

  return null;
};

export const purchaseInvoiceService = {
  obtenerTabla: async () => {
    try {
      const token = getCleanToken();

      const response = await apiClient.get('/api/purchase-invoices/table', {
        headers: {
          'Authorization': token ? `Bearer ${token}` : ''
        }
      });
      return response.data || [];
    } catch (error) {
      console.error('Error al obtener tabla de facturas:', error);
      throw error;
    }
  },

  obtenerPorId: async (id) => {
    try {
      const token = getCleanToken();
      const response = await apiClient.get(`/api/purchase-invoices/${id}`, {
        headers: {
          'Authorization': token ? `Bearer ${token}` : ''
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error al obtener factura por ID:', error);
      throw error;
    }
  },
  
  crear: async (datos) => {
    try {
      const token = getCleanToken();
      const response = await apiClient.post('/api/purchase-invoices', datos, {
        headers: {
          'Authorization': token ? `Bearer ${token}` : ''
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error al crear factura:', error);
      throw error;
    }
  },
  
  actualizar: async (id, datos) => {
    try {
      const token = getCleanToken();
      const response = await apiClient.put(`/api/purchase-invoices/${id}`, datos, {
        headers: {
          'Authorization': token ? `Bearer ${token}` : ''
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error al actualizar factura:', error);
      throw error;
    }
  },
  
  eliminar: async (id) => {
    try {
      const token = getCleanToken();
      const response = await apiClient.delete(`/api/purchase-invoices/${id}`, {
        headers: {
          'Authorization': token ? `Bearer ${token}` : ''
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error al eliminar factura:', error);
      throw error;
    }
  }
};