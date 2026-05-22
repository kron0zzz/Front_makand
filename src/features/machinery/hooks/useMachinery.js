// import { useState, useEffect, useCallback } from 'react';

// export const useMachinery = () => {
//   const [machineries, setMachineries] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [statuses, setStatuses] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   /**
//    * 1. CARGAR MAQUINARIAS (Data combinada para la tabla)
//    */
//   const cargarMaquinarias = useCallback(async () => { 
//       setLoading(true);
//       setError(null);
//       try {
//         const response = await fetch('http://localhost:3000/api/machinery/table');
        
//         if (!response.ok) {
//           throw new Error('No se pudo conectar con el servidor para cargar las maquinarias');
//         }
        
//         const datos = await response.json();
//         setMachineries(datos); 
//       } catch (err) {
//         setError(err.message);
//         console.error("Error al cargar maquinarias:", err);
//       } finally {
//         setLoading(false);
//       }
//   }, []);

//   /**
//    * 2. CARGAR AUXILIARES (Categorías y Estados para los Selects del Formulario)
//    */
//   const cargarAuxiliares = useCallback(async () => {
//     try {
//       // Cargamos categorías de su respectivo endpoint
//       const resCat = await fetch('http://localhost:3000/api/machinery-categories/table');
//       // Si tu backend usa el nombre en plural o singular exacto de tus rutas, cámbialo abajo:
//       const resStat = await fetch('http://localhost:3000/api/machine-statuses/table');

//       if (resCat.ok) setCategories(await resCat.json());
//       if (resStat.ok) setStatuses(await resStat.json());
//     } catch (err) {
//       console.error("Error al cargar datos auxiliares para el formulario:", err);
//     }
//   }, []);

//   /**
//    * 3. ELIMINAR MAQUINARIA
//    */
//   const eliminarMaquinaria = async (id) => {
//     if (window.confirm('¿Estás seguro de que deseas eliminar esta maquinaria?')) {
//       try {
//         const response = await fetch(`http://localhost:3000/api/machinery/${id}`, {
//           method: 'DELETE'
//         });

//         if (response.ok) {
//           // Filtramos por el ID correcto de la tabla maquinaria
//           setMachineries(prev => prev.filter(item => item.machinery_id !== id));
//         } else {
//           alert("No se pudo eliminar la maquinaria.");
//         }
//       } catch (err) {
//         console.error("Error al eliminar maquinaria:", err);
//       }
//     }
//   };

//   /**
//    * 4. CREAR MAQUINARIA
//    */
//   const crearMaquinaria = async (maquinariaData) => {
//     try {
//       const response = await fetch('http://localhost:3000/api/machinery', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(maquinariaData)
//       });

//       if (!response.ok) {
//         const errData = await response.json();
//         throw new Error(errData.error || 'Error al crear maquinaria');
//       }

//       // Recargamos la tabla para que traiga el nuevo registro con sus INNER JOINs resueltos
//       await cargarMaquinarias();
//       return true;
//     } catch (err) {
//       alert(err.message);
//       return false;
//     }
//   };

//   /**
//    * 5. ACTUALIZAR MAQUINARIA
//    */
//   const actualizarMaquinaria = async (id, maquinariaData) => {
//     try {
//       const response = await fetch(`http://localhost:3000/api/machinery/${id}`, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(maquinariaData)
//       });

//       if (!response.ok) {
//         const errData = await response.json();
//         throw new Error(errData.error || 'Error al actualizar maquinaria');
//       }

//       await cargarMaquinarias();
//       return true;
//     } catch (err) {
//       alert(err.message);
//       return false;
//     }
//   };

//   // Efecto de carga inicial
//   useEffect(() => {
//     const inicializarModulo = async () => {
//       await cargarMaquinarias();
//       await cargarAuxiliares();
//     };
//     inicializarModulo();
//   }, [cargarMaquinarias, cargarAuxiliares]);

//   return { 
//     machineries,
//     categories,
//     statuses,
//     loading, 
//     error, 
//     cargarMaquinarias, 
//     eliminarMaquinaria,
//     crearMaquinaria,
//     actualizarMaquinaria
//   };
// };


















// import { useState, useEffect, useCallback } from 'react';

// export const useMachinery = () => {
//   const [machineries, setMachineries] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [statuses, setStatuses] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   /**
//    * 1. CARGAR MAQUINARIAS (Data combinada con JOINs para la grilla)
//    */
//   const cargarMaquinarias = useCallback(async () => { 
//       setLoading(true);
//       setError(null);
//       try {
//         const response = await fetch('http://localhost:3000/api/machinery/table');
        
//         if (!response.ok) {
//           throw new Error('No se pudo conectar con el servidor para cargar las maquinarias');
//         }
        
//         const datos = await response.json();
//         setMachineries(datos); 
//       } catch (err) {
//         setError(err.message);
//         console.error("Error al cargar maquinarias:", err);
//       } finally {
//         setLoading(false);
//       }
//   }, []);

// /**
//    * 2. CARGAR AUXILIARES (Categorías y Estados para los Selects del Formulario)
//    */
//   const cargarAuxiliares = useCallback(async () => {
//     try {
//       // 🌟 Añadimos /table al final porque tus controladores del backend lo exigen
//       const resCat = await fetch('http://localhost:3000/api/machinery-categories/table');
//       const resStat = await fetch('http://localhost:3000/api/machine-statuses/table');

//       if (resCat.ok) {
//         const dataCategorias = await resCat.json();
//         console.log("Categorías obtenidas del Backend:", dataCategorias);
//         setCategories(dataCategorias);
//       } else {
//         console.error("El backend falló al responder la ruta de categorías");
//       }

//       if (resStat.ok) {
//         const dataEstados = await resStat.json();
//         setStatuses(dataEstados);
//       }
//     } catch (err) {
//       console.error("Error al cargar datos auxiliares para el formulario:", err);
//     }
//   }, []);

//   /**
//    * 3. ELIMINAR MAQUINARIA
//    */
//   const eliminarMaquinaria = async (id) => {
//     if (window.confirm('¿Estás seguro de que deseas eliminar esta maquinaria?')) {
//       try {
//         const response = await fetch(`http://localhost:3000/api/machinery/${id}`, {
//           method: 'DELETE'
//         });

//         if (response.ok) {
//           // Filtramos por el ID correcto de la tabla maquinaria
//           setMachineries(prev => prev.filter(item => item.machinery_id !== id));
//         } else {
//           alert("No se pudo eliminar la maquinaria.");
//         }
//       } catch (err) {
//         console.error("Error al eliminar maquinaria:", err);
//       }
//     }
//   };

//   /**
//    * 4. CREAR MAQUINARIA
//    */
//   const crearMaquinaria = async (maquinariaData) => {
//     try {
//       const response = await fetch('http://localhost:3000/api/machinery', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(maquinariaData)
//       });

//       if (!response.ok) {
//         const errData = await response.json();
//         throw new Error(errData.error || 'Error al crear maquinaria');
//       }

//       await cargarMaquinarias();
//       return true;
//     } catch (err) {
//       alert(err.message);
//       return false;
//     }
//   };

//   /**
//    * 5. ACTUALIZAR MAQUINARIA
//    */
//   const actualizarMaquinaria = async (id, maquinariaData) => {
//     try {
//       const response = await fetch(`http://localhost:3000/api/machinery/${id}`, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(maquinariaData)
//       });

//       if (!response.ok) {
//         const errData = await response.json();
//         throw new Error(errData.error || 'Error al actualizar maquinaria');
//       }

//       await cargarMaquinarias();
//       return true;
//     } catch (err) {
//       alert(err.message);
//       return false;
//     }
//   };

//   // Efecto de carga inicial
//   useEffect(() => {
//     const inicializarModulo = async () => {
//       await cargarMaquinarias();
//       await cargarAuxiliares();
//     };
//     inicializarModulo();
//   }, [cargarMaquinarias, cargarAuxiliares]);

//   return { 
//     machineries,
//     categories,
//     statuses,
//     loading, 
//     error, 
//     cargarMaquinarias, 
//     eliminarMaquinaria,
//     crearMaquinaria,
//     actualizarMaquinaria
//   };
// };






















// import { useState, useEffect, useCallback } from 'react';

// export const useMachinery = () => {
//   const [machineries, setMachineries] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [statuses, setStatuses] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   /**
//    * 1. CARGAR MAQUINARIAS (Data combinada con JOINs para la grilla)
//    * 🌟 Mantiene /table porque tu backend lo requiere: router.get("/table", getMachineriesTable);
//    */
//   const cargarMaquinarias = useCallback(async () => { 
//       setLoading(true);
//       setError(null);
//       try {
//         const response = await fetch('http://localhost:3000/api/machinery/table');
        
//         if (!response.ok) {
//           throw new Error('No se pudo conectar con el servidor para cargar las maquinarias');
//         }
        
//         const datos = await response.json();
//         setMachineries(datos); 
//       } catch (err) {
//         setError(err.message);
//         console.error("Error al cargar maquinarias:", err);
//       } finally {
//         setLoading(false);
//       }
//   }, []);

//   /**
//    * 2. CARGAR AUXILIARES (Categorías y Estados para los Selects del Formulario)
//    * 🌟 CORREGIDO: Se elimina el /table de estas rutas auxiliares para evitar el error 404
//    */
//   const cargarAuxiliares = useCallback(async () => {
//     try {
//       const resCat = await fetch('http://localhost:3000/api/machinery-categories');
//       const resStat = await fetch('http://localhost:3000/api/machine-statuses');

//       if (resCat.ok) {
//         const dataCategorias = await resCat.json();
//         console.log("Categorías obtenidas del Backend:", dataCategorias);
//         setCategories(dataCategorias);
//       } else {
//         console.error("El backend falló al responder la ruta de categorías (404)");
//       }

//       if (resStat.ok) {
//         const dataEstados = await resStat.json();
//         setStatuses(dataEstados);
//       }
//     } catch (err) {
//       console.error("Error al cargar datos auxiliares para el formulario:", err);
//     }
//   }, []);

//   /**
//    * 3. ELIMINAR MAQUINARIA
//    */
//   const eliminarMaquinaria = async (id) => {
//     if (window.confirm('¿Estás seguro de que deseas eliminar esta maquinaria?')) {
//       try {
//         const response = await fetch(`http://localhost:3000/api/machinery/${id}`, {
//           method: 'DELETE'
//         });

//         if (response.ok) {
//           // Filtramos por el ID correcto de la tabla maquinaria
//           setMachineries(prev => prev.filter(item => item.machinery_id !== id));
//         } else {
//           alert("No se pudo eliminar la maquinaria.");
//         }
//       } catch (err) {
//         console.error("Error al eliminar maquinaria:", err);
//       }
//     }
//   };

//   /**
//    * 4. CREAR MAQUINARIA
//    */
//   const crearMaquinaria = async (maquinariaData) => {
//     try {
//       const response = await fetch('http://localhost:3000/api/machinery', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(maquinariaData)
//       });

//       if (!response.ok) {
//         const errData = await response.json();
//         throw new Error(errData.error || 'Error al crear maquinaria');
//       }

//       await cargarMaquinarias();
//       return true;
//     } catch (err) {
//       alert(err.message);
//       return false;
//     }
//   };

//   /**
//    * 5. ACTUALIZAR MAQUINARIA
//    */
//   const actualizarMaquinaria = async (id, maquinariaData) => {
//     try {
//       const response = await fetch(`http://localhost:3000/api/machinery/${id}`, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(maquinariaData)
//       });

//       if (!response.ok) {
//         const errData = await response.json();
//         throw new Error(errData.error || 'Error al actualizar maquinaria');
//       }

//       await cargarMaquinarias();
//       return true;
//     } catch (err) {
//       alert(err.message);
//       return false;
//     }
//   };

//   // Efecto de carga inicial
//   useEffect(() => {
//     const inicializarModulo = async () => {
//       await cargarMaquinarias();
//       await cargarAuxiliares();
//     };
//     inicializarModulo();
//   }, [cargarMaquinarias, cargarAuxiliares]);

//   return { 
//     machineries,
//     categories,
//     statuses,
//     loading, 
//     error, 
//     cargarMaquinarias, 
//     eliminarMaquinaria,
//     crearMaquinaria,
//     actualizarMaquinaria
//   };
// };
















import { useState, useEffect, useCallback } from 'react';

export const useMachinery = () => {
  const [machineries, setMachineries] = useState([]);
  const [categories, setCategories] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * 1. CARGAR MAQUINARIAS (Data combinada con JOINs para la grilla)
   * 🌟 CORREGIDO: El endpoint real de tu servidor es /api/machines/table
   */
  const cargarMaquinarias = useCallback(async () => { 
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('http://localhost:3000/api/machines/table');
        
        if (!response.ok) {
          throw new Error('No se pudo conectar con el servidor para cargar las maquinarias');
        }
        
        const datos = await response.json();
        setMachineries(datos); 
      } catch (err) {
        setError(err.message);
        console.error("Error al cargar maquinarias:", err);
      } finally {
        setLoading(false);
      }
  }, []);

  /**
   * 2. CARGAR AUXILIARES (Categorías y Estados para los Selects del Formulario)
   * 🌟 CORREGIDO: Rutas alineadas exactamente con el Server.js de tu Backend
   */
  const cargarAuxiliares = useCallback(async () => {
    try {
      const resCat = await fetch('http://localhost:3000/api/machine-categories');
      const resStat = await fetch('http://localhost:3000/api/machine-statuses');

      if (resCat.ok) {
        const dataCategorias = await resCat.json();
        console.log("Categorías obtenidas del Backend:", dataCategorias);
        setCategories(dataCategorias);
      } else {
        console.error("El backend falló al responder la ruta de categorías (404)");
      }

      if (resStat.ok) {
        const dataEstados = await resStat.json();
        setStatuses(dataEstados);
      }
    } catch (err) {
      console.error("Error al cargar datos auxiliares para el formulario:", err);
    }
  }, []);

  /**
   * 3. ELIMINAR MAQUINARIA
   * 🌟 CORREGIDO: Cambiado a /api/machines
   */
  const eliminarMaquinaria = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta maquinaria?')) {
      try {
        const response = await fetch(`http://localhost:3000/api/machines/${id}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          setMachineries(prev => prev.filter(item => item.machinery_id !== id));
        } else {
          alert("No se pudo eliminar la maquinaria.");
        }
      } catch (err) {
        console.error("Error al eliminar maquinaria:", err);
      }
    }
  };

  /**
   * 4. CREAR MAQUINARIA
   * 🌟 CORREGIDO: Cambiado a /api/machines
   */
  const crearMaquinaria = async (maquinariaData) => {
    try {
      const response = await fetch('http://localhost:3000/api/machines', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(maquinariaData)
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Error al crear maquinaria');
      }

      await cargarMaquinarias();
      return true;
    } catch (err) {
      alert(err.message);
      return false;
    }
  };

  /**
   * 5. ACTUALIZAR MAQUINARIA
   * 🌟 CORREGIDO: Cambiado a /api/machines
   */
  const actualizarMaquinaria = async (id, maquinariaData) => {
    try {
      const response = await fetch(`http://localhost:3000/api/machines/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(maquinariaData)
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Error al actualizar maquinaria');
      }

      await cargarMaquinarias();
      return true;
    } catch (err) {
      alert(err.message);
      return false;
    }
  };

  // Efecto de carga inicial
  useEffect(() => {
    const inicializarModulo = async () => {
      await cargarMaquinarias();
      await cargarAuxiliares();
    };
    inicializarModulo();
  }, [cargarMaquinarias, cargarAuxiliares]);

  return { 
    machineries,
    categories,
    statuses,
    loading, 
    error, 
    cargarMaquinarias, 
    eliminarMaquinaria,
    crearMaquinaria,
    actualizarMaquinaria
  };
};