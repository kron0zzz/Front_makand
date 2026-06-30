// Las llamadas a la API
export const customerService = {
  obtenerTodos: async () => {
    const token = localStorage.getItem("token");
    const response = await fetch('http://localhost:3000/api/customers/table', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.ok ? await response.json() : [];
  },
  crear: async (data) => console.log("Creando:", data),
  actualizar: async (id, data) => console.log("Actualizando:", id, data),
  eliminar: async (id) => console.log("Eliminando:", id),
};