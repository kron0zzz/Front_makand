import { useState, useMemo, useEffect} from 'react';
import { Plus, Search, Eye, Edit, Trash2 } from 'lucide-react';
import { useProjects } from '../hooks/useProjects'; 
import { useAuth } from "../../../shared/context/AuthContext";
import ProjectForm from '../components/projectForm/ProjectForm';
import ProjectDetail from '../components/projectDetail/ProjectDetail';
import './ProjectsPage.css';

import Pagination from '../../../shared/components/pagination/Pagination';
import useDebounce from "../../../shared/hooks/useDebounce";
import { useAlertModal } from "../../../shared/alertModal";


const ProjectsPage = () => {
  const { showAlert, showConfirm } = useAlertModal();
  const { 
    projects, 
    cargarProyectos, 
    eliminarProyecto,

    page,
    cambiarPagina,
    cambiarBusqueda,
    pagination
  
  } = useProjects();
  const { hasPermission } = useAuth();
  const [busqueda, setBusqueda] = useState('');
  const [formData, setFormData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [mostrarModalForm, setMostrarModalForm] = useState(false);
  const [mostrarModalDetalle, setMostrarModalDetalle] = useState(false);
  const [proyectoSeleccionado, setProyectoSeleccionado] = useState(null);

  const handleToggleEstado = async (proyectoId) => {
    const proyecto = projects.find(p => p.project_id === proyectoId);
    if (!proyecto) return;
    
    const nuevoEstado = !proyecto.project_status;
    const accion = nuevoEstado ? 'ACTIVAR' : 'DESACTIVAR';
    const mensaje = `¿Estás seguro de que deseas ${accion} el proyecto ${proyecto.project_name}?`;
    
    if (await showConfirm(mensaje)) {
      try {
        const response = await fetch(`http://localhost:3000/api/projects/${proyectoId}`, {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            project_name: proyecto.project_name,
            project_address: proyecto.project_address,
            project_phone: proyecto.project_phone,
            project_city: proyecto.project_city,
            customer_id: proyecto.customer_id,
            project_status: nuevoEstado
          })
        });

        if (response.ok) {
          await cargarProyectos();
          await showAlert("Estado del proyecto actualizado correctamente.");
        } else {
          await showAlert("No se pudo actualizar el estado del Proyecto.");
        }
      } catch (error) {
        console.error("Error al cambiar estado:", error);
        await showAlert("Error de conexión con el servidor.");
      }
    }
  };


  const prepararEdicion = (proyecto) => {
    setIsEditing(true);
    setFormData({
      project_id: proyecto.project_id,
      project_name: proyecto.project_name,
      project_address: proyecto.project_address,
      project_phone: proyecto.project_phone,
      project_city: proyecto.project_city, 
      project_state: proyecto.project_state, 
      customer_id: proyecto.customer_id,
      project_status: proyecto.project_status
    });
    setMostrarModalForm(true);
  };


  const busquedaDebounce = useDebounce(busqueda, 300);
  useEffect(() => {
    cambiarBusqueda(busquedaDebounce);
  }, [busquedaDebounce]);


  return (
    <div className="page-container">
      <div className="header-container">
        <div className="header-text">
          <h1>Proyectos</h1>
          <p>Gestión de proyectos - Makand</p>
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
          
          {hasPermission('Crear Proyecto') && (
            <button 
              className="btn-nuevo"
              onClick={() => {
                setIsEditing(false);
                setFormData({}); 
                setMostrarModalForm(true);
              }}
            >
              <Plus size={20} />
              Nuevo Proyecto
            </button>
          )}
        </div>
      </div>

      <div className="table-wrapper">
        <table className="custom-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre Proyecto</th>
              <th>Cliente</th>
              <th>Estado</th>
              <th>Gestión</th>
            </tr>
          </thead>
          <tbody>
            {projects.length > 0 ? (
              projects.map((proyecto) => (
                <tr key={proyecto.project_id}>
                  <td>#{proyecto.project_id}</td>
                  <td>{proyecto.project_name}</td>
                  <td>{proyecto.customer_first_name} {proyecto.customer_last_name}</td>
                  <td>
                    <label className="switch">
                      <input 
                        type="checkbox" 
                        checked={!!proyecto.project_status} 
                        onChange={() => handleToggleEstado(proyecto.project_id)} 
                      />
                      <span className="slider round"></span>
                    </label>
                  </td>
                  <td className="actions-cell">
                    {hasPermission('Ver Detalle de Proyecto') && (
                      <button className="action-btn view" title="Ver" onClick={() => { setProyectoSeleccionado(proyecto); setMostrarModalDetalle(true); }}><Eye size={18} /></button>
                    )}
                    {hasPermission('Editar Proyecto') && (
                      <button className="action-btn edit" title="Editar" onClick={() => prepararEdicion(proyecto)}><Edit size={18} /></button>
                    )}
                    {hasPermission('Eliminar Proyecto') && (
                      <button className="action-btn delete" title="Eliminar" onClick={() => eliminarProyecto(proyecto.project_id)}><Trash2 size={18} /></button>
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

      <Pagination
        page={page}
        totalPages={pagination.totalPages}
        total={pagination.total}
        onPageChange={cambiarPagina}
      />

      <ProjectForm 
        isOpen={mostrarModalForm} 
        onClose={async () => { setMostrarModalForm(false); await cargarProyectos(); }}
        formData={formData}
        setFormData={setFormData}
        isEditing={isEditing}
      />
      
      <ProjectDetail 
        isOpen={mostrarModalDetalle}
        onClose={() => setMostrarModalDetalle(false)}
        proyecto={proyectoSeleccionado}
        onEdit={(proyecto) => {
          setMostrarModalDetalle(false);
          prepararEdicion(proyecto);
        }}
      />
    </div>
  );
};

export default ProjectsPage;