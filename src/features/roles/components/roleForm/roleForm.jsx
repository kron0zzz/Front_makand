// import { useState, useEffect } from 'react';
// import { X } from 'lucide-react';
// import { apiClient } from "../../../../shared/services/api"; 
// import PermissionsSelector from '../roleDetail/PermissionsSelector'; 
// import './roleForm.css';
// import { useAlertModal } from "../../../../shared/alertModal";

// const RoleForm = ({ isOpen, onClose, formData, setFormData, isEditing, cargarRoles }) => {
//   const { showAlert, showConfirm } = useAlertModal();
//   const [currentPermissions, setCurrentPermissions] = useState([]);
//   const [allPermissions, setAllPermissions] = useState([]);

//   useEffect(() => {
//     const fetchPermissions = async () => {
//       try {
//         const resAll = await apiClient.get('/roles/permissions/list');
//         setAllPermissions(resAll.data);

//         if (isEditing && formData.role_id) {
//           const resRole = await apiClient.get(`roles/${formData.role_id}/permissions`);
//           setCurrentPermissions(resRole.data.map(p => p.id));
//         } else {
//           setCurrentPermissions([]);
//         }
//       } catch (error) {
//         console.error("Error al cargar permisos:", error);
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

//   const handleSelectAll = (e) => {
//     if (e.target.checked) {
//       const allIds = allPermissions.map(p => p.id || p.permission_id);
//       setCurrentPermissions(allIds);
//     } else {
//       setCurrentPermissions([]);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     const dataToSend = { 
//       role_name: formData.role_name,
//       role_status: !!formData.role_status, 
//       permissionIds: currentPermissions 
//     };

//     try {
//       if (isEditing) {
//         await apiClient.put(`roles/${formData.role_id}`, dataToSend);
//         await showAlert('¡Rol actualizado con éxito!');
//       } else {
//         await apiClient.post('roles', dataToSend);
//         await showAlert('¡Rol creado con éxito!');
//       }
      
//       if (typeof cargarRoles === 'function') await cargarRoles();
//       onClose();
//     } catch (error) {
//       console.error("Error en la petición:", error);
//       await showAlert('Error: ' + (error.response?.data?.error || 'No se pudo guardar'));
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

//             <div className="permissions-section">
//               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
//                 <h3>Permisos del Rol</h3>
                
//                 <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', cursor: 'pointer', fontWeight: '500' }}>
//                   <input 
//                     type="checkbox" 
//                     checked={allPermissions.length > 0 && currentPermissions.length === allPermissions.length}
//                     onChange={handleSelectAll}
//                   />
//                   Seleccionar todos
//                 </label>
//               </div>

//               <div className="permissions-list-container">
//                 <PermissionsSelector 
//                   roleId={formData.role_id} 
//                   selected={currentPermissions} 
//                   onChange={setCurrentPermissions} 
//                   isEditable={true} 
//                 />
//               </div>
//             </div>

//             {/* Switch de Estado idéntico al de la tabla */}
//             <div className="form-checkbox-container" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
//               <label className="form-label">Estado del Rol</label>
//               <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
//                 <label className="switch">
//                   <input 
//                     name="role_status" 
//                     type="checkbox" 
//                     checked={!!formData.role_status} 
//                     onChange={handleChange} 
//                   />
//                   <span className="slider round"></span>
//                 </label>
//                 <span style={{ fontSize: '14px', color: formData.role_status ? '#16a34a' : '#dc2626', fontWeight: '500' }}>
//                   {formData.role_status ? 'Activo' : 'Inactivo'}
//                 </span>
//               </div>
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
import { useAlertModal } from "../../../../shared/alertModal";

const RoleForm = ({ isOpen, onClose, formData, setFormData, isEditing, cargarRoles }) => {
  const { showAlert, showConfirm } = useAlertModal();
  const [currentPermissions, setCurrentPermissions] = useState([]);
  const [allPermissions, setAllPermissions] = useState([]);

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const resAll = await apiClient.get('/roles/permissions/list');
        setAllPermissions(resAll.data);

        if (isEditing && formData.role_id) {
          const resRole = await apiClient.get(`roles/${formData.role_id}/permissions`);
          setCurrentPermissions(resRole.data.map(p => p.id));
        } else {
          setCurrentPermissions([]);
        }
      } catch (error) {
        console.error("Error al cargar permisos:", error);
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

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allIds = allPermissions.map(p => p.id || p.permission_id);
      setCurrentPermissions(allIds);
    } else {
      setCurrentPermissions([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validación: Comprobar que haya al menos un permiso seleccionado
    if (currentPermissions.length === 0) {
      await showAlert('Debes seleccionar al menos un permiso para el rol.');
      return;
    }

    const dataToSend = { 
      role_name: formData.role_name,
      role_status: !!formData.role_status, 
      permissionIds: currentPermissions 
    };

    try {
      if (isEditing) {
        await apiClient.put(`roles/${formData.role_id}`, dataToSend);
        await showAlert('¡Rol actualizado con éxito!');
      } else {
        await apiClient.post('roles', dataToSend);
        await showAlert('¡Rol creado con éxito!');
      }
      
      if (typeof cargarRoles === 'function') await cargarRoles();
      onClose();
    } catch (error) {
      console.error("Error en la petición:", error);
      await showAlert('Error: ' + (error.response?.data?.error || 'No se pudo guardar'));
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

            <div className="permissions-section">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <h3>Permisos del Rol</h3>
                
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', cursor: 'pointer', fontWeight: '500' }}>
                  <input 
                    type="checkbox" 
                    checked={allPermissions.length > 0 && currentPermissions.length === allPermissions.length}
                    onChange={handleSelectAll}
                  />
                  Seleccionar todos
                </label>
              </div>

              <div className="permissions-list-container">
                <PermissionsSelector 
                  roleId={formData.role_id} 
                  selected={currentPermissions} 
                  onChange={setCurrentPermissions} 
                  isEditable={true} 
                />
              </div>
            </div>

            {/* Switch de Estado idéntico al de la tabla */}
            <div className="form-checkbox-container" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label className="form-label">Estado del Rol</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <label className="switch">
                  <input 
                    name="role_status" 
                    type="checkbox" 
                    checked={!!formData.role_status} 
                    onChange={handleChange} 
                  />
                  <span className="slider round"></span>
                </label>
                <span style={{ fontSize: '14px', color: formData.role_status ? '#16a34a' : '#dc2626', fontWeight: '500' }}>
                  {formData.role_status ? 'Activo' : 'Inactivo'}
                </span>
              </div>
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