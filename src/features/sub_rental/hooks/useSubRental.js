// src/features/sub_rentals/hooks/useSubRentals.js
import { useState, useCallback } from 'react';
import { subRentalService } from '../services/subRentalService';

export const useSubRentals = () => {
  const [subRentals, setSubRentals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const cargarSubalquileres = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const datos = await subRentalService.obtenerTabla();
      setSubRentals(datos);
    } catch (err) {
      setError(err.message || 'Error al cargar los registros de subalquiler');
    } finally {
      setLoading(false);
    }
  }, []);

  const eliminarSubalquiler = useCallback(async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este registro de subalquiler?')) {
      try {
        await subRentalService.eliminar(id);
        // Filtramos usando sub_rental_id para actualizar el estado instantáneamente
        setSubRentals(prev => prev.filter(item => item.sub_rental_id !== id));
      } catch (err) {
        setError(err.message || 'Error al intentar eliminar el subalquiler');
      }
    }
  }, []);

  return {
    subRentals,
    loading,
    error,
    cargarSubalquileres,
    eliminarSubalquiler
  };
};