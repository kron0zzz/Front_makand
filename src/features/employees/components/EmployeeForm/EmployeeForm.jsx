// import { useState, useEffect } from 'react';
// import './EmployeeForm.css'; 

// const EmployeeForm = ({ isOpen, onClose, formData, setFormData, isEditing }) => {
//   const [positions, setPositions] = useState([]);
//   const [error, setError] = useState('');

//   // 1. Cargar las posiciones/cargos disponibles para el select dinámico
//   useEffect(() => {
//     const cargarPosiciones = async () => {
//       try {
//         const response = await fetch('http://localhost:3000/api/positions');
//         if (response.ok) {
//           const data = await response.json();
//           setPositions(data);
//         }
//       } catch (err) {
//         console.error("Error al cargar los cargos:", err);
//       }
//     };

//     if (isOpen) {
//       cargarPosiciones();
//     }
//   }, [isOpen]);

//   if (!isOpen) return null;

//   // 2. Controlar los cambios en los inputs
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: name === 'position_id' ? parseInt(value) : value
//     });
//   };

//   // 3. Manejar el envío del formulario (Crear o Editar)
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');

//     const url = isEditing
//       ? `http://localhost:3000/api/employees/${formData.employee_id}`
//       : 'http://localhost:3000/api/employees';

//     const method = isEditing ? 'PUT' : 'POST';

//     // Si es creación, por defecto el empleado entra con estado activo (true)
//     const datosAEnviar = isEditing
//       ? formData
//       : { ...formData, employee_status: true };

//     try {
//       const response = await fetch(url, {
//         method,
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(datosAEnviar)
//       });

//       const resultado = await response.json();

//       if (response.ok) {
//         onClose(); // Cierra el modal y refresca la tabla
//       } else {
//         setError(resultado.error || 'Ocurrió un error inesperado al procesar la solicitud.');
//       }
//     } catch (err) {
//       console.error("Error en la petición:", err);
//       setError('Error de conexión con el servidor.');
//     }
//   };

//   return (
//     <div className="modal-overlay">
//       <div className="modal-content">
//         <div className="modal-header">
//           <h2>{isEditing ? 'Editar Empleado' : 'Registrar Nuevo Empleado'}</h2>
//           <button className="close-btn" onClick={onClose}>&times;</button>
//         </div>

//         {error && <div className="modal-error-message">{error}</div>}

//         <form onSubmit={handleSubmit} className="modal-form">
//           <div className="form-grid">
            
//             {/* Tipo de Documento */}
//             <div className="form-group">
//               <label>Tipo de Documento *</label>
//               <select
//                 name="employee_document_type"
//                 value={formData.employee_document_type || ''}
//                 onChange={handleChange}
//                 required
//               >
//                 <option value="">Seleccione...</option>
//                 <option value="CC">Cédula de Ciudadanía</option>
//                 <option value="CE">Cédula de Extranjería</option>
//                 <option value="PPT">Permiso de Protección Temporal</option>
//               </select>
//             </div>

//             {/* Número de Documento */}
//             <div className="form-group">
//               <label>Número de Documento *</label>
//               <input
//                 type="text"
//                 name="employee_document_number"
//                 value={formData.employee_document_number || ''}
//                 onChange={handleChange}
//                 placeholder="Ej: 1023456789"
//                 required
//                 disabled={isEditing} // Comúnmente el documento no se edita por seguridad
//               />
//             </div>

//             {/* Primer Nombre */}
//             <div className="form-group">
//               <label>Primer Nombre *</label>
//               <input
//                 type="text"
//                 name="employee_first_name"
//                 value={formData.employee_first_name || ''}
//                 onChange={handleChange}
//                 placeholder="Ej: Sara"
//                 required
//               />
//             </div>

//             {/* Apellidos */}
//             <div className="form-group">
//               <label>Apellidos *</label>
//               <input
//                 type="text"
//                 name="employee_last_name"
//                 value={formData.employee_last_name || ''}
//                 onChange={handleChange}
//                 placeholder="Ej: Ortiz Higuita"
//                 required
//               />
//             </div>

//             {/* Correo Electrónico */}
//             <div className="form-group">
//               <label>Correo Electrónico *</label>
//               <input
//                 type="email"
//                 name="employee_email"
//                 value={formData.employee_email || ''}
//                 onChange={handleChange}
//                 placeholder="sara@example.com"
//                 required
//               />
//             </div>

//             {/* Teléfono */}
//             <div className="form-group">
//               <label>Teléfono Celular *</label>
//               <input
//                 type="text"
//                 name="employee_phone"
//                 value={formData.employee_phone || ''}
//                 onChange={handleChange}
//                 placeholder="Ej: 3123456789"
//                 required
//               />
//             </div>

//             {/* EPS */}
//             <div className="form-group">
//               <label>EPS *</label>
//               <input
//                 type="text"
//                 name="employee_eps"
//                 value={formData.employee_eps || ''}
//                 onChange={handleChange}
//                 placeholder="Ej: Sura, Sanitas"
//                 required
//               />
//             </div>

//             {/* Cargo / Posición (Select Dinámico) */}
//             <div className="form-group">
//               <label>Cargo Ocupacional *</label>
//               <select
//                 name="position_id"
//                 value={formData.position_id || ''}
//                 onChange={handleChange}
//                 required
//               >
//                 <option value="">Seleccione un cargo...</option>
//                 {positions.map((pos) => (
//                   <option key={pos.position_id} value={pos.position_id}>
//                     {pos.position_name}
//                   </option>
//                 ))}
//               </select>
//             </div>

//           </div>

//           <div className="modal-actions">
//             <button type="button" className="btn-cancelar" onClick={onClose}>
//               Cancelar
//             </button>
//             <button type="submit" className="btn-guardar">
//               {isEditing ? 'Guardar Cambios' : 'Registrar'}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default EmployeeForm;























import { useState, useEffect } from 'react';
import './EmployeeForm.css'; 

const EmployeeForm = ({ isOpen, onClose, formData, setFormData, isEditing }) => {
  const [positions, setPositions] = useState([]);
  const [error, setError] = useState('');

  // 1. Cargar las posiciones/cargos disponibles para el select dinámico
  useEffect(() => {
    const cargarPosiciones = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/positions');
        if (response.ok) {
          const data = await response.json();
          setPositions(data);
        }
      } catch (err) {
        console.error("Error al cargar los cargos:", err);
      }
    };

    if (isOpen) {
      cargarPosiciones();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // 2. Controlar los cambios en los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'position_id' ? parseInt(value) : value
    });
  };

  // 3. Manejar el envío del formulario (Crear o Editar)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const url = isEditing
      ? `http://localhost:3000/api/employees/${formData.employee_id}`
      : 'http://localhost:3000/api/employees';

    const method = isEditing ? 'PUT' : 'POST';

    // Si es creación, por defecto el empleado entra con estado activo (true)
    const datosAEnviar = isEditing
      ? formData
      : { ...formData, employee_status: true };

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datosAEnviar)
      });

      const resultado = await response.json();

      if (response.ok) {
        onClose(); // Cierra el modal y refresca la tabla
      } else {
        setError(resultado.error || 'Ocurrió un error inesperado al procesar la solicitud.');
      }
    } catch (err) {
      console.error("Error en la petición:", err);
      setError('Error de conexión con el servidor.');
    }
  };

  return (
    <div className="form-modal-overlay">
      <div className="form-modal-container">
        <div className="form-header">
          <h2>{isEditing ? 'Editar Empleado' : 'Registrar Nuevo Empleado'}</h2>
          <button className="form-close-btn" onClick={onClose}>&times;</button>
        </div>

        {error && <div className="modal-error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="form-body">
          <div className="form-grid">
            
            {/* Tipo de Documento */}
            <div className="form-group">
              <label className="form-label">Tipo de Documento *</label>
              <select
                name="employee_document_type"
                className="form-input"
                value={formData.employee_document_type || ''}
                onChange={handleChange}
                required
              >
                <option value="">Seleccione...</option>
                <option value="CC">Cédula de Ciudadanía</option>
                <option value="CE">Cédula de Extranjería</option>
                <option value="PPT">Permiso de Protección Temporal</option>
              </select>
            </div>

            {/* Número de Documento */}
            <div className="form-group">
              <label className="form-label">Número de Documento *</label>
              <input
                type="text"
                name="employee_document_number"
                className={isEditing ? "form-input form-input-disabled" : "form-input"}
                value={formData.employee_document_number || ''}
                onChange={handleChange}
                placeholder="Ej: 1023456789"
                required
                disabled={isEditing}
              />
            </div>

            {/* Primer Nombre */}
            <div className="form-group">
              <label className="form-label">Primer Nombre *</label>
              <input
                type="text"
                name="employee_first_name"
                className="form-input"
                value={formData.employee_first_name || ''}
                onChange={handleChange}
                placeholder="Ej: Sara"
                required
              />
            </div>

            {/* Apellidos */}
            <div className="form-group">
              <label className="form-label">Apellidos *</label>
              <input
                type="text"
                name="employee_last_name"
                className="form-input"
                value={formData.employee_last_name || ''}
                onChange={handleChange}
                placeholder="Ej: Ortiz Higuita"
                required
              />
            </div>

            {/* Correo Electrónico */}
            <div className="form-group">
              <label className="form-label">Correo Electrónico *</label>
              <input
                type="email"
                name="employee_email"
                className="form-input"
                value={formData.employee_email || ''}
                onChange={handleChange}
                placeholder="sara@example.com"
                required
              />
            </div>

            {/* Teléfono */}
            <div className="form-group">
              <label className="form-label">Teléfono Celular *</label>
              <input
                type="text"
                name="employee_phone"
                className="form-input"
                value={formData.employee_phone || ''}
                onChange={handleChange}
                placeholder="Ej: 3123456789"
                required
              />
            </div>

            {/* EPS */}
            <div className="form-group">
              <label className="form-label">EPS *</label>
              <input
                type="text"
                name="employee_eps"
                className="form-input"
                value={formData.employee_eps || ''}
                onChange={handleChange}
                placeholder="Ej: Sura, Sanitas"
                required
              />
            </div>

            {/* Cargo / Posición (Select Dinámico) */}
            <div className="form-group">
              <label className="form-label">Cargo Ocupacional *</label>
              <select
                name="position_id"
                className="form-input"
                value={formData.position_id || ''}
                onChange={handleChange}
                required
              >
                <option value="">Seleccione un cargo...</option>
                {positions.map((pos) => (
                  <option key={pos.position_id} value={pos.position_id}>
                    {pos.position_name}
                  </option>
                ))}
              </select>
            </div>

          </div>

          <div className="form-footer">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn-submit">
              {isEditing ? 'Guardar Cambios' : 'Registrar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeForm;