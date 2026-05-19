import { apiClient } from "../../../shared/services/api";

export const vehiculosService = {
  obtenerTodos: async () => {
    try {
      const response = await apiClient.get('/api/vehicles');
      const data = Array.isArray(response.data) ? response.data : (response.data.vehicles || []);
      
      return data.map(v => ({
        id: v.vehicle_id,
        placa: v.license_plate,
        marca: v.vehicle_brand,
        modelo: v.vehicle_model,
        capacidadKg: v.capacity_kg,
        estado: (() => {
          switch (v.vehicle_status) {
            case true: return 'Activo';
            case false: return 'Inactivo';
            default: return 'Inactivo';
          }
        })()
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
      capacity_kg: parseFloat(datos.capacidadKg),
      vehicle_status: (() => {
        switch (datos.estado) {
          case 'Activo': return true;
          case 'Inactivo': return false;
          default: return Boolean(datos.estado);
        }
      })()
    };
    return await apiClient.post('/api/vehicles', payload);
  },
  
  actualizar: async (id, datos) => {
    const payload = {
      vehicle_brand: datos.marca,
      vehicle_model: datos.modelo,
      license_plate: datos.placa,
      capacity_kg: parseFloat(datos.capacidadKg),
      vehicle_status: (() => {
        switch (datos.estado) {
          case 'Activo': return true;
          case 'Inactivo': return false;
          default: return !!datos.estado;
        }
      })()
    };
    return await apiClient.put(`/api/vehicles/${id}`, payload);
  },
  
  eliminar: async (id) => {
    return await apiClient.delete(`/api/vehicles/${id}`);
  }
};