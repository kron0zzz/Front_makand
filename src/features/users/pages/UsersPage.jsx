// import { useState, useMemo } from 'react';
// import { Plus, Search, Edit, Trash2 } from 'lucide-react';
// import { useUsers } from '../hooks/useUsers';
// import UserForm from '../components/userForm/UserForm';
// import './UsersPage.css';

// export const UsersPage = () => {
//   const { users, cargarUsers, eliminarUser } = useUsers();
//   const [busqueda, setBusqueda] = useState('');
//   const [formData, setFormData] = useState({});
//   const [isEditing, setIsEditing] = useState(false);
//   const [mostrarModalForm, setMostrarModalForm] = useState(false);

//   const usersFiltrados = useMemo(() => {
//     const datos = Array.isArray(users) ? users : [];
//     return datos.filter(u => 
//       u.user_email?.toLowerCase().includes(busqueda.toLowerCase()) || 
//       u.user_id.toString().includes(busqueda)
//     );
//   }, [users, busqueda]);

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

//           <button
//             className="btn-nuevo"
//             onClick={() => { setIsEditing(false); setFormData({}); setMostrarModalForm(true); }}
//           >
//             <Plus size={20} /> Nuevo Usuario
//           </button>
//         </div>
//       </div>

//       <div className="table-wrapper">
//         <table className="custom-table">
//           <thead>
//             <tr>
//               <th>ID</th>
//               <th>Email</th>
//               <th>Estado</th>
//               <th>Gestión</th>
//             </tr>
//           </thead>
//           <tbody>
//             {usersFiltrados.length > 0 ? (
//               usersFiltrados.map((user) => (
//                 <tr key={user.user_id}>
//                   <td>#{user.user_id}</td>
//                   <td>{user.user_email}</td>
//                   <td>{user.user_status ? 'Activo' : 'Inactivo'}</td>
//                   <td className="actions-cell">
//                     <button className="action-btn edit" onClick={() => { setIsEditing(true); setFormData(user); setMostrarModalForm(true); }}>
//                       <Edit size={18} />
//                     </button>
//                     <button className="action-btn delete" onClick={() => eliminarUser(user.user_id)}>
//                       <Trash2 size={18} />
//                     </button>
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="4" className="empty-row" style={{ textAlign: 'center', padding: '40px' }}>
//                   No se encontraron coincidencias para "{busqueda}"
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       <UserForm
//         isOpen={mostrarModalForm}
//         onClose={() => setMostrarModalForm(false)}
//         formData={formData}
//         setFormData={setFormData}
//         isEditing={isEditing}
//         cargarUsers={cargarUsers}
//       />
//     </div>
//   );
// };

// export default UsersPage;

// // import { useState, useMemo, useEffect } from 'react';
// // import { Plus, Search, Edit, Trash2 } from 'lucide-react';
// // import { useUsers } from '../hooks/useUsers';
// // import { useEmployees } from '../../employees/hooks/useEmployees';
// // import UserForm from '../components/userForm/UserForm';
// // import './UsersPage.css';

// // // 1. Definimos el componente como constante
// // const UsersPage = () => {
// //   const { users, loading, error, cargarUsers, eliminarUser } = useUsers();
// //   const { employees } = useEmployees();
// //   const [busqueda, setBusqueda] = useState('');
// //   const [formData, setFormData] = useState({});
// //   const [isEditing, setIsEditing] = useState(false);
// //   const [mostrarModalForm, setMostrarModalForm] = useState(false);

// //   useEffect(() => {
// //     cargarUsers();
// //   }, [cargarUsers]);

// //   const usersFiltrados = useMemo(() => {
// //     const datos = Array.isArray(users) ? users : [];
// //     return datos.filter(u => 
// //       u.user_email?.toLowerCase().includes(busqueda.toLowerCase())
// //     );
// //   }, [users, busqueda]);

// //   const handleOpenForm = (user = null) => {
// //     if (user) {
// //       setFormData(user);
// //       setIsEditing(true);
// //     } else {
// //       setFormData({ user_email: '', password: '', user_status: true, role_id: '', employee_id: '' });
// //       setIsEditing(false);
// //     }
// //     setMostrarModalForm(true);
// //   };

// //   return (
// //     <div className="page-container">
// //       <div className="header-container">
// //         <h1>Gestión de Usuarios</h1>
// //         <button className="btn-nuevo" onClick={() => handleOpenForm()}>
// //            <Plus size={20} /> Nuevo Usuario
// //         </button>
// //       </div>
      
// //       <div className="table-wrapper">
// //         <table className="custom-table">
// //           <thead>
// //             <tr>
// //               <th>Email</th>
// //               <th>Acciones</th>
// //             </tr>
// //           </thead>
// //           <tbody>
// //             {usersFiltrados.map((user) => (
// //               <tr key={user.user_id}>
// //                 <td>{user.user_email}</td>
// //                 <td className="actions-cell">
// //                   <button className="action-btn edit" onClick={() => handleOpenForm(user)}><Edit size={18}/></button>
// //                   <button className="action-btn delete" onClick={() => eliminarUser(user.user_id)}><Trash2 size={18}/></button>
// //                 </td>
// //               </tr>
// //             ))}
// //           </tbody>
// //         </table>
// //       </div>

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

// // export { UsersPage };
// // export default UsersPage;





import { useState, useMemo, useEffect } from 'react';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { useUsers } from '../hooks/useUsers';
import { useEmployees } from '../../employees/hooks/useEmployees'; // Integrado
import UserForm from '../components/userForm/UserForm';
import './UsersPage.css';

export const UsersPage = () => {
  const { users, cargarUsers, eliminarUser } = useUsers();
  const { employees } = useEmployees(); // Hook integrado
  const [busqueda, setBusqueda] = useState('');
  const [formData, setFormData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [mostrarModalForm, setMostrarModalForm] = useState(false);

  useEffect(() => {
    cargarUsers();
  }, [cargarUsers]);

  const usersFiltrados = useMemo(() => {
    const datos = Array.isArray(users) ? users : [];
    return datos.filter(u => 
      u.user_email?.toLowerCase().includes(busqueda.toLowerCase()) || 
      u.user_id.toString().includes(busqueda)
    );
  }, [users, busqueda]);

  // Función unificada para manejar el modal
  const handleOpenForm = (user = null) => {
    if (user) {
      setFormData(user);
      setIsEditing(true);
    } else {
      setFormData({ user_email: '', password: '', user_status: true, role_id: '', employee_id: '' });
      setIsEditing(false);
    }
    setMostrarModalForm(true);
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

          <button className="btn-nuevo" onClick={() => handleOpenForm()}>
            <Plus size={20} /> Nuevo Usuario
          </button>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="custom-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Email</th>
              <th>Estado</th>
              <th>Gestión</th>
            </tr>
          </thead>
          <tbody>
            {usersFiltrados.length > 0 ? (
              usersFiltrados.map((user) => (
                <tr key={user.user_id}>
                  <td>#{user.user_id}</td>
                  <td>{user.user_email}</td>
                  <td>{user.user_status ? 'Activo' : 'Inactivo'}</td>
                  <td className="actions-cell">
                    <button className="action-btn edit" onClick={() => handleOpenForm(user)}>
                      <Edit size={18} />
                    </button>
                    <button className="action-btn delete" onClick={() => eliminarUser(user.user_id)}>
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="empty-row" style={{ textAlign: 'center', padding: '40px' }}>
                  No se encontraron coincidencias para "{busqueda}"
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <UserForm
        isOpen={mostrarModalForm}
        onClose={() => setMostrarModalForm(false)}
        formData={formData}
        setFormData={setFormData}
        isEditing={isEditing}
        cargarUsers={cargarUsers}
        employees={employees} // Pasamos los empleados al formulario
      />
    </div>
  );
};

export default UsersPage;
