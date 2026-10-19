// import { useState, useEffect, useCallback } from 'react';
import { useState, useCallback, useEffect } from 'react';
import { machineryStatusService } from '../services/machineryStatusService';
import { useAlertModal } from "../../../shared/alertModal";

// export const useMachineryStatuses = () => {
//   const [statuses, setStatuses] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const cargarEstados = useCallback(async () => { 
//       setLoading(true);
//       setError(null);
//       try {
//         const token = localStorage.getItem("token");
//         const response = await fetch('http://localhost:3000/api/machine-statuses/table', {
//           headers: {
//             'Authorization': `Bearer ${token}`
//           }
//         });
        
//         if (!response.ok) {
//           throw new Error('No se pudo conectar con el servidor');
//         }
        
//         const datos = await response.json();
//         setStatuses(datos); 
//       } catch (err) {
//         setError(err.message);
//         console.error("Error al cargar estados de maquinaria:", err);
//       } finally {
//         setLoading(false);
//       }
//   }, []);

//   const eliminarEstado = async (id) => {
//     if (window.confirm('¿Estás seguro de que deseas eliminar este estado de maquinaria?')) {
//       try {
//         const token = localStorage.getItem("token");
//         const response = await fetch(`http://localhost:3000/api/machine-statuses/${id}`, {
//           method: 'DELETE',
//           headers: {
//             'Authorization': `Bearer ${token}`
//           }
//         });

//         if (response.ok) {
//           setStatuses(prev => prev.filter(status => status.status_id !== id));
//         } else {
//           alert("No se pudo eliminar ya que este estado se encuentra en uso.");
//         }
//       } catch (err) {
//         console.error("Error al eliminar estado:", err);
//       }
//     }
//   };

//   useEffect(() => {
//     cargarEstados();
//   }, [cargarEstados]);

//   return { 
//     statuses, 
//     loading, 
//     error, 
//     cargarEstados, 
//     eliminarEstado 
//   };
// };

export const useMachineryStatuses = () => {
  const { showSuccess, showError, showConfirm } = useAlertModal();
  const [statuses, setStatuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const cargarEstados = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const datos = await machineryStatusService.obtenerTabla();
      setStatuses(datos);
    } catch (err) {
      setError(err.message || 'Error al cargar estados de maquinaria');
    } finally {
      setLoading(false);
    }
  }, []);

  const eliminarEstado = async (id) => {
    if (!await showConfirm('¿Estás seguro de que deseas eliminar este estado de maquinaria?')) return;
    
    try {
      await machineryStatusService.eliminar(id);
      await cargarEstados();
      await showSuccess("Estado de maquinaria eliminado correctamente.");
    } catch (err) {
      await showError(err.response?.data?.error || "No se pudo eliminar el estado de maquinaria.");
      console.error("Error al eliminar estado:", err);
    }
  };

  useEffect(() => {
    cargarEstados();
  }, [cargarEstados]);

  return { statuses, loading, error, cargarEstados, eliminarEstado };
};