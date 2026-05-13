// Capa de servicios para interactuar con el endpoint de clientes en el backend.
// Hook para separar la lógica de negocio de la interfaz visual

//(Toda la lógica de estados, carga y funciones)




import { useState, useEffect } from 'react';
import { customerService } from '../services/customerService';

export const useCustomers = () => {
  // 1. Agregamos datos de prueba aquí para ver la tabla llena
  const [customers, setCustomers] = useState([
    { id: 1, documento: '102030', firstName: 'Sara', lastName: 'C.', estado: 'Activo' },
    { id: 2, documento: '405060', firstName: 'Juan', lastName: 'P.', estado: 'Activo' }
  ]);
  const [loading, setLoading] = useState(false);

  const cargarClientes = async () => {
    // Cuando conectes el backend, esto reemplazará los datos de prueba
    /*
    setLoading(true);
    try {
      const datos = await customerService.obtenerTodos();
      setCustomers(datos);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
    */
  };

  useEffect(() => { cargarClientes(); }, []);

  const eliminarCliente = async (id) => {
    if (window.confirm('¿Eliminar cliente?')) {
      // Simulación de borrado local
      setCustomers(customers.filter(c => c.id !== id));
    }
  };

  return { customers, loading, cargarClientes, eliminarCliente };
};