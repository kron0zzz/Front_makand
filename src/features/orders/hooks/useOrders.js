// // // import { useState, useEffect, useCallback } from "react";

// // // export const useOrders = () => {
// // //   const [orders, setOrders] = useState([]);
// // //   const [loading, setLoading] = useState(true);
// // //   const [error, setError] = useState(null);

// // //   const API_URL = "http://localhost:3000/api/orders";

// // //   const cargarPedidos = useCallback(async () => {
// // //     try {
// // //       setLoading(true);
// // //       setError(null);
// // //       const token = localStorage.getItem("token");

// // //       const response = await fetch(`${API_URL}/table`, {
// // //         headers: { Authorization: `Bearer ${token}` }
// // //       });

// // //       if (!response.ok) throw new Error("No se pudieron cargar los pedidos");

// // //       const data = await response.json();
// // //       setOrders(data);
// // //     } catch (err) {
// // //       console.error(err);
// // //       setError(err.message);
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   }, []);

// // //   // Efecto corregido para quitar el subrayado rojo
// // //   useEffect(() => {
// // //     // eslint-disable-next-line react-hooks/exhaustive-deps
// // //     cargarPedidos();
// // //   }, [cargarPedidos]);

// // //   // ... (tus funciones obtenerPedidoCompleto, crearPedidoCompleto, eliminarPedido se mantienen igual)
  
// // //   return { orders, loading, error, cargarPedidos, /* ... resto de funciones */ };
// // // };





// // //                                                         LO DE RIOSSSSSSS
// // //                                                         LO DE RIOSSSSSSS
// // //                                                         LO DE RIOSSSSSSS
// // //                                                         LO DE RIOSSSSSSS
// // //                                                         LO DE RIOSSSSSSS
// // //                                                         LO DE RIOSSSSSSS
// // //                                                         LO DE RIOSSSSSSS
// // //                                                         LO DE RIOSSSSSSS
// // //                                                         LO DE RIOSSSSSSS                                                         LO DE RIOSSSSSSS
// // //                                                         LO DE RIOSSSSSSS
// // //                                                         LO DE RIOSSSSSSS

// // import { useState, useCallback } from "react";

// // export const useOrders = () => {

// //   const [orders, setOrders] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState(null);
// //   //const [selectedOrder, setSelectedOrder] = useState(null);    esto es solo una prueba, se puede eliminar

// //   const API_URL = "http://localhost:3000/api/orders";



// //   // ==========================
// //   // CARGAR PEDIDOS
// //   // ==========================
// //   const cargarPedidos = useCallback(async () => {

// //     try {

// //       setLoading(true);
// //       setError(null);

// //       const token = localStorage.getItem("token");

// //       const response = await fetch(
// //         `${API_URL}/table`,
// //         {
// //           headers: {
// //             Authorization: `Bearer ${token}`
// //           }
// //         }
// //       );

// //       if (!response.ok) {
// //         throw new Error(
// //           "No se pudieron cargar los pedidos"
// //         );
// //       }

// //       const data = await response.json();

// //       setOrders(data);

// //     } catch (err) {

// //       console.error(err);
// //       setError(err.message);

// //     } finally {

// //       setLoading(false);

// //     }

// //   }, []);




// //   // ==========================
// //   // OBTENER PEDIDO COMPLETO
// //   // ==========================
// //   const obtenerPedidoCompleto = async (id) => {

// //     try {

// //       const token = localStorage.getItem("token");

// //       const response = await fetch(
// //         `${API_URL}/${id}/full`,
// //         {
// //           headers: {
// //             Authorization: `Bearer ${token}`
// //           }
// //         }
// //       );

// //       if (!response.ok) {
// //         throw new Error(
// //           "No se pudo obtener el pedido"
// //         );
// //       }

// //       return await response.json();

// //     } catch (err) {

// //       console.error(err);
// //       throw err;

// //     }

// //   };




// //   // ==========================
// //   // CREAR PEDIDO COMPLETO
// //   // ==========================
// //   const crearPedidoCompleto = async (pedidoData) => {

// //     try {

// //       const token = localStorage.getItem("token");

// //       const response = await fetch(
// //         `${API_URL}/complete`,
// //         {
// //           method: "POST",
// //           headers: {
// //             "Content-Type": "application/json",
// //             Authorization: `Bearer ${token}`
// //           },
// //           body: JSON.stringify(pedidoData)
// //         }
// //       );

// //       if (!response.ok) {

// //         const errorData =
// //           await response.json();

// //         throw new Error(
// //           errorData.error ||
// //           "Error al crear pedido"
// //         );
// //       }

// //       const nuevoPedido =
// //         await response.json();

// //       await cargarPedidos();

// //       return nuevoPedido;

// //     } catch (err) {

// //       console.error(err);
// //       throw err;

// //     }

// //   };




// //   // ==========================
// //   // ELIMINAR PEDIDO
// //   // ==========================
// //   const eliminarPedido = async (id) => {

// //     if (
// //       !window.confirm(
// //         "¿Deseas eliminar este pedido?"
// //       )
// //     ) {
// //       return;
// //     }

// //     try {

// //       const token = localStorage.getItem("token");

// //       const response = await fetch(
// //         `${API_URL}/${id}`,
// //         {
// //           method: "DELETE",
// //           headers: {
// //             Authorization: `Bearer ${token}`
// //           }
// //         }
// //       );

// //       if (!response.ok) {
// //         throw new Error(
// //           "No se pudo eliminar el pedido"
// //         );
// //       }

// //       await cargarPedidos();

// //     } catch (err) { 

// //       console.error(err);
// //       alert(err.message);

// //     }

// //   };


// //   /*
// //   // ==========================
// //   // OBTENER WORKSPACE
// //   // ==========================
// //   const obtenerWorkspace = async (id) => {

// //     try {

// //       const token = localStorage.getItem("token");

// //       const response = await fetch(
// //         `${API_URL}/${id}/workspace`,
// //         {
// //           headers: {
// //             Authorization: `Bearer ${token}`
// //           }
// //         }
// //       );

// //       if (!response.ok) {
// //         throw new Error(
// //           "No se pudo obtener el workspace"
// //         );
// //       }

// //       return await response.json();

// //     } catch (err) {

// //       console.error(err);
// //       throw err;

// //     }

// //   };


// //   //lo del workspace

// //   const abrirWorkspace = async (id) => {
// //     return await obtenerWorkspace(id);
// //   };

// //   */

// //   return {

// //     orders,
// //     loading,
// //     error,

// //     cargarPedidos,
// //     obtenerPedidoCompleto,
// //     //obtenerWorkspace,

// //     crearPedidoCompleto,
// //     eliminarPedido,

// //     ///abrirWorkspace,
// //     //setSelectedOrder
// //   };

// // };














// /////////////////////                 ACTUALIZACIÓN - VERSION MEJORADA 

// import { useState, useCallback } from "react";
// import api from "../../../shared/services/api"; 

// export const useOrders = () => {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   // Helper para manejar errores de forma centralizada
//   const handleError = (err) => {
//     const message = err.response?.data?.message || err.message || "Error desconocido";
//     setError(message);
//     if (err.response?.status === 403) {
//       console.warn("Acceso denegado: permisos insuficientes");
//     }
//     throw err;
//   };

//   const cargarPedidos = useCallback(async () => {
//     try {
//       setLoading(true);
//       setError(null);
//       // Usando tu instancia de api, el token se inyecta en el interceptor
//       // const { data } = await api.get("/orders/table");
//       const { data } = await api.get("/orders");
//       setOrders(data);
//     } catch (err) {
//       handleError(err);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   const crearPedidoCompleto = async (pedidoData) => {
//     try {
//       const { data } = await api.post("/orders/complete", pedidoData);
//       await cargarPedidos(); // Refrescar lista
//       return data;
//     } catch (err) {
//       handleError(err);
//     }
//   };

//   const eliminarPedido = async (id) => {
//     if (!window.confirm("¿Deseas eliminar este pedido?")) return;
//     try {
//       await api.delete(`/orders/${id}`);
//       await cargarPedidos();
//     } catch (err) {
//       handleError(err);
//     }
//   };

//   return {
//     orders,
//     loading,
//     error,
//     cargarPedidos,
//     crearPedidoCompleto,
//     eliminarPedido
//   };
// };





// features/orders/hooks/useOrders.js
import { useState, useCallback } from "react";
import api from "../../../shared/services/api"; 

export const useOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleError = (err) => {
    const message = err.response?.data?.message || err.message || "Error desconocido";
    setError(message);
    throw err;
  };

  const cargarPedidos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      // baseURL es /api + esta ruta = /api/orders/table
      const { data } = await api.get("/orders/table"); 
      setOrders(data);
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const crearPedidoCompleto = async (pedidoData) => {
    try {
      // baseURL es /api + esta ruta = /api/orders/complete
      const { data } = await api.post("/orders/complete", pedidoData);
      await cargarPedidos();
      return data;
    } catch (err) {
      handleError(err);
    }
  };

  const eliminarPedido = async (id) => {
    if (!window.confirm("¿Deseas eliminar este pedido?")) return;
    try {
      // baseURL es /api + esta ruta = /api/orders/:id
      await api.delete(`/orders/${id}`);
      await cargarPedidos();
    } catch (err) {
      handleError(err);
    }
  };

  const obtenerPedidoCompleto = async (id) => {
    try {
      const { data } = await api.get(`/orders/${id}/full`);
      return data;
    } catch (err) {
      handleError(err);
    }
  };

  return { 
    orders, 
    loading, 
    error, 
    cargarPedidos, 
    crearPedidoCompleto,
    eliminarPedido,
    obtenerPedidoCompleto, 
 
  };
};