import { useState, useEffect, useCallback, useMemo } from 'react';
import { projectService } from '../services/projectService';
import { useCustomers } from '../../customers/hooks/useCustomers';

export const useProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { customers } = useCustomers();

  const cargarProyectos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const datos = await projectService.obtenerTodos();
      setProjects(datos);
    } catch (err) {
      setError(err.message);
      console.error("Error al cargar proyectos:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const eliminarProyecto = useCallback(async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este proyecto?')) {
      try {
        setError(null);
        await projectService.eliminar(id);
        setProjects(prev => prev.filter(p => p.project_id !== id));
      } catch (err) {
        setError(err.message);
        console.error("Error al eliminar:", err);
      }
    }
  }, []);

  const projectsEnriquecidos = useMemo(() => {
    return projects.map(proyecto => {
      const cliente = customers.find(c => c.customer_id === proyecto.customer_id);
      return {
        ...proyecto,
        customer_first_name: cliente ? cliente.customer_first_name : '',
        customer_last_name: cliente ? cliente.customer_last_name : '',
      };
    });
  }, [projects, customers]);

  useEffect(() => {
    const load = async () => {
      await cargarProyectos();
    };
    load();
  }, [cargarProyectos]);

  return {
    projects: projectsEnriquecidos,
    loading,
    error,
    cargarProyectos,
    eliminarProyecto
  };
};