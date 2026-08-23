import { useState, useEffect, useCallback } from 'react';
import { vehiculosService } from '../services/vehiculosService';
import { useAlertModal } from "../../../shared/alertModal";

export const useVehicles = () => {
  const { showAlert, showConfirm, showSuccess, showError } = useAlertModal();
  const [vehiculos, setVehiculos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const cargarVehiculos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await vehiculosService.obtenerTodos();
      setVehiculos(data);
    } catch (err) {
      setError(err.message);
      console.error("Error al cargar vehículos:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const toggleVehiculoEstado = async (vehiculo) => {
    const nuevoEstado = vehiculo.estado === 'Inactivo';
    const accion = nuevoEstado ? 'ACTIVAR' : 'DESACTIVAR';
    const mensaje = `¿Estás seguro de que deseas ${accion} el vehículo ${vehiculo.placa}?`;

    if (await showConfirm(mensaje)) {
      try {
        await vehiculosService.actualizar(vehiculo.id, {
          marca: vehiculo.marca,
          modelo: vehiculo.modelo,
          placa: vehiculo.placa,
          capacidadKg: vehiculo.capacidadKg,
          estado: nuevoEstado
        });
        await cargarVehiculos();
        await showSuccess("Estado del vehículo actualizado correctamente.");
      } catch (err) {
        console.error("Error al actualizar estado:", err);
        await showError("Error al actualizar el estado del vehículo.");
      }
    }
  };

  const eliminarVehiculo = async (id) => {
    if (await showConfirm('¿Estás seguro de que deseas eliminar este vehículo?')) {
      try {
        await vehiculosService.eliminar(id);
        setVehiculos(prev => prev.filter(v => v.id !== id));
        await showSuccess("Vehículo eliminado correctamente.");
      } catch (err) {
        console.error("Error al eliminar:", err);
        await showError("No se puede eliminar este vehículo. Verifica que no tenga datos asociados.");
      }
    }
  };

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await vehiculosService.obtenerTodos();
        if (isMounted) setVehiculos(data);
      } catch (err) {
        if (isMounted) {
          setError(err.message);
          console.error("Error al cargar vehículos:", err);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    load();
    return () => { isMounted = false; };
  }, []);

  return {
    vehiculos,
    loading,
    error,
    cargarVehiculos,
    toggleVehiculoEstado,
    eliminarVehiculo
  };
};
