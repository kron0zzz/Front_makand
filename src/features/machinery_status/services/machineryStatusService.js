// Las llamadas a la API/Mocks para Estados de Maquinaria
// Capa de servicios para interactuar con el endpoint de estados en el backend.

export const machineryStatusService = {
  obtenerTodos: async () => {
    // Por ahora, devolvemos un array vacío para que no falle al cargar
    return []; 
  },
  crear: async (data) => console.log("Creando Estado de Maquinaria:", data),
  actualizar: async (id, data) => console.log("Actualizando Estado de Maquinaria:", id, data),
  eliminar: async (id) => console.log("Eliminando Estado de Maquinaria:", id),
};