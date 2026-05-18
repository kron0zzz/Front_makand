import { useState, useMemo } from 'react';
import { Plus, Search, Eye, Edit, Trash2 } from 'lucide-react';

import { useSuppliers } from '../hooks/useSuppliers';
import SupplierForm from '../components/SupplierForm';
import SupplierDetail from '../components/SupplierDetail';

const SupplierPage = () => {

  const {
    suppliers,
    loading,
    error,
    toggleProveedorEstado,
    eliminarProveedor,
    cargarProveedores,
  } = useSuppliers();

  const [busqueda, setBusqueda] = useState('');
  const [mostrarModalForm, setMostrarModalForm] = useState(false);
  const [mostrarModalDetalle, setMostrarModalDetalle] = useState(false);

  const [editingProveedor, setEditingProveedor] = useState(null);
  const [selectedProveedor, setSelectedProveedor] = useState(null);

  // Estado inicial corregido y unificado
  const initialFormState = {
    supplier_id: null,
    document_number: '',
    document_type: 'CC',
    supplier_name: '',
    supplier_phone: '',
    supplier_address: '',
    supplier_email: '',
    supplier_state: 'Antioquia',
    supplier_city: 'Medellín',
    supplier_status: true
  };

  const [formData, setFormData] = useState(initialFormState);

  // Preparar edición
  const prepararEdicion = (s) => {

    setFormData({
      supplier_id: s.supplier_id,

      document_number: s.document_number || '',
      document_type: s.document_type || 'CC',

      supplier_name: s.supplier_name || '',
      supplier_phone: s.supplier_phone || '',
      supplier_address: s.supplier_address || '',
      supplier_email: s.supplier_email || '',

      supplier_state: s.supplier_state || 'Antioquia',
      supplier_city: s.supplier_city || 'Medellín',

      supplier_status: s.supplier_status ?? true
    });

    setEditingProveedor(s);
    setMostrarModalForm(true);
  };

  // Filtro de búsqueda corregido
  const filteredSuppliers = useMemo(() => {

    if (!Array.isArray(suppliers)) return [];

    return suppliers.filter((s) => {

      const busquedaLower = busqueda.toLowerCase();

      return (
        s.supplier_name?.toLowerCase().includes(busquedaLower) ||
        s.document_number?.toString().includes(busqueda) ||
        s.supplier_id?.toString().includes(busqueda)
      );

    });

  }, [suppliers, busqueda]);

  // Loading
  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        Cargando proveedores de Makand...
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div style={{ padding: '20px', color: 'red', textAlign: 'center' }}>
        Error: {error}
      </div>
    );
  }

  return (

    <div
      className="module-container"
      style={{
        padding: '20px',
        backgroundColor: '#f3f4f6',
        minHeight: '100vh'
      }}
    >

      {/* HEADER */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px'
        }}
      >

        <div>
          <h1
            style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#111827',
              margin: 0
            }}
          >
            Proveedores
          </h1>

          <p
            style={{
              color: '#6b7280',
              margin: 0
            }}
          >
            Gestión de proveedores - Makand
          </p>
        </div>

        <button
          className="btn-primary"
          onClick={() => {

            setFormData(initialFormState);
            setEditingProveedor(null);
            setMostrarModalForm(true);

          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#ff6b35',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '8px',
            border: 'none',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          <Plus size={20} />
          Nuevo Proveedor
        </button>

      </div>

      {/* TABLA */}
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}
      >

        {/* BUSCADOR */}
        <div
          style={{
            position: 'relative',
            marginBottom: '20px'
          }}
        >

          <Search
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#9ca3af'
            }}
            size={18}
          />

          <input
            type="text"
            placeholder="Buscar por nombre o documento..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 12px 12px 40px',
              borderRadius: '8px',
              border: '1px solid #e5e7eb',
              backgroundColor: '#f9fafb',
              outline: 'none'
            }}
          />

        </div>

        {/* TABLA */}
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse'
          }}
        >

          <thead>

            <tr
              style={{
                borderBottom: '1px solid #f3f4f6',
                textAlign: 'left',
                color: '#6b7280',
                fontSize: '13px'
              }}
            >

              <th style={{ padding: '12px' }}>ID</th>
              <th style={{ padding: '12px' }}>Documento</th>
              <th style={{ padding: '12px' }}>Nombre</th>
              <th style={{ padding: '12px' }}>Ciudad</th>
              <th style={{ padding: '12px', textAlign: 'center' }}>Estado</th>
              <th style={{ padding: '12px', textAlign: 'center' }}>Gestión</th>

            </tr>

          </thead>

          <tbody>

            {filteredSuppliers.map((s) => (

              <tr
                key={s.supplier_id}
                style={{
                  borderBottom: '1px solid #f3f4f6',
                  color: '#374151',
                  fontSize: '14px'
                }}
              >

                <td style={{ padding: '12px' }}>
                  #{s.supplier_id}
                </td>

                <td style={{ padding: '12px' }}>
                  {s.document_number}
                </td>

                <td style={{ padding: '12px' }}>
                  {s.supplier_name}
                </td>

                <td style={{ padding: '12px' }}>
                  {s.supplier_city}
                </td>

                {/* ESTADO */}
                <td
                  style={{
                    padding: '12px',
                    textAlign: 'center'
                  }}
                >

                  <label
                    style={{
                      position: 'relative',
                      display: 'inline-block',
                      width: '40px',
                      height: '20px',
                      cursor: 'pointer'
                    }}
                  >

                    <input
                      type="checkbox"
                      checked={s.supplier_status}
                      onChange={() =>
                        toggleProveedorEstado(
                          s.supplier_id,
                          s.supplier_status
                        )
                      }
                      style={{
                        opacity: 0,
                        width: 0,
                        height: 0
                      }}
                    />

                    <span
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: s.supplier_status
                          ? '#10b981'
                          : '#d1d5db',
                        transition: '.3s',
                        borderRadius: '20px'
                      }}
                    >

                      <span
                        style={{
                          position: 'absolute',
                          height: '14px',
                          width: '14px',
                          left: s.supplier_status ? '22px' : '4px',
                          bottom: '3px',
                          backgroundColor: 'white',
                          transition: '.3s',
                          borderRadius: '50%'
                        }}
                      />

                    </span>

                  </label>

                </td>

                {/* ACCIONES */}
                <td
                  style={{
                    padding: '12px',
                    textAlign: 'center'
                  }}
                >

                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      gap: '10px'
                    }}
                  >

                    <button
                      onClick={() => {

                        setSelectedProveedor(s);
                        setMostrarModalDetalle(true);

                      }}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#3b82f6',
                        cursor: 'pointer'
                      }}
                    >
                      <Eye size={18} />
                    </button>

                    <button
                      onClick={() => prepararEdicion(s)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#ff6b35',
                        cursor: 'pointer'
                      }}
                    >
                      <Edit size={18} />
                    </button>

                    <button
                      onClick={() => eliminarProveedor(s.supplier_id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#ef4444',
                        cursor: 'pointer'
                      }}
                    >
                      <Trash2 size={18} />
                    </button>

                  </div>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

      {/* MODAL FORM */}
      <SupplierForm
        isOpen={mostrarModalForm}
        onClose={() => {

          setMostrarModalForm(false);
          setFormData(initialFormState);

        }}
        formData={formData}
        setFormData={setFormData}
        isEditing={!!editingProveedor}
        onSuccess={cargarProveedores}
      />

      {/* MODAL DETAIL */}
      <SupplierDetail
        isOpen={mostrarModalDetalle}
        onClose={() => setMostrarModalDetalle(false)}
        proveedor={selectedProveedor}
        onEdit={(s) => {

          setMostrarModalDetalle(false);
          prepararEdicion(s);

        }}
      />

    </div>

  );

};

export default SupplierPage;