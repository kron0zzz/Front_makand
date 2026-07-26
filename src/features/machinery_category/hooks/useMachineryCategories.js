import { useState, useCallback, useEffect } from 'react';
import { machineryCategoryService } from '../services/machineryCategoryService';
import { useAlertModal } from "../../../shared/alertModal";

export const useMachineryCategories = () => {
  const { showAlert, showConfirm } = useAlertModal();
  const [categories, setCategories] = useState([]);
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

  const cargarCategorias = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {

      //ahora se carga con los datos requeridos para paginación
      const datos = await machineryCategoryService.obtenerTabla(page, limit, search);
      setCategories(datos.data);
      setPagination(datos.pagination);

    } catch (err) {

      setError(err.message || 'Error al cargar categorías');

    } finally {

      setLoading(false);
    }
  }, [page, limit, search]);


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



  const eliminarCategoria = async (id) => {
    if (!await showConfirm('¿Estás seguro de que deseas eliminar esta categoría?')) return;
    
    try {
      await machineryCategoryService.eliminar(id);
      setCategories(prev => prev.filter(cat => cat.category_id !== id));
      await cargarCategorias();
    } catch (err) {
      await showAlert("No se pudo eliminar: la categoría podría estar en uso.");
      console.error("Error al eliminar categoría:", err);
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
    eliminarCategoria,
    
    page,
    cambiarPagina,
    cambiarBusqueda,
    pagination
  };
};