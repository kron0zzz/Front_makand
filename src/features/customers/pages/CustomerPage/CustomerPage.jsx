import { useState, useMemo, useEffect } from 'react';
import { Plus, Search, Eye, Edit, Trash2 } from 'lucide-react';
import { useCustomers } from '../../hooks/useCustomers'; 
import { useAuth } from '../../../../shared/context/AuthContext'
import { customerService } from '../../services/customerService';

import CustomerForm from '../../components/CustomerForm/CustomerForm';
import CustomerDetail from '../../components/CustomerDetail/CustomerDetail';
import './CustomerPage.css';

import Pagination from '../../../../shared/components/pagination/Pagination';
import useDebounce from "../../../../shared/hooks/useDebounce";
import { useAlertModal } from "../../../../shared/alertModal";

const CustomerPage = () => {
  const { showAlert, showConfirm } = useAlertModal();
  const { 
    customers, 
    cargarClientes, 
    eliminarCliente,
    toggleCustomerEstado,

    page,
    cambiarPagina,
    cambiarBusqueda,
    pagination
    
  } = useCustomers();
  const { hasPermission } = useAuth();
  const [busqueda, setBusqueda] = useState('');
  const [formData, setFormData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [mostrarModalForm, setMostrarModalForm] = useState(false);
  const [mostrarModalDetalle, setMostrarModalDetalle] = useState(false);
  const [customerSeleccionado, setCustomerSeleccionado] = useState(null);


  const cargarCliente = async (id, accion) => {
      try {
        const cliente = await customerService.obtenerPorId(id);
  
        if (accion === "detalle") {
          setCustomerSeleccionado(cliente);
          setMostrarModalDetalle(true);
        }
  
        if (accion === "editar") {
          setFormData(cliente);
          setIsEditing(true);
          setMostrarModalForm(true);
        }
  
      } catch (error) {
        console.error(error);
        await showAlert("No se pudo cargar la información del cliente.");
      }
    };


  const prepararEdicion = (customer) => {
    setIsEditing(true);
    setFormData({
      customer_id: customer.customer_id,
      customerName: customer.customer_name,
      tipoDocumento: customer.customer_document_type,
      documento: customer.customer_document_number,
      tipoOrganizacion: customer.organization_type,
      telefono: customer.customer_phone,
      email: customer.customer_email,
      direccion: customer.customer_address,
      estado: customer.customer_status,
      representanteLegal: customer.legal_representative
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
          <h1>Clientes</h1>
          <p>Gestión de clientes - Makand</p>
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
          
          {hasPermission('Crear Cliente') && (
            <button 
              className="btn-nuevo"
              onClick={() => {
                setIsEditing(false);
                setFormData({}); 
                setMostrarModalForm(true);
              }}
            >
              <Plus size={20} />
              Nuevo Cliente
            </button>
          )}
        </div>
      </div>

      <div className="table-wrapper">
        <table className="custom-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre Completo</th>
              <th>Documento</th>
              <th>Estado</th>
              <th>Gestión</th>
            </tr>
          </thead>
          <tbody>
            {customers.length > 0 ? (
              customers.map((customer) => (
                <tr key={customer.customer_id}>
                  <td>#{customer.customer_id}</td>
                  <td>{customer.customer_name}</td>
                  <td>{customer.customer_document_number}</td>
                  <td>
                    <label className="switch">
                      <input 
                        type="checkbox" 
                        checked={customer.customer_status} 
                        disabled={!hasPermission('Editar Cliente')}
                        onChange={() => toggleCustomerEstado(customer.customer_id, customer.customer_status)}  
                      />
                      <span className="slider round"></span>
                    </label>
                  </td>
                  <td className="actions-cell">
                    {hasPermission('Ver Detalle de Cliente') && (
                      <button className="action-btn view" title="Ver" onClick={() => cargarCliente(customer.customer_id, "detalle")}><Eye size={18} /></button>
                    )}
                    {hasPermission('Editar Cliente') && (
                      <button className="action-btn edit" title="Editar" onClick={() => cargarCliente(customer.customer_id, "editar")}><Edit size={18} /></button>
                    )}
                    {hasPermission('Eliminar Cliente') && (
                      <button className="action-btn delete" title="Eliminar" onClick={() => eliminarCliente(customer.customer_id)}><Trash2 size={18} /></button>
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


      <CustomerForm 
        isOpen={mostrarModalForm} 
        onClose={async () => { setMostrarModalForm(false); await cargarClientes(); }}
        formData={formData}
        setFormData={setFormData}
        isEditing={isEditing}
      />
      
      <CustomerDetail 
        isOpen={mostrarModalDetalle}
        onClose={() => setMostrarModalDetalle(false)}
        cliente={customerSeleccionado}
        onEdit={(cliente) => {
          setMostrarModalDetalle(false);
          prepararEdicion(cliente);
        }}
      />
    </div>
  );
};

export default CustomerPage;