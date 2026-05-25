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

//   // Filtro inteligente por nombre de maquinaria o nombre de categoría
//   const machineriesFiltrados = useMemo(() => {
//     const datos = Array.isArray(machineries) ? machineries : [];
//     const termino = busqueda.toLowerCase();
    
//     return datos.filter(m => {
//       const nombreMaquina = `${m.machinery_name}`.toLowerCase();
//       const nombreCategoria = `${m.category_name || ''}`.toLowerCase();
//       return nombreMaquina.includes(termino) || nombreCategoria.includes(termino);
//     });
//   }, [machineries, busqueda]);

//   const prepararEdicion = (machinery) => {
//     setIsEditing(true);
//     setFormData({
//       machinery_id: machinery.machinery_id,
//       status_id: machinery.status_id,
//       category_id: machinery.category_id,
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
//                 category_id: ''
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
//               <th>Precio Venta</th>
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
//                   <td>${Number(machinery.sale_price).toLocaleString('es-CO')}</td>
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
//                       onClick={() => eliminarMaquinaria(machinery.machinery_id)}
//                     >
//                       <Trash2 size={18} />
//                     </button>
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="7" className="empty-row" style={{ textAlign: 'center', padding: '40px' }}>
//                   No se encontraron maquinarias que coincidan con "{busqueda}"
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       <MachineryForm 
//         isOpen={mostrarModalForm} 
//         onClose={async () => { setMostrarModalForm(false); await cargarMaquinarias(); }}
//         formData={formData}
//         setFormData={setFormData}
//         isEditing={isEditing}
//       />
      
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
  // 🌟 EXTRAEMOS LAS CATEGORÍAS Y ESTADOS AQUÍ TAMBIÉN
  const { machineries, categories, statuses, cargarMaquinarias, eliminarMaquinaria } = useMachinery();
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
      const nombreMaquina = `${m.machinery_name}`.toLowerCase();
      const nombreCategoria = `${m.category_name || ''}`.toLowerCase();
      return nombreMaquina.includes(termino) || nombreCategoria.includes(termino);
    });
  }, [machineries, busqueda]);

  const prepararEdicion = (machinery) => {
    setIsEditing(true);
    setFormData({
      machinery_id: machinery.machinery_id,
      status_id: machinery.status_id,
      category_id: machinery.category_id,
      next_revision_date: machinery.next_revision_date ? machinery.next_revision_date.split('T')[0] : '',
      machinery_name: machinery.machinery_name,
      is_motorized: machinery.is_motorized,
      sale_price: machinery.sale_price,
      daily_rental_price: machinery.daily_rental_price,
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
                category_id: ''
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
              <th>Precio Venta</th>
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
                  <td>${Number(machinery.sale_price).toLocaleString('es-CO')}</td>
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
                      onClick={() => eliminarMaquinaria(machinery.machinery_id)}
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="empty-row" style={{ textAlign: 'center', padding: '40px' }}>
                  No se encontraron maquinarias que coincidan con "{busqueda}"
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 🌟 AQUÍ LE PASAMOS LAS CATEGORÍAS Y ESTADOS DIRECTAMENTE POR PROPS */}
      <MachineryForm 
        isOpen={mostrarModalForm} 
        onClose={() => setMostrarModalForm(false)}
        formData={formData}
        setFormData={setFormData}
        isEditing={isEditing}
        categories={categories}
        statuses={statuses}
      />
      
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