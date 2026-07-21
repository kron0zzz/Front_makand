import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import { useRoles } from '../hooks/useRoles';
import { useAuth } from '../../../shared/context/AuthContext';
import RoleForm from '../components/roleForm/roleForm';
import { RoleDetail } from '../components/roleDetail/roleDetail';
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
  

  const [detailModal, setDetailModal] = useState(null);
  const [editModal, setEditModal] = useState(null); 
  const [formData, setFormData] = useState({ role_name: '', role_status: true });

  // Estados para el modal y el formulario
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentRole, setCurrentRole] = useState(null);
  const [busqueda, setBusqueda] = useState('');


  useEffect(() => {
    cargarRoles();
  }, []);

  const handleOpenCreate = () => {
    setFormData({ role_name: '', role_status: true });
    setEditModal({});
  };

  const handleOpenEdit = (rol) => {
    setFormData({ 
      ...rol, 
      role_status: !!rol.role_status 
    });
    setEditModal(rol);
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
      

      {detailModal && (
        <RoleDetail 
          role={detailModal} 
          onClose={() => setDetailModal(null)} 
          onEdit={(rol) => {
            setDetailModal(null);
            handleOpenEdit(rol);
          }}
        />
      )}

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
