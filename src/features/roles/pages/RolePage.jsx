import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useRoles } from '../hooks/useRoles'; // El hook que definimos antes
import './RolePage.css'; // Asegúrate de tener estilos básicos o reutiliza los de SupplierPage

export const RolePage = () => {
  const { roles, cargarRoles, eliminarRol } = useRoles();
  
  useEffect(() => {
    cargarRoles();
  }, [cargarRoles]);

  return (
    <div className="page-container">
      <div className="header-container">
        <h1>Gestión de Roles</h1>
        <button className="btn-nuevo">
          <Plus size={20} /> Nuevo Rol
        </button>
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
                  <button className="action-btn edit"><Edit size={18} /></button>
                  <button 
                    className="action-btn delete" 
                    onClick={() => eliminarRol(rol.role_id)}
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RolePage;