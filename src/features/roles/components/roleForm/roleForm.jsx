// // // // import { X } from 'lucide-react';
// // // // import { apiClient } from "../../../../shared/services/api"; 
// // // // import PermissionsSelector from '../roleDetail/PermissionsSelector'; 
// // // // import './roleForm.css';

// // // // const RoleForm = ({ isOpen, onClose, formData, setFormData, isEditing, cargarRoles }) => {
  
// // // //   if (!isOpen) return null;

// // // //   const handleChange = (e) => {
// // // //     const { name, value, type, checked } = e.target;
// // // //     setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
// // // //   };

// // // //   const handleSubmit = async (e) => {
// // // //     e.preventDefault();
    
// // // //     const dataToSend = { 
// // // //       role_name: formData.role_name,
// // // //       role_status: formData.role_status ?? true 
// // // //     };

// // // //     try {
// // // //       if (isEditing) {
// // // //         await apiClient.put(`roles/${formData.role_id}`, dataToSend);
// // // //         alert('¡Rol actualizado con éxito!');
// // // //       } else {
// // // //         await apiClient.post('roles', dataToSend);
// // // //         alert('¡Rol creado con éxito!');
// // // //       }
      
// // // //       if (typeof cargarRoles === 'function') await cargarRoles();
// // // //       onClose();
// // // //     } catch (error) {
// // // //       console.error("Error en la petición:", error);
// // // //       alert('Error del servidor: ' + (error.response?.data?.message || 'Revisa los campos'));
// // // //     }
// // // //   };
// // // //   console.log("DEBUG RoleForm - Valor de formData:", formData);
// // // //   console.log("DEBUG: ID que estoy enviando al selector:", formData.role_id);
// // // //   return (
// // // //     <div className="form-modal-overlay">
// // // //       <div className="form-modal-container">
// // // //         <div className="form-header">
// // // //           <h2>{isEditing ? 'Editar Información del Rol' : 'Registrar Nuevo Rol'}</h2>
// // // //           <button onClick={onClose} className="form-close-btn"><X size={20} /></button>
// // // //         </div>

// // // //         <form onSubmit={handleSubmit} className="form-body">
// // // //           <div className="form-grid">
// // // //             <div>
// // // //               <label className="form-label">Código Interno</label>
// // // //               <input type="text" className="form-input form-input-disabled" value={isEditing ? `ID: ${formData.role_id}` : 'Auto'} disabled />
// // // //             </div>

// // // //             <div>
// // // //               <label className="form-label">Nombre del Rol*</label>
// // // //               <input name="role_name" type="text" className="form-input" value={formData.role_name || ''} onChange={handleChange} required />
// // // //             </div>

// // // //             {isEditing && (
// // // //               <div className="permissions-section">
// // // //                 <h3>Permisos del Rol</h3>
// // // //                 <div className="permissions-list-container">
// // // //                   <PermissionsSelector roleId={formData.role_id} isEditable={true} />
// // // //                 </div>
// // // //               </div>
// // // //             )}

// // // //             <div className="form-checkbox-container">
// // // //               <label className="form-label">
// // // //                 <input name="role_status" type="checkbox" checked={formData.role_status ?? true} onChange={handleChange} />
// // // //                 Rol Activo
// // // //               </label>
// // // //             </div>
// // // //           </div>

// // // //           <div className="form-footer">
// // // //             <button type="button" onClick={onClose} className="btn-cancel">Cancelar</button>
// // // //             <button type="submit" className="btn-submit">{isEditing ? 'Guardar Cambios' : 'Registrar Rol'}</button>
// // // //           </div>
// // // //         </form>
// // // //       </div>
// // // //     </div>
// // // //   );
// // // // };

// // // // export default RoleForm;


// // // import { useState, useEffect } from 'react';
// // // import { X } from 'lucide-react';
// // // import { apiClient } from "../../../../shared/services/api"; 
// // // import PermissionsSelector from '../roleDetail/PermissionsSelector'; 
// // // import './roleForm.css';

// // // const RoleForm = ({ isOpen, onClose, formData, setFormData, isEditing, cargarRoles }) => {
// // //   const [currentPermissions, setCurrentPermissions] = useState([]);

// // //   useEffect(() => {
// // //     const fetchPermissions = async () => {
// // //       if (isEditing && formData.role_id) {
// // //         try {
// // //           const res = await apiClient.get(`roles/${formData.role_id}/permissions`);
// // //           setCurrentPermissions(res.data.map(p => p.id));
// // //         } catch (error) {
// // //           console.error("Error al cargar permisos para edición:", error);
// // //         }
// // //       }
// // //     };
// // //     if (isOpen) fetchPermissions();
// // //   }, [isOpen, isEditing, formData.role_id]);

// // //   if (!isOpen) return null;

// // //   const handleChange = (e) => {
// // //     const { name, value, type, checked } = e.target;
// // //     setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
// // //   };

// // //   const handleSubmit = async (e) => {
// // //     e.preventDefault();
    
// // //     // Incluimos los permisos actuales para no borrarlos al actualizar el nombre
// // //     const dataToSend = { 
// // //       role_name: formData.role_name,
// // //       role_status: formData.role_status ?? true,
// // //       permissionIds: currentPermissions // Vital: esto evita que se borren en el repositorio
// // //     };

// // //     try {
// // //       if (isEditing) {
// // //         await apiClient.put(`roles/${formData.role_id}`, dataToSend);
// // //         alert('¡Rol actualizado con éxito!');
// // //       } else {
// // //         await apiClient.post('roles', dataToSend);
// // //         alert('¡Rol creado con éxito!');
// // //       }
      
// // //       if (typeof cargarRoles === 'function') await cargarRoles();
// // //       onClose();
// // //     } catch (error) {
// // //       console.error("Error en la petición:", error);
// // //       alert('Error: ' + (error.response?.data?.error || 'No se pudo guardar el rol'));
// // //     }
// // //   };

// // //   return (
// // //     <div className="form-modal-overlay">
// // //       <div className="form-modal-container">
// // //         <div className="form-header">
// // //           <h2>{isEditing ? 'Editar Información del Rol' : 'Registrar Nuevo Rol'}</h2>
// // //           <button onClick={onClose} className="form-close-btn"><X size={20} /></button>
// // //         </div>

// // //         <form onSubmit={handleSubmit} className="form-body">
// // //           <div className="form-grid">
// // //             <div>
// // //               <label className="form-label">Código Interno</label>
// // //               <input type="text" className="form-input form-input-disabled" value={isEditing ? `ID: ${formData.role_id}` : 'Auto'} disabled />
// // //             </div>

// // //             <div>
// // //               <label className="form-label">Nombre del Rol*</label>
// // //               <input name="role_name" type="text" className="form-input" value={formData.role_name || ''} onChange={handleChange} required />
// // //             </div>

// // //             {isEditing && (
// // //               <div className="permissions-section">
// // //                 <h3>Permisos del Rol</h3>
// // //                 <div className="permissions-list-container">
// // //                   <PermissionsSelector 
// // //                     roleId={formData.role_id} 
// // //                     isEditable={true} 
// // //                   />
// // //                 </div>
// // //               </div>
// // //             )}

// // //             <div className="form-checkbox-container">
// // //               <label className="form-label">
// // //                 <input name="role_status" type="checkbox" checked={formData.role_status ?? true} onChange={handleChange} />
// // //                 Rol Activo
// // //               </label>
// // //             </div>
// // //           </div>

// // //           <div className="form-footer">
// // //             <button type="button" onClick={onClose} className="btn-cancel">Cancelar</button>
// // //             <button type="submit" className="btn-submit">{isEditing ? 'Guardar Cambios' : 'Registrar Rol'}</button>
// // //           </div>
// // //         </form>
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // export default RoleForm;


// // import { useState, useEffect } from 'react';
// // import { X } from 'lucide-react';
// // import { apiClient } from "../../../../shared/services/api"; 
// // import PermissionsSelector from '../roleDetail/PermissionsSelector'; 
// // import './roleForm.css';

// // const RoleForm = ({ isOpen, onClose, formData, setFormData, isEditing, cargarRoles }) => {
// //   const [currentPermissions, setCurrentPermissions] = useState([]);

// //   // Al abrirse, si es edición, cargamos los permisos del rol para asegurar consistencia
// //   useEffect(() => {
// //     const fetchPermissions = async () => {
// //       if (isEditing && formData.role_id) {
// //         try {
// //           const res = await apiClient.get(`roles/${formData.role_id}/permissions`);
// //           setCurrentPermissions(res.data.map(p => p.id));
// //         } catch (error) {
// //           console.error("Error al cargar permisos para edición:", error);
// //         }
// //       }
// //     };
// //     if (isOpen) fetchPermissions();
// //   }, [isOpen, isEditing, formData.role_id]);

// //   if (!isOpen) return null;

// //   const handleChange = (e) => {
// //     const { name, value, type, checked } = e.target;
// //     setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
// //   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
    
// //     // Incluimos los permisos actuales para no borrarlos al actualizar el nombre
// //     const dataToSend = { 
// //       role_name: formData.role_name,
// //       role_status: formData.role_status ?? true,
// //       permissionIds: currentPermissions // Vital: esto evita que se borren en el repositorio
// //     };

// //     try {
// //       if (isEditing) {
// //         await apiClient.put(`roles/${formData.role_id}`, dataToSend);
// //         alert('¡Rol actualizado con éxito!');
// //       } else {
// //         await apiClient.post('roles', dataToSend);
// //         alert('¡Rol creado con éxito!');
// //       }
      
// //       if (typeof cargarRoles === 'function') await cargarRoles();
// //       onClose();
// //     } catch (error) {
// //       console.error("Error en la petición:", error);
// //       alert('Error: ' + (error.response?.data?.error || 'No se pudo guardar el rol'));
// //     }
// //   };

// //   return (
// //     <div className="form-modal-overlay">
// //       <div className="form-modal-container">
// //         <div className="form-header">
// //           <h2>{isEditing ? 'Editar Información del Rol' : 'Registrar Nuevo Rol'}</h2>
// //           <button onClick={onClose} className="form-close-btn"><X size={20} /></button>
// //         </div>

// //         <form onSubmit={handleSubmit} className="form-body">
// //           <div className="form-grid">
// //             <div>
// //               <label className="form-label">Código Interno</label>
// //               <input type="text" className="form-input form-input-disabled" value={isEditing ? `ID: ${formData.role_id}` : 'Auto'} disabled />
// //             </div>

// //             <div>
// //               <label className="form-label">Nombre del Rol*</label>
// //               <input name="role_name" type="text" className="form-input" value={formData.role_name || ''} onChange={handleChange} required />
// //             </div>

// //             {isEditing && (
// //               <div className="permissions-section">
// //                 <h3>Permisos del Rol</h3>
// //                 <div className="permissions-list-container">
// //                   <PermissionsSelector 
// //                     roleId={formData.role_id} 
// //                     isEditable={true} 
// //                   />
// //                 </div>
// //               </div>
// //             )}

// //             <div className="form-checkbox-container">
// //               <label className="form-label">
// //                 <input name="role_status" type="checkbox" checked={formData.role_status ?? true} onChange={handleChange} />
// //                 Rol Activo
// //               </label>
// //             </div>
// //           </div>

// //           <div className="form-footer">
// //             <button type="button" onClick={onClose} className="btn-cancel">Cancelar</button>
// //             <button type="submit" className="btn-submit">{isEditing ? 'Guardar Cambios' : 'Registrar Rol'}</button>
// //           </div>
// //         </form>
// //       </div>
// //     </div>
// //   );
// // };

// // export default RoleForm;


// import { useState, useEffect } from 'react';
// import { X } from 'lucide-react';
// import { apiClient } from "../../../../shared/services/api"; 
// import PermissionsSelector from '../roleDetail/PermissionsSelector'; 
// import './roleForm.css';

// const RoleForm = ({ isOpen, onClose, formData, setFormData, isEditing, cargarRoles }) => {
//   const [currentPermissions, setCurrentPermissions] = useState([]);

//   useEffect(() => {
//     const fetchPermissions = async () => {
//       if (isEditing && formData.role_id) {
//         try {
//           const res = await apiClient.get(`roles/${formData.role_id}/permissions`);
//           setCurrentPermissions(res.data.map(p => p.id));
//         } catch (error) {
//           console.error("Error al cargar permisos:", error);
//         }
//       }
//     };
//     if (isOpen) fetchPermissions();
//   }, [isOpen, isEditing, formData.role_id]);

//   if (!isOpen) return null;

//   const handleChange = (e) => {
//     const { name, type, checked, value } = e.target;
//     setFormData(prev => ({ 
//       ...prev, 
//       [name]: type === 'checkbox' ? checked : value 
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     // Fuerza a booleano explícito
//     const dataToSend = { 
//       role_name: formData.role_name,
//       role_status: !!formData.role_status, 
//       permissionIds: currentPermissions 
//     };

//     try {
//       if (isEditing) {
//         await apiClient.put(`roles/${formData.role_id}`, dataToSend);
//         alert('¡Rol actualizado con éxito!');
//       } else {
//         await apiClient.post('roles', dataToSend);
//         alert('¡Rol creado con éxito!');
//       }
      
//       if (typeof cargarRoles === 'function') await cargarRoles();
//       onClose();
//     } catch (error) {
//       console.error("Error en la petición:", error);
//       alert('Error: ' + (error.response?.data?.error || 'No se pudo guardar'));
//     }
//   };

//   return (
//     <div className="form-modal-overlay">
//       <div className="form-modal-container">
//         <div className="form-header">
//           <h2>{isEditing ? 'Editar Información del Rol' : 'Registrar Nuevo Rol'}</h2>
//           <button onClick={onClose} className="form-close-btn"><X size={20} /></button>
//         </div>

//         <form onSubmit={handleSubmit} className="form-body">
//           <div className="form-grid">
//             <div>
//               <label className="form-label">Código Interno</label>
//               <input type="text" className="form-input form-input-disabled" value={isEditing ? `ID: ${formData.role_id}` : 'Auto'} disabled />
//             </div>

//             <div>
//               <label className="form-label">Nombre del Rol*</label>
//               <input name="role_name" type="text" className="form-input" value={formData.role_name || ''} onChange={handleChange} required />
//             </div>

//             {isEditing && (
//               <div className="permissions-section">
//                 <h3>Permisos del Rol</h3>
//                 <div className="permissions-list-container">
//                   <PermissionsSelector roleId={formData.role_id} isEditable={true} />
//                 </div>
//               </div>
//             )}

//             <div className="form-checkbox-container">
//               <label className="form-label">
//                 <input name="role_status" type="checkbox" checked={!!formData.role_status} onChange={handleChange} />
//                 Rol Activo
//               </label>
//             </div>
//           </div>

//           <div className="form-footer">
//             <button type="button" onClick={onClose} className="btn-cancel">Cancelar</button>
//             <button type="submit" className="btn-submit">{isEditing ? 'Guardar Cambios' : 'Registrar Rol'}</button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default RoleForm;



import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { apiClient } from "../../../../shared/services/api"; 
import PermissionsSelector from '../roleDetail/PermissionsSelector'; 
import './roleForm.css';

const RoleForm = ({ isOpen, onClose, formData, setFormData, isEditing, cargarRoles }) => {
  const [currentPermissions, setCurrentPermissions] = useState([]);

  useEffect(() => {
    const fetchPermissions = async () => {
      if (isEditing && formData.role_id) {
        try {
          const res = await apiClient.get(`roles/${formData.role_id}/permissions`);
          setCurrentPermissions(res.data.map(p => p.id));
        } catch (error) {
          console.error("Error al cargar permisos:", error);
        }
      }
    };
    if (isOpen) fetchPermissions();
  }, [isOpen, isEditing, formData.role_id]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const dataToSend = { 
      role_name: formData.role_name,
      role_status: !!formData.role_status, 
      permissionIds: currentPermissions 
    };

    try {
      if (isEditing) {
        await apiClient.put(`roles/${formData.role_id}`, dataToSend);
        alert('¡Rol actualizado con éxito!');
      } else {
        await apiClient.post('roles', dataToSend);
        alert('¡Rol creado con éxito!');
      }
      
      if (typeof cargarRoles === 'function') await cargarRoles();
      onClose();
    } catch (error) {
      console.error("Error en la petición:", error);
      alert('Error: ' + (error.response?.data?.error || 'No se pudo guardar'));
    }
  };

  return (
    <div className="form-modal-overlay">
      <div className="form-modal-container">
        <div className="form-header">
          <h2>{isEditing ? 'Editar Información del Rol' : 'Registrar Nuevo Rol'}</h2>
          <button onClick={onClose} className="form-close-btn"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="form-body">
          <div className="form-grid">
            <div>
              <label className="form-label">Código Interno</label>
              <input type="text" className="form-input form-input-disabled" value={isEditing ? `ID: ${formData.role_id}` : 'Auto'} disabled />
            </div>

            <div>
              <label className="form-label">Nombre del Rol*</label>
              <input name="role_name" type="text" className="form-input" value={formData.role_name || ''} onChange={handleChange} required />
            </div>

            {isEditing && (
              <div className="permissions-section">
                <h3>Permisos del Rol</h3>
                <div className="permissions-list-container">
                  <PermissionsSelector roleId={formData.role_id} isEditable={true} />
                </div>
              </div>
            )}

            <div className="form-checkbox-container">
              <label className="form-label">
                <input name="role_status" type="checkbox" checked={!!formData.role_status} onChange={handleChange} />
                Rol Activo
              </label>
            </div>
          </div>

          <div className="form-footer">
            <button type="button" onClick={onClose} className="btn-cancel">Cancelar</button>
            <button type="submit" className="btn-submit">{isEditing ? 'Guardar Cambios' : 'Registrar Rol'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RoleForm;