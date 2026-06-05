// // // src/features/sub_rental/pages/SubRentalPage.jsx
// // import { useState, useMemo, useEffect } from 'react';
// // import { Plus, Search, Edit, Trash2 } from 'lucide-react';

// // import { useSubRentals } from '../hooks/useSubRental';
// // import SubRentalForm from '../components/SubRentalForm/SubRentalForm';

// // const SubRentalPage = () => {
// //   // Instanciamos las operaciones operativas aquí en el componente padre
// //   const { subRentals, loading, error, cargarSubalquileres, eliminarSubalquiler } = useSubRentals();
  
// //   const [busqueda, setBusqueda] = useState('');
// //   const [formData, setFormData] = useState({});
// //   const [isEditing, setIsEditing] = useState(false);
// //   const [mostrarModalForm, setMostrarModalForm] = useState(false);

// //   useEffect(() => {
// //     cargarSubalquileres();
// //   }, [cargarSubalquileres]);

// //   const subalquileresFiltrados = useMemo(() => {
// //     const datos = Array.isArray(subRentals) ? subRentals : [];
// //     const termino = busqueda.toLowerCase();

// //     return datos.filter(sr => {
// //       const id = sr.sub_rental_id?.toString() || '';
// //       const machinery = sr.machinery_name?.toLowerCase() || '';
// //       const supplier = sr.supplier_name?.toLowerCase() || '';
      
// //       return id.includes(termino) || machinery.includes(termino) || supplier.includes(termino);
// //     });
// //   }, [subRentals, busqueda]);

// //   const prepararEdicion = (subRental) => {
// //     setIsEditing(true);
    
// //     const costoLimpio = subRental.supplier_cost ? parseFloat(subRental.supplier_cost) : 0;

// //     setFormData({
// //       sub_rental_id: subRental.sub_rental_id,
// //       machinery_id: subRental.machinery_id,
// //       supplier_id: subRental.supplier_id,
// //       supplier_cost: costoLimpio, // Asegura que sea un número para el input numérico
// //       sub_rental_status: subRental.sub_rental_status
// //     });
// //     setMostrarModalForm(true);
// //   };

// //   return (
// //     <div className="page-container">
// //       <div className="header-container">
// //         <div className="header-text">
// //           <h1>Módulo de Subalquileres</h1>
// //           <p>Control y soporte de maquinarias subalquiladas - Makand</p>
// //         </div>

// //         <div className="header-actions">
// //           <div className="search-container-small">
// //             <Search size={18} color="#9ca3af" />
// //             <input 
// //               type="text" 
// //               className="search-input"
// //               placeholder="Buscar por ID, maquinaria o proveedor..." 
// //               value={busqueda}
// //               onChange={(e) => setBusqueda(e.target.value)}
// //             />
// //           </div>
          
// //           <button 
// //             className="btn-nuevo"
// //             type="button"
// //             onClick={() => {
// //               setIsEditing(false);
// //               setFormData({ sub_rental_status: true }); 
// //               setMostrarModalForm(true);
// //             }}
// //           >
// //             <Plus size={20} />
// //             Nuevo Subalquiler
// //           </button>
// //         </div>
// //       </div>

// //       {loading && <div style={{ textAlign: 'center', padding: '20px' }}>Cargando subalquileres...</div>}
// //       {error && <div style={{ color: 'red', textAlign: 'center', padding: '20px' }}>{error}</div>}

// //       {!loading && !error && (
// //         <div className="table-wrapper">
// //           <table className="custom-table">
// //             <thead>
// //               <tr>
// //                 <th>ID</th>
// //                 <th>Maquinaria</th>
// //                 <th>Proveedor Dueño</th>
// //                 <th>Costo del Proveedor</th>
// //                 <th>Estado</th>
// //                 <th>Gestión</th>
// //               </tr>
// //             </thead>
// //             <tbody>
// //               {subalquileresFiltrados.length > 0 ? (
// //                 subalquileresFiltrados.map((sr) => (
// //                   <tr key={sr.sub_rental_id}>
// //                     <td>#{sr.sub_rental_id}</td>
// //                     <td>{sr.machinery_name}</td>
// //                     <td>
// //                       <span className="badge-position">{sr.supplier_name}</span>
// //                     </td>
// //                     <td>${parseFloat(sr.supplier_cost).toLocaleString('es-CO')}</td>
// //                     <td>
// //                       <span className={`status-badge ${sr.sub_rental_status ? 'active' : 'inactive'}`}>
// //                         {sr.sub_rental_status ? 'Activo' : 'Finalizado'}
// //                       </span>
// //                     </td>
// //                     <td className="actions-cell">
// //                       <button 
// //                         type="button"
// //                         className="action-btn edit" 
// //                         title="Editar" 
// //                         onClick={() => prepararEdicion(sr)}
// //                       >
// //                         <Edit size={18} />
// //                       </button>
// //                       <button 
// //                         type="button"
// //                         className="action-btn delete" 
// //                         title="Eliminar" 
// //                         onClick={() => eliminarSubalquiler(sr.sub_rental_id)}
// //                       >
// //                         <Trash2 size={18} />
// //                       </button>
// //                     </td>
// //                   </tr>
// //                 ))
// //               ) : (
// //                 <tr>
// //                   <td colSpan="6" className="empty-row" style={{ textAlign: 'center', padding: '40px' }}>
// //                     No se encontraron subalquileres activos para "{busqueda}"
// //                   </td>
// //                 </tr>
// //               )}
// //             </tbody>
// //           </table>
// //         </div>
// //       )}

// //       {/* Le pasamos la función cargarSubalquileres mediante el prop onSuccess para actualizar la grilla */}
// //       <SubRentalForm 
// //         isOpen={mostrarModalForm} 
// //         onClose={() => setMostrarModalForm(false)}
// //         formData={formData}
// //         setFormData={setFormData}
// //         isEditing={isEditing}
// //         onSuccess={cargarSubalquileres}
// //       />
// //     </div>
// //   );
// // };

// // export default SubRentalPage;






// // src/features/sub_rental/pages/SubRentalPage.jsx
// import { useState, useMemo, useEffect } from 'react';
// import { Plus, Search, Edit, Trash2 } from 'lucide-react';
// import { useSubRentals } from '../hooks/useSubRental';
// import SubRentalForm from '../components/SubRentalForm/SubRentalForm';

// const SubRentalPage = () => {
//   // Instanciamos las operaciones operativas aquí en el componente padre
//   const { subRentals, loading, error, cargarSubalquileres, eliminarSubalquiler } = useSubRentals();
  
//   const [busqueda, setBusqueda] = useState('');
//   const [formData, setFormData] = useState({});
//   const [isEditing, setIsEditing] = useState(false);
//   const [mostrarModalForm, setMostrarModalForm] = useState(false);

//   useEffect(() => {
//     cargarSubalquileres();
//   }, [cargarSubalquileres]);

//   const subalquileresFiltrados = useMemo(() => {
//     const datos = Array.isArray(subRentals) ? subRentals : [];
//     const termino = busqueda.toLowerCase();

//     return datos.filter(sr => {
//       const id = sr.sub_rental_id?.toString() || '';
//       const machinery = sr.machinery_name?.toLowerCase() || '';
//       const supplier = sr.supplier_name?.toLowerCase() || '';
      
//       return id.includes(termino) || machinery.includes(termino) || supplier.includes(termino);
//     });
//   }, [subRentals, busqueda]);

//   const prepararEdicion = (subRental) => {
//     setIsEditing(true);
    
//     // Forzamos el casteo estricto a enteros y flotantes para asegurar compatibilidad con el Formulario
//     setFormData({
//       sub_rental_id: subRental.sub_rental_id,
//       machinery_id: subRental.machinery_id ? parseInt(subRental.machinery_id, 10) : '',
//       supplier_id: subRental.supplier_id ? parseInt(subRental.supplier_id, 10) : '',
//       supplier_cost: subRental.supplier_cost ? parseFloat(subRental.supplier_cost) : '',
//       sub_rental_status: subRental.sub_rental_status
//     });
//     setMostrarModalForm(true);
//   };

//   return (
//     <div className="page-container">
//       <div className="header-container">
//         <div className="header-text">
//           <h1>Módulo de Subalquileres</h1>
//           <p>Control y soporte de maquinarias subalquiladas - Makand</p>
//         </div>

//         <div className="header-actions">
//           <div className="search-container-small">
//             <Search size={18} color="#9ca3af" />
//             <input 
//               type="text" 
//               className="search-input"
//               placeholder="Buscar por ID, maquinaria o proveedor..." 
//               value={busqueda}
//               onChange={(e) => setBusqueda(e.target.value)}
//             />
//           </div>
          
//           <button 
//             className="btn-nuevo"
//             type="button"
//             onClick={() => {
//               setIsEditing(false);
//               setFormData({ sub_rental_status: true }); 
//               setMostrarModalForm(true);
//             }}
//           >
//             <Plus size={20} />
//             Nuevo Subalquiler
//           </button>
//         </div>
//       </div>

//       {loading && <div style={{ textAlign: 'center', padding: '20px' }}>Cargando subalquileres...</div>}
//       {error && <div style={{ color: 'red', textAlign: 'center', padding: '20px' }}>{error}</div>}

//       {!loading && !error && (
//         <div className="table-wrapper">
//           <table className="custom-table">
//             <thead>
//               <tr>
//                 <th>ID</th>
//                 <th>Maquinaria</th>
//                 <th>Proveedor Dueño</th>
//                 <th>Costo del Proveedor</th>
//                 <th>Estado</th>
//                 <th>Gestión</th>
//               </tr>
//             </thead>
//             <tbody>
//               {subalquileresFiltrados.length > 0 ? (
//                 subalquileresFiltrados.map((sr) => (
//                   <tr key={sr.sub_rental_id}>
//                     <td>#{sr.sub_rental_id}</td>
//                     <td>{sr.machinery_name}</td>
//                     <td>
//                       <span className="badge-position">{sr.supplier_name}</span>
//                     </td>
//                     <td>${parseFloat(sr.supplier_cost).toLocaleString('es-CO')}</td>
//                     <td>
//                       <span className={`status-badge ${sr.sub_rental_status ? 'active' : 'inactive'}`}>
//                         {sr.sub_rental_status ? 'Activo' : 'Finalizado'}
//                       </span>
//                     </td>
//                     <td className="actions-cell">
//                       <button 
//                         type="button"
//                         className="action-btn edit" 
//                         title="Editar" 
//                         onClick={() => prepararEdicion(sr)}
//                       >
//                         <Edit size={18} />
//                       </button>
//                       <button 
//                         type="button"
//                         className="action-btn delete" 
//                         title="Eliminar" 
//                         onClick={() => eliminarSubalquiler(sr.sub_rental_id)}
//                       >
//                         <Trash2 size={18} />
//                       </button>
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="6" className="empty-row" style={{ textAlign: 'center', padding: '40px' }}>
//                     No se encontraron subalquileres activos para "{busqueda}"
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       )}

//       <SubRentalForm 
//         isOpen={mostrarModalForm} 
//         onClose={() => setMostrarModalForm(false)}
//         formData={formData}
//         setFormData={setFormData}
//         isEditing={isEditing}
//         onSuccess={cargarSubalquileres}
//       />
//     </div>
//   );
// };

// export default SubRentalPage;






// src/features/sub_rental/pages/SubRentalPage.jsx
import { useState, useMemo, useEffect } from 'react';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { useSubRentals } from '../hooks/useSubRental';
import SubRentalForm from '../components/SubRentalForm/SubRentalForm';

const SubRentalPage = () => {
  const { subRentals, loading, error, cargarSubalquileres, eliminarSubalquiler } = useSubRentals();
  
  const [busqueda, setBusqueda] = useState('');
  const [formData, setFormData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [mostrarModalForm, setMostrarModalForm] = useState(false);

  useEffect(() => {
    cargarSubalquileres();
  }, [cargarSubalquileres]);

  const subalquileresFiltrados = useMemo(() => {
    const datos = Array.isArray(subRentals) ? subRentals : [];
    const termino = busqueda.toLowerCase();

    return datos.filter(sr => {
      const id = sr.sub_rental_id?.toString() || '';
      const machinery = sr.machinery_name?.toLowerCase() || '';
      const supplier = sr.supplier_name?.toLowerCase() || '';
      
      return id.includes(termino) || machinery.includes(termino) || supplier.includes(termino);
    });
  }, [subRentals, busqueda]);

  const prepararEdicion = (subRental) => {
    setIsEditing(true);
    
    setFormData({
      sub_rental_id: subRental.sub_rental_id,
      machinery_id: subRental.machinery_id ? parseInt(subRental.machinery_id, 10) : '',
      supplier_id: subRental.supplier_id ? parseInt(subRental.supplier_id, 10) : '',
      supplier_cost: subRental.supplier_cost ? parseFloat(subRental.supplier_cost) : '',
      sub_rental_status: subRental.sub_rental_status
    });
    setMostrarModalForm(true);
  };
  
  return (
    <div className="page-container">
      <div className="header-container">
        <div className="header-text">
          <h1>Módulo de Subalquileres</h1>
          <p>Control y soporte de maquinarias subalquiladas - Makand</p>
        </div>

        <div className="header-actions">
          <div className="search-container-small">
            <Search size={18} color="#9ca3af" />
            <input 
              type="text" 
              className="search-input"
              placeholder="Buscar por ID, maquinaria o proveedor..." 
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
          
          <button 
            className="btn-nuevo"
            type="button"
            onClick={() => {
              setIsEditing(false);
              setFormData({ sub_rental_status: true, machinery_id: '', supplier_id: '', supplier_cost: '' }); 
              setMostrarModalForm(true);
            }}
          >
            <Plus size={20} />
            Nuevo Subalquiler
          </button>
        </div>
      </div>

      {loading && <div style={{ textAlign: 'center', padding: '20px' }}>Cargando subalquileres...</div>}
      {error && <div style={{ color: 'red', textAlign: 'center', padding: '20px' }}>{error}</div>}

      {!loading && !error && (
        <div className="table-wrapper">
          <table className="custom-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Maquinaria</th>
                <th>Proveedor Dueño</th>
                <th>Costo del Proveedor</th>
                <th>Estado</th>
                <th>Gestión</th>
              </tr>
            </thead>
            <tbody>
              {subalquileresFiltrados.length > 0 ? (
                subalquileresFiltrados.map((sr) => (
                  <tr key={sr.sub_rental_id}>
                    <td>#{sr.sub_rental_id}</td>
                    <td>{sr.machinery_name}</td>
                    <td>
                      <span className="badge-position">{sr.supplier_name}</span>
                    </td>
                    <td>${parseFloat(sr.supplier_cost).toLocaleString('es-CO')}</td>
                    <td>
                      <span className={`status-badge ${sr.sub_rental_status ? 'active' : 'inactive'}`}>
                        {sr.sub_rental_status ? 'Activo' : 'Finalizado'}
                      </span>
                    </td>
                    <td className="actions-cell">
                      <button 
                        type="button"
                        className="action-btn edit" 
                        title="Editar" 
                        onClick={() => prepararEdicion(sr)}
                      >
                        <Edit size={18} />
                      </button>
                      <button 
                        type="button"
                        className="action-btn delete" 
                        title="Eliminar" 
                        onClick={() => eliminarSubalquiler(sr.sub_rental_id)}
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="empty-row" style={{ textAlign: 'center', padding: '40px' }}>
                    No se encontraron subalquileres activos para "{busqueda}"
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <SubRentalForm 
        isOpen={mostrarModalForm} 
        onClose={() => setMostrarModalForm(false)}
        formData={formData}
        setFormData={setFormData}
        isEditing={isEditing}
        onSuccess={cargarSubalquileres}
      />
    </div>
  );
};

export default SubRentalPage;