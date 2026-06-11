// Capa de servicios para interactuar con el endpoint de estados de maquinaria en el backend.
// Hook para separar la lógica de negocio de la interfaz visual
import { useState, useEffect, useCallback } from 'react';

export const useMachineryStatuses = () => {
  const [statuses, setStatuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * 1. CARGAR ESTADOS DE MAQUINARIA (Conexión Real)
   * Apunta a la ruta /table que configuramos en el controlador del backend.
   */
  const cargarEstados = useCallback(async () => { 
      setLoading(true);
      setError(null);
      try {
        // Usamos el endpoint correcto mapeado en tu Express (/api/machine-statuses/table)
        const response = await fetch('http://localhost:3000/api/machine-statuses/table');
        
        if (!response.ok) {
          throw new Error('No se pudo conectar con el servidor');
        }
        
        const datos = await response.json();
        setStatuses(datos); 
      } catch (err) {
        setError(err.message);
        console.error("Error al cargar estados de maquinaria:", err);
      } finally {
        setLoading(false);
      }
  }, []);

  /**
   * 2. ELIMINAR ESTADO DE MAQUINARIA (Conexión Real)
   */
  const eliminarEstado = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este estado de maquinaria?')) {
      try {
        const response = await fetch(`http://localhost:3000/api/machine-statuses/${id}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          // Filtramos el estado local para actualizar la UI al instante
          setStatuses(prev => prev.filter(status => status.status_id !== id));
        } else {
          alert("No se pudo eliminar ya que este estado se encuentra en uso.");
        }
      } catch (err) {
        console.error("Error al eliminar estado:", err);
      }
    }
  };

  // Efecto de carga inicial al montar el componente
  useEffect(() => {
    const fetchTableData = async () => {
      await cargarEstados();
    };
    
    fetchTableData();
  }, [cargarEstados]);

  return { 
    statuses, 
    loading, 
    error, 
    cargarEstados, 
    eliminarEstado 
  };
};