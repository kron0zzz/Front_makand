// import { useState, useEffect } from 'react';
// import { Plus, Edit, Trash2, Eye } from 'lucide-react';
// import { useRoles } from '../hooks/useRoles';
// import { useAuth } from '../../../shared/context/AuthContext';
// import RoleForm from '../components/roleForm/roleForm';
// import { RoleDetail } from '../components/roleDetail/roleDetail'; // Asegura esta ruta
// import './RolePage.css';

// export const RolePage = () => {
//   const { roles, cargarRoles, eliminarRol } = useRoles();
//   const { hasPermission } = useAuth();
  
//   // Estados para modales
//   const [detailModal, setDetailModal] = useState(null); // Contiene el objeto rol a ver
//   const [editModal, setEditModal] = useState(null);     // Contiene el objeto rol a editar/crear
//   const [formData, setFormData] = useState({ role_name: '', role_status: true });

//   useEffect(() => {
//     cargarRoles();
//   }, []);

//   const handleOpenCreate = () => {
//     setFormData({ role_name: '', role_status: true });
//     setEditModal({}); // Objeto vacío para indicar modo creación
//   };

//   const handleOpenEdit = (rol) => {
//     setFormData({ ...rol });
//     setEditModal(rol);
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
//                   <button className="action-btn view" onClick={() => setDetailModal(rol)}>
//                     <Eye size={18} />
//                   </button>
//                   {hasPermission('editar_roles') && (
//                     <button className="action-btn edit" onClick={() => handleOpenEdit(rol)}>
//                       <Edit size={18} />
//                     </button>
//                   )}
//                   {hasPermission('eliminar_roles') && (
//                     <button className="action-btn delete" onClick={() => eliminarRol(rol.role_id)}>
//                       <Trash2 size={18} />
//                     </button>
//                   )}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* --- RENDERIZADO CONDICIONAL DE MODALES --- */}

//       {/* Modal de Detalle */}
//       {detailModal && (
//         <div className="form-modal-overlay">
//           <RoleDetail 
//             role={detailModal} 
//             onClose={() => setDetailModal(null)} 
//           />
//         </div>
//       )}

//       {/* Modal de Edición/Creación */}
//       {editModal && (
//         <RoleForm 
//           isOpen={!!editModal}
//           onClose={() => setEditModal(null)}
//           formData={formData}
//           setFormData={setFormData}
//           isEditing={!!editModal.role_id}
//           cargarRoles={cargarRoles}
//         />
//       )}
//     </div>
//   );
// };

// export default RolePage;



import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import { useRoles } from '../hooks/useRoles';
import { useAuth } from '../../../shared/context/AuthContext';
import RoleForm from '../components/roleForm/roleForm';
import { RoleDetail } from '../components/roleDetail/roleDetail';
import './RolePage.css';

export const RolePage = () => {
  const { roles, cargarRoles, eliminarRol } = useRoles();
  const { hasPermission } = useAuth();
  
  // Estados para modales
  const [detailModal, setDetailModal] = useState(null); // Contiene el objeto rol a ver
  const [editModal, setEditModal] = useState(null);     // Contiene el objeto rol a editar/crear
  const [formData, setFormData] = useState({ role_name: '', role_status: true });

  useEffect(() => {
    cargarRoles();
  }, []);

  const handleOpenCreate = () => {
    setFormData({ role_name: '', role_status: true });
    setEditModal({}); // Objeto vacío para indicar modo creación
  };

  const handleOpenEdit = (rol) => {
    setFormData({ ...rol });
    setEditModal(rol); // Objeto con datos para indicar modo edición
  };

  // Puente para pasar de detalle a edición
  const handleEditFromDetail = (rol) => {
    setDetailModal(null); // 1. Cerramos detalle
    handleOpenEdit(rol);  // 2. Abrimos formulario
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
                  <button className="action-btn view" onClick={() => setDetailModal(rol)}>
                    <Eye size={18} />
                  </button>
                  {hasPermission('editar_roles') && (
                    <button className="action-btn edit" onClick={() => handleOpenEdit(rol)}>
                      <Edit size={18} />
                    </button>
                  )}
                  {hasPermission('eliminar_roles') && (
                    <button className="action-btn delete" onClick={() => eliminarRol(rol.role_id)}>
                      <Trash2 size={18} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- MODALES --- */}

      {/* Modal de Detalle */}
      {detailModal && (
        <RoleDetail 
          role={detailModal} 
          onClose={() => setDetailModal(null)} 
          onEdit={(rol) => {
            setDetailModal(null); // Cierra el detalle
            handleOpenEdit(rol);  // Abre el formulario
        }}
        />
      )}


      {/* Modal de Edición/Creación */}
      {editModal && (
        <RoleForm 
          isOpen={!!editModal}
          onClose={() => setEditModal(null)}
          formData={formData}
          setFormData={setFormData}
          isEditing={!!editModal.role_id}
          cargarRoles={cargarRoles}
        />
      )}
    </div>
  );
};

export default RolePage;