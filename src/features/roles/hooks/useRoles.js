import { useState, useCallback } from 'react';
import { roleService } from '../services/roleService';

export const useRoles = () => {
  const [roles, setRoles] = useState([]);

  const cargarRoles = useCallback(async () => {
    const datos = await roleService.obtenerTodos();
    setRoles(datos);
  }, []);

  const eliminarRol = async (id) => {
    if (window.confirm('¿Seguro que deseas eliminar este rol?')) {
      const exito = await roleService.eliminar(id);
      if (exito) cargarRoles();
    }
  };

  return { roles, cargarRoles, eliminarRol };
};