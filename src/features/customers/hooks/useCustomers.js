// // Capa de servicios para interactuar con el endpoint de clientes en el backend.
// // Hook para separar la lógica de negocio de la interfaz visual

// //(Toda la lógica de estados, carga y funciones)
import { useState, useEffect, useCallback } from 'react';

export const useCustomers = () => {
  // Inicializamos con un array vacío, ya no necesitamos los datos de prueba
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * 1. CARGAR CLIENTES (Conexión Real)
   * Usamos useCallback para que la función sea estable y no cause bucles en el useEffect.
   */
  const cargarClientes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Llamamos a la ruta optimizada para la tabla que creamos en el backend
      const response = await fetch('http://localhost:3000/api/customers/table');
      
      if (!response.ok) {
        throw new Error('No se pudo conectar con el servidor');
      }
      
      const datos = await response.json();
      setCustomers(datos);
    } catch (err) {
      setError(err.message);
      console.error("Error al cargar clientes:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * 2. CAMBIAR ESTADO (Para el Switch de la interfaz)
   * Esta función enviará el cambio a la base de datos PostgreSQL.
   */
  const toggleClienteEstado = async (id, estadoActual) => {
    try {
      const response = await fetch(`http://localhost:3000/api/customers/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          client_status: !estadoActual // Invertimos el booleano
        })
      });

      if (response.ok) {
        // Refrescamos la tabla para ver el cambio reflejado desde la DB
        await cargarClientes();
      }
    } catch (err) {
      console.error("Error al actualizar estado:", err);
    }
  };

  /**
   * 3. ELIMINAR CLIENTE (Conexión Real)
   */
  const eliminarCliente = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este cliente?')) {
      try {
        const response = await fetch(`http://localhost:3000/api/customers/${id}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          // Filtramos el estado local para una respuesta visual instantánea
          setCustomers(prev => prev.filter(c => c.customer_id !== id));
        } else {
          alert("No se pudo eliminar el cliente.");
        }
      } catch (err) {
        console.error("Error al eliminar:", err);
      }
    }
  };

  
  // Efecto de carga inicial
  useEffect(() => {
  const fetchTableData = async () => {
    await cargarClientes();
  };
  
  fetchTableData();
}, [cargarClientes]);

  return { 
    customers, 
    loading, 
    error, 
    cargarClientes, 
    toggleClienteEstado, 
    eliminarCliente 
  };
};