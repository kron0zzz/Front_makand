// import { useState, useMemo, useEffect } from 'react';
// import { Plus, Search, Eye, Edit, Trash2 } from 'lucide-react';
// import { useEmployees } from '../hooks/useEmployees'; 
// import EmployeeForm from '../components/employeeForm/EmployeeForm';
// import EmployeeDetail from '../components/employeeDetail/EmployeeDetail';
// import './EmployeePage.css'; 

// const EmployeePage = () => {
//   const { employees, cargarEmpleados, eliminarEmpleado } = useEmployees();
//   const [busqueda, setBusqueda] = useState('');
//   const [formData, setFormData] = useState({});
//   const [isEditing, setIsEditing] = useState(false);
//   const [mostrarModalForm, setMostrarModalForm] = useState(false);
//   const [mostrarModalDetalle, setMostrarModalDetalle] = useState(false);
//   const [employeeSeleccionado, setEmployeeSeleccionado] = useState(null);

//   useEffect(() => {
//     cargarEmpleados();
//   }, [cargarEmpleados]);

//   // Cambiar el estado booleano del empleado de forma limpia y segura
//   const handleToggleEstado = async (employee) => {
//     const nuevoEstado = !employee.employee_status;
//     const accion = nuevoEstado ? 'ACTIVAR' : 'DESACTIVAR';
//     const mensaje = `¿Estás seguro de que deseas ${accion} al empleado ${employee.employee_full_name || ''}?`;
    
//     if (window.confirm(mensaje)) {
//       try {
//         const response = await fetch(`http://localhost:3000/api/employees/${employee.employee_id}`, {
//           method: 'PUT',
//           headers: { 'Content-Type': 'application/json' },
//           // Enviamos únicamente el estado modificado para evitar conflictos de validación en el backend
//           body: JSON.stringify({
//             employee_status: nuevoEstado
//           })
//         });

//         if (response.ok) {
//           await cargarEmpleados();
//         } else {
//           alert("No se pudo actualizar el estado del empleado.");
//         }
//       } catch (error) {
//         console.error("Error al cambiar estado:", error);
//         alert("Error de conexión con el servidor.");
//       }
//     }
//   };

//   // Filtrado optimizado utilizando los campos que vienen de la ruta /table
//   const employeesFiltrados = useMemo(() => {
//     const datos = Array.isArray(employees) ? employees : [];
//     const termino = busqueda.toLowerCase();
    
//     return datos.filter(e => {
//       const nombreCompleto = `${e.employee_full_name || ''}`.toLowerCase();
//       const documento = e.employee_document_number?.toString() || '';
//       const correo = e.employee_email?.toLowerCase() || '';
//       const cargo = e.position_name?.toLowerCase() || '';
      
//       return nombreCompleto.includes(termino) || 
//              documento.includes(termino) || 
//              correo.includes(termino) ||
//              cargo.includes(termino);
//     });
//   }, [employees, busqueda]);

//   // Prepara los datos buscando el registro original e individual directamente de la API
//   const prepararEdicion = async (employee) => {
//     try {
//       const response = await fetch(`http://localhost:3000/api/employees/${employee.employee_id}`);
      
//       if (response.ok) {
//         const empleadoCompleto = await response.json();
        
//         setIsEditing(true);
//         // Cargamos el objeto original con todos los campos separados de la DB en el formulario
//         setFormData(empleadoCompleto); 
//         setMostrarModalForm(true);
//       } else {
//         alert("No se pudieron cargar los datos originales del empleado.");
//       }
//     } catch (error) {
//       console.error("Error al obtener detalles del empleado:", error);
//       alert("Error de conexión al intentar editar.");
//     }
//   };

//   return (
//     <div className="page-container">
//       <div className="header-container">
//         <div className="header-text">
//           <h1>Empleados</h1>
//           <p>Gestión de personal y cargos - Makand</p>
//         </div>

//         <div className="header-actions">
//           <div className="search-container-small">
//             <Search size={18} color="#9ca3af" />
//             <input 
//               type="text" 
//               className="search-input"
//               placeholder="Buscar por nombre, documento, cargo..." 
//               value={busqueda}
//               onChange={(e) => setBusqueda(e.target.value)}
//             />
//           </div>
          
//           <button 
//             className="btn-nuevo"
//             onClick={() => {
//               setIsEditing(false);
//               setFormData({}); 
//               setMostrarModalForm(true);
//             }}
//           >
//             <Plus size={20} />
//             Nuevo Empleado
//           </button>
//         </div>
//       </div>

//       <div className="table-wrapper">
//         <table className="custom-table">
//           <thead>
//             <tr>
//               <th>ID</th>
//               <th>Número de Documento</th>
//               <th>Nombre Completo</th>
//               <th>Correo Electrónico</th>
//               <th>Cargo</th>
//               <th>Estado</th>
//               <th>Gestión</th>
//             </tr>
//           </thead>
//           <tbody>
//             {employeesFiltrados.length > 0 ? (
//               employeesFiltrados.map((employee) => (
//                 <tr key={employee.employee_id}>
//                   <td>#{employee.employee_id}</td>
//                   <td>{employee.employee_document_number}</td>
//                   <td>{employee.employee_full_name}</td>
//                   <td>{employee.employee_email}</td>
//                   <td>
//                     <span className="badge-position">{employee.position_name}</span>
//                   </td>
//                   <td>
//                     {/* Switch interactivo para activar/desactivar el Estado */}
//                     <label className="switch">
//                       <input 
//                         type="checkbox" 
//                         checked={employee.employee_status} 
//                         onChange={() => handleToggleEstado(employee)} 
//                       />
//                       <span className="slider round"></span>
//                     </label>
//                   </td>
//                   <td className="actions-cell">
//                     <button 
//                       type="button"
//                       className="action-btn view" 
//                       title="Ver Detalles" 
//                       onClick={() => { setEmployeeSeleccionado(employee); setMostrarModalDetalle(true); }}
//                     >
//                       <Eye size={18} />
//                     </button>
//                     <button 
//                       type="button"
//                       className="action-btn edit" 
//                       title="Editar" 
//                       onClick={() => prepararEdicion(employee)}
//                     >
//                       <Edit size={18} />
//                     </button>
//                     <button 
//                       type="button"
//                       className="action-btn delete" 
//                       title="Eliminar" 
//                       onClick={() => eliminarEmpleado(employee.employee_id)}
//                     >
//                       <Trash2 size={18} />
//                     </button>
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="7" className="empty-row" style={{ textAlign: 'center', padding: '40px' }}>
//                   No se encontraron coincidencias para "{busqueda}"
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       <EmployeeForm 
//         isOpen={mostrarModalForm} 
//         onClose={async () => { setMostrarModalForm(false); await cargarEmpleados(); }}
//         formData={formData}
//         setFormData={setFormData}
//         isEditing={isEditing}
//       />
      
//       <EmployeeDetail 
//         isOpen={mostrarModalDetalle}
//         onClose={() => setMostrarModalDetalle(false)}
//         empleado={employeeSeleccionado}
//         onEdit={(empleado) => {
//           setMostrarModalDetalle(false);
//           prepararEdicion(empleado);
//         }}
//       />
//     </div>
//   );
// };

// export default EmployeePage;

















import { useState, useMemo, useEffect } from 'react';
import { Plus, Search, Eye, Edit, Trash2 } from 'lucide-react';
import { useEmployees } from '../hooks/useEmployees'; 
import EmployeeForm from '../components/employeeForm/EmployeeForm';
import EmployeeDetail from '../components/employeeDetail/EmployeeDetail';
import './EmployeePage.css'; 

const EmployeePage = () => {
  const { employees, cargarEmpleados, eliminarEmpleado } = useEmployees();
  const [busqueda, setBusqueda] = useState('');
  const [formData, setFormData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [mostrarModalForm, setMostrarModalForm] = useState(false);
  const [mostrarModalDetalle, setMostrarModalDetalle] = useState(false);
  const [employeeSeleccionado, setEmployeeSeleccionado] = useState(null);

  useEffect(() => {
    cargarEmpleados();
  }, [cargarEmpleados]);

  // Cambiar el estado booleano del empleado de forma limpia y segura
  const handleToggleEstado = async (employee) => {
    const nuevoEstado = !employee.employee_status;
    const accion = nuevoEstado ? 'ACTIVAR' : 'DESACTIVAR';
    const mensaje = `¿Estás seguro de que deseas ${accion} al empleado ${employee.employee_full_name || ''}?`;
    
    if (window.confirm(mensaje)) {
      try {
        // 1. Obtenemos el registro completo del empleado desde la API
        const getResponse = await fetch(`http://localhost:3000/api/employees/${employee.employee_id}`);
        if (!getResponse.ok) {
          alert("No se pudieron obtener los datos completos del empleado para actualizar su estado.");
          return;
        }
        const empleadoCompleto = await getResponse.json();

        // 2. Modificamos únicamente la propiedad del estado
        const empleadoActualizado = {
          ...empleadoCompleto,
          employee_status: nuevoEstado
        };

        // 3. Enviamos el registro completo para evitar errores de validación por campos obligatorios faltantes
        const response = await fetch(`http://localhost:3000/api/employees/${employee.employee_id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(empleadoActualizado)
        });

        if (response.ok) {
          await cargarEmpleados();
        } else {
          const resultado = await response.json();
          alert(resultado.error || "No se pudo actualizar el estado del empleado.");
        }
      } catch (error) {
        console.error("Error al cambiar estado:", error);
        alert("Error de conexión con el servidor.");
      }
    }
  };

  // Filtrado optimizado utilizando los campos que vienen de la ruta /table
  const employeesFiltrados = useMemo(() => {
    const datos = Array.isArray(employees) ? employees : [];
    const termino = busqueda.toLowerCase();
    
    return datos.filter(e => {
      const nombreCompleto = `${e.employee_full_name || ''}`.toLowerCase();
      const documento = e.employee_document_number?.toString() || '';
      const correo = e.employee_email?.toLowerCase() || '';
      const cargo = e.position_name?.toLowerCase() || '';
      
      return nombreCompleto.includes(termino) || 
             documento.includes(termino) || 
             correo.includes(termino) ||
             cargo.includes(termino);
    });
  }, [employees, busqueda]);

  // Prepara los datos buscando el registro original e individual directamente de la API
  const prepararEdicion = async (employee) => {
    try {
      const response = await fetch(`http://localhost:3000/api/employees/${employee.employee_id}`);
      
      if (response.ok) {
        const empleadoCompleto = await response.json();
        
        setIsEditing(true);
        // Cargamos el objeto original con todos los campos separados de la DB en el formulario
        setFormData(empleadoCompleto); 
        setMostrarModalForm(true);
      } else {
        alert("No se pudieron cargar los datos originales del empleado.");
      }
    } catch (error) {
      console.error("Error al obtener detalles del empleado:", error);
      alert("Error de conexión al intentar editar.");
    }
  };

  return (
    <div className="page-container">
      <div className="header-container">
        <div className="header-text">
          <h1>Empleados</h1>
          <p>Gestión de personal y cargos - Makand</p>
        </div>

        <div className="header-actions">
          <div className="search-container-small">
            <Search size={18} color="#9ca3af" />
            <input 
              type="text" 
              className="search-input"
              placeholder="Buscar por nombre, documento, cargo..." 
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
            Nuevo Empleado
          </button>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="custom-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Número de Documento</th>
              <th>Nombre Completo</th>
              <th>Correo Electrónico</th>
              <th>Cargo</th>
              <th>Estado</th>
              <th>Gestión</th>
            </tr>
          </thead>
          <tbody>
            {employeesFiltrados.length > 0 ? (
              employeesFiltrados.map((employee) => (
                <tr key={employee.employee_id}>
                  <td>#{employee.employee_id}</td>
                  <td>{employee.employee_document_number}</td>
                  <td>{employee.employee_full_name}</td>
                  <td>{employee.employee_email}</td>
                  <td>
                    <span className="badge-position">{employee.position_name}</span>
                  </td>
                  <td>
                    {/* Switch interactivo para activar/desactivar el Estado */}
                    <label className="switch">
                      <input 
                        type="checkbox" 
                        checked={employee.employee_status} 
                        onChange={() => handleToggleEstado(employee)} 
                      />
                      <span className="slider round"></span>
                    </label>
                  </td>
                  <td className="actions-cell">
                    <button 
                      type="button"
                      className="action-btn view" 
                      title="Ver Detalles" 
                      onClick={() => { setEmployeeSeleccionado(employee); setMostrarModalDetalle(true); }}
                    >
                      <Eye size={18} />
                    </button>
                    <button 
                      type="button"
                      className="action-btn edit" 
                      title="Editar" 
                      onClick={() => prepararEdicion(employee)}
                    >
                      <Edit size={18} />
                    </button>
                    <button 
                      type="button"
                      className="action-btn delete" 
                      title="Eliminar" 
                      onClick={() => eliminarEmpleado(employee.employee_id)}
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="empty-row" style={{ textAlign: 'center', padding: '40px' }}>
                  No se encontraron coincidencias para "{busqueda}"
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <EmployeeForm 
        isOpen={mostrarModalForm} 
        onClose={async () => { setMostrarModalForm(false); await cargarEmpleados(); }}
        formData={formData}
        setFormData={setFormData}
        isEditing={isEditing}
      />
      
      <EmployeeDetail 
        isOpen={mostrarModalDetalle}
        onClose={() => setMostrarModalDetalle(false)}
        empleado={employeeSeleccionado}
        onEdit={(empleado) => {
          setMostrarModalDetalle(false);
          prepararEdicion(empleado);
        }}
      />
    </div>
  );
};

export default EmployeePage;
