// // import { useState, useEffect } from 'react';
// // import { Plus, Edit, Trash2 } from 'lucide-react';
// // import { useRoles } from '../hooks/useRoles';
// // import { useAuth } from '../../../shared/context/AuthContext'; // Asegúrate de que esta ruta sea correcta
// // import './RolePage.css';

// // export const RolePage = () => {
// //   const { roles, cargarRoles, eliminarRol } = useRoles();
// //   // const { hasPermission } = useAuth(); // Obtenemos la función de permisos del contexto
// //   const { hasPermission, user } = useAuth();

// //   console.log("Datos del usuario en contexto:", user);
// //   console.log("¿Tiene permiso 'crear_roles'?", hasPermission('crear_roles'));

// //   useEffect(() => {
// //     cargarRoles();
// //   }, [cargarRoles]);

// //   return (
// //     <div className="page-container">
// //       <div className="header-container">
// //         <h1>Gestión de Roles</h1>
        
// //         {/* Validamos si el usuario puede crear roles */}
// //         {(hasPermission('crear_roles') || user?.role_id === 1) && (
// //           <button className="btn-nuevo">
// //             <Plus size={20} /> Nuevo Rol
// //           </button>
// //         )}

// //         {/* {hasPermission('crear_roles') && (
// //           <button className="btn-nuevo">
// //             <Plus size={20} /> Nuevo Rol
// //           </button>
// //         )} */}
// //       </div>

// //       <div className="table-wrapper">
// //         <table className="custom-table">
// //           <thead>
// //             <tr>
// //               <th>ID</th>
// //               <th>Nombre del Rol</th>
// //               <th>Estado</th>
// //               <th>Gestión</th>
// //             </tr>
// //           </thead>
// //           <tbody>
// //             {roles.map((rol) => (
// //               <tr key={rol.role_id}>
// //                 <td>#{rol.role_id}</td>
// //                 <td>{rol.role_name}</td>
// //                 <td>{rol.role_status ? 'Activo' : 'Inactivo'}</td>
// //                 <td className="actions-cell">
                  
// //                   {/* Validamos si el usuario puede editar roles */}
// //                   {hasPermission('editar_roles') && (
// //                     <button className="action-btn edit" aria-label="Editar">
// //                       <Edit size={18} />
// //                     </button>
// //                   )}
                  
// //                   {/* Validamos si el usuario puede eliminar roles */}
// //                   {hasPermission('eliminar_roles') && (
// //                     <button 
// //                       className="action-btn delete" 
// //                       onClick={() => eliminarRol(rol.role_id)}
// //                       aria-label="Eliminar"
// //                     >
// //                       <Trash2 size={18} />
// //                     </button>
// //                   )}
// //                 </td>
// //               </tr>
// //             ))}
// //           </tbody>
// //         </table>
// //       </div>
// //     </div>
// //   );
// // };

// // export default RolePage;



// import { useState, useEffect } from 'react';
// import { Plus, Edit, Trash2 } from 'lucide-react';
// import { useRoles } from '../hooks/useRoles';
// import { useAuth } from '../../../shared/context/AuthContext';
// import './RolePage.css';
// // Asegúrate de importar tu componente de modal, por ejemplo:
// // import RoleModal from './RoleModal'; 

// export const RolePage = () => {
//   const { roles, cargarRoles, eliminarRol } = useRoles();
//   const { hasPermission } = useAuth();
//   const [formData, setFormData] = useState({ role_name: '' });
  


//   useEffect(() => {
//     cargarRoles();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   const handleOpenCreate = () => {
//     setCurrentRole(null); // Null significa modo creación
//     setIsModalOpen(true);
//   };

//   const handleOpenEdit = (rol) => {
//     setCurrentRole(rol); // Cargamos el rol seleccionado para editar
//     setIsModalOpen(true);
//   };

//   return (
//     <div className="page-container">
//       <div className="header-container">
//         <h1>Gestión de Roles</h1>
        
//         {hasPermission('crear_roles') && (
//           <button className="btn-nuevo" onClick={handleOpenCreate}>
//             <Plus size={20} /> Nuevo Rol
//           </button>
//         )}
//       </div>

//       <div className="table-wrapper">
//         <table className="custom-table">
//           <thead>
//             <tr>
//               <th>ID</th>
//               <th>Nombre del Rol</th>
//               <th>Estado</th>
//               <th>Gestión</th>
//             </tr>
//           </thead>
//           <tbody>
//             {roles.map((rol) => (
//               <tr key={rol.role_id}>
//                 <td>#{rol.role_id}</td>
//                 <td>{rol.role_name}</td>
//                 <td>{rol.role_status ? 'Activo' : 'Inactivo'}</td>
//                 <td className="actions-cell">
                  
//                   {hasPermission('editar_roles') && (
//                     <button 
//                       className="action-btn edit" 
//                       onClick={() => handleOpenEdit(rol)}
//                       aria-label="Editar"
//                     >
//                       <Edit size={18} />
//                     </button>
//                   )}
                  
//                   {hasPermission('eliminar_roles') && (
//                     <button 
//                       className="action-btn delete" 
//                       onClick={() => eliminarRol(rol.role_id)}
//                       aria-label="Eliminar"
//                     >
//                       <Trash2 size={18} />
//                     </button>
//                   )}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* Aquí iría tu componente de Modal */}
//       {/* {isModalOpen && (
//         <RoleModal 
//           role={currentRole} 
//           onClose={() => setIsModalOpen(false)} 
//           refresh={cargarRoles}
//         />
//       )} */}
//     </div>
//   );
// };

// export default RolePage;


import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useRoles } from '../hooks/useRoles';
import { useAuth } from '../../../shared/context/AuthContext';
import RoleForm from '../components/roleForm/roleForm'; // Asegúrate de que esta ruta sea correcta
import './RolePage.css';

export const RolePage = () => {
  const { roles, cargarRoles, eliminarRol } = useRoles();
  const { hasPermission } = useAuth();
  
  // Estados para el modal y el formulario
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentRole, setCurrentRole] = useState(null);
  const [formData, setFormData] = useState({ role_name: '' });

  useEffect(() => {
    cargarRoles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleOpenCreate = () => {
    setCurrentRole(null); 
    setFormData({ role_name: '' }); // Limpiamos formulario para crear
    setIsModalOpen(true);
  };

  const handleOpenEdit = (rol) => {
    setCurrentRole(rol); 
    setFormData({ ...rol }); // Cargamos los datos del rol al formulario
    setIsModalOpen(true);
  };

  return (
    <div className="page-container">
      <div className="header-container">
        <h1>Gestión de Roles</h1>
        
        {hasPermission('crear_roles') && (
          <button className="btn-nuevo" onClick={handleOpenCreate}>
            <Plus size={20} /> Nuevo Rol
          </button>
        )}
      </div>

      <div className="table-wrapper">
        <table className="custom-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre del Rol</th>
              <th>Estado</th>
              <th>Gestión</th>
            </tr>
          </thead>
          <tbody>
            {roles.map((rol) => (
              <tr key={rol.role_id}>
                <td>#{rol.role_id}</td>
                <td>{rol.role_name}</td>
                <td>{rol.role_status ? 'Activo' : 'Inactivo'}</td>
                <td className="actions-cell">
                  
                  {hasPermission('editar_roles') && (
                    <button 
                      className="action-btn edit" 
                      onClick={() => handleOpenEdit(rol)}
                      aria-label="Editar"
                    >
                      <Edit size={18} />
                    </button>
                  )}
                  
                  {hasPermission('eliminar_roles') && (
                    <button 
                      className="action-btn delete" 
                      onClick={() => eliminarRol(rol.role_id)}
                      aria-label="Eliminar"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Componente del Modal */}
      {isModalOpen && (
        <RoleForm 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          formData={formData}
          setFormData={setFormData}
          isEditing={!!currentRole}
          cargarRoles={cargarRoles}
        />
      )}
    </div>
  );
};

export default RolePage;