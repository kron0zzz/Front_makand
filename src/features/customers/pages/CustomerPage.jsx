// import React, { useState, useMemo } from 'react';
import { useState, useMemo } from 'react';
import { Plus, Search, Eye, Edit, Trash2 } from 'lucide-react';
import { useCustomers } from '../hooks/useCustomers'; 
import CustomerForm from '../components/CustomerForm';
import CustomerDetail from '../components/CustomerDetail';

const CustomerPage = () => {
  const { 
    customers, 
    loading, 
    error, 
    toggleClienteEstado, 
    eliminarCliente,
    cargarClientes 
  } = useCustomers();

  const [busqueda, setBusqueda] = useState('');
  const [mostrarModalForm, setMostrarModalForm] = useState(false);
  const [mostrarModalDetalle, setMostrarModalDetalle] = useState(false);
  const [editingCliente, setEditingCliente] = useState(null);
  const [selectedCliente, setSelectedCliente] = useState(null);
  
  // 1. Estado inicial actualizado con customer_id
  const initialFormState = { 
    customer_id: null, // Antes client_id
    firstName: '', 
    lastName: '', 
    documento: '', 
    email: '',
    telefono: '', 
    direccion: '', 
    estado: true, 
    tipoDocumento: 'CC', 
    tipoOrganizacion: 'Natural'
  };

  const [formData, setFormData] = useState(initialFormState);

  // 2. Mapeo de snake_case (DB) a camelCase (Formulario) actualizado
  const prepararEdicion = (c) => {
    setFormData({
      customer_id: c.customer_id, // Actualizado
      firstName: c.customer_first_name, // Actualizado
      lastName: c.customer_last_name, // Actualizado
      documento: c.customer_document_number, // Actualizado
      email: c.customer_email || '', // Actualizado
      telefono: c.customer_phone, // Actualizado
      direccion: c.customer_address || '', // Actualizado
      tipoDocumento: c.customer_document_type, // Actualizado
      tipoOrganizacion: c.organization_type, // Actualizado (Ojo: era organization_type en tu repo)
      estado: c.customer_status // Actualizado
    });
    setEditingCliente(c);
    setMostrarModalForm(true);
  };

  // 3. Filtro de búsqueda actualizado
  const filteredCustomers = useMemo(() => {
    if (!Array.isArray(customers)) return [];
    return customers.filter(c => {
      const nombreCompleto = `${c.customer_first_name} ${c.customer_last_name}`.toLowerCase();
      const busquedaLower = busqueda.toLowerCase();
      return (
        nombreCompleto.includes(busquedaLower) || 
        c.customer_document_number.toString().includes(busqueda) || // Actualizado
        c.customer_id.toString().includes(busqueda) // Actualizado
      );
    });
  }, [customers, busqueda]);

  if (loading) return <div style={{ padding: '20px', textAlign: 'center' }}>Cargando clientes de Makand...</div>;
  if (error) return <div style={{ padding: '20px', color: 'red', textAlign: 'center' }}>Error: {error}</div>;

  return (
    <div className="module-container" style={{ padding: '20px', backgroundColor: '#f3f4f6', minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', margin: 0 }}>Clientes</h1>
          <p style={{ color: '#6b7280', margin: 0 }}>Gestión de clientes - Makand</p>
        </div>
        <button 
          className="btn-primary" 
          onClick={() => { 
            setFormData(initialFormState); 
            setEditingCliente(null); 
            setMostrarModalForm(true); 
          }}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#ff6b35', color: 'white', padding: '10px 20px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}
        >
          <Plus size={20} /> Nuevo Cliente
        </button>
      </div>

      <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <div style={{ position: 'relative', marginBottom: '20px' }}>
          <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} size={18} />
          <input 
            type="text" 
            placeholder="Buscar por nombre o documento..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            style={{ width: '100%', padding: '12px 12px 12px 40px', borderRadius: '8px', border: '1px solid #e5e7eb', backgroundColor: '#f9fafb', outline: 'none' }}
          />
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #f3f4f6', textAlign: 'left', color: '#6b7280', fontSize: '13px' }}>
              <th style={{ padding: '12px' }}>ID</th>
              <th style={{ padding: '12px' }}>Nombre Completo</th>
              <th style={{ padding: '12px' }}>Documento</th>
              <th style={{ padding: '12px' }} className="text-center">Estado</th>
              <th style={{ padding: '12px' }} className="text-center">Gestión</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.map((c) => (
              <tr key={c.customer_id} style={{ borderBottom: '1px solid #f3f4f6', color: '#374151', fontSize: '14px' }}>
                <td style={{ padding: '12px' }}>#{c.customer_id}</td>
                <td style={{ padding: '12px' }}>{c.customer_first_name} {c.customer_last_name}</td>
                <td style={{ padding: '12px' }}>{c.customer_document_number}</td>
                <td style={{ padding: '12px', textAlign: 'center' }}>
                  <label style={{ position: 'relative', display: 'inline-block', width: '40px', height: '20px', cursor: 'pointer' }}>
                    <input 
                      type="checkbox" 
                      checked={c.customer_status} // Actualizado
                      onChange={() => toggleClienteEstado(c.customer_id, c.customer_status)} // Actualizado
                      style={{ opacity: 0, width: 0, height: 0 }} 
                    />
                    <span style={{ 
                      position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, 
                      backgroundColor: c.customer_status ? '#10b981' : '#d1d5db', 
                      transition: '.3s', borderRadius: '20px' 
                    }}>
                      <span style={{ 
                        position: 'absolute', height: '14px', width: '14px', 
                        left: c.customer_status ? '22px' : '4px', 
                        bottom: '3px', backgroundColor: 'white', 
                        transition: '.3s', borderRadius: '50%' 
                      }}></span>
                    </span>
                  </label>
                </td>
                <td style={{ padding: '12px', textAlign: 'center' }}>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                    <button onClick={() => { setSelectedCliente(c); setMostrarModalDetalle(true); }} style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer' }}>
                      <Eye size={18} />
                    </button>
                    <button onClick={() => prepararEdicion(c)} style={{ background: 'none', border: 'none', color: '#ff6b35', cursor: 'pointer' }}>
                      <Edit size={18} />
                    </button>
                    <button onClick={() => eliminarCliente(c.customer_id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>


      
      {/* MODALES */}
      <CustomerForm 
        isOpen={mostrarModalForm} 
        onClose={() => {
          setMostrarModalForm(false);
          setFormData(initialFormState);
        }} 
        formData={formData} 
        setFormData={setFormData} 
        isEditing={!!editingCliente}
        onSuccess={cargarClientes} 
      />
      
      <CustomerDetail 
        isOpen={mostrarModalDetalle} 
        onClose={() => setMostrarModalDetalle(false)} 
        cliente={selectedCliente} 
        onEdit={(c) => {
          setMostrarModalDetalle(false);
          prepararEdicion(c);
        }} 
      />
    </div>
  );
};

export default CustomerPage;