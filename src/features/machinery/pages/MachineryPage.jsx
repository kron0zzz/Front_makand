import { useState, useMemo, useEffect } from 'react';
import { Plus, Search, Eye, Edit, Trash2 } from 'lucide-react';
import { useMachinery } from '../hooks/useMachinery';
import { useAuth } from '../../../shared/context/AuthContext'; // Ajusta esta ruta según tu estructura real
import MachineryForm from '../components/machineryForm/MachineryForm';
import MachineryDetail from '../components/machineryDetail/MachineryDetail';
import './MachineryPage.css';


import Pagination from '../../../shared/components/pagination/Pagination';
import useDebounce from "../../../shared/hooks/useDebounce";

const MachineryPage = () => {
  const { 
    machineries, 
    cargarMaquinarias, 
    eliminarMaquinaria, 
    crearMaquinaria, 
    actualizarMaquinaria, 

    page,
    cambiarPagina,
    cambiarBusqueda,
    pagination
  } = useMachinery();

  const { hasPermission } = useAuth();

  const [busqueda, setBusqueda] = useState('');
  const [formData, setFormData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [mostrarModalForm, setMostrarModalForm] = useState(false);
  const [mostrarModalDetalle, setMostrarModalDetalle] = useState(false);
  const [machinerySeleccionado, setMachinerySeleccionado] = useState(null);



  const limpiarCerosDecimales = (valor) => {
    if (valor === undefined || valor === null || valor === '') return '';
    const numero = parseFloat(valor);
    return numero % 1 === 0 ? numero.toString() : valor.toString();
  };

  const prepararEdicion = (machinery) => {
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
      sale_price: limpiarCerosDecimales(machinery.sale_price),
      daily_rental_price: limpiarCerosDecimales(machinery.daily_rental_price),
      weight_kg: machinery.weight_kg,
      stock_quantity: machinery.stock_quantity,
      is_owned: machinery.is_owned,
      machinery_description: machinery.machinery_description
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
          
          {hasPermission('Crear Maquinaria') && (
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
          )}
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
            {machineries.length > 0 ? (
              machineries.map((machinery) => (
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
                    {hasPermission('Ver Detalle de Maquinaria') && (
                      <button 
                        className="action-btn view" 
                        title="Ver Detalle" 
                        onClick={() => { setMachinerySeleccionado(machinery); setMostrarModalDetalle(true); }}
                      >
                        <Eye size={18} />
                      </button>
                    )}
                    {hasPermission('Editar Maquinaria') && (
                      <button 
                        className="action-btn edit" 
                        title="Editar" 
                        onClick={() => prepararEdicion(machinery)}
                      >
                        <Edit size={18} />
                      </button>
                    )}
                    {hasPermission('Eliminar Maquinaria') && (
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
                    )}
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

       <Pagination
        page={page}
        totalPages={pagination.totalPages}
        total={pagination.total}
        onPageChange={cambiarPagina}
      />


      <MachineryForm 
        isOpen={mostrarModalForm} 
        onClose={() => setMostrarModalForm(false)}
        formData={formData}
        setFormData={setFormData}
        isEditing={isEditing}
        crearMaquinaria={crearMaquinaria}
        actualizarMaquinaria={actualizarMaquinaria}
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