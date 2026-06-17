import { useState, useEffect, useCallback } from 'react';
import { maintenanceService } from '../services/maintenanceService';

export const useMaintenances = () => {
  const [maintenances, setMaintenances] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const cargarMaintenances = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await maintenanceService.obtenerTodos();
      setMaintenances(response);
    } catch (err) {
      setError(err.message);
      console.error("Error al cargar mantenimientos:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const load = async () => {
      await cargarMaintenances();
    };
    load();
  }, [cargarMaintenances]);

  const eliminarMaintenance = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este mantenimiento?')) return false;
    try {
      await maintenanceService.eliminar(id);
      setMaintenances(prev => prev.filter(c => c.maintenance_id !== id));
      return true;
    } catch (err) {
      console.error("Error al eliminar mantenimiento:", err);
      return false;
    }
  };

  return {
    maintenances,
    loading,
    error,
    cargarMaintenances,
    eliminarMaintenance
  };
};