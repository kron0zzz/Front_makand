import { useState, useEffect, useCallback } from 'react';

export const useMachineryStatuses = () => {
  const [statuses, setStatuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const cargarEstados = useCallback(async () => { 
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        const response = await fetch('http://localhost:3000/api/machine-statuses/table', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
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

  const eliminarEstado = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este estado de maquinaria?')) {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`http://localhost:3000/api/machine-statuses/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          setStatuses(prev => prev.filter(status => status.status_id !== id));
        } else {
          alert("No se pudo eliminar ya que este estado se encuentra en uso.");
        }
      } catch (err) {
        console.error("Error al eliminar estado:", err);
      }
    }
  };

  useEffect(() => {
    cargarEstados();
  }, [cargarEstados]);

  return { 
    statuses, 
    loading, 
    error, 
    cargarEstados, 
    eliminarEstado 
  };
};