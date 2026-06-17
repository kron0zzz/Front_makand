import { useState, useEffect, useCallback } from 'react';
import { chargeTypeService } from '../services/chargeTypeService';

export const useChargeTypes = () => {
  const [chargeTypes, setChargeTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const cargarTiposCobro = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await chargeTypeService.obtenerTodos();
      setChargeTypes(data);
    } catch (err) {
      setError(err.message);
      console.error("Error al cargar tipos de cobro:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const crearTipoCobro = async (data) => {
    try {
      await chargeTypeService.crear(data);
      await cargarTiposCobro();
      return true;
    } catch (err) {
      console.error("Error al crear tipo de cobro:", err);
      return false;
    }
  };

  const actualizarTipoCobro = async (id, data) => {
    try {
      await chargeTypeService.actualizar(id, data);
      await cargarTiposCobro();
      return true;
    } catch (err) {
      console.error("Error al actualizar tipo de cobro:", err);
      return false;
    }
  };

  const eliminarTipoCobro = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este tipo de cobro?')) return false;
    try {
      await chargeTypeService.eliminar(id);
      setChargeTypes(prev => prev.filter(c => c.charge_type_id !== id));
      return true;
    } catch (err) {
      console.error("Error al eliminar tipo de cobro:", err);
      return false;
    }
  };

  // Efecto de carga inicial
  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await chargeTypeService.obtenerTodos();
        if (isMounted) setChargeTypes(data);
      } catch (err) {
        if (isMounted) {
          setError(err.message);
          console.error("Error al cargar tipos de cobro:", err);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    loadData();
    return () => { isMounted = false; };
  }, []);

  return {
    chargeTypes,
    loading,
    error,
    cargarTiposCobro,
    crearTipoCobro,
    actualizarTipoCobro,
    eliminarTipoCobro,
  };
};
