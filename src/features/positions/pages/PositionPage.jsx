import { useState, useMemo } from 'react';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { usePositions } from '../hooks/usePositions'; 
import PositionForm from '../components/positionForm/PositionForm';
import './PositionPage.css';

const PositionPage = () => {
  const { positions, cargarCargos, eliminarCargo } = usePositions(); 
  const [busqueda, setBusqueda] = useState('');
  const [formData, setFormData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [mostrarModalForm, setMostrarModalForm] = useState(false);
  
  const positionsFiltrados = useMemo(() => {
    const datos = Array.isArray(positions) ? positions : [];
    const termino = busqueda.toLowerCase();
    
    return datos.filter(p => {
      const nombreCargo = `${p.position_name}`.toLowerCase();
      return nombreCargo.includes(termino);
    });
  }, [positions, busqueda]);

  const prepararEdicion = (position) => {
    setIsEditing(true);
    setFormData({
      position_id: position.position_id,
      position_name: position.position_name
    }); 
    setMostrarModalForm(true);
  };

  return (
    <div className="page-container">
      <div className="header-container">
        <div className="header-text">
          <h1>Cargos</h1>
          <p>Gestión de Cargos - Makand</p>
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
          
          <button 
            className="btn-nuevo"
            onClick={() => {
              setIsEditing(false);
              setFormData({}); 
              setMostrarModalForm(true);
            }}
          >
            <Plus size={20} />
            Nuevo Cargo
          </button>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="custom-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre del cargo</th>
              <th>Gestión</th>
            </tr>
          </thead>
          <tbody>
            {positionsFiltrados.length > 0 ? (
              positionsFiltrados.map((position) => (
                <tr key={position.position_id}>
                  <td>#{position.position_id}</td>
                  <td>{position.position_name}</td>
                  <td className="actions-cell">
                    <button className="action-btn edit" title="Editar" onClick={() => prepararEdicion(position)}><Edit size={18} /></button>
                    <button className="action-btn delete" title="Eliminar" onClick={() => eliminarCargo(position.position_id)}><Trash2 size={18} /></button>
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

      <PositionForm 
        isOpen={mostrarModalForm} 
        onClose={() => setMostrarModalForm(false)} 
        formData={formData}
        setFormData={setFormData}
        isEditing={isEditing}
        cargarCargos={cargarCargos}
      />
    </div>
  );
};

export default PositionPage;