// 1. Asegúrate de que esta línea esté idéntica arriba del todo:
import { useState, useEffect, useCallback } from 'react';

export const useMachineryCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Función para cargar
  const cargarCategorias = useCallback(async () => { 
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('http://localhost:3000/api/machine-categories/table');
        
        if (!response.ok) {
          throw new Error('No se pudo conectar con el servidor');
        }
        
        const datos = await response.json();
        setCategories(datos); 
      } catch (err) {
        setError(err.message);
        console.error("Error al cargar categorías:", err);
      } finally {
        setLoading(false);
      }
  }, []);

  // Función para eliminar
  const eliminarCategoria = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta categoría?')) {
      try {
        const response = await fetch(`http://localhost:3000/api/machine-categories/${id}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          setCategories(prev => prev.filter(cat => cat.category_id !== id));
        } else {
          alert("No se pudo eliminar ya que la categoría se encuentra en uso.");

        }
      } catch (err) {
        console.error("Error al eliminar categoría:", err);
      }
    }
  };

  // El useEffect que te salía en rojo:
  useEffect(() => {
    cargarCategorias();
  }, [cargarCategorias]);

  // El retorno de los datos
  return { 
    categories, 
    loading, 
    error, 
    cargarCategorias, 
    eliminarCategoria 
  };
};