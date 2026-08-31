import { useState, useCallback } from 'react';
import { roleService } from '../services/roleService';
import { useAlertModal } from "../../../shared/alertModal";


export const useRoles = () => {
  const { showConfirm, showSuccess, showError } = useAlertModal();
  const [roles, setRoles] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(9);
  const [search, setSearch] = useState("");
  const [error, setError] = useState(null); 
  const [pagination, setPagination] = useState({
      page: 1,
      totalPages: 1,
      total: 0
  });

  const cargarRoles = useCallback(async () => {
    try{
      const datos = await roleService.obtenerTodos(page, limit, search);
      setRoles(datos.data);
      setPagination(datos.pagination);
    }catch (err){
      setError(err.message || 'Error al cargar roles');
    }
  }, [page, limit, search]);

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

  const eliminarRol = async (id) => {
    if (await showConfirm('¿Seguro que deseas eliminar este rol?')) {
      try {
        await roleService.eliminar(id);
        await showSuccess("Rol eliminado correctamente.");
        cargarRoles();
      } catch (err) {
        await showError("No se pudo eliminar el rol. Verifica que no haya usuarios con este rol asignado." || err.response?.data?.error );
      }
    }
  };

  // FUNCIÓN PARA EL SWITCH DE ESTADO
  const toggleRolEstado = async (rol) => {
    const nuevoEstado = !rol.role_status;
    const accionTexto = nuevoEstado ? "activar" : "desactivar";

    if (await showConfirm(`¿Estás seguro de que deseas ${accionTexto} este rol?`)) {
      try {
        await roleService.actualizar(rol.role_id, { 
          role_name: rol.role_name, 
          role_status: nuevoEstado 
        });
        
        cargarRoles();
        await showSuccess("Estado del rol actualizado correctamente.");
      } catch (err) {
        console.error("Error al cambiar estado del rol:", err);
        await showError("No se pudo cambiar el estado del rol. Verifica que tengas permisos de edición.");
      }
    }
  };

  return { 
    roles, 
    cargarRoles, 
    eliminarRol,
    toggleRolEstado, 
    page,
    cambiarPagina,
    cambiarBusqueda,
    pagination,
    error
  };
};