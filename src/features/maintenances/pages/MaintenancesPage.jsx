import { useState, useMemo, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Eye } from 'lucide-react';
import { useMaintenances } from '../hooks/useMaintenances';
import { useAuth } from "../../../shared/context/AuthContext";
import MaintenanceForm from '../components/maintenanceForm/MaintenanceForm';
import MaintenanceDetail from '../components/MaintenanceDetail/MaintenanceDetail'; // 🌟 Importamos el detalle
import { formatDate } from '../../../shared/utils/dateUtils'; // 🌟 Importamos la utilidad de fecha
import './MaintenancesPage.css';
import { useAlertModal } from "../../../shared/alertModal";

const MaintenancesPage = () => {
  const { showAlert, showConfirm } = useAlertModal();
  const { maintenances, cargarMaintenances, eliminarMaintenance } = useMaintenances();
  const { hasPermission } = useAuth();
  const [busqueda, setBusqueda] = useState('');
  const [formData, setFormData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [mostrarModalForm, setMostrarModalForm] = useState(false);

  // Estados para controlar el modal de "Ver Detalle"
  const [mostrarModalDetalle, setMostrarModalDetalle] = useState(false);
  const [mantenimientoSeleccionado, setMantenimientoSeleccionado] = useState(null);

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
      stock_id: maintenance.stock_id,
      maintenance_date: maintenance.maintenance_date,
      revision_notes: maintenance.revision_notes,
    });
    setMostrarModalForm(true);
  };

  const abrirDetalle = (maintenance) => {
    setMantenimientoSeleccionado(maintenance);
    setMostrarModalDetalle(true);
  };

  const handleEliminar = async (id) => {
    if (await showConfirm('¿Estás seguro de que deseas eliminar este mantenimiento?')) {
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
              <th>Maquinaria</th>
              <th>Fecha</th>
              <th>Gestión</th>
            </tr>
          </thead>
          <tbody>
            {maintenancesFiltrados.length > 0 ? (
              maintenancesFiltrados.map((maintenance) => (
                <tr key={maintenance.maintenance_id}>
                  <td>#{maintenance.maintenance_id}</td>
                  {/* Mostramos el nombre de la máquina en vez del ID */}
                  <td>{maintenance.machinery_name || `Máquina #${maintenance.machinery_id}`} - ({maintenance.serial_number})</td>
                  {/* Aplicamos la utilidad de formato de fecha */}
                  <td>{formatDate(maintenance.maintenance_date)}</td>
                  <td className="actions-cell">
                    {/* Botón de Ver Detalle */}
                    <button className="action-btn view" title="Ver Detalle" onClick={() => abrirDetalle(maintenance)}>
                      <Eye size={18} />
                    </button>
                    {hasPermission('Editar Mantenimiento') && (
                      <button className="action-btn edit" title="Editar" onClick={() => prepararEdicion(maintenance)}>
                        <Edit size={18} />
                      </button>
                    )}
                    {hasPermission('Eliminar Mantenimiento') && (
                      <button className="action-btn delete" title="Eliminar" onClick={() => handleEliminar(maintenance.maintenance_id)}>
                        <Trash2 size={18} />
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="empty-row" style={{ textAlign: 'center', padding: '40px' }}>
                  No se encontraron coincidencias para "{busqueda}"
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal de Formulario */}
      <MaintenanceForm
        isOpen={mostrarModalForm}
        onClose={async () => { setMostrarModalForm(false); await cargarMaintenances(); }}
        formData={formData}
        setFormData={setFormData}
        isEditing={isEditing}
      />

      {/* Modal de Ver Detalle */}
      <MaintenanceDetail
        isOpen={mostrarModalDetalle}
        onClose={() => setMostrarModalDetalle(false)}
        maintenance={mantenimientoSeleccionado}
        onEdit={(manto) => {
          setMostrarModalDetalle(false);
          prepararEdicion(manto);
        }}
      />
    </div>
  );
};

export default MaintenancesPage;