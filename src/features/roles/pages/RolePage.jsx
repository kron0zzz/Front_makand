import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useRoles } from '../hooks/useRoles';
import { useAuth } from '../../../shared/context/AuthContext';
import RoleForm from '../components/roleForm/roleForm'; // Asegúrate de que esta ruta sea correcta
import './RolePage.css';

import Pagination from '../../../shared/components/pagination/Pagination';
import useDebounce from "../../../shared/hooks/useDebounce";

export const RolePage = () => {
  const { 
    roles, 
    cargarRoles, 
    eliminarRol,
  
    page,
    cambiarPagina,
    cambiarBusqueda,
    pagination
  } = useRoles();
  const { hasPermission } = useAuth();
  
  // Estados para el modal y el formulario
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentRole, setCurrentRole] = useState(null);
  const [formData, setFormData] = useState({ role_name: '' });
  const [busqueda, setBusqueda] = useState('');

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



  const busquedaDebounce = useDebounce(busqueda, 300);
  useEffect(() => {
    cambiarBusqueda(busquedaDebounce);
  }, [busquedaDebounce]);


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
            {roles.length > 0 ? (
              roles.map((rol) => (
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
            ))):(
              <tr>
                <td>ola</td>
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