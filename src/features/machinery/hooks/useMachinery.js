import { useState, useCallback, useEffect } from 'react';

export const useMachinery = () => {
  const [machineries, setMachineries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const cargarMaquinarias = useCallback(async () => { 
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        const response = await fetch('http://localhost:3000/api/machines/table', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error('No se pudo conectar con el servidor para cargar las maquinarias');
        }
        
        const datos = await response.json();
        setMachineries(datos); 
      } catch (err) {
        setError(err.message);
        console.error("Error al cargar maquinarias:", err);
      } finally {
        setLoading(false);
      }
  }, []);

  const eliminarMaquinaria = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta maquinaria?')) {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`http://localhost:3000/api/machines/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          setMachineries(prev => prev.filter(item => item.machinery_id !== id));
        } else {
          alert("No se pudo eliminar la maquinaria.");
        }
      } catch (err) {
        console.error("Error al eliminar maquinaria:", err);
      }
    }
  };

  const crearMaquinaria = async (maquinariaData) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch('http://localhost:3000/api/machines', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(maquinariaData)
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Error al crear maquinaria');
      }

      await cargarMaquinarias();
      return true;
    } catch (err) {
      alert(err.message);
      return false;
    }
  };

  const actualizarMaquinaria = async (id, maquinariaData) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:3000/api/machines/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(maquinariaData)
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Error al actualizar maquinaria');
      }

      await cargarMaquinarias();
      return true;
    } catch (err) {
      alert(err.message);
      return false;
    }
  };

  useEffect(() => {
    cargarMaquinarias();
  }, [cargarMaquinarias]);

  return { 
    machineries,
    loading, 
    error, 
    cargarMaquinarias, 
    eliminarMaquinaria,
    crearMaquinaria,
    actualizarMaquinaria
  };
};