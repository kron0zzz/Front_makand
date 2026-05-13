// Importamos la configuración global de Axios
// Subimos 4 niveles para llegar a src/services/
import apiClient from "../../../shared/services/api";
export const vehiculosService = {
  obtenerTodos: async () => {
    try {
      // Ahora usamos apiClient porque así lo llamamos arriba en la importación
      const response = await apiClient.get('/api/vehicles');
      
      const data = Array.isArray(response.data) 
        ? response.data 
        : (response.data.vehicles || []);
      
      return data.map(v => ({
        id: v.vehicle_id,
        placa: v.license_plate,
        marca: v.vehicle_brand,
        modelo: v.vehicle_model,
        capacidadKg: v.capacity_kg,
        estado: v.vehicle_status ? 'Activo' : 'Inactivo',
        ...v 
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
      capacity_kg: Number(datos.capacidadKg),
      vehicle_status: datos.estado !== false
    };
    // Usamos apiClient para enviar los datos al backend de Makand
    const response = await apiClient.post('/api/vehicles', payload);
    return response.data;
  },

  actualizar: async (id, datos) => {
    const payload = {
      vehicle_brand: datos.marca,
      vehicle_model: datos.modelo,
      license_plate: datos.placa,
      capacity_kg: Number(datos.capacidadKg),
      vehicle_status: datos.estado === 'Activo' || datos.estado === true
    };
    const response = await apiClient.put(`/api/vehicles/${id}`, payload);
    return response.data;
  }
};