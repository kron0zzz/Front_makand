// // src/features/purchase_invoices/components/PurchaseInvoiceForm/PurchaseInvoiceForm.jsx
// import { useState, useEffect } from 'react';
// import { purchaseInvoiceService } from '../../services/purchaseInvoiceService';
// import './PurchaseInvoiceForm.css';

// const PurchaseInvoiceForm = ({ isOpen, onClose, formData, setFormData, isEditing }) => {
//   const [suppliers, setSuppliers] = useState([]);
//   const [error, setError] = useState('');
//   const [cargando, setCargando] = useState(false);

//   // Cargar proveedores para el selector dropdown
//   useEffect(() => {
//     const cargarProveedores = async () => {
//       try {
//         const response = await fetch('http://localhost:3000/api/suppliers');
//         if (response.ok) {
//           const data = await response.json();
//           setSuppliers(data);
//         }
//       } catch (err) {
//         console.error("Error al cargar proveedores:", err);
//       }
//     };

//     if (isOpen) {
//       cargarProveedores();
//     }
//   }, [isOpen]);

//   if (!isOpen) return null;

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: name === 'supplier_id' ? parseInt(value, 10) : value
//     });
//   };

//   // Lector de archivos para codificación a Base64
//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setFormData(prev => ({
//           ...prev,
//           invoice_photo: reader.result
//         }));
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     setCargando(true);

//     try {
//       if (isEditing) {
//         await purchaseInvoiceService.actualizar(formData.invoice_id, formData);
//       } else {
//         await purchaseInvoiceService.crear(formData);
//       }
//       onClose();
//     } catch (err) {
//       console.error(err);
//       setError(err.response?.data?.error || 'Error al procesar la solicitud.');
//     } finally {
//       setCargando(false);
//     }
//   };

//   return (
//     <div className="form-modal-overlay">
//       <div className="form-modal-container">
//         <div className="form-header">
//           <h2>{isEditing ? 'Editar Factura de Compra' : 'Registrar Nueva Factura'}</h2>
//           <button className="form-close-btn" onClick={onClose}>&times;</button>
//         </div>

//         {error && <div className="modal-error-message">{error}</div>}

//         <form onSubmit={handleSubmit} className="form-body">
//           <div className="form-grid">
            
//             {/* Proveedor */}
//             <div className="form-group">
//               <label className="form-label">Proveedor *</label>
//               <select
//                 name="supplier_id"
//                 className="form-input"
//                 value={formData.supplier_id || ''}
//                 onChange={handleChange}
//                 required
//               >
//                 <option value="">Seleccione un proveedor...</option>
//                 {suppliers.map((sup) => (
//                   <option key={sup.supplier_id} value={sup.supplier_id}>
//                     {sup.supplier_name}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {/* Fecha de compra */}
//             <div className="form-group">
//               <label className="form-label">Fecha de Compra *</label>
//               <input
//                 type="date"
//                 name="purchase_date"
//                 className="form-input"
//                 value={formData.purchase_date ? formData.purchase_date.substring(0, 10) : ''}
//                 onChange={handleChange}
//                 required
//               />
//             </div>

//             {/* Maquinaria */}
//             <div className="form-group">
//               <label className="form-label">Nombre de la Maquinaria *</label>
//               <input
//                 type="text"
//                 name="machinery_name"
//                 className="form-input"
//                 value={formData.machinery_name || ''}
//                 onChange={handleChange}
//                 placeholder="Ej: Andamio Colgante 6m"
//                 required
//               />
//             </div>

//             {/* Foto de la factura */}
//             <div className="form-group">
//               <label className="form-label">Foto / Imagen de Factura</label>
//               <input
//                 type="file"
//                 accept="image/*"
//                 className="form-input"
//                 onChange={handleFileChange}
//               />
//               {formData.invoice_photo && (
//                 <div style={{ marginTop: '8px' }}>
//                   <span className="label-text">Vista previa seleccionada:</span>
//                   <img 
//                     src={formData.invoice_photo} 
//                     alt="Previsualización" 
//                     style={{ display: 'block', width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px', marginTop: '4px', border: '1px solid #e2e8f0' }} 
//                   />
//                 </div>
//               )}
//             </div>

//           </div>

//           <div className="form-footer">
//             <button type="button" className="btn-cancel" onClick={onClose} disabled={cargando}>
//               Cancelar
//             </button>
//             <button type="submit" className="btn-submit" disabled={cargando}>
//               {cargando ? 'Procesando...' : isEditing ? 'Guardar Cambios' : 'Registrar'}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default PurchaseInvoiceForm;







// src/features/purchase_invoices/components/PurchaseInvoiceForm/PurchaseInvoiceForm.jsx
import { useState, useEffect } from 'react';
import { purchaseInvoiceService } from '../../services/purchaseInvoiceService';
import './PurchaseInvoiceForm.css';

const PurchaseInvoiceForm = ({ isOpen, onClose, formData, setFormData, isEditing }) => {
  const [suppliers, setSuppliers] = useState([]);
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  // 🌟 Cargar proveedores enviando el token de autenticación
  useEffect(() => {
    const cargarProveedores = async () => {
      try {
        // Recuperamos el token de seguridad que guardaste al iniciar sesión
        const token = localStorage.getItem('token'); 
        
        const response = await fetch('http://localhost:3000/api/suppliers', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // <- Esto es lo que le da permiso de entrar al backend
          }
        });

        if (response.ok) {
          const data = await response.json();
          setSuppliers(data);
        } else {
          console.error("Error en la respuesta de proveedores:", response.status);
        }
      } catch (err) {
        console.error("Error al conectar con la API de proveedores:", err);
      }
    };

    if (isOpen) {
      cargarProveedores();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'supplier_id' ? parseInt(value, 10) : value
    });
  };

  // Lector de archivos para codificación a Base64
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          invoice_photo: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setCargando(true);

    try {
      if (isEditing) {
        await purchaseInvoiceService.actualizar(formData.invoice_id, formData);
      } else {
        await purchaseInvoiceService.crear(formData);
      }
      onClose();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Error al procesar la solicitud.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="form-modal-overlay">
      <div className="form-modal-container">
        <div className="form-header">
          <h2>{isEditing ? 'Editar Factura de Compra' : 'Registrar Nueva Factura'}</h2>
          <button className="form-close-btn" onClick={onClose}>&times;</button>
        </div>

        {error && <div className="modal-error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="form-body">
          <div className="form-grid">
            
            {/* Proveedor */}
            <div className="form-group">
              <label className="form-label">Proveedor *</label>
              <select
                name="supplier_id"
                className="form-input"
                value={formData.supplier_id || ''}
                onChange={handleChange}
                required
              >
                <option value="">Seleccione un proveedor...</option>
                {suppliers.map((sup) => (
                  <option key={sup.supplier_id} value={sup.supplier_id}>
                    {sup.supplier_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Fecha de compra */}
            <div className="form-group">
              <label className="form-label">Fecha de Compra *</label>
              <input
                type="date"
                name="purchase_date"
                className="form-input"
                value={formData.purchase_date ? formData.purchase_date.substring(0, 10) : ''}
                onChange={handleChange}
                required
              />
            </div>

            {/* Maquinaria */}
            <div className="form-group">
              <label className="form-label">Nombre de la Maquinaria *</label>
              <input
                type="text"
                name="machinery_name"
                className="form-input"
                value={formData.machinery_name || ''}
                onChange={handleChange}
                placeholder="Ej: Andamio Colgante 6m"
                required
              />
            </div>

            {/* Foto de la factura */}
            <div className="form-group">
              <label className="form-label">Foto / Imagen de Factura</label>
              <input
                type="file"
                accept="image/*"
                className="form-input"
                onChange={handleFileChange}
              />
              {formData.invoice_photo && (
                <div style={{ marginTop: '8px' }}>
                  <span className="label-text">Vista previa seleccionada:</span>
                  <img 
                    src={formData.invoice_photo} 
                    alt="Previsualización" 
                    style={{ display: 'block', width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px', marginTop: '4px', border: '1px solid #e2e8f0' }} 
                  />
                </div>
              )}
            </div>

          </div>

          <div className="form-footer">
            <button type="button" className="btn-cancel" onClick={onClose} disabled={cargando}>
              Cancelar
            </button>
            <button type="submit" className="btn-submit" disabled={cargando}>
              {cargando ? 'Procesando...' : isEditing ? 'Guardar Cambios' : 'Registrar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PurchaseInvoiceForm;