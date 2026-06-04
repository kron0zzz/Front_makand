
// // // import { useState, useMemo, useEffect } from 'react';
// // // import { Plus, Search, Eye, Edit, Trash2 } from 'lucide-react';
// // // import { useMachinery } from '../hooks/useMachinery'; 
// // // import MachineryForm from '../components/machineryForm/MachineryForm'; 
// // // import MachineryDetail from '../components/machineryDetail/MachineryDetail';
// // // import './MachineryPage.css';

// // // const MachineryPage = () => {
// // //   const { machineries, cargarMaquinarias, eliminarMaquinaria } = useMachinery();
  
// // //   const [busqueda, setBusqueda] = useState('');
// // //   const [formData, setFormData] = useState({});
// // //   const [isEditing, setIsEditing] = useState(false);
// // //   const [mostrarModalForm, setMostrarModalForm] = useState(false);
// // //   const [mostrarModalDetalle, setMostrarModalDetalle] = useState(false);
// // //   const [machinerySeleccionado, setMachinerySeleccionado] = useState(null);

// // //   useEffect(() => {
// // //     cargarMaquinarias();
// // //   }, [cargarMaquinarias]);

// // //   const machineriesFiltrados = useMemo(() => {
// // //     const datos = Array.isArray(machineries) ? machineries : [];
// // //     const termino = busqueda.toLowerCase();
    
// // //     return datos.filter(m => {
// // //       const nombreMaquina = `${m.machinery_name || ''}`.toLowerCase();
// // //       const nombreCategoria = `${m.category_name || ''}`.toLowerCase();
// // //       return nombreMaquina.includes(termino) || nombreCategoria.includes(termino);
// // //     });
// // //   }, [machineries, busqueda]);

// // //   // Prepara el estado del formulario con los datos existentes para la edición
// // //   const prepararEdicion = (machinery) => {
// // //     setIsEditing(true);
// // //     setFormData({
// // //       machinery_id: machinery.machinery_id,
// // //       // 🛠️ CORRECCIÓN PUNTO 3: Convertimos los IDs numéricos a string para que el selector HTML los reconozca al instante
// // //       status_id: machinery.status_id ? machinery.status_id.toString() : '',
// // //       category_id: machinery.category_id ? machinery.category_id.toString() : '',
// // //       next_revision_date: machinery.next_revision_date ? machinery.next_revision_date.split('T')[0] : '',
// // //       machinery_name: machinery.machinery_name,
// // //       is_motorized: machinery.is_motorized,
// // //       sale_price: machinery.sale_price,
// // //       daily_rental_price: machinery.daily_rental_price,
// // //       weight_kg: machinery.weight_kg,
// // //       stock_quantity: machinery.stock_quantity,
// // //       is_owned: machinery.is_owned,
// // //       machinery_description: machinery.machinery_description
// // //     });
// // //     setMostrarModalForm(true);
// // //   };

// // //   return (
// // //     <div className="page-container">
// // //       <div className="header-container">
// // //         <div className="header-text">
// // //           <h1>Maquinaria</h1>
// // //           <p>Gestión de inventario de maquinaria - Makand</p>
// // //         </div>

// // //         <div className="header-actions">
// // //           <div className="search-container-small">
// // //             <Search size={18} color="#9ca3af" />
// // //             <input 
// // //               type="text" 
// // //               className="search-input"
// // //               placeholder="Buscar por nombre o categoría..." 
// // //               value={busqueda}
// // //               onChange={(e) => setBusqueda(e.target.value)}
// // //             />
// // //           </div>
          
// // //           <button 
// // //             className="btn-nuevo"
// // //             onClick={() => {
// // //               setIsEditing(false);
// // //               setFormData({
// // //                 is_motorized: false,
// // //                 is_owned: true,
// // //                 status_id: '',
// // //                 category_id: '',
// // //                 stock_quantity: ''
// // //               }); 
// // //               setMostrarModalForm(true);
// // //             }}
// // //           >
// // //             <Plus size={20} />
// // //             Nueva Maquinaria
// // //           </button>
// // //         </div>
// // //       </div>

// // //       <div className="table-wrapper">
// // //         <table className="custom-table">
// // //           <thead>
// // //             <tr>
// // //               <th>ID</th>
// // //               <th>Nombre Maquinaria</th>
// // //               <th>Categoría</th>
// // //               <th>Cant. Disponible</th>
// // //               <th>Estado</th>
// // //               <th>Gestión</th>
// // //             </tr>
// // //           </thead>
// // //           <tbody>
// // //             {machineriesFiltrados.length > 0 ? (
// // //               machineriesFiltrados.map((machinery) => (
// // //                 <tr key={machinery.machinery_id}>
// // //                   <td>#{machinery.machinery_id}</td>
// // //                   <td><strong>{machinery.machinery_name}</strong></td>
// // //                   <td>{machinery.category_name}</td>
// // //                   <td>{machinery.stock_quantity} unds</td>
// // //                   <td>
// // //                     <span className={`status-badge status-${machinery.status_name?.toLowerCase().replace(/\s+/g, '-')}`}>
// // //                       {machinery.status_name}
// // //                     </span>
// // //                   </td>
// // //                   <td className="actions-cell">
// // //                     <button 
// // //                       className="action-btn view" 
// // //                       title="Ver Detalle" 
// // //                       onClick={() => { setMachinerySeleccionado(machinery); setMostrarModalDetalle(true); }}
// // //                     >
// // //                       <Eye size={18} />
// // //                     </button>
// // //                     <button 
// // //                       className="action-btn edit" 
// // //                       title="Editar" 
// // //                       onClick={() => prepararEdicion(machinery)}
// // //                     >
// // //                       <Edit size={18} />
// // //                     </button>
// // //                     <button 
// // //                       className="action-btn delete" 
// // //                       title="Eliminar" 
// // //                       onClick={async () => {
// // //                         if (confirm('¿Está seguro de eliminar esta maquinaria?')) {
// // //                           await eliminarMaquinaria(machinery.machinery_id);
// // //                           await cargarMaquinarias(); // Refresca automáticamente al borrar
// // //                         }
// // //                       }}
// // //                     >
// // //                       <Trash2 size={18} />
// // //                     </button>
// // //                   </td>
// // //                 </tr>
// // //               ))
// // //             ) : (
// // //               <tr>
// // //                 <td colSpan="6" className="empty-row" style={{ textAlign: 'center', padding: '40px' }}>
// // //                   No se encontraron maquinarias que coincidan con "{busqueda}"
// // //                 </td>
// // //               </tr>
// // //             )}
// // //           </tbody>
// // //         </table>
// // //       </div>

// // //       {/* Componente Modal del Formulario (Crear / Editar) */}
// // //       <MachineryForm 
// // //         isOpen={mostrarModalForm} 
// // //         onClose={() => setMostrarModalForm(false)}
// // //         onSuccess={cargarMaquinarias} // 🛠️ CORRECCIÓN PUNTO 2: Pasamos la función de refresco directo al hijo
// // //         formData={formData}
// // //         setFormData={setFormData}
// // //         isEditing={isEditing}
// // //       />
      
// // //       {/* Componente Modal del Detalle Técnico */}
// // //       <MachineryDetail 
// // //         isOpen={mostrarModalDetalle}
// // //         onClose={() => setMostrarModalDetalle(false)}
// // //         machinery={machinerySeleccionado}
// // //         onEdit={(machinery) => {
// // //           setMostrarModalDetalle(false);
// // //           prepararEdicion(machinery);
// // //         }}
// // //       />
// // //     </div>
// // //   );
// // // };

// // // export default MachineryPage;



// // import { useState, useMemo, useEffect } from 'react';
// // import { Plus, Search, Eye, Edit, Trash2 } from 'lucide-react';
// // import { useMachinery } from '../hooks/useMachinery'; 
// // import MachineryForm from '../components/machineryForm/MachineryForm'; 
// // import MachineryDetail from '../components/machineryDetail/MachineryDetail';
// // import './MachineryPage.css';

// // const MachineryPage = () => {
// //   const { machineries, cargarMaquinarias, eliminarMaquinaria } = useMachinery();
  
// //   const [busqueda, setBusqueda] = useState('');
// //   const [formData, setFormData] = useState({});
// //   const [isEditing, setIsEditing] = useState(false);
// //   const [mostrarModalForm, setMostrarModalForm] = useState(false);
// //   const [mostrarModalDetalle, setMostrarModalDetalle] = useState(false);
// //   const [machinerySeleccionado, setMachinerySeleccionado] = useState(null);

// //   useEffect(() => {
// //     cargarMaquinarias();
// //   }, [cargarMaquinarias]);

// //   const machineriesFiltrados = useMemo(() => {
// //     const datos = Array.isArray(machineries) ? machineries : [];
// //     const termino = busqueda.toLowerCase();
    
// //     return datos.filter(m => {
// //       const nombreMaquina = `${m.machinery_name || ''}`.toLowerCase();
// //       const nombreCategoria = `${m.category_name || ''}`.toLowerCase();
// //       return nombreMaquina.includes(termino) || nombreCategoria.includes(termino);
// //     });
// //   }, [machineries, busqueda]);

// //   // Prepara el estado del formulario con los datos existentes para la edición
// //   const prepararEdicion = (machinery) => {
// //     setIsEditing(true);

// //     // 🔍 Pasaporte de seguridad: Detecta si la propiedad viene con o sin el prefijo "machinery_"
// //     const idCategoria = machinery.category_id || machinery.machinery_category_id;
// //     const idEstado = machinery.status_id || machinery.machinery_status_id;

// //     setFormData({
// //       machinery_id: machinery.machinery_id,
      
// //       // 🛠️ ACTUALIZADO: Forzado seguro a string de la propiedad correcta para que el <select> se llene solo
// //       category_id: idCategoria !== undefined && idCategoria !== null ? idCategoria.toString() : '',
// //       status_id: idEstado !== undefined && idEstado !== null ? idEstado.toString() : '',
      
// //       next_revision_date: machinery.next_revision_date ? machinery.next_revision_date.split('T')[0] : '',
// //       machinery_name: machinery.machinery_name,
// //       is_motorized: machinery.is_motorized,
// //       sale_price: machinery.sale_price,
// //       daily_rental_price: machinery.daily_rental_price,
// //       weight_kg: machinery.weight_kg,
// //       stock_quantity: machinery.stock_quantity,
// //       is_owned: machinery.is_owned,
// //       machinery_description: machinery.machinery_description
// //     });
    
// //     setMostrarModalForm(true);
// //   };

// //   return (
// //     <div className="page-container">
// //       <div className="header-container">
// //         <div className="header-text">
// //           <h1>Maquinaria</h1>
// //           <p>Gestión de inventario de maquinaria - Makand</p>
// //         </div>

// //         <div className="header-actions">
// //           <div className="search-container-small">
// //             <Search size={18} color="#9ca3af" />
// //             <input 
// //               type="text" 
// //               className="search-input"
// //               placeholder="Buscar por nombre o categoría..." 
// //               value={busqueda}
// //               onChange={(e) => setBusqueda(e.target.value)}
// //             />
// //           </div>
          
// //           <button 
// //             className="btn-nuevo"
// //             onClick={() => {
// //               setIsEditing(false);
// //               setFormData({
// //                 is_motorized: false,
// //                 is_owned: true,
// //                 status_id: '',
// //                 category_id: '',
// //                 stock_quantity: ''
// //               }); 
// //               setMostrarModalForm(true);
// //             }}
// //           >
// //             <Plus size={20} />
// //             Nueva Maquinaria
// //           </button>
// //         </div>
// //       </div>

// //       <div className="table-wrapper">
// //         <table className="custom-table">
// //           <thead>
// //             <tr>
// //               <th>ID</th>
// //               <th>Nombre Maquinaria</th>
// //               <th>Categoría</th>
// //               <th>Cant. Disponible</th>
// //               <th>Estado</th>
// //               <th>Gestión</th>
// //             </tr>
// //           </thead>
// //           <tbody>
// //             {machineriesFiltrados.length > 0 ? (
// //               machineriesFiltrados.map((machinery) => (
// //                 <tr key={machinery.machinery_id}>
// //                   <td>#{machinery.machinery_id}</td>
// //                   <td><strong>{machinery.machinery_name}</strong></td>
// //                   <td>{machinery.category_name}</td>
// //                   <td>{machinery.stock_quantity} unds</td>
// //                   <td>
// //                     <span className={`status-badge status-${machinery.status_name?.toLowerCase().replace(/\s+/g, '-')}`}>
// //                       {machinery.status_name}
// //                     </span>
// //                   </td>
// //                   <td className="actions-cell">
// //                     <button 
// //                       className="action-btn view" 
// //                       title="Ver Detalle" 
// //                       onClick={() => { setMachinerySeleccionado(machinery); setMostrarModalDetalle(true); }}
// //                     >
// //                       <Eye size={18} />
// //                     </button>
// //                     <button 
// //                       className="action-btn edit" 
// //                       title="Editar" 
// //                       onClick={() => prepararEdicion(machinery)}
// //                     >
// //                       <Edit size={18} />
// //                     </button>
// //                     <button 
// //                       className="action-btn delete" 
// //                       title="Eliminar" 
// //                       onClick={async () => {
// //                         if (confirm('¿Está seguro de eliminar esta maquinaria?')) {
// //                           await eliminarMaquinaria(machinery.machinery_id);
// //                           await cargarMaquinarias(); 
// //                         }
// //                       }}
// //                     >
// //                       <Trash2 size={18} />
// //                     </button>
// //                   </td>
// //                 </tr>
// //               ))
// //             ) : (
// //               <tr>
// //                 <td colSpan="6" className="empty-row" style={{ textAlign: 'center', padding: '40px' }}>
// //                   No se encontraron maquinarias que coincidan con "{busqueda}"
// //                 </td>
// //               </tr>
// //             )}
// //           </tbody>
// //         </table>
// //       </div>

// //       {/* Componente Modal del Formulario (Crear / Editar) */}
// //       <MachineryForm 
// //         isOpen={mostrarModalForm} 
// //         onClose={() => setMostrarModalForm(false)}
// //         onSuccess={cargarMaquinarias} 
// //         formData={formData}
// //         setFormData={setFormData}
// //         isEditing={isEditing}
// //       />
      
// //       {/* Componente Modal del Detalle Técnico */}
// //       <MachineryDetail 
// //         isOpen={mostrarModalDetalle}
// //         onClose={() => setMostrarModalDetalle(false)}
// //         machinery={machinerySeleccionado}
// //         onEdit={(machinery) => {
// //           setMostrarModalDetalle(false);
// //           prepararEdicion(machinery);
// //         }}
// //       />
// //     </div>
// //   );
// // };

// // export default MachineryPage;















// import { useState, useMemo, useEffect } from 'react';
// import { Plus, Search, Eye, Edit, Trash2 } from 'lucide-react';
// import { useMachinery } from '../hooks/useMachinery'; 
// import MachineryForm from '../components/machineryForm/MachineryForm'; 
// import MachineryDetail from '../components/machineryDetail/MachineryDetail';
// import './MachineryPage.css';

// const MachineryPage = () => {
//   const { machineries, cargarMaquinarias, eliminarMaquinaria } = useMachinery();
  
//   const [busqueda, setBusqueda] = useState('');
//   const [formData, setFormData] = useState({});
//   const [isEditing, setIsEditing] = useState(false);
//   const [mostrarModalForm, setMostrarModalForm] = useState(false);
//   const [mostrarModalDetalle, setMostrarModalDetalle] = useState(false);
//   const [machinerySeleccionado, setMachinerySeleccionado] = useState(null);

//   useEffect(() => {
//     cargarMaquinarias();
//   }, [cargarMaquinarias]);

//   const machineriesFiltrados = useMemo(() => {
//     const datos = Array.isArray(machineries) ? machineries : [];
//     const termino = busqueda.toLowerCase();
    
//     return datos.filter(m => {
//       const nombreMaquina = `${m.machinery_name || ''}`.toLowerCase();
//       const nombreCategoria = `${m.category_name || ''}`.toLowerCase();
//       return nombreMaquina.includes(termino) || nombreCategoria.includes(termino);
//     });
//   }, [machineries, busqueda]);

//   // Prepara el estado del formulario con los datos existentes para la edición
//   const prepararEdicion = (machinery) => {
//     // 👁️ DIAGNÓSTICO: Esto te mostrará en la consola del navegador (F12) exactamente qué campos tiene tu objeto
//     console.log("=== DATOS DE LA MAQUINARIA SELECCIONADA ===", machinery);

//     setIsEditing(true);

//     const idCategoria = machinery.category_id || machinery.machinery_category_id;
//     const idEstado = machinery.status_id || machinery.machinery_status_id;

//     setFormData({
//       machinery_id: machinery.machinery_id,
      
//       // Intentamos asignar los IDs si es que existen
//       category_id: idCategoria !== undefined && idCategoria !== null ? idCategoria.toString() : '',
//       status_id: idEstado !== undefined && idEstado !== null ? idEstado.toString() : '',
      
//       // 🛠️ ¡AQUÍ ESTÁ EL TRUCO! Le pasamos los nombres de texto explícitos que usa tu tabla 
//       // para que el MachineryForm modificado pueda buscar sus IDs en base al texto.
//       category_name: machinery.category_name || '',
//       status_name: machinery.status_name || '',
      
//       next_revision_date: machinery.next_revision_date ? machinery.next_revision_date.split('T')[0] : '',
//       machinery_name: machinery.machinery_name,
//       is_motorized: machinery.is_motorized,
//       sale_price: machinery.sale_price,
//       daily_rental_price: machinery.daily_rental_price,
//       weight_kg: machinery.weight_kg,
//       stock_quantity: machinery.stock_quantity,
//       is_owned: machinery.is_owned,
//       machinery_description: machinery.machinery_description
//     });
    
//     setMostrarModalForm(true);
//   };

//   return (
//     <div className="page-container">
//       <div className="header-container">
//         <div className="header-text">
//           <h1>Maquinaria</h1>
//           <p>Gestión de inventario de maquinaria - Makand</p>
//         </div>

//         <div className="header-actions">
//           <div className="search-container-small">
//             <Search size={18} color="#9ca3af" />
//             <input 
//               type="text" 
//               className="search-input"
//               placeholder="Buscar por nombre o categoría..." 
//               value={busqueda}
//               onChange={(e) => setBusqueda(e.target.value)}
//             />
//           </div>
          
//           <button 
//             className="btn-nuevo"
//             onClick={() => {
//               setIsEditing(false);
//               setFormData({
//                 is_motorized: false,
//                 is_owned: true,
//                 status_id: '',
//                 category_id: '',
//                 category_name: '',
//                 status_name: '',
//                 stock_quantity: ''
//               }); 
//               setMostrarModalForm(true);
//             }}
//           >
//             <Plus size={20} />
//             Nueva Maquinaria
//           </button>
//         </div>
//       </div>

//       <div className="table-wrapper">
//         <table className="custom-table">
//           <thead>
//             <tr>
//               <th>ID</th>
//               <th>Nombre Maquinaria</th>
//               <th>Categoría</th>
//               <th>Cant. Disponible</th>
//               <th>Estado</th>
//               <th>Gestión</th>
//             </tr>
//           </thead>
//           <tbody>
//             {machineriesFiltrados.length > 0 ? (
//               machineriesFiltrados.map((machinery) => (
//                 <tr key={machinery.machinery_id}>
//                   <td>#{machinery.machinery_id}</td>
//                   <td><strong>{machinery.machinery_name}</strong></td>
//                   <td>{machinery.category_name}</td>
//                   <td>{machinery.stock_quantity} unds</td>
//                   <td>
//                     <span className={`status-badge status-${machinery.status_name?.toLowerCase().replace(/\s+/g, '-')}`}>
//                       {machinery.status_name}
//                     </span>
//                   </td>
//                   <td className="actions-cell">
//                     <button 
//                       className="action-btn view" 
//                       title="Ver Detalle" 
//                       onClick={() => { setMachinerySeleccionado(machinery); setMostrarModalDetalle(true); }}
//                     >
//                       <Eye size={18} />
//                     </button>
//                     <button 
//                       className="action-btn edit" 
//                       title="Editar" 
//                       onClick={() => prepararEdicion(machinery)}
//                     >
//                       <Edit size={18} />
//                     </button>
//                     <button 
//                       className="action-btn delete" 
//                       title="Eliminar" 
//                       onClick={async () => {
//                         if (confirm('¿Está seguro de eliminar esta maquinaria?')) {
//                           await eliminarMaquinaria(machinery.machinery_id);
//                           await cargarMaquinarias(); 
//                         }
//                       }}
//                     >
//                       <Trash2 size={18} />
//                     </button>
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="6" className="empty-row" style={{ textAlign: 'center', padding: '40px' }}>
//                   No se encontraron maquinarias que coincidan con "{busqueda}"
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Componente Modal del Formulario (Crear / Editar) */}
//       <MachineryForm 
//         isOpen={mostrarModalForm} 
//         onClose={() => setMostrarModalForm(false)}
//         onSuccess={cargarMaquinarias} 
//         formData={formData}
//         setFormData={setFormData}
//         isEditing={isEditing}
//       />
      
//       {/* Componente Modal del Detalle Técnico */}
//       <MachineryDetail 
//         isOpen={mostrarModalDetalle}
//         onClose={() => setMostrarModalDetalle(false)}
//         machinery={machinerySeleccionado}
//         onEdit={(machinery) => {
//           setMostrarModalDetalle(false);
//           prepararEdicion(machinery);
//         }}
//       />
//     </div>
//   );
// };

// export default MachineryPage;















import { useState, useMemo, useEffect } from 'react';
import { Plus, Search, Eye, Edit, Trash2 } from 'lucide-react';
import { useMachinery } from '../hooks/useMachinery'; 
import MachineryForm from '../components/machineryForm/MachineryForm'; 
import MachineryDetail from '../components/machineryDetail/MachineryDetail';
import './MachineryPage.css';

const MachineryPage = () => {
  const { machineries, cargarMaquinarias, eliminarMaquinaria } = useMachinery();
  
  const [busqueda, setBusqueda] = useState('');
  const [formData, setFormData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [mostrarModalForm, setMostrarModalForm] = useState(false);
  const [mostrarModalDetalle, setMostrarModalDetalle] = useState(false);
  const [machinerySeleccionado, setMachinerySeleccionado] = useState(null);

  useEffect(() => {
    cargarMaquinarias();
  }, [cargarMaquinarias]);

  const machineriesFiltrados = useMemo(() => {
    const datos = Array.isArray(machineries) ? machineries : [];
    const termino = busqueda.toLowerCase();
    
    return datos.filter(m => {
      const nombreMaquina = `${m.machinery_name || ''}`.toLowerCase();
      const nombreCategoria = `${m.category_name || ''}`.toLowerCase();
      return nombreMaquina.includes(termino) || nombreCategoria.includes(termino);
    });
  }, [machineries, busqueda]);

  // 🛠️ Función auxiliar para limpiar ceros decimales innecesarios (ej: "600000.00" -> "600000")
  const limpiarCerosDecimales = (valor) => {
    if (valor === undefined || valor === null || valor === '') return '';
    const numero = parseFloat(valor);
    // Si al convertirlo a entero sigue siendo igual, quitamos los decimales.
    return numero % 1 === 0 ? numero.toString() : valor.toString();
  };

  // Prepara el estado del formulario con los datos existentes para la edición
  const prepararEdicion = (machinery) => {
    console.log("=== DATOS DE LA MAQUINARIA SELECCIONADA ===", machinery);

    setIsEditing(true);

    const idCategoria = machinery.category_id || machinery.machinery_category_id;
    const idEstado = machinery.status_id || machinery.machinery_status_id;

    setFormData({
      machinery_id: machinery.machinery_id,
      
      category_id: idCategoria !== undefined && idCategoria !== null ? idCategoria.toString() : '',
      status_id: idEstado !== undefined && idEstado !== null ? idEstado.toString() : '',
      
      category_name: machinery.category_name || '',
      status_name: machinery.status_name || '',
      
      next_revision_date: machinery.next_revision_date ? machinery.next_revision_date.split('T')[0] : '',
      machinery_name: machinery.machinery_name,
      is_motorized: machinery.is_motorized,
      
      // 🛠️ ACTUALIZADO: Limpiamos los precios para quitarle los .00 de la base de datos
      sale_price: limpiarCerosDecimales(machinery.sale_price),
      daily_rental_price: limpiarCerosDecimales(machinery.daily_rental_price),
      
      weight_kg: machinery.weight_kg,
      stock_quantity: machinery.stock_quantity,
      is_owned: machinery.is_owned,
      machinery_description: machinery.machinery_description
    });
    
    setMostrarModalForm(true);
  };

  return (
    <div className="page-container">
      <div className="header-container">
        <div className="header-text">
          <h1>Maquinaria</h1>
          <p>Gestión de inventario de maquinaria - Makand</p>
        </div>

        <div className="header-actions">
          <div className="search-container-small">
            <Search size={18} color="#9ca3af" />
            <input 
              type="text" 
              className="search-input"
              placeholder="Buscar por nombre o categoría..." 
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
          
          <button 
            className="btn-nuevo"
            onClick={() => {
              setIsEditing(false);
              setFormData({
                is_motorized: false,
                is_owned: true,
                status_id: '',
                category_id: '',
                category_name: '',
                status_name: '',
                stock_quantity: ''
              }); 
              setMostrarModalForm(true);
            }}
          >
            <Plus size={20} />
            Nueva Maquinaria
          </button>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="custom-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre Maquinaria</th>
              <th>Categoría</th>
              <th>Cant. Disponible</th>
              <th>Estado</th>
              <th>Gestión</th>
            </tr>
          </thead>
          <tbody>
            {machineriesFiltrados.length > 0 ? (
              machineriesFiltrados.map((machinery) => (
                <tr key={machinery.machinery_id}>
                  <td>#{machinery.machinery_id}</td>
                  <td><strong>{machinery.machinery_name}</strong></td>
                  <td>{machinery.category_name}</td>
                  <td>{machinery.stock_quantity} unds</td>
                  <td>
                    <span className={`status-badge status-${machinery.status_name?.toLowerCase().replace(/\s+/g, '-')}`}>
                      {machinery.status_name}
                    </span>
                  </td>
                  <td className="actions-cell">
                    <button 
                      className="action-btn view" 
                      title="Ver Detalle" 
                      onClick={() => { setMachinerySeleccionado(machinery); setMostrarModalDetalle(true); }}
                    >
                      <Eye size={18} />
                    </button>
                    <button 
                      className="action-btn edit" 
                      title="Editar" 
                      onClick={() => prepararEdicion(machinery)}
                    >
                      <Edit size={18} />
                    </button>
                    <button 
                      className="action-btn delete" 
                      title="Eliminar" 
                      onClick={async () => {
                        if (confirm('¿Está seguro de eliminar esta maquinaria?')) {
                          await eliminarMaquinaria(machinery.machinery_id);
                          await cargarMaquinarias(); 
                        }
                      }}
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="empty-row" style={{ textAlign: 'center', padding: '40px' }}>
                  No se encontraron maquinarias que coincidan con "{busqueda}"
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Componente Modal del Formulario (Crear / Editar) */}
      <MachineryForm 
        isOpen={mostrarModalForm} 
        onClose={() => setMostrarModalForm(false)}
        onSuccess={cargarMaquinarias} 
        formData={formData}
        setFormData={setFormData}
        isEditing={isEditing}
      />
      
      {/* Componente Modal del Detalle Técnico */}
      <MachineryDetail 
        isOpen={mostrarModalDetalle}
        onClose={() => setMostrarModalDetalle(false)}
        machinery={machinerySeleccionado}
        onEdit={(machinery) => {
          setMostrarModalDetalle(false);
          prepararEdicion(machinery);
        }}
      />
    </div>
  );
};

export default MachineryPage;