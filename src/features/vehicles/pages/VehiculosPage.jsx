// import { useState, useMemo, useEffect } from 'react';
// import { Plus, Search, Eye, Edit, Trash2 } from 'lucide-react';
// import { useVehicles } from '../hooks/useVehicles';
// import { vehiculosService } from '../services/vehiculosService';
// import VehiculoForm from '../components/vehiculoForm/VehiculoForm';
// import VehiculoDetail from '../components/vehiculoDetail/VehiculoDetail';
// import './VehiculosPage.css';

// const VehiculosPage = () => {
//   const { vehiculos, cargarVehiculos, eliminarVehiculo } = useVehicles();
//   const [busqueda, setBusqueda] = useState('');
//   const [formData, setFormData] = useState({});
//   const [isEditing, setIsEditing] = useState(false);
//   const [mostrarModalForm, setMostrarModalForm] = useState(false);
//   const [mostrarModalDetalle, setMostrarModalDetalle] = useState(false);
//   const [vehiculoSeleccionado, setVehiculoSeleccionado] = useState(null);

//   useEffect(() => {
//     cargarVehiculos();
//   }, [cargarVehiculos]);

//    const handleToggleEstado = async (vehiculo) => {
//      const nuevoEstado = vehiculo.estado === 'Inactivo';
//      const accion = nuevoEstado ? 'ACTIVAR' : 'DESACTIVAR';
//      const mensaje = `¿Estás seguro de que deseas ${accion} el vehículo ${vehiculo.placa}?`;

//      if (window.confirm(mensaje)) {
//        try {
//          await vehiculosService.actualizar(vehiculo.id, {
//            marca: vehiculo.marca,
//            modelo: vehiculo.modelo,
//            placa: vehiculo.placa,
//            capacidadKg: vehiculo.capacidadKg,
//            estado: nuevoEstado
//          });
//          await cargarVehiculos();
//        } catch (error) {
//          console.error("Error al cambiar estado:", error);
//          alert("Error de conexión con el servidor.");
//        }
//      }
//    };

//   const vehiculosFiltrados = useMemo(() => {
//     const datos = Array.isArray(vehiculos) ? vehiculos : [];
//     const termino = busqueda.toLowerCase();

//     return datos.filter(v => {
//       const placa = `${v.placa}`.toLowerCase();
//       const marca = `${v.marca}`.toLowerCase();
//       return placa.includes(termino) || marca.includes(termino);
//     });
//   }, [vehiculos, busqueda]);

//   const prepararEdicion = (vehiculo) => {
//     setIsEditing(true);
//     setFormData({
//       id: vehiculo.id,
//       placa: vehiculo.placa,
//       marca: vehiculo.marca,
//       modelo: vehiculo.modelo,
//       capacidadKg: vehiculo.capacidadKg,
//       estado: vehiculo.estado === 'Activo'
//     });
//     setMostrarModalForm(true);
//   };

//   return (
//     <div className="page-container">
//       <div className="header-container">
//         <div className="header-text">
//           <h1>Vehículos</h1>
//           <p>Gestión de vehículos - Makand</p>
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
// onClick={() => {
//                setIsEditing(false);
//                setFormData({ estado: true });
//                setMostrarModalForm(true);
//              }}
//           >
//             <Plus size={20} />
//             Nuevo Vehículo
//           </button>
//         </div>
//       </div>

//       <div className="table-wrapper">
//         <table className="custom-table">
//           <thead>
//             <tr>
//               <th>ID</th>
//               <th>Placa</th>
//               <th>Marca</th>
//               <th>Modelo</th>
//               <th>Estado</th>
//               <th>Gestión</th>
//             </tr>
//           </thead>
//           <tbody>
//             {vehiculosFiltrados.length > 0 ? (
//               vehiculosFiltrados.map((vehiculo) => (
//                 <tr key={vehiculo.id}>
//                   <td>#{vehiculo.id}</td>
//                   <td>{vehiculo.placa}</td>
//                   <td>{vehiculo.marca}</td>
//                   <td>{vehiculo.modelo}</td>
//                   <td>
//                     <label className="switch">
//                       <input
//                         type="checkbox"
//                         checked={vehiculo.estado === 'Activo'}
//                         onChange={() => handleToggleEstado(vehiculo)}
//                       />
//                       <span className="slider round"></span>
//                     </label>
//                   </td>
//                   <td className="actions-cell">
//                     <button className="action-btn view" title="Ver" onClick={() => { setVehiculoSeleccionado(vehiculo); setMostrarModalDetalle(true); }}><Eye size={18} /></button>
//                     <button className="action-btn edit" title="Editar" onClick={() => prepararEdicion(vehiculo)}><Edit size={18} /></button>
//                     <button className="action-btn delete" title="Eliminar" onClick={() => eliminarVehiculo(vehiculo.id)}><Trash2 size={18} /></button>
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="6" className="empty-row" style={{ textAlign: 'center', padding: '40px' }}>
//                   No se encontraron coincidencias para "{busqueda}"
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       <VehiculoForm
//         isOpen={mostrarModalForm}
//         onClose={async () => { setMostrarModalForm(false); await cargarVehiculos(); }}
//         formData={formData}
//         setFormData={setFormData}
//         isEditing={isEditing}
//       />

//       <VehiculoDetail
//         isOpen={mostrarModalDetalle}
//         onClose={() => setMostrarModalDetalle(false)}
//         vehiculo={vehiculoSeleccionado}
//         onEdit={(vehiculo) => {
//           setMostrarModalDetalle(false);
//           prepararEdicion(vehiculo);
//         }}
//       />
//     </div>
//   );
// };

// export default VehiculosPage;



import { useState, useMemo, useEffect } from 'react';
import { Plus, Search, Eye, Edit, Trash2 } from 'lucide-react';
import { useVehicles } from '../hooks/useVehicles';
import { useAuth } from "../../../shared/context/AuthContext";
import { vehiculosService } from '../services/vehiculosService';
import VehiculoForm from '../components/vehiculoForm/VehiculoForm';
import VehiculoDetail from '../components/vehiculoDetail/VehiculoDetail';
import './VehiculosPage.css';

const VehiculosPage = () => {
  const { vehiculos, cargarVehiculos, eliminarVehiculo } = useVehicles();
  const { hasPermission } = useAuth();
  const [busqueda, setBusqueda] = useState('');
  const [formData, setFormData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [mostrarModalForm, setMostrarModalForm] = useState(false);
  const [mostrarModalDetalle, setMostrarModalDetalle] = useState(false);
  const [vehiculoSeleccionado, setVehiculoSeleccionado] = useState(null);

  useEffect(() => {
    cargarVehiculos();
  }, [cargarVehiculos]);

  const handleToggleEstado = async (vehiculo) => {
    const nuevoEstado = vehiculo.estado === 'Inactivo';
    const accion = nuevoEstado ? 'ACTIVAR' : 'DESACTIVAR';
    const mensaje = `¿Estás seguro de que deseas ${accion} el vehículo ${vehiculo.placa}?`;

    if (window.confirm(mensaje)) {
      try {
        await vehiculosService.actualizar(vehiculo.id, {
          marca: vehiculo.marca,
          modelo: vehiculo.modelo,
          placa: vehiculo.placa,
          capacidadKg: vehiculo.capacidadKg,
          estado: nuevoEstado
        });
        await cargarVehiculos();
      } catch (error) {
        console.error("Error al cambiar estado:", error);
        alert("Error de conexión con el servidor.");
      }
    }
  };

  const vehiculosFiltrados = useMemo(() => {
    const datos = Array.isArray(vehiculos) ? vehiculos : [];
    const termino = busqueda.toLowerCase();

    return datos.filter(v => {
      const placa = `${v.placa}`.toLowerCase();
      const marca = `${v.marca}`.toLowerCase();
      return placa.includes(termino) || marca.includes(termino);
    });
  }, [vehiculos, busqueda]);

  const prepararEdicion = (vehiculo) => {
    setIsEditing(true);
    setFormData({
      id: vehiculo.id,
      placa: vehiculo.placa,
      marca: vehiculo.marca,
      modelo: vehiculo.modelo,
      capacidadKg: vehiculo.capacidadKg,
      estado: vehiculo.estado === 'Activo'
    });
    setMostrarModalForm(true);
  };

  return (
    <div className="page-container">
      <div className="header-container">
        <div className="header-text">
          <h1>Vehículos</h1>
          <p>Gestión de vehículos - Makand</p>
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

          {hasPermission('Crear Vehículo') && (
            <button
              className="btn-nuevo"
              onClick={() => {
                setIsEditing(false);
                setFormData({ estado: true });
                setMostrarModalForm(true);
              }}
            >
              <Plus size={20} />
              Nuevo Vehículo
            </button>
          )}
        </div>
      </div>

      <div className="table-wrapper">
        <table className="custom-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Placa</th>
              <th>Marca</th>
              <th>Modelo</th>
              <th>Estado</th>
              <th>Gestión</th>
            </tr>
          </thead>
          <tbody>
            {vehiculosFiltrados.length > 0 ? (
              vehiculosFiltrados.map((vehiculo) => (
                <tr key={vehiculo.id}>
                  <td>#{vehiculo.id}</td>
                  <td>{vehiculo.placa}</td>
                  <td>{vehiculo.marca}</td>
                  <td>{vehiculo.modelo}</td>
                  <td>
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={vehiculo.estado === 'Activo'}
                        onChange={() => handleToggleEstado(vehiculo)}
                      />
                      <span className="slider round"></span>
                    </label>
                  </td>
                  <td className="actions-cell">
                    {hasPermission('Ver Detalle de Vehículo') && (
                      <button className="action-btn view" title="Ver" onClick={() => { setVehiculoSeleccionado(vehiculo); setMostrarModalDetalle(true); }}><Eye size={18} /></button>
                    )}
                    {hasPermission('Editar Vehículo') && (
                      <button className="action-btn edit" title="Editar" onClick={() => prepararEdicion(vehiculo)}><Edit size={18} /></button>
                    )}
                    {hasPermission('Eliminar Vehículo') && (
                      <button className="action-btn delete" title="Eliminar" onClick={() => eliminarVehiculo(vehiculo.id)}><Trash2 size={18} /></button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="empty-row" style={{ textAlign: 'center', padding: '40px' }}>
                  No se encontraron coincidencias para "{busqueda}"
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <VehiculoForm
        isOpen={mostrarModalForm}
        onClose={async () => { setMostrarModalForm(false); await cargarVehiculos(); }}
        formData={formData}
        setFormData={setFormData}
        isEditing={isEditing}
      />

      <VehiculoDetail
        isOpen={mostrarModalDetalle}
        onClose={() => setMostrarModalDetalle(false)}
        vehiculo={vehiculoSeleccionado}
        onEdit={(vehiculo) => {
          setMostrarModalDetalle(false);
          prepararEdicion(vehiculo);
        }}
      />
    </div>
  );
};

export default VehiculosPage;