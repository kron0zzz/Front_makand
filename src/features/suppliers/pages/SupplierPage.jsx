import { useState, useMemo, useEffect } from 'react';
import { Plus, Search, Eye, Edit, Trash2 } from 'lucide-react';
import { useSuppliers } from '../hooks/useSuppliers'; 
import { useAuth } from "../../../shared/context/AuthContext";
import { supplierService } from "../services/suppliersService";

import SupplierForm from '../components/supplierForm/SupplierForm';
import SupplierDetail from '../components/supplierDetail/SupplierDetail';
import './SupplierPage.css';

import Pagination from '../../../shared/components/pagination/Pagination';
import useDebounce from "../../../shared/hooks/useDebounce";

const SupplierPage = () => {
  const { 
    suppliers, 
    cargarProveedores, 
    eliminarProveedor, 
    toggleProveedorEstado,
    
    page,
    cambiarPagina,
    cambiarBusqueda,
    pagination
  } = useSuppliers();

  const { hasPermission } = useAuth();
  const [busqueda, setBusqueda] = useState('');
  const [formData, setFormData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [mostrarModalForm, setMostrarModalForm] = useState(false);
  const [mostrarModalDetalle, setMostrarModalDetalle] = useState(false);
  const [supplierSeleccionado, setSupplierSeleccionado] = useState(null);


  const cargarProveedor = async (id, accion) => {
    try {
      const proveedor = await supplierService.obtenerPorId(id);

      if (accion === "detalle") {
        setSupplierSeleccionado(proveedor);
        setMostrarModalDetalle(true);
      }

      if (accion === "editar") {
        setFormData(proveedor);
        setIsEditing(true);
        setMostrarModalForm(true);
      }

    } catch (error) {
      console.error(error);
      alert("No se pudo cargar la información del proveedor.");
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
          
          {hasPermission('Crear Proveedor') && (
            <button className="btn-nuevo" onClick={() => { setIsEditing(false); setFormData({}); setMostrarModalForm(true); }}>
              <Plus size={20} /> Nuevo Proveedor
            </button>
          )}
        </div>
      </div>

      <div className="table-wrapper">
        <table className="custom-table">
          <thead>
            <tr>
              <th>ID</th><th>Número de documento</th><th>Nombre</th><th>Ciudad</th><th>Estado</th><th>Gestión</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.length > 0 ? (
              suppliers.map((s) => (
              <tr key={s.supplier_id}>
                <td>#{s.supplier_id}</td>
                <td>{s.document_number}</td>
                <td>{s.supplier_name}</td>
                <td>{s.supplier_city}</td>
                <td>
                  <label className="switch">
                    <input 
                      type="checkbox" 
                      checked={!!s.supplier_status} 
                      onChange={() => toggleProveedorEstado(s.supplier_id, s.supplier_status)} 
                    />
                    <span className="slider round"></span>
                  </label>
                </td>
                <td className="actions-cell">
                  {hasPermission('Ver Detalle de Proveedor') && (
                    <button className="action-btn view" onClick={() => cargarProveedor(s.supplier_id, "detalle")}><Eye size={18} /></button>
                  )}
                  {hasPermission('Editar Proveedor') && (
                    <button className="action-btn edit" onClick={() => cargarProveedor(s.supplier_id, "editar")}><Edit size={18} /></button>
                  )}
                  {hasPermission('Eliminar Proveedor') && (
                    <button className="action-btn delete" onClick={() => eliminarProveedor(s.supplier_id)}><Trash2 size={18} /></button>
                  )}
                </td>
              </tr>
            ))):(
              <tr>
                <td><p>No se pudieron encontrar los proveedores</p></td>
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

      <SupplierForm 
        isOpen={mostrarModalForm} 
        onClose={() => { setMostrarModalForm(false); cargarProveedores(); }} 
        formData={formData} 
        setFormData={setFormData} 
        isEditing={isEditing} 
      />
      <SupplierDetail 
        isOpen={mostrarModalDetalle} 
        onClose={() => setMostrarModalDetalle(false)} 
        proveedor={supplierSeleccionado}
        onEdit={(prov) => {
          setMostrarModalDetalle(false); 
          setIsEditing(true);            
          setFormData(prov);            
          setMostrarModalForm(true);    
        }}
      />
    </div>
  );
};

export default SupplierPage;