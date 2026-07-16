// // // // // import { useState, useEffect } from 'react';
// // // // // import { apiClient } from "../../../../shared/services/api";

// // // // // const PermissionsSelector = ({ roleId, isEditable = true }) => {
// // // // //   const [allPermissions, setAllPermissions] = useState([]);
// // // // //   const [selected, setSelected] = useState([]);
// // // // //   const [loading, setLoading] = useState(true);

// // // // //   useEffect(() => {
// // // // //     const fetchData = async () => {
// // // // //       try {
// // // // //         setLoading(true);
// // // // //         // Hacemos las peticiones en paralelo
// // // // //         const [allRes, currentRes] = await Promise.all([
// // // // //           apiClient.get('/roles/permissions/list'),
// // // // //           apiClient.get(`/roles/${roleId}/permissions`)
// // // // //         ]);

// // // // //         setAllPermissions(allRes.data || []);
        
// // // // //         // Validamos que currentRes.data sea un array antes de mapear
// // // // //         if (Array.isArray(currentRes.data)) {
// // // // //           setSelected(currentRes.data.map(p => p.id));
// // // // //         } else {
// // // // //           setSelected([]);
// // // // //         }
// // // // //       } catch (error) {
// // // // //         console.error("Error al cargar permisos:", error);
// // // // //         setSelected([]); // Si falla, dejamos la lista vacía en lugar de romper
// // // // //       } finally {
// // // // //         setLoading(false);
// // // // //       }
// // // // //     };
    
// // // // //     if (roleId) fetchData();
// // // // //   }, [roleId]);

// // // // //   const toggle = async (id) => {
// // // // //     const isAdding = !selected.includes(id);
// // // // //     const newSelection = isAdding ? [...selected, id] : selected.filter(i => i !== id);
    
// // // // //     // Guardamos el estado anterior por si la petición falla
// // // // //     const previousSelection = selected;
// // // // //     setSelected(newSelection);

// // // // //     try {
// // // // //       await apiClient.put(`/roles/${roleId}/permissions`, { permissions: newSelection });
// // // // //     } catch (error) {
// // // // //       console.error("Error al actualizar permiso:", error);
// // // // //       setSelected(previousSelection); // Revertimos cambios si hay error
// // // // //       alert("No se pudo actualizar el permiso en el servidor.");
// // // // //     }
// // // // //   };

// // // // //   if (loading) return <div>Cargando permisos...</div>;

// // // // //   // --- MODO LECTURA ---
// // // // //   if (!isEditable) {
// // // // //     return (
// // // // //       <div className="permissions-view">
// // // // //         {allPermissions
// // // // //           .filter(p => selected.includes(p.id))
// // // // //           .map(p => (
// // // // //             <span key={p.id} className="permission-badge">
// // // // //               {p.name}
// // // // //             </span>
// // // // //           ))}
// // // // //         {selected.length === 0 && <p>No tiene permisos asignados.</p>}
// // // // //       </div>
// // // // //     );
// // // // //   }

// // // // //   // --- MODO EDICIÓN ---
// // // // //   return (
// // // // //     <div className="permissions-list-container">
// // // // //       <div className="permissions-grid">
// // // // //         {allPermissions.map(p => (
// // // // //           <label key={p.id} className="permission-item">
// // // // //             <input 
// // // // //               type="checkbox" 
// // // // //               checked={selected.includes(p.id)} 
// // // // //               onChange={() => toggle(p.id)} 
// // // // //             />
// // // // //             <span>{p.name}</span>
// // // // //           </label>
// // // // //         ))}
// // // // //       </div>
// // // // //     </div>
// // // // //   );
// // // // // };

// // // // // export default PermissionsSelector;

// // // // import { useState, useEffect } from 'react';
// // // // import { apiClient } from "../../../../shared/services/api";

// // // // const PermissionsSelector = ({ roleId, isEditable = true }) => {
// // // //   const [allPermissions, setAllPermissions] = useState([]);
// // // //   const [selected, setSelected] = useState([]);
// // // //   const [loading, setLoading] = useState(true);

// // // //   useEffect(() => {
// // // //     const fetchData = async () => {
// // // //       try {
// // // //         setLoading(true);
// // // //         // Hacemos las peticiones en paralelo
// // // //         const [allRes, currentRes] = await Promise.all([
// // // //           apiClient.get('/roles/permissions/list'),
// // // //           apiClient.get(`/roles/${roleId}/permissions`)
// // // //         ]);

// // // //         // Guardamos todos los permisos disponibles
// // // //         setAllPermissions(allRes.data || []);
        
// // // //         // Normalizamos los IDs a números para asegurar la comparación con includes()
// // // //         if (Array.isArray(currentRes.data)) {
// // // //           setSelected(currentRes.data.map(p => Number(p.id)));
// // // //         } else {
// // // //           setSelected([]);
// // // //         }
// // // //       } catch (error) {
// // // //         console.error("Error al cargar permisos:", error);
// // // //         setSelected([]);
// // // //       } finally {
// // // //         setLoading(false);
// // // //       }
// // // //     };
    
// // // //     if (roleId) fetchData();
// // // //   }, [roleId]);

// // // //   const toggle = async (id) => {
// // // //     const isAdding = !selected.includes(Number(id));
// // // //     const newSelection = isAdding 
// // // //       ? [...selected, Number(id)] 
// // // //       : selected.filter(i => i !== Number(id));
    
// // // //     const previousSelection = selected;
// // // //     setSelected(newSelection);

// // // //     try {
// // // //       await apiClient.put(`/roles/${roleId}/permissions`, { permissions: newSelection });
// // // //     } catch (error) {
// // // //       console.error("Error al actualizar permiso:", error);
// // // //       setSelected(previousSelection); 
// // // //       alert("No se pudo actualizar el permiso.");
// // // //     }
// // // //   };

// // // //   if (loading) return <div>Cargando permisos...</div>;

// // // //   // --- MODO LECTURA ---
// // // //   if (!isEditable) {
// // // //     return (
// // // //       <div className="permissions-view">
// // // //         {allPermissions
// // // //           .filter(p => selected.includes(Number(p.id)))
// // // //           .map(p => (
// // // //             <span key={p.id} className="permission-badge">
// // // //               {p.name}
// // // //             </span>
// // // //           ))}
// // // //         {selected.length === 0 && <p>No tiene permisos asignados.</p>}
// // // //       </div>
// // // //     );
// // // //   }

// // // //   // --- MODO EDICIÓN ---
// // // //   return (
// // // //     <div className="permissions-list-container">
// // // //       <div className="permissions-grid">
// // // //         {allPermissions.map(p => (
// // // //           <label key={p.id} className="permission-item">
// // // //             <input 
// // // //               type="checkbox" 
// // // //               checked={selected.includes(Number(p.id))} 
// // // //               onChange={() => toggle(p.id)} 
// // // //             />
// // // //             <span>{p.name}</span>
// // // //           </label>
// // // //         ))}
// // // //       </div>
// // // //     </div>
// // // //   );
// // // // };

// // // // export default PermissionsSelector;

// // // import { useState, useEffect } from 'react';
// // // import { apiClient } from "../../../../shared/services/api";

// // // const PermissionsSelector = ({ roleId, isEditable = true }) => {
// // //   const [allPermissions, setAllPermissions] = useState([]);
// // //   const [selected, setSelected] = useState([]);
// // //   const [loading, setLoading] = useState(true);

// // //   useEffect(() => {
// // //     const fetchData = async () => {
// // //       try {
// // //         setLoading(true);
// // //         const [allRes, currentRes] = await Promise.all([
// // //           apiClient.get('/roles/permissions/list'),
// // //           apiClient.get(`/roles/${roleId}/permissions`)
// // //         ]);

// // //         setAllPermissions(allRes.data || []);
        
// // //         // Convertimos todo a String para comparar sin errores de tipo
// // //         if (Array.isArray(currentRes.data)) {
// // //           setSelected(currentRes.data.map(p => String(p.id)));
// // //         } else {
// // //           setSelected([]);
// // //         }
// // //       } catch (error) {
// // //         console.error("Error al cargar:", error);
// // //       } finally {
// // //         setLoading(false);
// // //       }
// // //     };
// // //     if (roleId) fetchData();
// // //   }, [roleId]);

// // //   const toggle = async (id) => {
// // //     const stringId = String(id);
// // //     const isAdding = !selected.includes(stringId);
// // //     const newSelection = isAdding 
// // //       ? [...selected, stringId] 
// // //       : selected.filter(i => i !== stringId);
    
// // //     const previousSelection = selected;
// // //     setSelected(newSelection);

// // //     try {
// // //       // Importante: al guardar, enviamos los IDs como números si tu back lo espera, 
// // //       // o como strings si el repositorio los recibe bien.
// // //       await apiClient.put(`/roles/${roleId}/permissions`, { 
// // //         permissions: newSelection.map(Number) 
// // //       });
// // //     } catch (error) {
// // //       setSelected(previousSelection);
// // //       alert("Error al actualizar");
// // //     }
// // //   };

// // //   if (loading) return <div>Cargando permisos...</div>;

// // //   return (
// // //     <div className="permissions-list-container">
// // //       <div className="permissions-grid">
// // //         {allPermissions.map(p => (
// // //           <label key={p.id} className="permission-item">
// // //             <input 
// // //               type="checkbox" 
// // //               checked={selected.includes(String(p.id))} 
// // //               onChange={() => toggle(p.id)} 
// // //             />
// // //             <span>{p.name}</span>
// // //           </label>
// // //         ))}
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // export default PermissionsSelector;

// // import { useState, useEffect } from 'react';
// // import { apiClient } from "../../../../shared/services/api";

// // const PermissionsSelector = ({ roleId }) => {
// //   const [allPermissions, setAllPermissions] = useState([]);
// //   const [selected, setSelected] = useState([]);
// //   const [loading, setLoading] = useState(true);

// //   useEffect(() => {
// //     const fetchData = async () => {
// //       try {
// //         setLoading(true);
// //         // Volvemos a las llamadas que funcionan: listar todos y consultar los del rol
// //         const [allRes, currentRes] = await Promise.all([
// //           apiClient.get('/roles/permissions/list'),
// //           apiClient.get(`/roles/${roleId}/permissions`)
// //         ]);
        
// //         setAllPermissions(allRes.data);
// //         // Aseguramos que 'selected' coincida exactamente con lo que trae la API
// //         setSelected(currentRes.data.map(p => p.id));
// //       } catch (error) {
// //         console.error("Error al cargar:", error);
// //       } finally {
// //         setLoading(false);
// //       }
// //     };
    
// //     if (roleId) fetchData();
// //   }, [roleId]);

// //   const toggle = async (id) => {
// //     const isAdding = !selected.includes(id);
// //     const newSelection = isAdding ? [...selected, id] : selected.filter(i => i !== id);
    
// //     setSelected(newSelection);

// //     try {
// //       await apiClient.put(`/roles/${roleId}/permissions`, { permissions: newSelection });
// //     } catch (error) {
// //       console.error("Error al actualizar:", error);
// //       // Revertir estado si falla
// //       setSelected(selected);
// //     }
// //   };

// //   if (loading) return <div>Cargando...</div>;

// //   return (
// //     <div className="permissions-grid">
// //       {allPermissions.map(p => (
// //         <label key={p.id} className="permission-item">
// //           <input 
// //             type="checkbox" 
// //             checked={selected.includes(p.id)} 
// //             onChange={() => toggle(p.id)} 
// //           />
// //           {p.name}
// //         </label>
// //       ))}
// //     </div>
// //   );
// // };

// // export default PermissionsSelector;


// import { useState, useEffect } from 'react';
// import { apiClient } from "../../../../shared/services/api";

// const PermissionsSelector = ({ roleId, isEditable = true }) => {
//   const [allPermissions, setAllPermissions] = useState([]);
//   const [selected, setSelected] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         const [allRes, currentRes] = await Promise.all([
//           apiClient.get('/roles/permissions/list'),
//           apiClient.get(`/roles/${roleId}/permissions`)
//         ]);
        
//         setAllPermissions(allRes.data);
//         setSelected(currentRes.data.map(p => p.id));
//       } catch (error) {
//         console.error("Error al cargar:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
    
//     if (roleId) fetchData();
//   }, [roleId]);

//   const toggle = async (id) => {
//     if (!isEditable) return; // Bloquea la interacción si no es editable
    
//     const isAdding = !selected.includes(id);
//     const newSelection = isAdding ? [...selected, id] : selected.filter(i => i !== id);
    
//     setSelected(newSelection);

//     try {
//       await apiClient.put(`/roles/${roleId}/permissions`, { permissions: newSelection });
//     } catch (error) {
//       console.error("Error al actualizar:", error);
//       setSelected(selected);
//     }
//   };

//   if (loading) return <div>Cargando...</div>;

//   return (
//     <div className={`permissions-grid ${!isEditable ? 'view-only' : ''}`}>
//     {allPermissions
//       .filter(p => selected.includes(p.id)) 
//       .map(p => (
//         <span key={p.id} className="permission-badge">
//           {p.name}
//         </span>
//       ))}
//   </div>
//   );
// };

// export default PermissionsSelector;




import { useState, useEffect } from 'react';
import { apiClient } from "../../../../shared/services/api";

const PermissionsSelector = ({ roleId, isEditable = true }) => {
  const [allPermissions, setAllPermissions] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Ajuste: quitamos la barra inicial para evitar doble slash si apiClient ya tiene prefijo
        const [allRes, currentRes] = await Promise.all([
          apiClient.get('roles/permissions/list'),
          apiClient.get(`roles/${roleId}/permissions`)
        ]);
        
        setAllPermissions(allRes.data);
        setSelected(currentRes.data.map(p => p.id));
      } catch (error) {
        console.error("Error al cargar permisos:", error);
      } finally {
        setLoading(false);
      }
    };
    
    if (roleId) fetchData();
  }, [roleId]);

  const toggle = async (id) => {
    if (!isEditable) return;
    
    const isAdding = !selected.includes(id);
    const newSelection = isAdding ? [...selected, id] : selected.filter(i => i !== id);
    
    setSelected(newSelection);

    try {
      // await apiClient.put(`roles/${roleId}/permissions`, { permissions: newSelection });
      await apiClient.put(`/roles/${roleId}/permissions`, { permissionIds: newSelection });
    } catch (error) {
      console.error("Error al actualizar permisos:", error);
      // Revertir en caso de error
      setSelected(selected);
    }
  };

  if (loading) return <div>Cargando...</div>;

  return (
    <div className={`permissions-grid ${!isEditable ? 'view-only' : ''}`}>
      {allPermissions.map(p => {
        const isSelected = selected.includes(p.id);

        // MODO LECTURA: Solo mostramos los seleccionados como badges
        if (!isEditable) {
          return isSelected ? (
            <span key={p.id} className="permission-badge">
              {p.name}
            </span>
          ) : null;
        }

        // MODO EDICIÓN: Mostramos checkboxes para todos
        return (
          <label key={p.id} className="permission-item">
            <input 
              type="checkbox" 
              checked={isSelected} 
              onChange={() => toggle(p.id)} 
            />
            {p.name}
          </label>
        );
      })}
    </div>
  );
};

export default PermissionsSelector;