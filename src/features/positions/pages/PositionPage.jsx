import { useState, useMemo, useEffect} from 'react';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { usePositions } from '../hooks/usePositions'; 
import { useAuth } from "../../../shared/context/AuthContext";
import PositionForm from '../components/positionForm/PositionForm';
import './PositionPage.css';

import Pagination from '../../../shared/components/pagination/Pagination';
import useDebounce from "../../../shared/hooks/useDebounce";

const PositionPage = () => {
  const { 
    positions, 
    cargarCargos, 
    eliminarCargo,
  
    page,
    cambiarPagina,
    cambiarBusqueda,
    pagination
  } = usePositions(); 

  const { hasPermission } = useAuth();
  const [busqueda, setBusqueda] = useState('');
  const [formData, setFormData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [mostrarModalForm, setMostrarModalForm] = useState(false);
  
  

  const prepararEdicion = (position) => {
    setIsEditing(true);
    setFormData({
      position_id: position.position_id,
      position_name: position.position_name
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
          
          {hasPermission('Crear Cargo') && (
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
          )}
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
            {positions.length > 0 ? (
              positions.map((position) => (
                <tr key={position.position_id}>
                  <td>#{position.position_id}</td>
                  <td>{position.position_name}</td>
                  <td className="actions-cell">
                    {hasPermission('Editar Cargo') && (
                      <button 
                        className="action-btn edit" 
                        title="Editar" 
                        onClick={() => prepararEdicion(position)}
                      >
                        <Edit size={18} />
                      </button>
                    )}
                    {hasPermission('Eliminar Cargo') && (
                      <button 
                        className="action-btn delete" 
                        title="Eliminar" 
                        onClick={() => eliminarCargo(position.position_id)}
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
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


       <Pagination
        page={page}
        totalPages={pagination.totalPages}
        total={pagination.total}
        onPageChange={cambiarPagina}
      />

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