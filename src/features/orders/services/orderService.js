const API_URL = "http://localhost:3000/api/orders";

export const orderService = {

  // Obtener todos los pedidos completos
  obtenerTodos: async () => {

    const token = localStorage.getItem("token");

    const response = await fetch(
      `${API_URL}/full`,
      {
        headers: {
          Authorization: `Bearer ${token}`       //nota:  debo aclararle a gpt que las rutas tal vez sean distintas, en especial la de get full, porque se está pidiendo en id en realidad, también debería mostrarle y corregir el endpoint de table, para que traiga los nombres y no los id´s
        }
      }
    );

    if (!response.ok) {
      throw new Error(
        "Error al obtener pedidos"
      );
    }

    return await response.json();
  },



  // Obtener un pedido específico
  obtenerPorId: async (id) => {

    const token = localStorage.getItem("token");

    const response = await fetch(
      `${API_URL}/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    if (!response.ok) {
      throw new Error(
        "Error al obtener pedido"
      );
    }

    return await response.json();
  },



  // Crear pedido completo
  crearCompleto: async (data) => {

    const token = localStorage.getItem("token");

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
        "Error al crear pedido"
      );
    }

    return await response.json();
  },



  // Actualizar pedido
  actualizar: async (
    id,
    data
  ) => {

    const token = localStorage.getItem("token");

    const response = await fetch(
      `${API_URL}/${id}`,
      {
        method: "PUT",
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
      throw new Error(
        "Error al actualizar pedido"
      );
    }

    return await response.json();
  },



  // Eliminar pedido
  eliminar: async (id) => {

    const token = localStorage.getItem("token");

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
        "Error al eliminar pedido"
      );
    }

    return true;
  }

};