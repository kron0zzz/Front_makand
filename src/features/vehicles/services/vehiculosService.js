// import { apiClient } from "../../../shared/services/api";

// export const vehiculosService = {
//   obtenerTodos: async () => {
//     try {
//       const response = await apiClient.get('/api/vehicles');
//       const data = Array.isArray(response.data) ? response.data : (response.data.vehicles || []);
      
//       return data.map(v => ({
//         id: v.vehicle_id,
//         placa: v.license_plate,
//         marca: v.vehicle_brand,
//         modelo: v.vehicle_model,
//         capacidadKg: v.capacity_kg,
//         estado: (() => {
//           switch (v.vehicle_status) {
//             case true: return 'Activo';
//             case false: return 'Inactivo';
//             default: return 'Inactivo';
//           }
//         })()
//       }));
//     } catch (error) {
//       console.error('Error al obtener vehículos:', error);
//       throw error;
//     }
//   },
  
//   crear: async (datos) => {
//     const payload = {
//       vehicle_brand: datos.marca,
//       vehicle_model: datos.modelo,
//       license_plate: datos.placa,
//       capacity_kg: datos.capacidadKg !== undefined && datos.capacidadKg !== null && datos.capacidadKg !== ''
//         ? parseFloat(datos.capacidadKg)
//         : null,
//       vehicle_status: typeof datos.estado === 'boolean'
//         ? datos.estado
//         : datos.estado === 'Activo' ? true : false
//     };
//     console.log('Payload crear:', payload);
//     return await apiClient.post('/api/vehicles', payload);
//   },
  
//   actualizar: async (id, datos) => {
//     const payload = {
//       vehicle_brand: datos.marca,
//       vehicle_model: datos.modelo,
//       license_plate: datos.placa,
//       capacity_kg: datos.capacidadKg !== undefined && datos.capacidadKg !== null && datos.capacidadKg !== ''
//         ? parseFloat(datos.capacidadKg)
//         : null,
//       vehicle_status: typeof datos.estado === 'boolean'
//         ? datos.estado
//         : datos.estado === 'Activo' ? true : false
//     };
//     return await apiClient.put(`/api/vehicles/${id}`, payload);
//   },
  
//   eliminar: async (id) => {
//     return await apiClient.delete(`/api/vehicles/${id}`);
//   }
// };


import { apiClient } from "../../../shared/services/api";

export const vehiculosService = {
  obtenerTodos: async () => {
    try {
      // Ruta corregida: sin el /api inicial
      const response = await apiClient.get('/vehicles');
      const data = Array.isArray(response.data) ? response.data : (response.data.vehicles || []);
      
      return data.map(v => ({
        id: v.vehicle_id,
        placa: v.license_plate,
        marca: v.vehicle_brand,
        modelo: v.vehicle_model,
        capacidadKg: v.capacity_kg,
        estado: v.vehicle_status ? 'Activo' : 'Inactivo'
      }));
    } catch (error) {
      console.error('Error al obtener vehículos:', error);
      throw error;
    }
  },
  
  crear: async (datos) => {
    const payload = {
      vehicle_brand: datos.marca,
      vehicle_model: datos.modelo,
      license_plate: datos.placa,
      capacity_kg: datos.capacidadKg ? parseFloat(datos.capacidadKg) : null,
      vehicle_status: typeof datos.estado === 'boolean' ? datos.estado : (datos.estado === 'Activo')
    };
    // Ruta corregida: sin /api
    return await apiClient.post('/vehicles', payload);
  },
  
  actualizar: async (id, datos) => {
    const payload = {
      vehicle_brand: datos.marca,
      vehicle_model: datos.modelo,
      license_plate: datos.placa,
      capacity_kg: datos.capacidadKg ? parseFloat(datos.capacidadKg) : null,
      vehicle_status: typeof datos.estado === 'boolean' ? datos.estado : (datos.estado === 'Activo')
    };
    // Ruta corregida: sin /api
    return await apiClient.put(`/vehicles/${id}`, payload);
  },
  
  eliminar: async (id) => {
    // Ruta corregida: sin /api
    return await apiClient.delete(`/vehicles/${id}`);
  }
};