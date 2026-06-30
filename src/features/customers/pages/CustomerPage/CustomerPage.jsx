import { useState, useMemo, useEffect } from 'react';
import { Plus, Search, Eye, Edit, Trash2 } from 'lucide-react';
import { useCustomers } from '../../hooks/useCustomers'; 
import CustomerForm from '../../components/CustomerForm/CustomerForm';
import CustomerDetail from '../../components/CustomerDetail/CustomerDetail';
import './CustomerPage.css';


const CustomerPage = () => {
  const { customers, cargarClientes, eliminarCliente } = useCustomers();
  const [busqueda, setBusqueda] = useState('');
  const [formData, setFormData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [mostrarModalForm, setMostrarModalForm] = useState(false);
  const [mostrarModalDetalle, setMostrarModalDetalle] = useState(false);
  const [customerSeleccionado, setCustomerSeleccionado] = useState(null);

  useEffect(() => {
    cargarClientes();
  }, [cargarClientes]);

  // Nueva función para cambiar el estado con advertencia
  const handleToggleEstado = async (customer) => {
    const nuevoEstado = !customer.customer_status;
    const accion = nuevoEstado ? 'ACTIVAR' : 'DESACTIVAR';
    const mensaje = `¿Estás seguro de que deseas ${accion} al cliente ${customer.customer_first_name} ${customer.customer_last_name}?`;
    
    if (window.confirm(mensaje)) {
      try {
        const token = localStorage.getItem("token"); // Token añadido
        const response = await fetch(`http://localhost:3000/api/customers/${customer.customer_id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({
            customer_first_name: customer.customer_first_name,
            customer_last_name: customer.customer_last_name,
            customer_document_type: customer.customer_document_type,
            customer_document_number: customer.customer_document_number,
            organization_type: customer.organization_type,
            customer_phone: customer.customer_phone,
            customer_email: customer.customer_email,
            customer_address: customer.customer_address,
            customer_status: nuevoEstado 
          })
        });

        if (response.ok) {
          await cargarClientes();
        } else {
          alert("No se pudo actualizar el estado del cliente.");
        }
      } catch (error) {
        console.error("Error al cambiar estado:", error);
        alert("Error de conexión con el servidor.");
      }
    }
  };

  const customersFiltrados = useMemo(() => {
    const datos = Array.isArray(customers) ? customers : [];
    const termino = busqueda.toLowerCase();
    
    return datos.filter(c => {
      const nombreCompleto = `${c.customer_first_name} ${c.customer_last_name}`.toLowerCase();
      const documento = c.customer_document_number?.toString() || '';
      return nombreCompleto.includes(termino) || documento.includes(termino);
    });
  }, [customers, busqueda]);

  const prepararEdicion = (customer) => {
    setIsEditing(true);
    setFormData({
      customer_id: customer.customer_id,
      firstName: customer.customer_first_name,
      lastName: customer.customer_last_name,
      tipoDocumento: customer.customer_document_type,
      documento: customer.customer_document_number,
      tipoOrganizacion: customer.organization_type,
      telefono: customer.customer_phone,
      email: customer.customer_email,
      direccion: customer.customer_address,
      estado: customer.customer_status
    });
    setMostrarModalForm(true);
  };

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
            {customersFiltrados.length > 0 ? (
              customersFiltrados.map((customer) => (
                <tr key={customer.customer_id}>
                  <td>#{customer.customer_id}</td>
                  <td>{`${customer.customer_first_name} ${customer.customer_last_name}`}</td>
                  <td>{customer.customer_document_number}</td>
                  <td>
                    {/* Switch interactivo para el Estado */}
                    <label className="switch">
                      <input 
                        type="checkbox" 
                        checked={customer.customer_status} 
                        onChange={() => handleToggleEstado(customer)} 
                      />
                      <span className="slider round"></span>
                    </label>
                  </td>
                  <td className="actions-cell">
                    <button className="action-btn view" title="Ver" onClick={() => { setCustomerSeleccionado(customer); setMostrarModalDetalle(true); }}><Eye size={18} /></button>
                    <button className="action-btn edit" title="Editar" onClick={() => prepararEdicion(customer)}><Edit size={18} /></button>
                    <button className="action-btn delete" title="Eliminar" onClick={() => eliminarCliente(customer.customer_id)}><Trash2 size={18} /></button>
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