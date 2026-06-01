// Capa de servicios para interactuar con el endpoint de empleados en el backend.
// Hook para separar la lógica de negocio de la interfaz visual

import { useState, useEffect, useCallback } from 'react';

export const useEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * 1. CARGAR EMPLEADOS (Conexión Real)
   * Usamos useCallback para que la función sea estable y no cause bucles en el useEffect.
   */
  const cargarEmpleados = useCallback(async () => { 
      setLoading(true);
      setError(null);
      try {
        // Llamamos a la ruta optimizada para la tabla de empleados en el backend
        const response = await fetch('http://localhost:3000/api/employees/table');
        
        if (!response.ok) {
          throw new Error('No se pudo conectar con el servidor');
        }
        
        const datos = await response.json();
        setEmployees(datos); 
      } catch (err) {
        setError(err.message);
        console.error("Error al cargar empleados:", err);
      } finally {
        setLoading(false);
      }
  }, []);

  /**
   * 2. CAMBIAR ESTADO (Para el Switch de la interfaz)
   * Esta función enviará el cambio a la base de datos PostgreSQL.
   */
  const toggleEmpleadoEstado = async (id, estadoActual) => {
    try {
      const response = await fetch(`http://localhost:3000/api/employees/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          employee_status: !estadoActual // Invertimos el booleano del estado del empleado
        })
      });

      if (response.ok) {
        // Refrescamos la tabla para ver el cambio reflejado desde la DB
        await cargarEmpleados();
      } else {
        console.error("No se pudo actualizar el estado del empleado.");
      }
    } catch (err) {
      console.error("Error al actualizar estado del empleado:", err);
    }
  };

  /**
   * 3. ELIMINAR EMPLEADO (Conexión Real)
   */
  const eliminarEmpleado = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este empleado?')) {
      try {
        const response = await fetch(`http://localhost:3000/api/employees/${id}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          // Filtramos el estado local usando 'employee_id' para una respuesta visual instantánea
          setEmployees(prev => prev.filter(e => e.employee_id !== id));
        } else {
          alert("No se pudo eliminar el empleado.");
        }
      } catch (err) {
        console.error("Error al eliminar empleado:", err);
      }
    }
  };

  // Efecto de carga inicial
  useEffect(() => {
    const fetchTableData = async () => {
      await cargarEmpleados();
    };
    
    fetchTableData();
  }, [cargarEmpleados]);

  return { 
    employees, 
    loading, 
    error, 
    cargarEmpleados, 
    toggleEmpleadoEstado, 
    eliminarEmpleado 
  };
};