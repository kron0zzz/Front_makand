// src/features/sub_rentals/hooks/useSubRentals.js
import { useState, useCallback, useEffect} from 'react';
import { subRentalService } from '../services/subRentalService';
import { useAlertModal } from "../../../shared/alertModal";

export const useSubRentals = () => {
  const { showAlert, showConfirm } = useAlertModal();
  const [subRentals, setSubRentals] = useState([]);
  const [loading, setLoading] = useState(false);
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

  const cargarSubalquileres = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      //ahora se carga con los datos requeridos para paginación
      const datos = await subRentalService.obtenerTabla(page, limit, search);
      setSubRentals(datos.data);
      setPagination(datos.pagination);
    } catch (err) {
      setError(err.message || 'Error al cargar los registros de subalquiler');
    } finally {
      setLoading(false);
    }
  }, [page, limit, search]);


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

  // NUEVA FUNCIÓN PARA CAMBIAR EL ESTADO CON SWITCH
  const cambiarEstadoSubalquiler = useCallback(async (subRental) => {
    const nuevoEstado = !subRental.sub_rental_status;
    const mensajeAccion = nuevoEstado ? 'activar' : 'finalizar';

    if (await showConfirm(`¿Estás seguro de que deseas ${mensajeAccion} este subalquiler?`)) {
      try {
        const datosActualizados = {
          machinery_id: subRental.machinery_id,
          supplier_id: subRental.supplier_id,
          supplier_cost: subRental.supplier_cost,
          sub_rental_status: nuevoEstado
        };

        await subRentalService.actualizar(subRental.sub_rental_id, datosActualizados);
        
        // Actualizamos el estado localmente de forma inmediata
        setSubRentals(prev =>
          prev.map(item =>
            item.sub_rental_id === subRental.sub_rental_id
              ? { ...item, sub_rental_status: nuevoEstado }
              : item
          )
        );
        await showAlert("Estado del subalquiler actualizado correctamente.");
      } catch (err) {
        await showAlert(err.message || 'Error al cambiar el estado del subalquiler');
      }
    }
  }, []);

  const eliminarSubalquiler = useCallback(async (id) => {
    if (await showConfirm('¿Estás seguro de que deseas eliminar este registro de subalquiler?')) {
      try {
        await subRentalService.eliminar(id);
        // Filtramos usando sub_rental_id para actualizar el estado instantáneamente
        setSubRentals(prev => prev.filter(item => item.sub_rental_id !== id));
      } catch (err) {
        setError(err.message || 'Error al intentar eliminar el subalquiler');
      }
    }
  }, []);

  useEffect(() => {
    cargarSubalquileres();
  }, [cargarSubalquileres]);

  return {
    subRentals,
    loading,
    error,
    cargarSubalquileres,
    eliminarSubalquiler,
    cambiarEstadoSubalquiler,

    page,
    cambiarPagina,
    cambiarBusqueda,
    pagination
  };
};