import { useState, useMemo } from 'react';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { useUsers } from '../hooks/useUsers';
import UserForm from '../components/userForm/UserForm';
import './UsersPage.css';

const UsersPage = () => {
  const { users, cargarUsers, eliminarUser } = useUsers();
  const [busqueda, setBusqueda] = useState('');
  const [formData, setFormData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [mostrarModalForm, setMostrarModalForm] = useState(false);

  const usersFiltrados = useMemo(() => {
    const datos = Array.isArray(users) ? users : [];
    const termino = busqueda.toLowerCase();
    
    return datos.filter(u =>
      u.user_email.toLowerCase().includes(termino) ||
      u.user_id.toString().includes(termino)
    );
  }, [users, busqueda]);

  const prepararEdicion = (user) => {
    setIsEditing(true);
    setFormData({
      user_id: user.user_id,
      user_email: user.user_email,
      password: user.password,
      user_status: user.user_status,
      role_id: user.role_id,
      employee_id: user.employee_id,
    });
    setMostrarModalForm(true);
  };

  const handleEliminar = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      await eliminarUser(id);
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

          <button
            className="btn-nuevo"
            onClick={() => {
              setIsEditing(false);
              setFormData({});
              setMostrarModalForm(true);
            }}
          >
            <Plus size={20} />
            Nuevo Usuario
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
                    <button className="action-btn edit" title="Editar" onClick={() => prepararEdicion(user)}><Edit size={18} /></button>
                    <button className="action-btn delete" title="Eliminar" onClick={() => handleEliminar(user.user_id)}><Trash2 size={18} /></button>
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
        onClose={async () => { setMostrarModalForm(false); await cargarUsers(); }}
        formData={formData}
        setFormData={setFormData}
        isEditing={isEditing}
      />
    </div>
  );
};

export default UsersPage;