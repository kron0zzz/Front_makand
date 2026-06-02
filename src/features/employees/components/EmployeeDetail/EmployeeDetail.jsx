// import { Shield, Mail, Phone, Heart, Briefcase, CreditCard } from 'lucide-react';
// import './EmployeeDetail.css'; 
// const EmployeeDetail = ({ isOpen, onClose, empleado, onEdit }) => {
//   if (!isOpen || !empleado) return null;

//   return ( 
//     <div className="modal-overlay">
//       <div className="modal-content detail-modal">
//         <div className="modal-header">
//           <h2>Detalles del Empleado</h2>
//           <button className="close-btn" onClick={onClose}>&times;</button>
//         </div>

//         <div className="modal-body detail-body">
//           {/* Encabezado con Nombre Completo y Estado */}
//           <div className="detail-profile-header">
//             <div className="profile-avatar">
//               {empleado.employee_first_name?.[0]?.toUpperCase()}
//               {empleado.employee_last_name?.[0]?.toUpperCase()}
//             </div>
//             <div className="profile-info">
//               <h3>{empleado.employee_full_name || `${empleado.employee_first_name} ${empleado.employee_last_name}`}</h3>
//               <span className={`status-badge ${empleado.employee_status ? 'active' : 'inactive'}`}>
//                 {empleado.employee_status ? 'Activo' : 'Inactivo'}
//               </span>
//             </div>
//           </div>

//           <hr className="detail-divider" />

//           {/* Cuadrícula de Información del Empleado */}
//           <div className="detail-grid">
            
//             {/* Identificación */}
//             <div className="detail-item">
//               <div className="detail-icon-wrapper">
//                 <CreditCard size={20} color="#4b5563" />
//               </div>
//               <div className="detail-text">
//                 <span className="detail-label">Identificación</span>
//                 <span className="detail-value">
//                   {empleado.employee_document_type} - {empleado.employee_document_number}
//                 </span>
//               </div>
//             </div>

//             {/* Cargo / Posición */}
//             <div className="detail-item">
//               <div className="detail-icon-wrapper">
//                 <Briefcase size={20} color="#4b5563" />
//               </div>
//               <div className="detail-text">
//                 <span className="detail-label">Cargo Ocupacional</span>
//                 <span className="detail-value">{empleado.position_name || `ID Cargo: ${empleado.position_id}`}</span>
//               </div>
//             </div>

//             {/* Correo Electrónico */}
//             <div className="detail-item">
//               <div className="detail-icon-wrapper">
//                 <Mail size={20} color="#4b5563" />
//               </div>
//               <div className="detail-text">
//                 <span className="detail-label">Correo Electrónico</span>
//                 <span className="detail-value">{empleado.employee_email}</span>
//               </div>
//             </div>

//             {/* Teléfono */}
//             <div className="detail-item">
//               <div className="detail-icon-wrapper">
//                 <Phone size={20} color="#4b5563" />
//               </div>
//               <div className="detail-text">
//                 <span className="detail-label">Teléfono de Contacto</span>
//                 <span className="detail-value">{empleado.employee_phone}</span>
//               </div>
//             </div>

//             {/* EPS */}
//             <div className="detail-item">
//               <div className="detail-icon-wrapper">
//                 <Heart size={20} color="#4b5563" />
//               </div>
//               <div className="detail-text">
//                 <span className="detail-label">Entidad de Salud (EPS)</span>
//                 <span className="detail-value">{empleado.employee_eps}</span>
//               </div>
//             </div>

//             {/* ID Interno de Registro */}
//             <div className="detail-item">
//               <div className="detail-icon-wrapper">
//                 <Shield size={20} color="#4b5563" />
//               </div>
//               <div className="detail-text">
//                 <span className="detail-label">ID Sistema</span>
//                 <span className="detail-value">#{empleado.employee_id}</span>
//               </div>
//             </div>

//           </div>
//         </div>

//         <div className="modal-actions detail-actions">
//           <button type="button" className="btn-cancelar" onClick={onClose}>
//             Cerrar
//           </button>
//           <button 
//             type="button" 
//             className="btn-guardar" 
//             onClick={() => onEdit(empleado)}
//           >
//             Editar Información
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EmployeeDetail;











import { Shield, Mail, Phone, Heart, Briefcase, CreditCard } from 'lucide-react';
import './EmployeeDetail.css'; 

const EmployeeDetail = ({ isOpen, onClose, empleado, onEdit }) => {
  if (!isOpen || !empleado) return null;

  return ( 
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>Detalles del Empleado</h2>
          <button className="close-button" onClick={onClose}>&times;</button>
        </div>

        <div className="modal-content">
          {/* Encabezado con Nombre Completo y Estado */}
          <div className="user-avatar-section">
            <div className="avatar-icon-wrapper">
              {empleado.employee_first_name?.[0]?.toUpperCase()}
              {empleado.employee_last_name?.[0]?.toUpperCase()}
            </div>
            <div>
              <h3 className="value-text value-text-large" style={{ margin: '0 0 4px 0' }}>
                {empleado.employee_full_name || `${empleado.employee_first_name} ${empleado.employee_last_name}`}
              </h3>
              <span className={`status-badge ${empleado.employee_status ? 'status-active' : 'status-inactive'}`}>
                {empleado.employee_status ? 'Activo' : 'Inactivo'}
              </span>
            </div>
          </div>

          <br />

          {/* Cuadrícula de Información del Empleado */}
          <div className="detail-grid">
            
            {/* Identificación */}
            <div>
              <div className="info-item-header">
                <CreditCard size={16} className="doc-type-tag" />
                <span className="label-text">Identificación</span>
              </div>
              <span className="value-text">
                {empleado.employee_document_type} - {empleado.employee_document_number}
              </span>
            </div>

            {/* Cargo / Posición */}
            <div>
              <div className="info-item-header">
                <Briefcase size={16} style={{ color: '#ff6b35' }} />
                <span className="label-text">Cargo Ocupacional</span>
              </div>
              <span className="value-text">
                {empleado.position_name || `ID Cargo: ${empleado.position_id}`}
              </span>
            </div>

            {/* Correo Electrónico */}
            <div>
              <div className="info-item-header">
                <Mail size={16} style={{ color: '#ff6b35' }} />
                <span className="label-text">Correo Electrónico</span>
              </div>
              <span className="value-text" style={{ wordBreak: 'break-all' }}>
                {empleado.employee_email}
              </span>
            </div>

            {/* Teléfono */}
            <div>
              <div className="info-item-header">
                <Phone size={16} style={{ color: '#ff6b35' }} />
                <span className="label-text">Teléfono de Contacto</span>
              </div>
              <span className="value-text">{empleado.employee_phone}</span>
            </div>

            {/* EPS */}
            <div>
              <div className="info-item-header">
                <Heart size={16} style={{ color: '#ff6b35' }} />
                <span className="label-text">Entidad de Salud (EPS)</span>
              </div>
              <span className="value-text">{empleado.employee_eps}</span>
            </div>

            {/* ID Interno de Registro */}
            <div>
              <div className="info-item-header">
                <Shield size={16} style={{ color: '#ff6b35' }} />
                <span className="label-text">ID Sistema</span>
              </div>
              <span className="value-text">#{empleado.employee_id}</span>
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
              onClick={() => onEdit(empleado)}
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