// import React, { useState, useMemo } from 'react';
// import { Plus, Search, Eye, Edit } from 'lucide-react';
// import { useCustomers } from '../hooks/useCustomers'; 
// import CustomerForm from '../components/CustomerForm';
// import CustomerDetail from '../components/CustomerDetail';

// const CustomerPage = () => {
//   const { customers, loading, refetch } = useCustomers();
//   const [busqueda, setBusqueda] = useState('');
//   const [mostrarModalForm, setMostrarModalForm] = useState(false);
//   const [mostrarModalDetalle, setMostrarModalDetalle] = useState(false);
//   const [editingCliente, setEditingCliente] = useState(null);
//   const [selectedCliente, setSelectedCliente] = useState(null);
//   const [formData, setFormData] = useState({ 
//     firstName: '', lastName: '', documento: '', email: '',
//     telefono: '', direccion: '', estado: true 
//   });

//   const filteredCustomers = useMemo(() => {
//     if (!Array.isArray(customers)) return [];
//     return customers.filter(c => {
//       const nombre = `${c.firstName} ${c.lastName}`.toLowerCase();
//       return nombre.includes(busqueda.toLowerCase()) || c.documento.includes(busqueda);
//     });
//   }, [customers, busqueda]);

//   return (
//     <div className="module-container" style={{ padding: '20px', backgroundColor: '#f3f4f6', minHeight: '100vh' }}>
//       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
//         <div>
//           <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', margin: 0 }}>Clientes</h1>
//           <p style={{ color: '#6b7280', margin: 0 }}>Gestión de clientes</p>
//         </div>
//         <button 
//           className="btn-primary" 
//           onClick={() => { setEditingCliente(null); setMostrarModalForm(true); }}
//           style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#ff6b35', color: 'white', padding: '10px 20px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}
//         >
//           <Plus size={20} /> Nuevo Cliente
//         </button>
//       </div>

//       <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
//         <div style={{ position: 'relative', marginBottom: '20px' }}>
//           <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} size={18} />
//           <input 
//             type="text" 
//             placeholder="Buscar por nombre, documento o ID..."
//             value={busqueda}
//             onChange={(e) => setBusqueda(e.target.value)}
//             style={{ width: '100%', padding: '12px 12px 12px 40px', borderRadius: '8px', border: '1px solid #e5e7eb', backgroundColor: '#f9fafb', outline: 'none' }}
//           />
//         </div>

//         <table style={{ width: '100%', borderCollapse: 'collapse' }}>
//           <thead>
//             <tr style={{ borderBottom: '1px solid #f3f4f6', textAlign: 'left', color: '#6b7280', fontSize: '13px' }}>
//               <th style={{ padding: '12px' }}>ID</th>
//               <th style={{ padding: '12px' }}>Nombre Completo</th>
//               <th style={{ padding: '12px' }}>Documento</th>
//               <th style={{ padding: '12px' }} className="text-center">Estado</th>
//               <th style={{ padding: '12px' }} className="text-center">Gestión</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredCustomers.map((c) => (
//               <tr key={c.id} style={{ borderBottom: '1px solid #f3f4f6', color: '#374151', fontSize: '14px' }}>
//                 <td style={{ padding: '12px' }}>{c.customId || `CLI-00${c.id}`}</td>
//                 <td style={{ padding: '12px' }}>{c.firstName} {c.lastName}</td>
//                 <td style={{ padding: '12px' }}>{c.documento}</td>
//                 <td style={{ padding: '12px', textAlign: 'center' }}>
//                   {/* COMPONENTE SWITCH */}
//                   <label style={{ position: 'relative', display: 'inline-block', width: '40px', height: '20px', cursor: 'pointer' }}>
//                     <input 
//                       type="checkbox" 
//                       checked={c.estado} 
//                       onChange={() => {/* lógica toggle */}} 
//                       style={{ opacity: 0, width: 0, height: 0 }} 
//                     />
//                     <span style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: c.estado ? '#10b981' : '#d1d5db', transition: '.3s', borderRadius: '20px' }}>
//                       <span style={{ position: 'absolute', height: '14px', width: '14px', left: c.estado ? '22px' : '4px', bottom: '3px', backgroundColor: 'white', transition: '.3s', borderRadius: '50%' }}></span>
//                     </span>
//                   </label>
//                 </td>
//                 <td style={{ padding: '12px', textAlign: 'center' }}>
//                   <button onClick={() => { setSelectedCliente(c); setMostrarModalDetalle(true); }} style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', marginRight: '10px' }}><Eye size={18} /></button>
//                   <button onClick={() => { setEditingCliente(c); setFormData({...c}); setMostrarModalForm(true); }} style={{ background: 'none', border: 'none', color: '#ff6b35', cursor: 'pointer' }}><Edit size={18} /></button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* Modales */}
//       <CustomerForm isOpen={mostrarModalForm} onClose={() => setMostrarModalForm(false)} formData={formData} setFormData={setFormData} isEditing={!!editingCliente} />
//       <CustomerDetail isOpen={mostrarModalDetalle} onClose={() => setMostrarModalDetalle(false)} cliente={selectedCliente} onEdit={(c) => { setEditingCliente(c); setFormData({...c}); setMostrarModalDetalle(false); setMostrarModalForm(true); }} />
//     </div>
//   );
// };

// export default CustomerPage;











import React, { useState, useMemo } from 'react';
import { Plus, Search, Eye, Edit, Trash2 } from 'lucide-react';
import { useCustomers } from '../hooks/useCustomers'; 
import CustomerForm from '../components/CustomerForm';
import CustomerDetail from '../components/CustomerDetail';

const CustomerPage = () => {
  // 1. Extraemos las funciones reales del Hook
  const { 
    customers, 
    loading, 
    error, 
    toggleClienteEstado, 
    eliminarCliente 
  } = useCustomers();

  const [busqueda, setBusqueda] = useState('');
  const [mostrarModalForm, setMostrarModalForm] = useState(false);
  const [mostrarModalDetalle, setMostrarModalDetalle] = useState(false);
  const [editingCliente, setEditingCliente] = useState(null);
  const [selectedCliente, setSelectedCliente] = useState(null);
  
  // Ajustamos el estado inicial para que coincida con los campos de la DB
  const [formData, setFormData] = useState({ 
    firstName: '', lastName: '', documento: '', email: '',
    telefono: '', direccion: '', estado: true, tipoDocumento: 'CC', tipoOrganizacion: 'Natural'
  });

  // 2. Filtro actualizado con los nombres de columna de la DB (snake_case)
  const filteredCustomers = useMemo(() => {
    if (!Array.isArray(customers)) return [];
    return customers.filter(c => {
      const nombreCompleto = `${c.client_first_name} ${c.client_last_name}`.toLowerCase();
      const busquedaLower = busqueda.toLowerCase();
      return (
        nombreCompleto.includes(busquedaLower) || 
        c.client_document_number.includes(busqueda) ||
        c.client_id.toString().includes(busqueda)
      );
    });
  }, [customers, busqueda]);

  if (loading) return <div style={{ padding: '20px', textAlign: 'center' }}>Cargando clientes de Makand...</div>;
  if (error) return <div style={{ padding: '20px', color: 'red', textAlign: 'center' }}>Error: {error}</div>;

  return (
    <div className="module-container" style={{ padding: '20px', backgroundColor: '#f3f4f6', minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', margin: 0 }}>Clientes</h1>
          <p style={{ color: '#6b7280', margin: 0 }}>Gestión de clientes - Makand</p>
        </div>
        <button 
          className="btn-primary" 
          onClick={() => { setEditingCliente(null); setMostrarModalForm(true); }}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#ff6b35', color: 'white', padding: '10px 20px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}
        >
          <Plus size={20} /> Nuevo Cliente
        </button>
      </div>

      <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <div style={{ position: 'relative', marginBottom: '20px' }}>
          <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} size={18} />
          <input 
            type="text" 
            placeholder="Buscar por nombre o documento..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            style={{ width: '100%', padding: '12px 12px 12px 40px', borderRadius: '8px', border: '1px solid #e5e7eb', backgroundColor: '#f9fafb', outline: 'none' }}
          />
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #f3f4f6', textAlign: 'left', color: '#6b7280', fontSize: '13px' }}>
              <th style={{ padding: '12px' }}>ID</th>
              <th style={{ padding: '12px' }}>Nombre Completo</th>
              <th style={{ padding: '12px' }}>Documento</th>
              <th style={{ padding: '12px' }} className="text-center">Estado</th>
              <th style={{ padding: '12px' }} className="text-center">Gestión</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.map((c) => (
              <tr key={c.client_id} style={{ borderBottom: '1px solid #f3f4f6', color: '#374151', fontSize: '14px' }}>
                <td style={{ padding: '12px' }}>#{c.client_id}</td>
                <td style={{ padding: '12px' }}>{c.client_first_name} {c.client_last_name}</td>
                <td style={{ padding: '12px' }}>{c.client_document_number}</td>
                <td style={{ padding: '12px', textAlign: 'center' }}>
                  {/* SWITCH CONECTADO A toggleClienteEstado */}
                  <label style={{ position: 'relative', display: 'inline-block', width: '40px', height: '20px', cursor: 'pointer' }}>
                    <input 
                      type="checkbox" 
                      checked={c.client_status} 
                      onChange={() => toggleClienteEstado(c.client_id, c.client_status)} 
                      style={{ opacity: 0, width: 0, height: 0 }} 
                    />
                    <span style={{ 
                      position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, 
                      backgroundColor: c.client_status ? '#10b981' : '#d1d5db', 
                      transition: '.3s', borderRadius: '20px' 
                    }}>
                      <span style={{ 
                        position: 'absolute', height: '14px', width: '14px', 
                        left: c.client_status ? '22px' : '4px', 
                        bottom: '3px', backgroundColor: 'white', 
                        transition: '.3s', borderRadius: '50%' 
                      }}></span>
                    </span>
                  </label>
                </td>
                <td style={{ padding: '12px', textAlign: 'center' }}>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                    <button 
                      onClick={() => { setSelectedCliente(c); setMostrarModalDetalle(true); }} 
                      style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer' }}
                    >
                      <Eye size={18} />
                    </button>
                    <button 
                      onClick={() => { setEditingCliente(c); setFormData({...c}); setMostrarModalForm(true); }} 
                      style={{ background: 'none', border: 'none', color: '#ff6b35', cursor: 'pointer' }}
                    >
                      <Edit size={18} />
                    </button>
                    <button 
                      onClick={() => eliminarCliente(c.client_id)} 
                      style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredCustomers.length === 0 && (
          <p style={{ textAlign: 'center', color: '#6b7280', padding: '20px' }}>No se encontraron clientes.</p>
        )}
      </div>

      {/* Modales */}
      <CustomerForm 
        isOpen={mostrarModalForm} 
        onClose={() => setMostrarModalForm(false)} 
        formData={formData} 
        setFormData={setFormData} 
        isEditing={!!editingCliente} 
      />
      
      <CustomerDetail 
        isOpen={mostrarModalDetalle} 
        onClose={() => setMostrarModalDetalle(false)} 
        cliente={selectedCliente} 
        onEdit={(c) => { 
          setEditingCliente(c); 
          setFormData({...c}); 
          setMostrarModalDetalle(false); 
          setMostrarModalForm(true); 
        }} 
      />
    </div>
  );
};

export default CustomerPage;