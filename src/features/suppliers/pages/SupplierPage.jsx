// import { useState, useMemo, useEffect } from 'react';
// import { Plus, Search, Eye, Edit, Trash2 } from 'lucide-react';
// import { useSuppliers } from '../hooks/useSuppliers'; 
// import SupplierForm from '../components/supplierForm/SupplierForm';
// import SupplierDetail from '../components/supplierDetail/SupplierDetail';
// import './SupplierPage.css';

// const SupplierPage = () => {
//   const { suppliers, cargarProveedores, eliminarProveedor, toggleProveedorEstado } = useSuppliers();
//   const [busqueda, setBusqueda] = useState('');
//   const [formData, setFormData] = useState({});
//   const [isEditing, setIsEditing] = useState(false);
//   const [mostrarModalForm, setMostrarModalForm] = useState(false);
//   const [mostrarModalDetalle, setMostrarModalDetalle] = useState(false);
//   const [supplierSeleccionado, setSupplierSeleccionado] = useState(null);

//   useEffect(() => {
//     cargarProveedores();
//   }, [cargarProveedores]);

//   const suppliersFiltrados = useMemo(() => {
//     const datos = Array.isArray(suppliers) ? suppliers : [];
//     return datos.filter(s => 
//       s.supplier_name.toLowerCase().includes(busqueda.toLowerCase()) || 
//       (s.document_number && s.document_number.toString().includes(busqueda))
//     );
//   }, [suppliers, busqueda]);

//   return (
//     <div className="page-container">
//       <div className="header-container">
//         <div className="header-text">
//           <h1>Proveedores</h1>
//           <p>Gestión de proveedores - Makand</p>
//         </div>
//         <div className="header-actions">
//           <div className="search-container-small">
//             <Search size={18} color="#9ca3af" />
//             <input 
//               type="text" 
//               className="search-input" 
//               placeholder="Buscar..." 
//               value={busqueda} 
//               onChange={(e) => setBusqueda(e.target.value)} 
//             />
//           </div>
//           <button className="btn-nuevo" onClick={() => { setIsEditing(false); setFormData({}); setMostrarModalForm(true); }}>
//             <Plus size={20} /> Nuevo Proveedor
//           </button>
//         </div>
//       </div>

//       <div className="table-wrapper">
//         <table className="custom-table">
//           <thead>
//             <tr>
//               <th>ID</th><th>Número de documento</th><th>Nombre</th><th>Ciudad</th><th>Estado</th><th>Gestión</th>
//             </tr>
//           </thead>
//           <tbody>
//             {suppliersFiltrados.map((s) => (
//               <tr key={s.supplier_id}>
//                 <td>#{s.supplier_id}</td>
//                 <td>{s.document_number}</td>
//                 <td>{s.supplier_name}</td>
//                 <td>{s.supplier_city}</td>
//                 <td>
//                   <label className="switch">
//                     <input 
//                       type="checkbox" 
//                       checked={!!s.supplier_status} 
//                       // Pasamos 's' (proveedor completo) para el backend
//                       onChange={() => toggleProveedorEstado(s.supplier_id, s.supplier_status, s)} 
//                     />
//                     <span className="slider round"></span>
//                   </label>
//                 </td>
//                 <td className="actions-cell">
//                   <button className="action-btn view" onClick={() => { setSupplierSeleccionado(s); setMostrarModalDetalle(true); }}><Eye size={18} /></button>
//                   <button className="action-btn edit" onClick={() => { setIsEditing(true); setFormData(s); setMostrarModalForm(true); }}><Edit size={18} /></button>
//                   <button className="action-btn delete" onClick={() => eliminarProveedor(s.supplier_id)}><Trash2 size={18} /></button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       <SupplierForm isOpen={mostrarModalForm} onClose={() => { setMostrarModalForm(false); cargarProveedores(); }} formData={formData} setFormData={setFormData} isEditing={isEditing} />
//       <SupplierDetail 
//       isOpen={mostrarModalDetalle} 
//       onClose={() => setMostrarModalDetalle(false)} 
//       proveedor={supplierSeleccionado}
//       onEdit={(prov) => {
//         setMostrarModalDetalle(false); 
//         setIsEditing(true);            
//         setFormData(prov);             
//         setMostrarModalForm(true);     
//       }}
// />
//     </div>
//   );
// };

// export default SupplierPage;


import { useState, useMemo, useEffect } from 'react';
import { Plus, Search, Eye, Edit, Trash2 } from 'lucide-react';
import { useSuppliers } from '../hooks/useSuppliers'; 
import { useAuth } from "../../../shared/context/AuthContext";
import SupplierForm from '../components/supplierForm/SupplierForm';
import SupplierDetail from '../components/supplierDetail/SupplierDetail';
import './SupplierPage.css';

const SupplierPage = () => {
  const { suppliers, cargarProveedores, eliminarProveedor, toggleProveedorEstado } = useSuppliers();
  const { hasPermission } = useAuth();
  const [busqueda, setBusqueda] = useState('');
  const [formData, setFormData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [mostrarModalForm, setMostrarModalForm] = useState(false);
  const [mostrarModalDetalle, setMostrarModalDetalle] = useState(false);
  const [supplierSeleccionado, setSupplierSeleccionado] = useState(null);

  useEffect(() => {
    cargarProveedores();
  }, [cargarProveedores]);

  const suppliersFiltrados = useMemo(() => {
    const datos = Array.isArray(suppliers) ? suppliers : [];
    return datos.filter(s => 
      s.supplier_name.toLowerCase().includes(busqueda.toLowerCase()) || 
      (s.document_number && s.document_number.toString().includes(busqueda))
    );
  }, [suppliers, busqueda]);

  return (
    <div className="page-container">
      <div className="header-container">
        <div className="header-text">
          <h1>Proveedores</h1>
          <p>Gestión de proveedores - Makand</p>
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
          
          {hasPermission('Crear Proveedor') && (
            <button className="btn-nuevo" onClick={() => { setIsEditing(false); setFormData({}); setMostrarModalForm(true); }}>
              <Plus size={20} /> Nuevo Proveedor
            </button>
          )}
        </div>
      </div>

      <div className="table-wrapper">
        <table className="custom-table">
          <thead>
            <tr>
              <th>ID</th><th>Número de documento</th><th>Nombre</th><th>Ciudad</th><th>Estado</th><th>Gestión</th>
            </tr>
          </thead>
          <tbody>
            {suppliersFiltrados.map((s) => (
              <tr key={s.supplier_id}>
                <td>#{s.supplier_id}</td>
                <td>{s.document_number}</td>
                <td>{s.supplier_name}</td>
                <td>{s.supplier_city}</td>
                <td>
                  <label className="switch">
                    <input 
                      type="checkbox" 
                      checked={!!s.supplier_status} 
                      onChange={() => toggleProveedorEstado(s.supplier_id, s.supplier_status, s)} 
                    />
                    <span className="slider round"></span>
                  </label>
                </td>
                <td className="actions-cell">
                  {hasPermission('Ver Detalle de Proveedor') && (
                    <button className="action-btn view" onClick={() => { setSupplierSeleccionado(s); setMostrarModalDetalle(true); }}><Eye size={18} /></button>
                  )}
                  {hasPermission('Editar Proveedor') && (
                    <button className="action-btn edit" onClick={() => { setIsEditing(true); setFormData(s); setMostrarModalForm(true); }}><Edit size={18} /></button>
                  )}
                  {hasPermission('Eliminar Proveedor') && (
                    <button className="action-btn delete" onClick={() => eliminarProveedor(s.supplier_id)}><Trash2 size={18} /></button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <SupplierForm isOpen={mostrarModalForm} onClose={() => { setMostrarModalForm(false); cargarProveedores(); }} formData={formData} setFormData={setFormData} isEditing={isEditing} />
      <SupplierDetail 
        isOpen={mostrarModalDetalle} 
        onClose={() => setMostrarModalDetalle(false)} 
        proveedor={supplierSeleccionado}
        onEdit={(prov) => {
          setMostrarModalDetalle(false); 
          setIsEditing(true);            
          setFormData(prov);            
          setMostrarModalForm(true);    
        }}
      />
    </div>
  );
};

export default SupplierPage;