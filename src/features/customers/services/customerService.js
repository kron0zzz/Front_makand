//Las llamadas a la API/Mocks



export const customerService = {
  obtenerTodos: async () => {
    // Por ahora, devolvemos un array vacío para que no falle al cargar
    return []; 
  },
  crear: async (data) => console.log("Creando:", data),
  actualizar: async (id, data) => console.log("Actualizando:", id, data),
  eliminar: async (id) => console.log("Eliminando:", id),
};


