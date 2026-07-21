import { apiClient } from "../../../shared/services/api";

const API_URL =
  "http://localhost:3000/api/orders";

export const orderService = {

  // implementando paginación
  obtenerTabla: async (page = 1, limit = 9, search="") => {
    const { data } = await apiClient.get(
      `/orders/table?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`
    );

    return data;
  },



  // Pedido completo

  obtenerCompleto: async (id) => {

    const token =
      localStorage.getItem("token");

    const response = await fetch(
      `${API_URL}/${id}/full`,
      {
        headers: {
          Authorization:
            `Bearer ${token}`
        }
      }
    );

    if (!response.ok) {
      throw new Error(
        "Error obteniendo pedido"
      );
    }

    return await response.json();
  },



  // Crear pedido completo

  crearCompleto: async (data) => {

    const token =
      localStorage.getItem("token");

    const response = await fetch(
      `${API_URL}/complete`,
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
          Authorization:
            `Bearer ${token}`
        },
        body: JSON.stringify(data)
      }
    );

    if (!response.ok) {

      const error =
        await response.json();

      throw new Error(
        error.error ||
        "Error creando pedido"
      );
    }

    return await response.json();
  },


  


  eliminar: async (id) => {

    const token =
      localStorage.getItem("token");

    const response = await fetch(
      `${API_URL}/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization:
            `Bearer ${token}`
        }
      }
    );

    if (!response.ok) {
      throw new Error(
        "Error eliminando pedido"
      );
    }

    return true;
  }

};