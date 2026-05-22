// Capa de servicios para interactuar con el endpoint de maquinaria en el backend.

export const machineryService = {
  obtenerTodos: async () => {
    return []; 
  },
  crear: async (data) => console.log("Creando Maquinaria:", data),
  actualizar: async (id, data) => console.log("Actualizando Maquinaria:", id, data),
  eliminar: async (id) => console.log("Eliminando Maquinaria:", id),
};

export default machineryService;