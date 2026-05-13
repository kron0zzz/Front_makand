// // // Este es el que se llama en las rutas

// // import React, { useState } from 'react';
// // import { Plus, Search, Edit, Trash2 } from 'lucide-react';
// // import { useCustomers } from '../hooks/useCustomers';
// // import { customerService } from '../services/customerService';
// // import CustomerForm from '../components/CustomerForm';

// // const CustomerPage = () => {
// //   const { customers, loading, cargarClientes, eliminarCliente } = useCustomers();
// //   const [mostrarModal, setMostrarModal] = useState(false);
// //   const [editingCliente, setEditingCliente] = useState(null);
// //   const [formData, setFormData] = useState({ firstName: '', documento: '', estado: true });

// //   const abrirModalNuevo = () => {
// //     setEditingCliente(null);
// //     setFormData({ firstName: '', documento: '', estado: true });
// //     setMostrarModal(true);
// //   };

// //   const guardar = async (e) => {
// //     e.preventDefault();
// //     if (editingCliente) {
// //       await customerService.actualizar(editingCliente.id, formData);
// //     } else {
// //       await customerService.crear(formData);
// //     }
// //     await cargarClientes();
// //     setMostrarModal(false);
// //   };

// //   return (
// //     <div style={{ padding: '20px' }}>
// //       <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
// //         <h1>Gestión de Clientes</h1>
// //         <button className="btn-primary" onClick={abrirModalNuevo}>
// //           <Plus size={18} /> Nuevo Cliente
// //         </button>
// //       </div>

// //       {loading ? <p>Cargando...</p> : (
// //         <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white' }}>
// //           <thead>
// //             <tr style={{ borderBottom: '2px solid #eee' }}>
// //               <th>Documento</th>
// //               <th>Nombre</th>
// //               <th>Acciones</th>
// //             </tr>
// //           </thead>
// //           <tbody>
// //             {customers.map(c => (
// //               <tr key={c.id} style={{ borderBottom: '1px solid #eee' }}>
// //                 <td>{c.documento}</td>
// //                 <td>{c.firstName}</td>
// //                 <td>
// //                   <button onClick={() => { setEditingCliente(c); setFormData(c); setMostrarModal(true); }}><Edit size={16}/></button>
// //                   <button onClick={() => eliminarCliente(c.id)}><Trash2 size={16}/></button>
// //                 </td>
// //               </tr>
// //             ))}
// //           </tbody>
// //         </table>
// //       )}

// //       <CustomerForm 
// //         isOpen={mostrarModal} 
// //         onClose={() => setMostrarModal(false)} 
// //         onSave={guardar}
// //         formData={formData}
// //         setFormData={setFormData}
// //         isEditing={!!editingCliente}
// //       />
// //     </div>
// //   );
// // };

// // export default CustomerPage;


























































// import React, { useState } from 'react';
// import { Plus, Search, Eye, Edit, Trash2 } from 'lucide-react';
// import { useCustomers } from '../hooks/useCustomers';
// import CustomerForm from '../components/CustomerForm';

// const CustomerPage = () => {
//   const { customers, loading, eliminarCliente } = useCustomers();
//   const [busqueda, setBusqueda] = useState('');
//   const [mostrarModal, setMostrarModal] = useState(false);
//   const [editingCliente, setEditingCliente] = useState(null);
//   const [formData, setFormData] = useState({ firstName: '', lastName: '', documento: '', estado: true });

//   // Filtrado por nombre o documento
//   const filteredCustomers = customers.filter(c => 
//     `${c.firstName} ${c.lastName} ${c.documento}`.toLowerCase().includes(busqueda.toLowerCase())
//   );

//   return (
//     <div className="p-8">
//       {/* Header según la imagen */}
//       <div className="flex justify-between items-start mb-6">
//         <div>
//           <h1 className="text-3xl font-semibold text-gray-800">Clientes</h1>
//           <p className="text-gray-500">Gestión de clientes</p>
//         </div>
//         <button 
//           className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors"
//           onClick={() => { setEditingCliente(null); setMostrarModal(true); }}
//         >
//           <Plus size={20} /> Nuevo Cliente
//         </button>
//       </div>

//       {/* Barra de Búsqueda */}
//       <div className="bg-white rounded-xl border border-gray-200 mb-6 p-1">
//         <div className="flex items-center px-4 py-2">
//           <Search className="text-gray-400 mr-3" size={20} />
//           <input 
//             type="text"
//             className="w-full outline-none text-gray-600"
//             placeholder="Buscar por nombre, documento o ID..."
//             value={busqueda}
//             onChange={(e) => setBusqueda(e.target.value)}
//           />
//         </div>
//       </div>

//       {/* Tabla Estilizada */}
//       <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
//         <table className="w-full text-left border-collapse">
//           <thead>
//             <tr className="bg-gray-50 border-bottom border-gray-200">
//               <th className="px-6 py-4 text-sm font-semibold text-gray-600">ID</th>
//               <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-center">Nombre Completo</th>
//               <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-center">Documento</th>
//               <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-center">Estado</th>
//               <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-center">Gestión</th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-gray-100">
//             {filteredCustomers.map((c) => (
//               <tr key={c.id} className="hover:bg-gray-50 transition-colors">
//                 <td className="px-6 py-4 text-sm text-gray-700">{c.customId || `CLI-00${c.id}`}</td>
//                 <td className="px-6 py-4 text-sm text-gray-700 text-center">{c.firstName} {c.lastName}</td>
//                 <td className="px-6 py-4 text-sm text-gray-700 text-center">{c.documento}</td>
//                 <td className="px-6 py-4 text-center">
//                   {/* Switch de Estado */}
//                   <div className={`relative inline-flex h-6 w-11 items-center rounded-full cursor-pointer transition-colors ${c.estado ? 'bg-green-500' : 'bg-gray-300'}`}>
//                     <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${c.estado ? 'translate-x-6' : 'translate-x-1'}`} />
//                   </div>
//                 </td>
//                 <td className="px-6 py-4 text-center">
//                   <div className="flex justify-center gap-3">
//                     <button className="text-blue-500 hover:text-blue-700 p-1">
//                       <Eye size={18} />
//                     </button>
//                     <button 
//                       className="text-orange-500 hover:text-orange-700 p-1"
//                       onClick={() => { setEditingCliente(c); setMostrarModal(true); }}
//                     >
//                       <Edit size={18} />
//                     </button>
//                   </div>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//         {loading && <div className="p-10 text-center text-gray-500">Cargando clientes...</div>}
//         {!loading && filteredCustomers.length === 0 && (
//           <div className="p-10 text-center text-gray-500">No se encontraron clientes.</div>
//         )}
//       </div>

//       <CustomerForm 
//         isOpen={mostrarModal} 
//         onClose={() => setMostrarModal(false)} 
//         formData={formData}
//         setFormData={setFormData}
//         isEditing={!!editingCliente}
//       />
//     </div>
//   );
// };

// export default CustomerPage;



























import React, { useState } from 'react';
import { Plus, Search, Eye, Edit } from 'lucide-react';
import { useCustomers } from '../hooks/useCustomers';
import CustomerForm from '../components/CustomerForm';

const CustomerPage = () => {
  const { customers, loading } = useCustomers();
  const [busqueda, setBusqueda] = useState('');
  const [mostrarModal, setMostrarModal] = useState(false);
  const [editingCliente, setEditingCliente] = useState(null);
  const [formData, setFormData] = useState({ firstName: '', lastName: '', documento: '', estado: true });

  // --- NUEVA LÓGICA PARA EL SWITCH ---
  const handleToggleStatus = (id) => {
    // Aquí normalmente llamarías a tu API para actualizar el estado en la BD
    console.log(`Cambiando estado del cliente con ID: ${id}`);
    
    /* 
       Si quieres que cambie visualmente de inmediato en el front 
       mientras integras el backend, podrías usar un estado local 
       o disparar la mutación de tu hook aquí.
    */
  };

  const filteredCustomers = customers.filter(c => 
    `${c.firstName} ${c.lastName} ${c.documento}`.toLowerCase().includes(busqueda.toLowerCase())
  );

  const abrirModalNuevo = () => {
    setEditingCliente(null);
    setFormData({ firstName: '', lastName: '', documento: '', estado: true });
    setMostrarModal(true);
  };

  const abrirModalEditar = (cliente) => {
    setEditingCliente(cliente);
    setFormData(cliente);
    setMostrarModal(true);
  };

  return (
    <div className="module-container">
      <div className="module-header-row">
        <div>
          <h1 className="page-title">Clientes</h1>
          <p className="page-subtitle">Gestión de clientes</p>
        </div>
        <div className="header-actions">
          <div className="search-container-short">
            <Search size={18} className="text-gray-400" />
            <input 
              type="text" 
              placeholder="Buscar por nombre, documento o ID..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
          <button className="btn-primary" onClick={abrirModalNuevo}>
            <Plus size={20} /> Nuevo Cliente
          </button>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="custom-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre Completo</th>
              <th>Documento</th>
              <th className="text-center">Estado</th>
              <th className="text-center">Gestión</th>
            </tr>
          </thead>
          <tbody>
            {!loading && filteredCustomers.map((c) => (
              <tr key={c.id}>
                <td>{c.customId || `CLI-00${c.id}`}</td>
                <td>{c.firstName} {c.lastName}</td>
                <td>{c.documento}</td>
                <td className="text-center">
                  {/* SWITCH FUNCIONAL */}
                  <label className="status-switch">
                    <input 
                      type="checkbox" 
                      checked={c.estado} 
                      onChange={() => handleToggleStatus(c.id)} 
                    />
                    <span className="status-slider"></span>
                  </label>
                </td>
                <td className="text-center">
                  <div className="action-buttons">
                    <button className="btn-action btn-view"><Eye size={18} /></button>
                    <button className="btn-action btn-edit" onClick={() => abrirModalEditar(c)}>
                      <Edit size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <CustomerForm 
        isOpen={mostrarModal} 
        onClose={() => setMostrarModal(false)} 
        formData={formData}
        setFormData={setFormData}
        isEditing={!!editingCliente}
      />
    </div>
  );
};

export default CustomerPage;