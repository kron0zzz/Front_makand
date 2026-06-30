import { useState, useEffect, useCallback } from 'react';
import { userService } from '../services/userService';

export const useUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const cargarUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await userService.obtenerTodos();
      setUsers(response);
    } catch (err) {
      setError(err.message);
      console.error("Error al cargar usuarios:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargarUsers();
  }, [cargarUsers]);

  const eliminarUser = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este usuario?')) return false;
    try {
      await userService.eliminar(id);
      setUsers(prev => prev.filter(c => c.user_id !== id));
      return true;
    } catch (err) {
      console.error("Error al eliminar usuario:", err);
      return false;
    }
  };

  return { users, loading, error, cargarUsers, eliminarUser };
};