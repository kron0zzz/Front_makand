import { useState, useEffect, useCallback, useMemo } from 'react';
import { projectService } from '../services/projectService';
import { useCustomers } from '../../customers/hooks/useCustomers';
import { useAlertModal } from "../../../shared/alertModal";

export const useProjects = () => {
  const { showAlert, showConfirm, showSuccess, showError} = useAlertModal();
  const [projects, setProjects] = useState([]);
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

  const cargarProyectos = useCallback(async() => {
    setLoading(true); 
    setError(null);

    try{
      const datos = await projectService.obtenerTabla(page, limit, search);
      setProjects(datos.data);
      setPagination(datos.pagination);
    }catch{
      setError(err.message || 'Error al cargar los proyectos');
    }finally{
      setLoading(false);
    }
  },[page,limit, search])

  const eliminarProyecto = useCallback(async (id) => {
    if (await showConfirm('¿Estás seguro de que deseas eliminar este proyecto?')) {
      try {
        setError(null);
        await projectService.eliminar(id);
        setProjects(prev => prev.filter(p => p.project_id !== id));
        await showSuccess("Proyecto eliminado correctamente.");
      } catch (err) {
        setError(err.message);
        console.error("Error al eliminar:", err);
        await showError("No se puede eliminar este proyecto. Verifica que no tenga pedidos asociados.");
      }
    }
  }, []);



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


  useEffect(() => {
    cargarProyectos();
  }, [cargarProyectos]);



  return {
    projects,
    loading,
    error,
    cargarProyectos,
    eliminarProyecto,

    page,
    cambiarPagina,
    cambiarBusqueda,
    pagination
  };
};