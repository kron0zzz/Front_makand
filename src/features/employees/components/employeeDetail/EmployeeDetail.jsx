// import { useState, useEffect } from 'react';
// import { Shield, Mail, Phone, Heart, Briefcase, CreditCard } from 'lucide-react';
// import './EmployeeDetail.css'; 

// const EmployeeDetail = ({ isOpen, onClose, empleado, onEdit }) => {
//   const [empleadoCompleto, setEmpleadoCompleto] = useState(null);
//   const [cargando, setCargando] = useState(false);

//   useEffect(() => {
//     const cargarDetalleCompleto = async () => {
//       if (!isOpen || !empleado?.employee_id) return;
//       setCargando(true);
//       try {
//         const response = await fetch(`http://localhost:3000/api/employees/${empleado.employee_id}`);
//         if (response.ok) {
//           const data = await response.json();
//           setEmpleadoCompleto(data);
//         } else {
//           console.error("No se pudieron cargar los detalles completos del empleado.");
//           setEmpleadoCompleto(empleado); // Fallback al simplificado
//         }
//       } catch (error) {
//         console.error("Error de red al cargar detalles:", error);
//         setEmpleadoCompleto(empleado);
//       } finally {
//         setCargando(false);
//       }
//     };

//     if (isOpen) {
//       cargarDetalleCompleto();
//     } else {
//       setEmpleadoCompleto(null); // Resetear estado cuando el modal se cierre
//     }
//   }, [isOpen, empleado]);

//   if (!isOpen || !empleado) return null;

//   // Usamos los datos completos si ya cargaron, de lo contrario usamos los simplificados
//   const datos = empleadoCompleto || empleado;

//   // Calculamos las iniciales del avatar de forma segura
//   const obtenerIniciales = () => {
//     if (datos.employee_first_name && datos.employee_last_name) {
//       return `${datos.employee_first_name[0]}${datos.employee_last_name[0]}`.toUpperCase();
//     }
//     return datos.employee_full_name?.substring(0, 2).toUpperCase() || 'EM';
//   };

//   return ( 
//     <div className="modal-overlay">
//       <div className="modal-container">
//         <div className="modal-header">
//           <h2>Detalles del Empleado</h2>
//           <button className="close-button" onClick={onClose} aria-label="Cerrar">&times;</button>
//         </div>

//         <div className="modal-content">
//           {/* Encabezado con Nombre Completo y Estado */}
//           <div className="user-avatar-section">
//             <div className="avatar-icon-wrapper" style={{ fontSize: '1.25rem', fontWeight: '700' }}>
//               {obtenerIniciales()}
//             </div>
//             <div>
//               <h3 className="value-text value-text-large" style={{ margin: '0 0 4px 0' }}>
//                 {datos.employee_full_name || `${datos.employee_first_name} ${datos.employee_last_name}`}
//               </h3>
//               <span className={`status-badge status-${datos.employee_status ? 'active' : 'inactive'}`}>
//                 {datos.employee_status ? 'Activo' : 'Inactivo'}
//               </span>
//             </div>
//           </div>

//           <br />

//           {/* Cuadrícula de Información del Empleado */}
//           <div className="detail-grid">
            
//             {/* Identificación */}
//             <div className="info-card">
//               <div className="info-item-header">
//                 <CreditCard size={16} />
//                 <span className="label-text">Identificación</span>
//               </div>
//               <span className="value-text">
//                 {cargando ? 'Cargando...' : `${datos.employee_document_type || ''} - ${datos.employee_document_number}`}
//               </span>
//             </div>

//             {/* Cargo / Posición */}
//             <div className="info-card">
//               <div className="info-item-header">
//                 <Briefcase size={16} />
//                 <span className="label-text">Cargo Ocupacional</span>
//               </div>
//               <span className="value-text">
//                 {datos.position_name || `ID Cargo: ${datos.position_id}`}
//               </span>
//             </div>

//             {/* Correo Electrónico */}
//             <div className="info-card">
//               <div className="info-item-header">
//                 <Mail size={16} />
//                 <span className="label-text">Correo Electrónico</span>
//               </div>
//               <span className="value-text" style={{ wordBreak: 'break-all' }}>
//                 {datos.employee_email}
//               </span>
//             </div>

//             {/* Teléfono */}
//             <div className="info-card">
//               <div className="info-item-header">
//                 <Phone size={16} />
//                 <span className="label-text">Teléfono de Contacto</span>
//               </div>
//               <span className="value-text">
//                 {cargando ? 'Cargando...' : (datos.employee_phone || 'No registrado')}
//               </span>
//             </div>

//             {/* EPS */}
//             <div className="info-card">
//               <div className="info-item-header">
//                 <Heart size={16} />
//                 <span className="label-text">Entidad de Salud (EPS)</span>
//               </div>
//               <span className="value-text">
//                 {cargando ? 'Cargando...' : (datos.employee_eps || 'No registrada')}
//               </span>
//             </div>

//             {/* ID Interno de Registro */}
//             <div className="info-card">
//               <div className="info-item-header">
//                 <Shield size={16} />
//                 <span className="label-text">ID Sistema</span>
//               </div>
//               <span className="value-text">#{datos.employee_id}</span>
//             </div>

//           </div>

//           {/* Botones de acción inferiores */}
//           <div className="action-buttons">
//             <button type="button" className="btn-secondary" onClick={onClose}>
//               Cerrar
//             </button>
//             <button 
//               type="button" 
//               className="btn-primary" 
//               onClick={() => onEdit(datos)}
//               disabled={cargando}
//             >
//               Editar Información
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EmployeeDetail;












import { useState, useEffect } from 'react';
import { Shield, Mail, Phone, Heart, Briefcase, CreditCard } from 'lucide-react';
import './EmployeeDetail.css'; 

const EmployeeDetail = ({ isOpen, onClose, empleado, onEdit }) => {
  const [empleadoCompleto, setEmpleadoCompleto] = useState(null);
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    const cargarDetalleCompleto = async () => {
      if (!isOpen || !empleado?.employee_id) return;
      setCargando(true);
      try {
        const response = await fetch(`http://localhost:3000/api/employees/${empleado.employee_id}`);
        if (response.ok) {
          const data = await response.json();
          setEmpleadoCompleto(data);
        } else {
          console.error("No se pudieron cargar los detalles completos del empleado.");
          setEmpleadoCompleto(empleado); // Fallback al simplificado si falla
        }
      } catch (error) {
        console.error("Error de red al cargar detalles:", error);
        setEmpleadoCompleto(empleado);
      } finally {
        setCargando(false);
      }
    };

    if (isOpen) {
      cargarDetalleCompleto();
    } else {
      setEmpleadoCompleto(null); // Resetear estado al cerrar el modal
    }
  }, [isOpen, empleado]);

  if (!isOpen || !empleado) return null;

  // Usamos los datos completos si ya cargaron, de lo contrario usamos los simplificados
  const datos = empleadoCompleto || empleado;

  // Calculamos las iniciales del avatar
  const obtenerIniciales = () => {
    if (datos.employee_first_name && datos.employee_last_name) {
      return `${datos.employee_first_name[0]}${datos.employee_last_name[0]}`.toUpperCase();
    }
    return datos.employee_full_name?.substring(0, 2).toUpperCase() || 'EM';
  };

  return ( 
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>Detalles del Empleado</h2>
          <button className="close-button" onClick={onClose} aria-label="Cerrar">&times;</button>
        </div>

        <div className="modal-content">
          {/* Encabezado con Nombre Completo y Estado */}
          <div className="user-avatar-section">
            <div className="avatar-icon-wrapper" style={{ fontSize: '1.25rem', fontWeight: '700' }}>
              {obtenerIniciales()}
            </div>
            <div>
              <h3 className="value-text value-text-large" style={{ margin: '0 0 4px 0' }}>
                {datos.employee_full_name || `${datos.employee_first_name} ${datos.employee_last_name}`}
              </h3>
              <span className={`status-badge status-${datos.employee_status ? 'active' : 'inactive'}`}>
                {datos.employee_status ? 'Activo' : 'Inactivo'}
              </span>
            </div>
          </div>

          <br />

          {/* Cuadrícula de Información del Empleado */}
          <div className="detail-grid">
            
            {/* Identificación */}
            <div className="info-card">
              <div className="info-item-header">
                <CreditCard size={16} />
                <span className="label-text">Identificación</span>
              </div>
              <span className="value-text">
                {cargando ? 'Cargando...' : `${datos.employee_document_type || ''} - ${datos.employee_document_number}`}
              </span>
            </div>

            {/* Cargo / Posición */}
            <div className="info-card">
              <div className="info-item-header">
                <Briefcase size={16} />
                <span className="label-text">Cargo Ocupacional</span>
              </div>
              <span className="value-text">
                {datos.position_name || `ID Cargo: ${datos.position_id}`}
              </span>
            </div>

            {/* Correo Electrónico */}
            <div className="info-card">
              <div className="info-item-header">
                <Mail size={16} />
                <span className="label-text">Correo Electrónico</span>
              </div>
              <span className="value-text" style={{ wordBreak: 'break-all' }}>
                {datos.employee_email}
              </span>
            </div>

            {/* Teléfono */}
            <div className="info-card">
              <div className="info-item-header">
                <Phone size={16} />
                <span className="label-text">Teléfono de Contacto</span>
              </div>
              <span className="value-text">
                {cargando ? 'Cargando...' : (datos.employee_phone || 'No registrado')}
              </span>
            </div>

            {/* EPS */}
            <div className="info-card">
              <div className="info-item-header">
                <Heart size={16} />
                <span className="label-text">Entidad de Salud (EPS)</span>
              </div>
              <span className="value-text">
                {cargando ? 'Cargando...' : (datos.employee_eps || 'No registrada')}
              </span>
            </div>

            {/* ID Interno de Registro */}
            <div className="info-card">
              <div className="info-item-header">
                <Shield size={16} />
                <span className="label-text">ID Sistema</span>
              </div>
              <span className="value-text">#{datos.employee_id}</span>
            </div>

          </div>

          {/* Botones de acción inferiores */}
          <div className="action-buttons">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cerrar
            </button>
            <button 
              type="button" 
              className="btn-primary" 
              onClick={() => onEdit(datos)}
              disabled={cargando}
            >
              Editar Información
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetail;