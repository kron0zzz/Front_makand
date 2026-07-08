// import { useState, useEffect, useCallback } from 'react';
// import { apiClient } from "../../../shared/services/api";

// export const usePositions = () => {
//   const [positions, setPositions] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const cargarCargos = useCallback(async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const response = await apiClient.get('/api/positions');
//       setPositions(response.data);
//     } catch (err) {
//       setError(err.response?.status === 403 ? "Sin permisos." : "Error al cargar.");
//       console.error("Error:", err);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   // AGREGAMOS ESTA FUNCIÓN: Lógica para eliminar
//   const eliminarCargo = async (id) => {
//     if (!window.confirm("¿Estás seguro de que deseas eliminar este cargo?")) {
//       return;
//     }

//     try {
//       await apiClient.delete(`/api/positions/${id}`);
//       alert("Cargo eliminado correctamente");
//       // Recargamos la lista después de borrar
//       await cargarCargos();
//     } catch (err) {
//       console.error("Error al eliminar:", err);
//       alert(err.response?.data?.message || "Error al intentar eliminar el cargo.");
//     }
//   };

//   useEffect(() => {
//     cargarCargos();
//   }, [cargarCargos]); 

//   // RETORNAMOS LA FUNCIÓN REAL
//   return { positions, loading, error, cargarCargos, eliminarCargo };
// };



// src/features/positions/hooks/usePositions.js
import { useState, useEffect, useCallback } from 'react';
import { PositionService } from '../services/PositionsService';

export const usePositions = () => {
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const cargarCargos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await PositionService.obtenerTodos();
      setPositions(data);
    } catch (err) {
      setError(err.response?.status === 403 ? "Sin permisos." : "Error al cargar cargos.");
    } finally {
      setLoading(false);
    }
  }, []);

  const eliminarCargo = async (id) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este cargo?")) return;

    try {
      await PositionService.eliminar(id);
      alert("Cargo eliminado correctamente");
      await cargarCargos();
    } catch (err) {
      alert(err.response?.data?.message || "Error al intentar eliminar.");
    }
  };

  useEffect(() => {
    cargarCargos();
  }, [cargarCargos]);

  return { positions, loading, error, cargarCargos, eliminarCargo };
};