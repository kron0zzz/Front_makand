import { useState, useEffect } from 'react';
import { subRentalService } from '../../services/subRentalService';
import { useAlertModal } from "../../../../shared/alertModal";

const SubRentalForm = ({ isOpen, onClose, formData, setFormData, isEditing, onSuccess }) => {
  const [suppliers, setSuppliers] = useState([]);
  const [machines, setMachines] = useState([]);
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);
  const { showAlert } = useAlertModal();

  // 1. Carga de Catálogos desde la API al abrir el modal
  useEffect(() => {
    const cargarCatalogos = async () => {
      try {
        const token = localStorage.getItem('token')?.replace(/^"|"$/g, '');
        const headers = {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        };

        const [resSuppliers, resMachines] = await Promise.all([
          fetch('http://localhost:3000/api/suppliers', { method: 'GET', headers }),
          fetch('http://localhost:3000/api/machines', { method: 'GET', headers })
        ]);

        if (resSuppliers.ok) {
          const dataSuppliers = await resSuppliers.json();
          setSuppliers(dataSuppliers);
        }
        if (resMachines.ok) {
          const dataMachines = await resMachines.json();
          setMachines(dataMachines);
        }

      } catch (err) {
        console.error("Error al cargar catálogos en subalquileres:", err);
      }
    };

    if (isOpen) {
      cargarCatalogos();
    }
  }, [isOpen]);

  // 2. 🌟 SALVAGUARDA DE SINCRONIZACIÓN: Forzar actualización de IDs cuando los catálogos terminen de cargar
  useEffect(() => {
    if (isOpen && isEditing && (machines.length > 0 || suppliers.length > 0)) {
      setFormData(prev => ({
        ...prev,
        machinery_id: prev.machinery_id ? parseInt(prev.machinery_id, 10) : '',
        supplier_id: prev.supplier_id ? parseInt(prev.supplier_id, 10) : ''
      }));
    }
  }, [machines, suppliers, isOpen, isEditing, setFormData]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    let valorProcesado = value;
    if (name === 'supplier_id' || name === 'machinery_id') {
      valorProcesado = value === '' ? '' : parseInt(value, 10);
    } else if (name === 'sub_rental_status') {
      valorProcesado = value === 'true';
    }

    setFormData({
      ...formData,
      [name]: valorProcesado
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setCargando(true);

    try {
      if (isEditing) {
        await subRentalService.actualizar(formData.sub_rental_id, formData);
      } else {
        await subRentalService.crear(formData);
      }

      if (onSuccess) {
        await onSuccess();
      }

      onClose();
      await showAlert(isEditing ? '¡Subalquiler actualizado con éxito!' : '¡Subalquiler registrado con éxito!');
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.error || 'Error al procesar el subalquiler.';
      setError(msg);
      await showAlert(msg);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="form-modal-overlay">
      <div className="form-modal-container">
        <div className="form-header">
          <h2>{isEditing ? 'Editar Registro de Subalquiler' : 'Registrar Nuevo Subalquiler'}</h2>
          <button className="form-close-btn" onClick={onClose}>&times;</button>
        </div>

        {error && <div className="modal-error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="form-body">
          <div className="form-grid">
            
            {/* Selector de Maquinaria */}
            <div className="form-group">
              <label className="form-label">Maquinaria Asignada *</label>
              <select
                name="machinery_id"
                className="form-input"
                value={formData.machinery_id !== undefined && formData.machinery_id !== null ? formData.machinery_id : ''}
                onChange={handleChange}
                required
              >
                <option value="">Seleccione la maquinaria...</option>
                {machines.map((m) => {
                  // Evaluamos dinámicamente cómo se llama el ID del elemento del catálogo
                  const currentId = m.machinery_id || m.id || m.id_machinery;
                  return (
                    <option key={currentId} value={Number(currentId)}>
                      {m.machinery_name} {m.machinery_model ? `(${m.machinery_model})` : ''}
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Selector de Proveedor */}
            <div className="form-group">
              <label className="form-label">Proveedor Dueño *</label>
              <select
                name="supplier_id"
                className="form-input"
                value={formData.supplier_id !== undefined && formData.supplier_id !== null ? formData.supplier_id : ''}
                onChange={handleChange}
                required
              >
                <option value="">Seleccione el proveedor...</option>
                {suppliers.map((sup) => {
                  // Evaluamos dinámicamente cómo se llama el ID del elemento del catálogo
                  const currentSupId = sup.supplier_id || sup.id || sup.id_supplier;
                  return (
                    <option key={currentSupId} value={Number(currentSupId)}>
                      {sup.supplier_name}
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Costo del Subalquiler */}
            <div className="form-group">
              <label className="form-label">Costo de Subalquiler ($) *</label>
              <input
                type="number"
                step="0.01"
                name="supplier_cost"
                className="form-input"
                value={formData.supplier_cost !== undefined && formData.supplier_cost !== null ? formData.supplier_cost : ''}
                onChange={handleChange}
                placeholder="Ej: 450000.00"
                required
              />
            </div>

            {/* Estado del Subalquiler */}
            <div className="form-group">
              <label className="form-label">Estado del Proceso *</label>
              <select
                name="sub_rental_status"
                className="form-input"
                value={formData.sub_rental_status !== undefined ? String(formData.sub_rental_status) : 'true'}
                onChange={handleChange}
                required
              >
                <option value="true">Activo / En Curso</option>
                <option value="false">Finalizado / Retornado</option>
              </select>
            </div>

          </div>

          <div className="form-footer">
            <button type="button" className="btn-cancel" onClick={onClose} disabled={cargando}>
              Cancelar
            </button>
            <button type="submit" className="btn-submit" disabled={cargando}>
              {cargando ? 'Procesando...' : isEditing ? 'Guardar Cambios' : 'Registrar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubRentalForm;