// // // import { useState, useMemo, useEffect } from 'react';
// // // import { Plus, Search, Edit, Trash2 } from 'lucide-react';
// // // import { useUsers } from '../hooks/useUsers';
// // // import { useEmployees } from '../../employees/hooks/useEmployees';
// // // import { useAuth } from '../../../shared/context/AuthContext'; // Importamos useAuth
// // // import UserForm from '../components/userForm/UserForm';
// // // import './UsersPage.css';

// // // import Pagination from '../../../shared/components/pagination/Pagination';
// // // import useDebounce from "../../../shared/hooks/useDebounce";

// // // export const UsersPage = () => {
// // //   const { 
// // //     users, 
// // //     cargarUsers, 
// // //     eliminarUser,
  
// // //     page,
// // //     cambiarPagina,
// // //     cambiarBusqueda,
// // //     pagination

// // //   } = useUsers();
// // //   const { employees } = useEmployees();
// // //   const { hasPermission } = useAuth(); // Usamos hasPermission
// // //   const [busqueda, setBusqueda] = useState('');
// // //   const [formData, setFormData] = useState({});
// // //   const [isEditing, setIsEditing] = useState(false);
// // //   const [mostrarModalForm, setMostrarModalForm] = useState(false);

  

// // //   const handleOpenForm = (user = null) => {
// // //     if (user) {
// // //       setFormData(user);
// // //       setIsEditing(true);
// // //     } else {
// // //       setFormData({ user_email: '', password: '', user_status: true, role_id: '', employee_id: '' });
// // //       setIsEditing(false);
// // //     }
// // //     setMostrarModalForm(true);
// // //   };



// // //   const busquedaDebounce = useDebounce(busqueda, 300);
// // //   useEffect(() => {
// // //     cambiarBusqueda(busquedaDebounce);
// // //   }, [busquedaDebounce]);

// // //   return (
// // //     <div className="page-container">
// // //       <div className="header-container">
// // //         <div className="header-text">
// // //           <h1>Usuarios</h1>
// // //           <p>Gestión de usuarios - Makand</p>
// // //         </div>

// // //         <div className="header-actions">
// // //           <div className="search-container-small">
// // //             <Search size={18} color="#9ca3af" />
// // //             <input
// // //               type="text"
// // //               className="search-input"
// // //               placeholder="Buscar..."
// // //               value={busqueda}
// // //               onChange={(e) => setBusqueda(e.target.value)}
// // //             />
// // //           </div>

// // //           {/* Botón Nuevo protegido */}
// // //           {hasPermission('crear_usuarios') && (
// // //             <button className="btn-nuevo" onClick={() => handleOpenForm()}>
// // //               <Plus size={20} /> Nuevo Usuario
// // //             </button>
// // //           )}
// // //         </div>
// // //       </div>

// // //       <div className="table-wrapper">
// // //         <table className="custom-table">
// // //           <thead>
// // //             <tr>
// // //               <th>ID</th>
// // //               <th>Email</th>
// // //               <th>Estado</th>
// // //               <th>Gestión</th>
// // //             </tr>
// // //           </thead>
// // //           <tbody>
// // //             {users.length > 0 ? (
// // //               users.map((user) => (
// // //                 <tr key={user.user_id}>
// // //                   <td>#{user.user_id}</td>
// // //                   <td>{user.user_email}</td>
// // //                   <td>{user.user_status ? 'Activo' : 'Inactivo'}</td>
// // //                   <td className="actions-cell">
// // //                     {/* Botones de acción protegidos */}
// // //                     {hasPermission('editar_usuarios') && (
// // //                       <button className="action-btn edit" onClick={() => handleOpenForm(user)}>
// // //                         <Edit size={18} />
// // //                       </button>
// // //                     )}
// // //                     {hasPermission('eliminar_usuarios') && (
// // //                       <button className="action-btn delete" onClick={() => eliminarUser(user.user_id)}>
// // //                         <Trash2 size={18} />
// // //                       </button>
// // //                     )}
// // //                   </td>
// // //                 </tr>
// // //               ))
// // //             ) : (
// // //               <tr>
// // //                 <td colSpan="4" className="empty-row" style={{ textAlign: 'center', padding: '40px' }}>
// // //                   No se encontraron coincidencias para "{busqueda}"
// // //                 </td>
// // //               </tr>
// // //             )}
// // //           </tbody>
// // //         </table>
// // //       </div>

// // //       <Pagination
// // //         page={page}
// // //         totalPages={pagination.totalPages}
// // //         total={pagination.total}
// // //         onPageChange={cambiarPagina}
// // //       />

// // //       <UserForm
// // //         isOpen={mostrarModalForm}
// // //         onClose={() => setMostrarModalForm(false)}
// // //         formData={formData}
// // //         setFormData={setFormData}
// // //         isEditing={isEditing}
// // //         cargarUsers={cargarUsers}
// // //         employees={employees}
// // //       />
// // //     </div>
// // //   );
// // // };

// // // export default UsersPage;



// // import { useState, useEffect } from 'react';
// // import { Plus, Search, Edit, Trash2 } from 'lucide-react';
// // import { useUsers } from '../hooks/useUsers';
// // import { useEmployees } from '../../employees/hooks/useEmployees';
// // import { useRoles } from "../../roles/hooks/useRoles"; // Ajusta esta ruta si es necesario según tu estructura
// // import { useAuth } from '../../../shared/context/AuthContext';
// // import UserForm from '../components/userForm/UserForm';
// // import './UsersPage.css';

// // import Pagination from '../../../shared/components/pagination/Pagination';
// // import useDebounce from "../../../shared/hooks/useDebounce";

// // export const UsersPage = () => {
// //   const { 
// //     users, 
// //     cargarUsers, 
// //     eliminarUser,
// //     page,
// //     cambiarPagina,
// //     cambiarBusqueda,
// //     pagination
// //   } = useUsers();
  
// //   const { employees } = useEmployees();
// //   const { roles, cargarRoles } = useRoles(); // 🌟 Obtenemos los roles y la función para cargarlos
// //   const { hasPermission } = useAuth();
  
// //   const [busqueda, setBusqueda] = useState('');
// //   const [formData, setFormData] = useState({});
// //   const [isEditing, setIsEditing] = useState(false);
// //   const [mostrarModalForm, setMostrarModalForm] = useState(false);

// //   // 🌟 Cargamos los roles al montar la página para que el mapeo de nombres funcione en la tabla
// //   useEffect(() => {
// //     cargarRoles();
// //   }, [cargarRoles]);

// //   const handleOpenForm = (user = null) => {
// //     if (user) {
// //       setFormData({
// //         ...user,
// //         user_status: user.user_status ?? true,
// //         password: '' 
// //       });
// //       setIsEditing(true);
// //     } else {
// //       setFormData({ user_email: '', password: '', user_status: true, role_id: '', employee_id: '' });
// //       setIsEditing(false);
// //     }
// //     setMostrarModalForm(true);
// //   };

// //   const busquedaDebounce = useDebounce(busqueda, 300);
// //   useEffect(() => {
// //     cambiarBusqueda(busquedaDebounce);
// //   }, [busquedaDebounce]);

// //   const obtenerNombreEmpleado = (employeeId) => {
// //     const emp = employees.find(e => e.employee_id === employeeId);
// //     return emp ? emp.employee_full_name : `Empleado #${employeeId}`;
// //   };

// //   const obtenerNombreRol = (roleId) => {
// //     const rol = roles.find(r => r.role_id === roleId);
// //     return rol ? rol.role_name : `Rol #${roleId}`;
// //   };

// //   return (
// //     <div className="page-container">
// //       <div className="header-container">
// //         <div className="header-text">
// //           <h1>Usuarios</h1>
// //           <p>Gestión de usuarios - Makand</p>
// //         </div>

// //         <div className="header-actions">
// //           <div className="search-container-small">
// //             <Search size={18} color="#9ca3af" />
// //             <input
// //               type="text"
// //               className="search-input"
// //               placeholder="Buscar..."
// //               value={busqueda}
// //               onChange={(e) => setBusqueda(e.target.value)}
// //             />
// //           </div>

// //           {hasPermission('crear_usuarios') && (
// //             <button className="btn-nuevo" onClick={() => handleOpenForm()}>
// //               <Plus size={20} /> Nuevo Usuario
// //             </button>
// //           )}
// //         </div>
// //       </div>

// //       <div className="table-wrapper">
// //         <table className="custom-table">
// //           <thead>
// //             <tr>
// //               <th>ID</th>
// //               <th>Empleado</th>
// //               <th>Rol</th>
// //               <th>Email</th>
// //               <th>Estado</th>
// //               <th>Gestión</th>
// //             </tr>
// //           </thead>
// //           <tbody>
// //             {users.length > 0 ? (
// //               users.map((user) => (
// //                 <tr key={user.user_id}>
// //                   <td>#{user.user_id}</td>
// //                   <td>{user.employee_full_name || obtenerNombreEmpleado(user.employee_id)}</td>
// //                   <td>{user.role_name || obtenerNombreRol(user.role_id)}</td>
// //                   <td>{user.user_email}</td>
// //                   {/* 🌟 Celda de Estado con Switch visual (deshabilitado en tabla o interactivo según prefieras) */}
// //                   <td>
// //                     <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
// //                       <label className="switch" style={{ transform: 'scale(0.8)', margin: 0 }}>
// //                         <input
// //                           type="checkbox"
// //                           checked={user.user_status}
// //                           disabled // Opcional: si quieres que solo se cambie desde editar, déjalo disabled
// //                         />
// //                         <span className="slider round"></span>
// //                       </label>
// //                       <span style={{ fontSize: '13px', color: user.user_status ? '#16a34a' : '#dc2626', fontWeight: 500 }}>
// //                         {user.user_status ? 'Activo' : 'Inactivo'}
// //                       </span>
// //                     </div>
// //                   </td>
// //                   <td className="actions-cell">
// //                     {hasPermission('editar_usuarios') && (
// //                       <button className="action-btn edit" onClick={() => handleOpenForm(user)} title="Editar">
// //                         <Edit size={18} />
// //                       </button>
// //                     )}
// //                     {hasPermission('eliminar_usuarios') && (
// //                       <button className="action-btn delete" onClick={() => eliminarUser(user.user_id)} title="Eliminar">
// //                         <Trash2 size={18} />
// //                       </button>
// //                     )}
// //                   </td>
// //                 </tr>
// //               ))
// //             ) : (
// //               <tr>
// //                 <td colSpan="6" className="empty-row" style={{ textAlign: 'center', padding: '40px' }}>
// //                   No se encontraron coincidencias para "{busqueda}"
// //                 </td>
// //               </tr>
// //             )}
// //           </tbody>
// //         </table>
// //       </div>

// //       <Pagination
// //         page={page}
// //         totalPages={pagination.totalPages}
// //         total={pagination.total}
// //         onPageChange={cambiarPagina}
// //       />

// //       <UserForm
// //         isOpen={mostrarModalForm}
// //         onClose={() => setMostrarModalForm(false)}
// //         formData={formData}
// //         setFormData={setFormData}
// //         isEditing={isEditing}
// //         cargarUsers={cargarUsers}
// //         employees={employees}
// //       />
// //     </div>
// //   );
// // };

// // export default UsersPage;


// import { useState, useEffect } from 'react';
// import { Plus, Search, Edit, Trash2 } from 'lucide-react';
// import { useUsers } from '../hooks/useUsers';
// import { useEmployees } from '../../employees/hooks/useEmployees';
// import { useRoles } from "../../roles/hooks/useRoles";
// import { useAuth } from '../../../shared/context/AuthContext';
// import { userService } from '../services/userService';
// import UserForm from '../components/userForm/UserForm';
// import './UsersPage.css';

// import Pagination from '../../../shared/components/pagination/Pagination';
// import useDebounce from "../../../shared/hooks/useDebounce";

// export const UsersPage = () => {
//   const { 
//     users, 
//     cargarUsers, 
//     eliminarUser,
//     page,
//     cambiarPagina,
//     cambiarBusqueda,
//     pagination
//   } = useUsers();
  
//   const { employees } = useEmployees();
//   const { roles, cargarRoles } = useRoles();
//   const { hasPermission } = useAuth();
  
//   const [busqueda, setBusqueda] = useState('');
//   const [formData, setFormData] = useState({});
//   const [isEditing, setIsEditing] = useState(false);
//   const [mostrarModalForm, setMostrarModalForm] = useState(false);

//   useEffect(() => {
//     cargarRoles();
//   }, [cargarRoles]);

//   const handleOpenForm = (user = null) => {
//     if (user) {
//       setFormData({
//         user_id: user.user_id,
//         user_email: user.user_email,
//         user_status: user.user_status ?? true,
//         role_id: user.role_id,
//         employee_id: user.employee_id,
//         password: '' 
//       });
//       setIsEditing(true);
//     } else {
//       setFormData({ user_email: '', password: '', user_status: true, role_id: '', employee_id: '' });
//       setIsEditing(false);
//     }
//     setMostrarModalForm(true);
//   };

//   const busquedaDebounce = useDebounce(busqueda, 300);
//   useEffect(() => {
//     cambiarBusqueda(busquedaDebounce);
//   }, [busquedaDebounce]);

//   const obtenerNombreEmpleado = (employeeId) => {
//     const emp = employees.find(e => e.employee_id === employeeId);
//     return emp ? emp.employee_full_name : `Empleado #${employeeId}`;
//   };

//   const obtenerNombreRol = (roleId) => {
//     const rol = roles.find(r => r.role_id === roleId);
//     return rol ? rol.role_name : `Rol #${roleId}`;
//   };

//   // Función para alternar el estado directamente desde la tabla con el switch
//   const handleToggleStatus = async (user) => {
//     try {
//       const nuevoEstado = !user.user_status;
//       const datosActualizados = {
//         user_email: user.user_email,
//         user_status: nuevoEstado,
//         role_id: user.role_id,
//         employee_id: user.employee_id,
//       };
//       await userService.actualizar(user.user_id, datosActualizados);
//       await cargarUsers();
//     } catch (error) {
//       console.error("Error al cambiar el estado del usuario:", error);
//       alert("No se pudo actualizar el estado.");
//     }
//   };

//   return (
//     <div className="page-container">
//       <div className="header-container">
//         <div className="header-text">
//           <h1>Usuarios</h1>
//           <p>Gestión de usuarios - Makand</p>
//         </div>

//         <div className="header-actions">
//           <div className="search-container-small">
//             <Search size={18} color="#9ca3af" />
//             <input
//               type="text"
//               className="search-input"
//               placeholder="Buscar..."
//               value={busqueda}
//               onChange={(e) => setBusqueda(e.target.value)}
//             />
//           </div>

//           {hasPermission('crear_usuarios') && (
//             <button className="btn-nuevo" onClick={() => handleOpenForm()}>
//               <Plus size={20} /> Nuevo Usuario
//             </button>
//           )}
//         </div>
//       </div>

//       <div className="table-wrapper">
//         <table className="custom-table">
//           <thead>
//             <tr>
//               <th>ID</th>
//               <th>Empleado</th>
//               <th>Rol</th>
//               <th>Email</th>
//               <th>Estado</th>
//               <th>Gestión</th>
//             </tr>
//           </thead>
//           <tbody>
//             {users.length > 0 ? (
//               users.map((user) => (
//                 <tr key={user.user_id}>
//                   <td>#{user.user_id}</td>
//                   <td>{user.employee_full_name || obtenerNombreEmpleado(user.employee_id)}</td>
//                   <td>{user.role_name || obtenerNombreRol(user.role_id)}</td>
//                   <td>{user.user_email}</td>
//                   <td>
//                     <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
//                       <label className="switch" style={{ transform: 'scale(0.8)', margin: 0 }}>
//                         <input
//                           type="checkbox"
//                           checked={user.user_status}
//                           onChange={() => handleToggleStatus(user)}
//                         />
//                         <span className="slider round"></span>
//                       </label>
//                       <span style={{ fontSize: '13px', color: user.user_status ? '#16a34a' : '#dc2626', fontWeight: 500 }}>
//                         {user.user_status ? 'Activo' : 'Inactivo'}
//                       </span>
//                     </div>
//                   </td>
//                   <td className="actions-cell">
//                     {hasPermission('editar_usuarios') && (
//                       <button className="action-btn edit" onClick={() => handleOpenForm(user)} title="Editar">
//                         <Edit size={18} />
//                       </button>
//                     )}
//                     {hasPermission('eliminar_usuarios') && (
//                       <button className="action-btn delete" onClick={() => eliminarUser(user.user_id)} title="Eliminar">
//                         <Trash2 size={18} />
//                       </button>
//                     )}
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="6" className="empty-row" style={{ textAlign: 'center', padding: '40px' }}>
//                   No se encontraron coincidencias para "{busqueda}"
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       <Pagination
//         page={page}
//         totalPages={pagination.totalPages}
//         total={pagination.total}
//         onPageChange={cambiarPagina}
//       />

//       <UserForm
//         isOpen={mostrarModalForm}
//         onClose={() => setMostrarModalForm(false)}
//         formData={formData}
//         setFormData={setFormData}
//         isEditing={isEditing}
//         cargarUsers={cargarUsers}
//         employees={employees}
//       />
//     </div>
//   );
// };

// export default UsersPage;


import { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { useUsers } from '../hooks/useUsers';
import { useEmployees } from '../../employees/hooks/useEmployees';
import { useRoles } from "../../roles/hooks/useRoles";
import { useAuth } from '../../../shared/context/AuthContext';
import { userService } from '../services/userService';
import UserForm from '../components/userForm/UserForm';
import './UsersPage.css';

import Pagination from '../../../shared/components/pagination/Pagination';
import useDebounce from "../../../shared/hooks/useDebounce";

export const UsersPage = () => {
  const { 
    users, 
    cargarUsers, 
    eliminarUser,
    page,
    cambiarPagina,
    cambiarBusqueda,
    pagination
  } = useUsers();
  
  const { employees } = useEmployees();
  const { roles, cargarRoles } = useRoles();
  const { hasPermission } = useAuth();
  
  const [busqueda, setBusqueda] = useState('');
  const [formData, setFormData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [mostrarModalForm, setMostrarModalForm] = useState(false);

  useEffect(() => {
    cargarRoles();
  }, [cargarRoles]);

  const handleOpenForm = (user = null) => {
    if (user) {
      setFormData({
        user_id: user.user_id,
        user_email: user.user_email,
        user_status: user.user_status ?? true,
        role_id: user.role_id,
        employee_id: user.employee_id,
        password: '' 
      });
      setIsEditing(true);
    } else {
      setFormData({ user_email: '', password: '', user_status: true, role_id: '', employee_id: '' });
      setIsEditing(false);
    }
    setMostrarModalForm(true);
  };

  const busquedaDebounce = useDebounce(busqueda, 300);
  useEffect(() => {
    cambiarBusqueda(busquedaDebounce);
  }, [busquedaDebounce]);

  const obtenerNombreEmpleado = (employeeId) => {
    const emp = employees.find(e => e.employee_id === employeeId);
    return emp ? emp.employee_full_name : `Empleado #${employeeId}`;
  };

  const obtenerNombreRol = (roleId) => {
    const rol = roles.find(r => r.role_id === roleId);
    return rol ? rol.role_name : `Rol #${roleId}`;
  };

  // Función para alternar el estado desde la tabla con alerta de confirmación
  const handleToggleStatus = async (user) => {
    const nuevoEstado = !user.user_status;
    const accionTexto = nuevoEstado ? "activar" : "inactivar";
    
    const confirmacion = window.confirm(`¿Estás seguro de que deseas ${accionTexto} al usuario ${user.user_email}?`);
    
    if (!confirmacion) {
      return; 
    }

    try {
      const datosActualizados = {
        user_email: user.user_email,
        user_status: nuevoEstado,
        role_id: user.role_id,
        employee_id: user.employee_id,
      };
      await userService.actualizar(user.user_id, datosActualizados);
      await cargarUsers();
    } catch (error) {
      console.error("Error al cambiar el estado del usuario:", error);
      alert("No se pudo actualizar el estado.");
    }
  };

  return (
    <div className="page-container">
      <div className="header-container">
        <div className="header-text">
          <h1>Usuarios</h1>
          <p>Gestión de usuarios - Makand</p>
        </div>

        <div className="header-actions">
          <div className="search-container-small">
            <Search size={18} color="#9ca3af" />
            <input
              type="text"
              className="search-input"
              placeholder="Buscar..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>

          {hasPermission('crear_usuarios') && (
            <button className="btn-nuevo" onClick={() => handleOpenForm()}>
              <Plus size={20} /> Nuevo Usuario
            </button>
          )}
        </div>
      </div>

      <div className="table-wrapper">
        <table className="custom-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Empleado</th>
              <th>Rol</th>
              <th>Email</th>
              <th>Estado</th>
              <th>Gestión</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user.user_id}>
                  <td>#{user.user_id}</td>
                  <td>{user.employee_full_name || obtenerNombreEmpleado(user.employee_id)}</td>
                  <td>{user.role_name || obtenerNombreRol(user.role_id)}</td>
                  <td>{user.user_email}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <label className="switch" style={{ transform: 'scale(0.8)', margin: 0 }}>
                        <input
                          type="checkbox"
                          checked={user.user_status}
                          onChange={() => handleToggleStatus(user)}
                        />
                        <span className="slider round"></span>
                      </label>
                      <span style={{ fontSize: '13px', color: user.user_status ? '#16a34a' : '#dc2626', fontWeight: 500 }}>
                        {user.user_status ? 'Activo' : 'Inactivo'}
                      </span>
                    </div>
                  </td>
                  <td className="actions-cell">
                    {hasPermission('editar_usuarios') && (
                      <button className="action-btn edit" onClick={() => handleOpenForm(user)} title="Editar">
                        <Edit size={18} />
                      </button>
                    )}
                    {hasPermission('eliminar_usuarios') && (
                      <button className="action-btn delete" onClick={() => eliminarUser(user.user_id)} title="Eliminar">
                        <Trash2 size={18} />
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="empty-row" style={{ textAlign: 'center', padding: '40px' }}>
                  No se encontraron coincidencias para "{busqueda}"
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        page={page}
        totalPages={pagination.totalPages}
        total={pagination.total}
        onPageChange={cambiarPagina}
      />

      <UserForm
        isOpen={mostrarModalForm}
        onClose={() => setMostrarModalForm(false)}
        formData={formData}
        setFormData={setFormData}
        isEditing={isEditing}
        cargarUsers={cargarUsers}
        employees={employees}
      />
    </div>
  );
};

export default UsersPage;