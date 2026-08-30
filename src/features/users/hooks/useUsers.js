import { useState, useEffect, useCallback } from 'react';
import { userService } from '../services/userService';
import { useAlertModal } from "../../../shared/alertModal";

export const useUsers = () => {
  const { showSuccess, showError, showConfirm } = useAlertModal();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


  const [page, setPage] = useState(1);
  const [limit] = useState(9);
  const [search, setSearch] = useState("");

  const [pagination, setPagination] = useState({
      page: 1,
      totalPages: 1,
      total: 0
  });

  const cargarUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const datos = await userService.obtenerTodos(page, limit, search);
      setUsers(datos.data);
      setPagination(datos.pagination);
    } catch (err) {
      setError(err.message);
      console.error("Error al cargar usuarios:", err);
    } finally {
      setLoading(false);
    }
  }, [page, limit, search]);

  useEffect(() => {
    cargarUsers();
  }, [cargarUsers]);


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


  const eliminarUser = async (id) => {
    if (!await showConfirm('¿Estás seguro de que deseas eliminar este usuario?')) return false;
    try {
      await userService.eliminar(id);
      await cargarUsers();
      await showSuccess("Usuario eliminado correctamente.");
      return true;
    } catch (err) {
      await showError(err.response?.data?.error || "No se pudo eliminar el usuario. Verifica que no tenga datos asociados.");
      console.error("Error al eliminar usuario:", err);
      return false;
    }
  };

  return {
    users, 
    loading, 
    error, 
    cargarUsers, 
    eliminarUser,
    
    page,
    cambiarPagina,
    cambiarBusqueda,
    pagination
  };
};