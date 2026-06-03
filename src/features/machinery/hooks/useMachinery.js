import { useState, useCallback } from 'react';

export const useMachinery = () => {
  const [machineries, setMachineries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * 1. CARGAR MAQUINARIAS (Data combinada con JOINs para la grilla)
   */
  const cargarMaquinarias = useCallback(async () => { 
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('http://localhost:3000/api/machines/table');
        
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

  /**
   * 2. ELIMINAR MAQUINARIA
   */
  const eliminarMaquinaria = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta maquinaria?')) {
      try {
        const response = await fetch(`http://localhost:3000/api/machines/${id}`, {
          method: 'DELETE'
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

  /**
   * 3. CREAR MAQUINARIA
   */
  const crearMaquinaria = async (maquinariaData) => {
    try {
      const response = await fetch('http://localhost:3000/api/machines', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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

  /**
   * 4. ACTUALIZAR MAQUINARIA
   */
  const actualizarMaquinaria = async (id, maquinariaData) => {
    try {
      const response = await fetch(`http://localhost:3000/api/machines/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
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