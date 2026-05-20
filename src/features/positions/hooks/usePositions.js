// // Capa de servicios para interactuar con el endpoint de clientes en el backend.
// // Hook para separar la lógica de negocio de la interfaz visual

// //(Toda la lógica de estados, carga y funciones)
import { useState, useEffect, useCallback } from 'react';

export const usePositions = () => {
  // Inicializamos con un array vacío, ya no necesitamos los datos de prueba
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * 1. CARGAR cargos (Conexión Real)
   * Usamos useCallback para que la función sea estable y no cause bucles en el useEffect.
   */
  const cargarCargos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Llamamos a la ruta optimizada para la tabla que creamos en el backend
      const response = await fetch('http://localhost:3000/api/positions'); 
      
      if (!response.ok) {
        throw new Error('No se pudo conectar con el servidor');
      }
      
      const datos = await response.json();
      setPositions(datos);
    } catch (err) {
      setError(err.message);
      console.error("Error al cargar Cargos:", err);
    } finally {
      setLoading(false);
    }
  }, []);


  /**
   * 3. ELIMINAR cargo (Conexión Real)
   */
  const eliminarCargo = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este cargo?')) {
      try {
        const response = await fetch(`http://localhost:3000/api/positions/${id}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          // Filtramos el estado local para una respuesta visual instantánea
          setPositions(prev => prev.filter(p => p.position_id !== id));
        } else {
          alert("No se pudo eliminar el Cargo.");
        }
      } catch (err) {
        console.error("Error al eliminar:", err);
      }
    }
  };

  
  // Efecto de carga inicial
  useEffect(() => {
  const fetchTableData = async () => {
    await cargarCargos();
  };
  
  fetchTableData();
}, [cargarCargos]);

  return { 
    positions, 
    loading, 
    error, 
    cargarCargos, 
    eliminarCargo
  };
};