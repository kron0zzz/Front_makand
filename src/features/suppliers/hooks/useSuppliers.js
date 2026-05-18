// // Capa de servicios para interactuar con el endpoint de clientes en el backend.
// // Hook para separar la lógica de negocio de la interfaz visual

// //(Toda la lógica de estados, carga y funciones)
import { useState, useEffect, useCallback } from 'react';

export const useSuppliers = () => {
  // Inicializamos con un array vacío, ya no necesitamos los datos de prueba
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * 1. CARGAR CLIENTES (Conexión Real)
   * Usamos useCallback para que la función sea estable y no cause bucles en el useEffect.
   */
  const cargarProveedores = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Llamamos a la ruta optimizada para la tabla que creamos en el backend
      const response = await fetch('http://localhost:3000/api/suppliers');
      
      if (!response.ok) {
        throw new Error('No se pudo conectar con el servidor');
      }
      
      const datos = await response.json();
      setSuppliers(datos);
    } catch (err) {
      setError(err.message);
      console.error("Error al cargar proveedores:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const cargarDatosProveedores = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Llamamos a la ruta optimizada para la tabla que creamos en el backend
      const response = await fetch('http://localhost:3000/api/suppliers');
      
      if (!response.ok) {
        throw new Error('No se pudo conectar con el servidor');
      }
      
      const datos = await response.json();
      setSuppliers(datos);
    } catch (err) {
      setError(err.message);
      console.error("Error al cargar proveedores:", err);
    } finally {
      setLoading(false);
    }
  }, []);



  /**
   * 2. CAMBIAR ESTADO (Para el Switch de la interfaz)
   * Esta función enviará el cambio a la base de datos PostgreSQL.
   */
  const toggleProveedorEstado = async (id, estadoActual) => {
    try {
      const response = await fetch(`http://localhost:3000/api/suppliers/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          supplier_status: !estadoActual // Invertimos el booleano
        })
      });

      if (response.ok) {
        // Refrescamos la tabla para ver el cambio reflejado desde la DB
        await cargarProveedores();
      }
    } catch (err) {
      console.error("Error al actualizar estado:", err);
    }
  };

  /**
   * 3. ELIMINAR Proveedor (Conexión Real)
   */
  const eliminarProveedor = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este proveedor?')) {
      try {
        const response = await fetch(`http://localhost:3000/api/suppliers/${id}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          // Filtramos el estado local para una respuesta visual instantánea
          setSuppliers(prev => prev.filter(c => c.customer_id !== id));
        } else {
          alert("No se pudo eliminar el proveedor.");
        }
      } catch (err) {
        console.error("Error al eliminar:", err);
      }
    }
  };

  
  // Efecto de carga inicial
  useEffect(() => {
  const fetchTableData = async () => {
    await cargarProveedores();
  };
  
  fetchTableData();
}, [cargarProveedores]);

  return { 
    suppliers, 
    loading, 
    error, 
    cargarProveedores, 
    toggleProveedorEstado, 
    eliminarProveedor, 
    cargarDatosProveedores
  };
};