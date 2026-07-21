import { useState, useEffect, useCallback } from 'react';
import { customerService } from '../services/customerService'; // Importamos el servicio

export const useCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // asignar estados para paginación
  const [page, setPage] = useState(1);
  const [limit] = useState(9);
  const [search, setSearch] = useState("");

  const [pagination, setPagination] = useState({
      page: 1,
      totalPages: 1,
      total: 0
  });

  const cargarClientes = useCallback(async () => { 
      setLoading(true);
      setError(null);
      try {
        // Usamos el servicio en lugar de fetch
        const datos = await customerService.obtenerTodos(page, limit, search);
        setCustomers(datos.data);
        setPagination(datos.pagination); 
      } catch (err) {
        setError(err.message || 'Error al cargar clientes');
        console.error("Error al cargar clientes:", err);
      } finally {
        setLoading(false);
      }
  }, [page, limit, search]);



  const toggleCustomerEstado = async (id, estadoActual) => {
    if (
      !window.confirm(
        `¿Estás seguro de que deseas ${
          estadoActual ? "desactivar" : "activar"
        } este cliente?`
      )
    ) {
      return;
    }
  
    try {
      const cliente = await customerService.obtenerPorId(id);
  
      cliente.customer_status = !estadoActual;
  
      await customerService.actualizar(id, cliente);
  
      await cargarClientes();
    } catch (err) {
      console.error(err);
      alert("No se pudo actualizar el estado.");
    }
  };


  //función para cambiar de página
  const cambiarPagina = (nuevaPagina) => {
    if (
        nuevaPagina !== page &&
        nuevaPagina >= 1 &&
        nuevaPagina <= pagination.totalPages
    ) {
        setPage(nuevaPagina);
    }
  };



  const cambiarBusqueda = useCallback((texto) => {
    setSearch(texto);
    setPage(1);
  }, []);

  const eliminarCliente = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este cliente?')) {
      try {
        // Usamos el servicio en lugar de fetch
        await customerService.eliminar(id);
        setCustomers(prev => prev.filter(c => c.customer_id !== id));
      } catch (err) {
        console.error("Error al eliminar:", err);
        alert("No se pudo eliminar el cliente.");
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
    toggleCustomerEstado, 
    eliminarCliente, 

    page,
    cambiarPagina,
    cambiarBusqueda,
    pagination
  };
};