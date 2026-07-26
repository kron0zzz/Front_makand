import { useState, useMemo, useEffect } from 'react';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { useChargeTypes } from '../hooks/useChargeTypes';
import { useAuth } from "../../../shared/context/AuthContext";
import ChargeTypeForm from '../components/chargeTypeForm/ChargeTypeForm';
import './ChargeTypesPage.css';

import Pagination from '../../../shared/components/pagination/Pagination';
import useDebounce from "../../../shared/hooks/useDebounce";
import { useAlertModal } from "../../../shared/alertModal";

const ChargeTypesPage = () => {
  const { showAlert, showConfirm } = useAlertModal();
  const { 
    chargeTypes, 
    eliminarTipoCobro, 
    cargarTiposCobro, 

    page,
    cambiarPagina,
    cambiarBusqueda,
    pagination
  } = useChargeTypes();

  const { hasPermission } = useAuth();
  const [busqueda, setBusqueda] = useState('');
  const [formData, setFormData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [mostrarModalForm, setMostrarModalForm] = useState(false);



  const prepararEdicion = (tipoCobro) => {
    setIsEditing(true);
    setFormData({
      charge_type_id: tipoCobro.charge_type_id,
      charge_type_name: tipoCobro.charge_type_name,
    });
    setMostrarModalForm(true);
  };

  const handleEliminar = async (id) => {
    if (await showConfirm('¿Estás seguro de que deseas eliminar este tipo de cobro?')) {
      await eliminarTipoCobro(id);
    }
  };

  const busquedaDebounce = useDebounce(busqueda, 300);
  useEffect(() => {
    cambiarBusqueda(busquedaDebounce);
  }, [busquedaDebounce]);

  return (
    <div className="page-container">
      <div className="header-container">
        <div className="header-text">
          <h1>Tipos de Cobro</h1>
          <p>Gestión de tipos de cobro - Makand</p>
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

          {hasPermission('Crear Tipo de Cargo') && (
            <button
              className="btn-nuevo"
              onClick={() => {
                setIsEditing(false);
                setFormData({});
                setMostrarModalForm(true);
              }}
            >
              <Plus size={20} />
              Nuevo Tipo de Cobro
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
            {chargeTypes.length > 0 ? (
              chargeTypes.map((tipoCobro) => (
                <tr key={tipoCobro.charge_type_id}>
                  <td>#{tipoCobro.charge_type_id}</td>
                  <td>{tipoCobro.charge_type_name}</td>
                  <td className="actions-cell">
                    {hasPermission('Editar Tipo de Cargo') && (
                      <button className="action-btn edit" title="Editar" onClick={() => prepararEdicion(tipoCobro)}><Edit size={18} /></button>
                    )}
                    {hasPermission('Eliminar Tipo de Cargo') && (
                      <button className="action-btn delete" title="Eliminar" onClick={() => handleEliminar(tipoCobro.charge_type_id)}><Trash2 size={18} /></button>
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

      
      <ChargeTypeForm
        isOpen={mostrarModalForm}
        onClose={async () => {
          setMostrarModalForm(false);
          await cargarTiposCobro();
        }}
        formData={formData}
        setFormData={setFormData}
        isEditing={isEditing}
      />
    </div>
  );
};

export default ChargeTypesPage;