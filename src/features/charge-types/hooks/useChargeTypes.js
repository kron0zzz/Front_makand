import { useState, useEffect, useCallback } from 'react';
import { chargeTypeService } from '../services/chargeTypeService';

export const useChargeTypes = () => {
  const [chargeTypes, setChargeTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const cargarTiposCobro = useCallback(async () => {
    setLoading(true);
    try {
      const data = await chargeTypeService.obtenerTodos();
      setChargeTypes(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargarTiposCobro();
  }, [cargarTiposCobro]);

  return { chargeTypes, loading, error, cargarTiposCobro };
};