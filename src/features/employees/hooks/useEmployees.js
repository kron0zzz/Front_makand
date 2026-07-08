// import { useState, useEffect, useCallback } from 'react';

// export const useEmployees = () => {
//   const [employees, setEmployees] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Función auxiliar para obtener el token
//   const getToken = () => localStorage.getItem("token");

//   /**
//    * 1. CARGAR EMPLEADOS
//    */
//   const cargarEmpleados = useCallback(async () => { 
//       setLoading(true);
//       setError(null);
//       try {
//         const response = await fetch('http://localhost:3000/api/employees/table', {
//           headers: { 
//             'Authorization': `Bearer ${getToken()}` 
//           }
//         });
        
//         if (!response.ok) {
//           throw new Error('No se pudo conectar con el servidor');
//         }
        
//         const datos = await response.json();
//         setEmployees(datos); 
//       } catch (err) {
//         setError(err.message);
//         console.error("Error al cargar empleados:", err);
//       } finally {
//         setLoading(false);
//       }
//   }, []);

//   /**
//    * 2. CAMBIAR ESTADO
//    */
//   const toggleEmpleadoEstado = async (id, estadoActual) => {
//     try {
//       const response = await fetch(`http://localhost:3000/api/employees/${id}`, {
//         method: 'PUT',
//         headers: { 
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${getToken()}` 
//         },
//         body: JSON.stringify({ 
//           employee_status: !estadoActual
//         })
//       });

//       if (response.ok) {
//         await cargarEmpleados();
//       } else {
//         console.error("No se pudo actualizar el estado del empleado.");
//       }
//     } catch (err) {
//       console.error("Error al actualizar estado del empleado:", err);
//     }
//   };

//   /**
//    * 3. ELIMINAR EMPLEADO
//    */
//   const eliminarEmpleado = async (id) => {
//     if (window.confirm('¿Estás seguro de que deseas eliminar este empleado?')) {
//       try {
//         const response = await fetch(`http://localhost:3000/api/employees/${id}`, {
//           method: 'DELETE',
//           headers: { 
//             'Authorization': `Bearer ${getToken()}` 
//           }
//         });

//         if (response.ok) {
//           setEmployees(prev => prev.filter(e => e.employee_id !== id));
//         } else {
//           alert("No se pudo eliminar el empleado.");
//         }
//       } catch (err) {
//         console.error("Error al eliminar empleado:", err);
//       }
//     }
//   };

//   useEffect(() => {
//     cargarEmpleados();
//   }, [cargarEmpleados]);

//   return { 
//     employees, 
//     loading, 
//     error, 
//     cargarEmpleados, 
//     toggleEmpleadoEstado, 
//     eliminarEmpleado 
//   };
// };


import { useState, useEffect, useCallback } from 'react';
import { employeeService } from '../services/employeeService';

export const useEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const cargarEmpleados = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const datos = await employeeService.obtenerTodos();
      setEmployees(datos);
    } catch (err) {
      setError(err.message || 'Error al cargar empleados');
      console.error("Error al cargar empleados:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const toggleEmpleadoEstado = async (id, estadoActual) => {
    try {
      await employeeService.actualizar(id, { employee_status: !estadoActual });
      await cargarEmpleados();
    } catch (err) {
      console.error("Error al actualizar estado del empleado:", err);
    }
  };

  const eliminarEmpleado = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este empleado?')) return;
    try {
      await employeeService.eliminar(id);
      setEmployees(prev => prev.filter(e => e.employee_id !== id));
    } catch (err) {
      console.error("Error al eliminar empleado:", err);
      alert("No se pudo eliminar el empleado.");
    }
  };

  useEffect(() => {
    cargarEmpleados();
  }, [cargarEmpleados]);

  return { employees, loading, error, cargarEmpleados, toggleEmpleadoEstado, eliminarEmpleado };
};