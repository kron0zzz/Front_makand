import { useState, useMemo, useEffect } from 'react';
import { Plus, Search, Eye, Edit, Trash2 } from 'lucide-react';
import { useEmployees } from '../hooks/useEmployees'; 
import { useAuth } from "../../../shared/context/AuthContext";
import EmployeeForm from '../components/employeeForm/EmployeeForm';
import EmployeeDetail from '../components/employeeDetail/EmployeeDetail';
import './EmployeePage.css'; 

import Pagination from '../../../shared/components/pagination/Pagination';
import useDebounce from "../../../shared/hooks/useDebounce";

const EmployeePage = () => {
  const { 
    employees, 
    cargarEmpleados, 
    eliminarEmpleado,
    toggleEmpleadoEstado,

    page,
    cambiarPagina,
    cambiarBusqueda,
    pagination
  
  } = useEmployees();
  const { hasPermission } = useAuth();
  const [busqueda, setBusqueda] = useState('');
  const [formData, setFormData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [mostrarModalForm, setMostrarModalForm] = useState(false);
  const [mostrarModalDetalle, setMostrarModalDetalle] = useState(false);
  const [employeeSeleccionado, setEmployeeSeleccionado] = useState(null);

  const getToken = () => localStorage.getItem("token");

  const prepararEdicion = (emp) => {
    setIsEditing(true);
    setFormData({ ...emp }); 
    setMostrarModalForm(true);
    setMostrarModalDetalle(false);
  };

  


  const busquedaDebounce = useDebounce(busqueda, 300);
  useEffect(() => {
    cambiarBusqueda(busquedaDebounce);
  }, [busquedaDebounce]);

  return (
    <div className="page-container">
      <div className="header-container">
        <div className="header-text">
          <h1>Empleados</h1>
          <p>Gestión de empleados - Makand</p>
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

          {hasPermission('Crear Empleado') && (
            <button
              className="btn-nuevo"
              onClick={() => { setIsEditing(false); setFormData({}); setMostrarModalForm(true); }}
            >
              <Plus size={20} /> Nuevo Empleado
            </button>
          )}
        </div>
      </div>

      <div className="table-wrapper">
        <table className="custom-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Documento</th>
              <th>Nombre</th>
              <th>Cargo</th>
              <th>Estado</th>
              <th>Gestión</th>
            </tr>
          </thead>
          <tbody>
            {employees.length > 0 ? (
              employees.map((emp) => (
                <tr key={emp.employee_id}>
                  <td>#{emp.employee_id}</td>
                  <td>{emp.employee_document_number}</td>
                  <td>{emp.employee_full_name}</td>
                  <td>{emp.position_name}</td>
                  <td>
                    <label className="switch">
                      <input 
                        type="checkbox" 
                        checked={emp.employee_status} 
                        onChange={() => toggleEmpleadoEstado(emp.employee_id, emp.employee_status)}  
                      />
                      <span className="slider round"></span>
                    </label>
                  </td>
                  <td className="actions-cell">
                    {hasPermission('Ver Detalle de Empleado') && (
                      <button className="action-btn view" onClick={() => { setEmployeeSeleccionado(emp); setMostrarModalDetalle(true); }}>
                        <Eye size={18} />
                      </button>
                    )}
                    {hasPermission('Editar Empleado') && (
                      <button className="action-btn edit" onClick={() => prepararEdicion(emp)}>
                        <Edit size={18} />
                      </button>
                    )}
                    {hasPermission('Eliminar Empleado') && (
                      <button className="action-btn delete" onClick={() => eliminarEmpleado(emp.employee_id)}>
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

      <EmployeeDetail 
        isOpen={mostrarModalDetalle} 
        onClose={() => setMostrarModalDetalle(false)} 
        empleado={employeeSeleccionado} 
        onEdit={prepararEdicion} 
      />

      <EmployeeForm 
        isOpen={mostrarModalForm} 
        onClose={() => { setMostrarModalForm(false); cargarEmpleados(); }} 
        formData={formData} 
        setFormData={setFormData} 
        isEditing={isEditing} 
      />
    </div>
  );
};

export default EmployeePage;