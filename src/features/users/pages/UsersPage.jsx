import { useState, useMemo, useEffect } from 'react';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { useUsers } from '../hooks/useUsers';
import { useEmployees } from '../../employees/hooks/useEmployees';
import { useAuth } from '../../../shared/context/AuthContext'; // Importamos useAuth
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
  const { hasPermission } = useAuth(); // Usamos hasPermission
  const [busqueda, setBusqueda] = useState('');
  const [formData, setFormData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [mostrarModalForm, setMostrarModalForm] = useState(false);

  

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



  const busquedaDebounce = useDebounce(busqueda, 300);
  useEffect(() => {
    cambiarBusqueda(busquedaDebounce);
  }, [busquedaDebounce]);

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

          {/* Botón Nuevo protegido */}
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
                  <td>{user.user_email}</td>
                  <td>{user.user_status ? 'Activo' : 'Inactivo'}</td>
                  <td className="actions-cell">
                    {/* Botones de acción protegidos */}
                    {hasPermission('editar_usuarios') && (
                      <button className="action-btn edit" onClick={() => handleOpenForm(user)}>
                        <Edit size={18} />
                      </button>
                    )}
                    {hasPermission('eliminar_usuarios') && (
                      <button className="action-btn delete" onClick={() => eliminarUser(user.user_id)}>
                        <Trash2 size={18} />
                      </button>
                    )}
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