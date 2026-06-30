import { useState, useEffect, useCallback } from 'react';

export const useMachineryCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const cargarCategorias = useCallback(async () => { 
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        const response = await fetch('http://localhost:3000/api/machine-categories/table', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
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

  const eliminarCategoria = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta categoría?')) {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`http://localhost:3000/api/machine-categories/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
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

  useEffect(() => {
    cargarCategorias();
  }, [cargarCategorias]);

  return { 
    categories, 
    loading, 
    error, 
    cargarCategorias, 
    eliminarCategoria 
  };
};