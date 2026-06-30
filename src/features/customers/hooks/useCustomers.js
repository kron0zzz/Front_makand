import { useState, useEffect, useCallback } from 'react';

export const useCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const cargarClientes = useCallback(async () => { 
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        const response = await fetch('http://localhost:3000/api/customers/table', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
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

  const toggleClienteEstado = async (id, estadoActual) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:3000/api/customers/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ 
          client_status: !estadoActual 
        })
      });

      if (response.ok) {
        await cargarClientes();
      }
    } catch (err) {
      console.error("Error al actualizar estado:", err);
    }
  };

  const eliminarCliente = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este cliente?')) {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`http://localhost:3000/api/customers/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          setCustomers(prev => prev.filter(c => c.customer_id !== id));
        } else {
          alert("No se pudo eliminar el cliente.");
        }
      } catch (err) {
        console.error("Error al eliminar:", err);
      }
    }
  };

  useEffect(() => {
    cargarClientes();
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