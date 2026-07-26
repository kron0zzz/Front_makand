// // import { useState, useMemo } from 'react';
// // import { Plus, Search, Edit, Trash2 } from 'lucide-react';
// // import { useOrderStatus } from '../hooks/useOrderStatus';
// // import OrderStatusForm from '../components/orderStatusForm/OrderStatusForm';
// // import './OrderStatusPage.css';

// // const OrderStatusPage = () => {
// //   const { orderStatus, cargarOrderStatus, eliminarOrderStatus } = useOrderStatus();
// //   const [busqueda, setBusqueda] = useState('');
// //   const [formData, setFormData] = useState({});
// //   const [isEditing, setIsEditing] = useState(false);
// //   const [mostrarModalForm, setMostrarModalForm] = useState(false);

// //   const orderStatusFiltrados = useMemo(() => {
// //     const datos = Array.isArray(orderStatus) ? orderStatus : [];
// //     const termino = busqueda.toLowerCase();
    
// //     return datos.filter(t =>
// //       t.order_status_name.toLowerCase().includes(termino) ||
// //       t.order_status_id.toString().includes(termino)
// //     );
// //   }, [orderStatus, busqueda]);

// //   const prepararEdicion = (orderStatus) => {
// //     setIsEditing(true);
// //     setFormData({
// //       order_status_id: orderStatus.order_status_id,
// //       order_status_name: orderStatus.order_status_name,
// //     });
// //     setMostrarModalForm(true);
// //   };

// //   const handleEliminar = async (id) => {
// //     if (window.confirm('¿Estás seguro de que deseas eliminar este estado de pedido?')) {
// //       await eliminarOrderStatus(id);
// //     }
// //   };

// //   return (
// //     <div className="page-container">
// //       <div className="header-container">
// //         <div className="header-text">
// //           <h1>Estados de Pedido</h1>
// //           <p>Gestión de estados de pedido - Makand</p>
// //         </div>

// //         <div className="header-actions">
// //           <div className="search-container-small">
// //             <Search size={18} color="#9ca3af" />
// //             <input
// //               type="text"
// //               className="search-input"
// //               placeholder="Buscar..."
// //               value={busqueda}
// //               onChange={(e) => setBusqueda(e.target.value)}
// //             />
// //           </div>

// //           <button
// //             className="btn-nuevo"
// //             onClick={() => {
// //               setIsEditing(false);
// //               setFormData({});
// //               setMostrarModalForm(true);
// //             }}
// //           >
// //             <Plus size={20} />
// //             Nuevo Estado
// //           </button>
// //         </div>
// //       </div>

// //       <div className="table-wrapper">
// //         <table className="custom-table">
// //           <thead>
// //             <tr>
// //               <th>ID</th>
// //               <th>Nombre</th>
// //               <th>Gestión</th>
// //             </tr>
// //           </thead>
// //           <tbody>
// //             {orderStatusFiltrados.length > 0 ? (
// //               orderStatusFiltrados.map((orderStatus) => (
// //                 <tr key={orderStatus.order_status_id}>
// //                   <td>#{orderStatus.order_status_id}</td>
// //                   <td>{orderStatus.order_status_name}</td>
// //                   <td className="actions-cell">
// //                     <button className="action-btn edit" title="Editar" onClick={() => prepararEdicion(orderStatus)}><Edit size={18} /></button>
// //                     <button className="action-btn delete" title="Eliminar" onClick={() => handleEliminar(orderStatus.order_status_id)}><Trash2 size={18} /></button>
// //                   </td>
// //                 </tr>
// //               ))
// //             ) : (
// //               <tr>
// //                 <td colSpan="3" className="empty-row" style={{ textAlign: 'center', padding: '40px' }}>
// //                   No se encontraron coincidencias para "{busqueda}"
// //                 </td>
// //               </tr>
// //             )}
// //           </tbody>
// //         </table>
// //       </div>

// //       <OrderStatusForm
// //         isOpen={mostrarModalForm}
// //         onClose={async () => { setMostrarModalForm(false); await cargarOrderStatus(); }}
// //         formData={formData}
// //         setFormData={setFormData}
// //         isEditing={isEditing}
// //       />
// //     </div>
// //   );
// // };

// // export default OrderStatusPage;





// import { useState, useMemo } from 'react';
// import { Plus, Search, Edit, Trash2 } from 'lucide-react';
// import { useOrderStatus } from '../hooks/useOrderStatus';
// import OrderStatusForm from '../components/orderStatusForm/OrderStatusForm';
// import './OrderStatusPage.css';

// const OrderStatusPage = () => {
//   const { orderStatus, cargarOrderStatus, eliminarOrderStatus } = useOrderStatus();
//   const [busqueda, setBusqueda] = useState('');
//   const [formData, setFormData] = useState({});
//   const [isEditing, setIsEditing] = useState(false);
//   const [mostrarModalForm, setMostrarModalForm] = useState(false);

//   const orderStatusFiltrados = useMemo(() => {
//     const datos = Array.isArray(orderStatus) ? orderStatus : [];
//     const termino = busqueda.toLowerCase();
//     return datos.filter(t =>
//       t.order_status_name.toLowerCase().includes(termino) ||
//       t.order_status_id.toString().includes(termino)
//     );
//   }, [orderStatus, busqueda]);

//   const prepararEdicion = (item) => {
//     setIsEditing(true);
//     setFormData({
//       order_status_id: item.order_status_id,
//       order_status_name: item.order_status_name,
//     });
//     setMostrarModalForm(true);
//   };

//   const handleEliminar = async (id) => {
//     if (window.confirm('¿Estás seguro de que deseas eliminar este estado de pedido?')) {
//       await eliminarOrderStatus(id);
//     }
//   };

//   return (
//     <div className="page-container">
//       <div className="header-container">
//         <div className="header-text">
//           <h1>Estados de Pedido</h1>
//           <p>Gestión de estados de pedido - Makand</p>
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
//           <button
//             className="btn-nuevo"
//             onClick={() => {
//               setIsEditing(false);
//               setFormData({});
//               setMostrarModalForm(true);
//             }}
//           >
//             <Plus size={20} /> Nuevo Estado
//           </button>
//         </div>
//       </div>

//       <div className="table-wrapper">
//         <table className="custom-table">
//           <thead>
//             <tr>
//               <th>ID</th>
//               <th>Nombre</th>
//               <th>Gestión</th>
//             </tr>
//           </thead>
//           <tbody>
//             {orderStatusFiltrados.length > 0 ? (
//               orderStatusFiltrados.map((item) => (
//                 <tr key={item.order_status_id}>
//                   <td>#{item.order_status_id}</td>
//                   <td>{item.order_status_name}</td>
//                   <td className="actions-cell">
//                     <button className="action-btn edit" onClick={() => prepararEdicion(item)}><Edit size={18} /></button>
//                     <button className="action-btn delete" onClick={() => handleEliminar(item.order_status_id)}><Trash2 size={18} /></button>
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr><td colSpan="3" style={{ textAlign: 'center', padding: '40px' }}>No se encontraron coincidencias</td></tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       <OrderStatusForm
//         isOpen={mostrarModalForm}
//         onClose={() => setMostrarModalForm(false)}
//         formData={formData}
//         setFormData={setFormData}
//         isEditing={isEditing}
//         cargarOrderStatus={cargarOrderStatus} 
//       />
//     </div>
//   );
// };

// export default OrderStatusPage;




import { useState, useMemo } from 'react';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { useOrderStatus } from '../hooks/useOrderStatus';
import { useAuth } from '../../../shared/context/AuthContext'; // Ajusta la ruta según tu estructura
import OrderStatusForm from '../components/orderStatusForm/OrderStatusForm';
import './OrderStatusPage.css';
import { useAlertModal } from "../../../shared/alertModal";

const OrderStatusPage = () => {
  const { showAlert, showConfirm } = useAlertModal();
  const { orderStatus, cargarOrderStatus, eliminarOrderStatus } = useOrderStatus();
  const { hasPermission } = useAuth();
  
  const [busqueda, setBusqueda] = useState('');
  const [formData, setFormData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [mostrarModalForm, setMostrarModalForm] = useState(false);

  const orderStatusFiltrados = useMemo(() => {
    const datos = Array.isArray(orderStatus) ? orderStatus : [];
    const termino = busqueda.toLowerCase();
    return datos.filter(t =>
      t.order_status_name.toLowerCase().includes(termino) ||
      t.order_status_id.toString().includes(termino)
    );
  }, [orderStatus, busqueda]);

  const prepararEdicion = (item) => {
    setIsEditing(true);
    setFormData({
      order_status_id: item.order_status_id,
      order_status_name: item.order_status_name,
    });
    setMostrarModalForm(true);
  };

  const handleEliminar = async (id) => {
    if (await showConfirm('¿Estás seguro de que deseas eliminar este estado de pedido?')) {
      await eliminarOrderStatus(id);
    }
  };

  return (
    <div className="page-container">
      <div className="header-container">
        <div className="header-text">
          <h1>Estados de Pedido</h1>
          <p>Gestión de estados de pedido - Makand</p>
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
          
          {hasPermission('Crear Estado de Orden') && (
            <button
              className="btn-nuevo"
              onClick={() => {
                setIsEditing(false);
                setFormData({});
                setMostrarModalForm(true);
              }}
            >
              <Plus size={20} /> Nuevo Estado
            </button>
          )}
        </div>
      </div>

      <div className="table-wrapper">
        <table className="custom-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Gestión</th>
            </tr>
          </thead>
          <tbody>
            {orderStatusFiltrados.length > 0 ? (
              orderStatusFiltrados.map((item) => (
                <tr key={item.order_status_id}>
                  <td>#{item.order_status_id}</td>
                  <td>{item.order_status_name}</td>
                  <td className="actions-cell">
                    {hasPermission('Editar Estado de Orden') && (
                      <button className="action-btn edit" onClick={() => prepararEdicion(item)}>
                        <Edit size={18} />
                      </button>
                    )}
                    {hasPermission('Eliminar Estado de Orden') && (
                      <button className="action-btn delete" onClick={() => handleEliminar(item.order_status_id)}>
                        <Trash2 size={18} />
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" style={{ textAlign: 'center', padding: '40px' }}>
                  No se encontraron coincidencias
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <OrderStatusForm
        isOpen={mostrarModalForm}
        onClose={() => setMostrarModalForm(false)}
        formData={formData}
        setFormData={setFormData}
        isEditing={isEditing}
        cargarOrderStatus={cargarOrderStatus} 
      />
    </div>
  );
};

export default OrderStatusPage;