import { useState, useEffect, useCallback } from "react";

export const useOrders = () => {

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = "http://localhost:3000/api/orders";



  // ==========================
  // CARGAR PEDIDOS
  // ==========================
  const cargarPedidos = useCallback(async () => {

    try {

      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/table`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (!response.ok) {
        throw new Error(
          "No se pudieron cargar los pedidos"
        );
      }

      const data = await response.json();

      setOrders(data);

    } catch (err) {

      console.error(err);
      setError(err.message);

    } finally {

      setLoading(false);

    }

  }, []);




  // ==========================
  // OBTENER PEDIDO COMPLETO
  // ==========================
  const obtenerPedidoCompleto = async (id) => {

    try {

      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/${id}/full`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (!response.ok) {
        throw new Error(
          "No se pudo obtener el pedido"
        );
      }

      return await response.json();

    } catch (err) {

      console.error(err);
      throw err;

    }

  };




  // ==========================
  // CREAR PEDIDO COMPLETO
  // ==========================
  const crearPedidoCompleto = async (pedidoData) => {

    try {

      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/complete`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(pedidoData)
        }
      );

      if (!response.ok) {

        const errorData =
          await response.json();

        throw new Error(
          errorData.error ||
          "Error al crear pedido"
        );
      }

      const nuevoPedido =
        await response.json();

      await cargarPedidos();

      return nuevoPedido;

    } catch (err) {

      console.error(err);
      throw err;

    }

  };




  // ==========================
  // ELIMINAR PEDIDO
  // ==========================
  const eliminarPedido = async (id) => {

    if (
      !window.confirm(
        "¿Deseas eliminar este pedido?"
      )
    ) {
      return;
    }

    try {

      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (!response.ok) {
        throw new Error(
          "No se pudo eliminar el pedido"
        );
      }

      await cargarPedidos();

    } catch (err) { 

      console.error(err);
      alert(err.message);

    }

  };




  useEffect(() => {

    cargarPedidos();

  }, [cargarPedidos]);



  return {

    orders,
    loading,
    error,

    cargarPedidos,
    obtenerPedidoCompleto,
    crearPedidoCompleto,
    eliminarPedido

  };

};