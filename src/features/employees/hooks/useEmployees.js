import { useState, useEffect, useCallback } from 'react';
import { employeeService } from '../services/employeeService';
import { useAlertModal } from "../../../shared/alertModal";

export const useEmployees = () => {
  const { showAlert, showConfirm } = useAlertModal();
  const [employees, setEmployees] = useState([]);
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

  const cargarEmpleados = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const datos = await employeeService.obtenerTodos(page, limit, search);
      setEmployees(datos.data);
      setPagination(datos.pagination)
    } catch (err) {
      setError(err.message || 'Error al cargar empleados');
      console.error("Error al cargar empleados:", err);
    } finally {
      setLoading(false);
    }
  }, [page, limit, search]);

  const toggleEmpleadoEstado = async (id, estadoActual) => {
    if (
      !await showConfirm(
        `¿Estás seguro de que deseas ${
          estadoActual ? "desactivar" : "activar"
        } este empleado?`
      )
    ) {
      return;
    }
  
    try {
      const empleado = await employeeService.obtenerPorId(id);
  
      empleado.employee_status = !estadoActual;
  
      await employeeService.actualizar(id, empleado);
  
      await cargarEmpleados();
  
    } catch (err) {
      console.error(err);
      await showAlert("No se pudo actualizar el estado.");
    }
  };


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

  const eliminarEmpleado = async (id) => {
    if (!await showConfirm('¿Estás seguro de que deseas eliminar este empleado?')) return;
    try {
      await employeeService.eliminar(id);
      setEmployees(prev => prev.filter(e => e.employee_id !== id));
    } catch (err) {
      console.error("Error al eliminar empleado:", err);
      await showAlert("No se pudo eliminar el empleado.");
    }
  };

  useEffect(() => {
    cargarEmpleados();
  }, [cargarEmpleados]);

  return { 
    employees, 
    loading, 
    error, 
    cargarEmpleados, 
    toggleEmpleadoEstado, 
    eliminarEmpleado, 

    page,
    cambiarPagina,
    cambiarBusqueda,
    pagination
  };
};