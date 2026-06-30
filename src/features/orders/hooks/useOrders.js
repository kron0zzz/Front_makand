import { useState, useEffect, useCallback } from "react";

export const useOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = "http://localhost:3000/api/orders";

  const cargarPedidos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/table`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!response.ok) throw new Error("No se pudieron cargar los pedidos");

      const data = await response.json();
      setOrders(data);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Efecto corregido para quitar el subrayado rojo
  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    cargarPedidos();
  }, [cargarPedidos]);

  // ... (tus funciones obtenerPedidoCompleto, crearPedidoCompleto, eliminarPedido se mantienen igual)
  
  return { orders, loading, error, cargarPedidos, /* ... resto de funciones */ };
};