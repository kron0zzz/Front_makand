import { useState, useMemo, useEffect } from 'react';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { useMachineryStatuses } from '../hooks/useMachineryStatuses'; 
import MachineryStatusForm from '../components/MachineryStatusForm';
import './MachineryStatusPage.css'; 

const MachineryStatusPage = () => {
  const { statuses, cargarEstados, eliminarEstado } = useMachineryStatuses();
  const [busqueda, setBusqueda] = useState('');
  const [formData, setFormData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [mostrarModalForm, setMostrarModalForm] = useState(false);

  useEffect(() => {
    cargarEstados();
  }, [cargarEstados]);

  // Filtro de búsqueda inteligente por ID o Nombre del estado
  const estadosFiltrados = useMemo(() => {
    const datos = Array.isArray(statuses) ? statuses : [];
    const termino = busqueda.toLowerCase();
    
    return datos.filter(status => {
      const nombreEstado = (status.status_name || '').toLowerCase();
      const idEstado = status.status_id?.toString() || '';
      return nombreEstado.includes(termino) || idEstado.includes(termino);
    });
  }, [statuses, busqueda]);

  // Setea el estado del formulario con las variables correctas
  const prepararEdicion = (status) => {
    setIsEditing(true);
    setFormData({
      status_id: status.status_id,
      statusName: status.status_name
    });
    setMostrarModalForm(true);
  };

  return (
    <div className="page-container">
      <div className="header-container">
        <div className="header-text">
          <h1>Estados de Maquinaria</h1>
          <p>Gestión de estados - Makand</p>
        </div>

        <div className="header-actions">
          <div className="search-container-small">
            <Search size={18} color="#9ca3af" />
            <input 
              type="text" 
              className="search-input"
              placeholder="Buscar estado..." 
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
          
          <button 
            className="btn-nuevo"
            onClick={() => {
              setIsEditing(false);
              setFormData({}); 
              setMostrarModalForm(true);
            }}
          >
            <Plus size={20} />
            Nuevo Estado
          </button>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="custom-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre del Estado</th>
              <th>Gestión</th>
            </tr>
          </thead>
          <tbody>
            {estadosFiltrados.length > 0 ? (
              estadosFiltrados.map((status) => (
                <tr key={status.status_id}>
                  <td>#{status.status_id}</td>
                  <td>{status.status_name}</td>
                  <td className="actions-cell">
                    <button 
                      className="action-btn edit" 
                      title="Editar" 
                      onClick={() => prepararEdicion(status)}
                    >
                      <Edit size={18} />
                    </button>
                    <button 
                      className="action-btn delete" 
                      title="Eliminar" 
                      onClick={() => eliminarEstado(status.status_id)}
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="empty-row" style={{ textAlign: 'center', padding: '40px' }}>
                  No se encontraron coincidencias para "{busqueda}"
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal del Formulario */}
      <MachineryStatusForm 
        isOpen={mostrarModalForm} 
        onClose={async () => { 
          setMostrarModalForm(false); 
          await cargarEstados(); 
        }}
        formData={formData}
        setFormData={setFormData}
        isEditing={isEditing}
      />
    </div>
  );
};

export default MachineryStatusPage;