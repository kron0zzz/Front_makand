import { useState, useEffect, useCallback } from 'react';
import { maintenanceService } from '../services/maintenanceService';
import { useAlertModal } from "../../../shared/alertModal";

export const useMaintenances = () => {
  const { showSuccess, showError, showConfirm } = useAlertModal();
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
    if (!await showConfirm('¿Estás seguro que deseas eliminar este mantenimiento?')) return false;
    try {
      await maintenanceService.eliminar(id);
      await cargarMaintenances();
      await showSuccess("Mantenimiento eliminado correctamente.");
      return true;
    } catch (err) {
      await showError(err.response?.data?.error || "No se pudo eliminar el mantenimiento.");
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


