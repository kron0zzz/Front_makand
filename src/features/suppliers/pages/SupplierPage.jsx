import { useState, useMemo, useEffect } from 'react';
import { Plus, Search, Eye, Edit, Trash2 } from 'lucide-react';
import { useSuppliers } from '../hooks/useSuppliers'; 
import SupplierForm from '../components/supplierForm/SupplierForm';
import SupplierDetail from '../components/supplierDetail/SupplierDetail';
import './SupplierPage.css';

const SupplierPage = () => {
  const { suppliers, cargarProveedores, eliminarProveedor } = useSuppliers();
  const [busqueda, setBusqueda] = useState('');
  const [formData, setFormData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [mostrarModalForm, setMostrarModalForm] = useState(false);
  const [mostrarModalDetalle, setMostrarModalDetalle] = useState(false);
  const [supplierSeleccionado, setSupplierSeleccionado] = useState(null);

  useEffect(() => {
    cargarProveedores();
  }, [cargarProveedores]);

  // Nueva función para cambiar el estado con advertencia
  const handleToggleEstado = async (supplier) => {
    const nuevoEstado = !supplier.supplier_status;
    const accion = nuevoEstado ? 'ACTIVAR' : 'DESACTIVAR';
    const mensaje = `¿Estás seguro de que deseas ${accion} al proveedor ${supplier.supplier_name}?`;
    
    if (window.confirm(mensaje)) {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`http://localhost:3000/api/suppliers/${supplier.supplier_id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({
            document_type: supplier.document_type,
            document_number: supplier.document_number,
            supplier_status: nuevoEstado,
            supplier_name: supplier.supplier_name,
            supplier_address: supplier.supplier_address,
            supplier_phone: supplier.supplier_phone,
            supplier_email: supplier.supplier_email,
            supplier_state: supplier.supplier_state,
            supplier_city: supplier.supplier_city
          })
        });

        if (response.ok) {
          await cargarProveedores();
        } else {
          alert("No se pudo actualizar el estado del Proveedor.");
        }
      } catch (error) {
        console.error("Error al cambiar estado:", error);
        alert("Error de conexión con el servidor.");
      }
    }
  };

  const suppliersFiltrados = useMemo(() => {
    const datos = Array.isArray(suppliers) ? suppliers : [];
    const termino = busqueda.toLowerCase();
    
    return datos.filter(s => {
      const nombreCompleto = `${s.supplier_name}`.toLowerCase();
      const documento = s.document_number?.toString() || '';
      return nombreCompleto.includes(termino) || documento.includes(termino);
    });
  }, [suppliers, busqueda]);

  const prepararEdicion = (supplier) => {
    setIsEditing(true);
    setFormData({
      supplier_id: supplier.supplier_id,
      document_type: supplier.document_type,
      document_number: supplier.document_number,
      supplier_status: supplier.supplier_status,
      supplier_name: supplier.supplier_name,
      supplier_address: supplier.supplier_address,
      supplier_phone: supplier.supplier_phone,
      supplier_email: supplier.supplier_email,
      supplier_state: supplier.supplier_state,
      supplier_city: supplier.supplier_city
    });
    setMostrarModalForm(true);
  };

  return (
    <div className="page-container">
      <div className="header-container">
        <div className="header-text">
          <h1>Proveedores</h1>
          <p>Gestión de proveedores - Makand</p>
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
            Nuevo Proveedor
          </button>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="custom-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Numero de documento</th>
              <th>Nombre</th>
              <th>Ciudad</th>
              <th>Estado</th>
              <th>Gestión</th>
            </tr>
          </thead>
          <tbody>
            {suppliersFiltrados.length > 0 ? (
              suppliersFiltrados.map((supplier) => (
                <tr key={supplier.supplier_id}>
                  <td>#{supplier.supplier_id}</td>
                  <td>{supplier.document_number}</td>
                  <td>{supplier.supplier_name}</td>
                  <td>{supplier.supplier_city}</td>
                  <td>
                    {/* Switch interactivo para el Estado */}
                    <label className="switch">
                      <input 
                        type="checkbox" 
                        checked={supplier.supplier_status} 
                        onChange={() => handleToggleEstado(supplier)} 
                      />
                      <span className="slider round"></span>
                    </label>
                  </td>
                  <td className="actions-cell">
                    <button className="action-btn view" title="Ver" onClick={() => { setSupplierSeleccionado(supplier); setMostrarModalDetalle(true); }}><Eye size={18} /></button>
                    <button className="action-btn edit" title="Editar" onClick={() => prepararEdicion(supplier)}><Edit size={18} /></button>
                    <button className="action-btn delete" title="Eliminar" onClick={() => eliminarProveedor(supplier.supplier_id)}><Trash2 size={18} /></button>
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

      <SupplierForm 
        isOpen={mostrarModalForm} 
        onClose={async () => { setMostrarModalForm(false); await cargarProveedores(); }}
        formData={formData}
        setFormData={setFormData}
        isEditing={isEditing}
      />
      
      <SupplierDetail 
        isOpen={mostrarModalDetalle}
        onClose={() => setMostrarModalDetalle(false)}
        proveedor={supplierSeleccionado}
        onEdit={(proveedor) => {
          setMostrarModalDetalle(false);
          prepararEdicion(proveedor);
        }}
      />
    </div>
  );
};

export default SupplierPage;