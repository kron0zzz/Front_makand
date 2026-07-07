// import { useState, useMemo } from 'react';
// import { Plus, Search, Edit, Trash2 } from 'lucide-react';
// import { useMaintenances } from '../hooks/useMaintenances';
// import MaintenanceForm from '../components/maintenanceForm/MaintenanceForm';
// import './MaintenancesPage.css';

// const MaintenancesPage = () => {
//   const { maintenances, cargarMaintenances, eliminarMaintenance } = useMaintenances();
//   const [busqueda, setBusqueda] = useState('');
//   const [formData, setFormData] = useState({});
//   const [isEditing, setIsEditing] = useState(false);
//   const [mostrarModalForm, setMostrarModalForm] = useState(false);

//   const maintenancesFiltrados = useMemo(() => {
//     const datos = Array.isArray(maintenances) ? maintenances : [];
//     const termino = busqueda.toLowerCase();
    
//     return datos.filter(m =>
//       m.maintenance_id.toString().includes(termino) ||
//       (m.machinery_name && m.machinery_name.toLowerCase().includes(termino))
//     );
//   }, [maintenances, busqueda]);

//   const prepararEdicion = (maintenance) => {
//     setIsEditing(true);
//     setFormData({
//       maintenance_id: maintenance.maintenance_id,
//       machinery_id: maintenance.machinery_id,
//       maintenance_date: maintenance.maintenance_date,
//       revision_notes: maintenance.revision_notes,
//     });
//     setMostrarModalForm(true);
//   };

//   const handleEliminar = async (id) => {
//     if (window.confirm('¿Estás seguro de que deseas eliminar este mantenimiento?')) {
//       await eliminarMaintenance(id);
//     }
//   };

//   return (
//     <div className="page-container">
//       <div className="header-container">
//         <div className="header-text">
//           <h1>Mantenimientos</h1>
//           <p>Gestión de mantenimientos - Makand</p>
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
//             <Plus size={20} />
//             Nuevo Mantenimiento
//           </button>
//         </div>
//       </div>

//       <div className="table-wrapper">
//         <table className="custom-table">
//           <thead>
//             <tr>
//               <th>ID</th>
//               <th>Machinery ID</th>
//               <th>Fecha</th>
//               <th>Notas</th>
//               <th>Gestión</th>
//             </tr>
//           </thead>
//           <tbody>
//             {maintenancesFiltrados.length > 0 ? (
//               maintenancesFiltrados.map((maintenance) => (
//                 <tr key={maintenance.maintenance_id}>
//                   <td>#{maintenance.maintenance_id}</td>
//                   <td>{maintenance.machinery_id}</td>
//                   <td>{maintenance.maintenance_date}</td>
//                   <td>{maintenance.revision_notes || '-'}</td>
//                   <td className="actions-cell">
//                     <button className="action-btn edit" title="Editar" onClick={() => prepararEdicion(maintenance)}><Edit size={18} /></button>
//                     <button className="action-btn delete" title="Eliminar" onClick={() => handleEliminar(maintenance.maintenance_id)}><Trash2 size={18} /></button>
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="5" className="empty-row" style={{ textAlign: 'center', padding: '40px' }}>
//                   No se encontraron coincidencias para "{busqueda}"
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       <MaintenanceForm
//         isOpen={mostrarModalForm}
//         onClose={async () => { setMostrarModalForm(false); await cargarMaintenances(); }}
//         formData={formData}
//         setFormData={setFormData}
//         isEditing={isEditing}
//       />
//     </div>
//   );
// };

// export default MaintenancesPage;


import { useState, useMemo, useEffect } from 'react';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { useMaintenances } from '../hooks/useMaintenances';
import { useAuth } from "../../../shared/context/AuthContext";
import MaintenanceForm from '../components/maintenanceForm/MaintenanceForm';
import './MaintenancesPage.css';

const MaintenancesPage = () => {
  const { maintenances, cargarMaintenances, eliminarMaintenance } = useMaintenances();
  const { hasPermission } = useAuth();
  const [busqueda, setBusqueda] = useState('');
  const [formData, setFormData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [mostrarModalForm, setMostrarModalForm] = useState(false);

  useEffect(() => {
    cargarMaintenances();
  }, [cargarMaintenances]);

  const maintenancesFiltrados = useMemo(() => {
    const datos = Array.isArray(maintenances) ? maintenances : [];
    const termino = busqueda.toLowerCase();
    
    return datos.filter(m =>
      m.maintenance_id.toString().includes(termino) ||
      (m.machinery_name && m.machinery_name.toLowerCase().includes(termino))
    );
  }, [maintenances, busqueda]);

  const prepararEdicion = (maintenance) => {
    setIsEditing(true);
    setFormData({
      maintenance_id: maintenance.maintenance_id,
      machinery_id: maintenance.machinery_id,
      maintenance_date: maintenance.maintenance_date,
      revision_notes: maintenance.revision_notes,
    });
    setMostrarModalForm(true);
  };

  const handleEliminar = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este mantenimiento?')) {
      await eliminarMaintenance(id);
    }
  };

  return (
    <div className="page-container">
      <div className="header-container">
        <div className="header-text">
          <h1>Mantenimientos</h1>
          <p>Gestión de mantenimientos - Makand</p>
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

          {hasPermission('Crear Mantenimiento') && (
            <button
              className="btn-nuevo"
              onClick={() => {
                setIsEditing(false);
                setFormData({});
                setMostrarModalForm(true);
              }}
            >
              <Plus size={20} />
              Nuevo Mantenimiento
            </button>
          )}
        </div>
      </div>

      <div className="table-wrapper">
        <table className="custom-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Machinery ID</th>
              <th>Fecha</th>
              <th>Notas</th>
              <th>Gestión</th>
            </tr>
          </thead>
          <tbody>
            {maintenancesFiltrados.length > 0 ? (
              maintenancesFiltrados.map((maintenance) => (
                <tr key={maintenance.maintenance_id}>
                  <td>#{maintenance.maintenance_id}</td>
                  <td>{maintenance.machinery_id}</td>
                  <td>{maintenance.maintenance_date}</td>
                  <td>{maintenance.revision_notes || '-'}</td>
                  <td className="actions-cell">
                    {hasPermission('Editar Mantenimiento') && (
                      <button className="action-btn edit" title="Editar" onClick={() => prepararEdicion(maintenance)}><Edit size={18} /></button>
                    )}
                    {hasPermission('Eliminar Mantenimiento') && (
                      <button className="action-btn delete" title="Eliminar" onClick={() => handleEliminar(maintenance.maintenance_id)}><Trash2 size={18} /></button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="empty-row" style={{ textAlign: 'center', padding: '40px' }}>
                  No se encontraron coincidencias para "{busqueda}"
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <MaintenanceForm
        isOpen={mostrarModalForm}
        onClose={async () => { setMostrarModalForm(false); await cargarMaintenances(); }}
        formData={formData}
        setFormData={setFormData}
        isEditing={isEditing}
      />
    </div>
  );
};

export default MaintenancesPage;