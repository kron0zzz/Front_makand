import { useState, useEffect, useCallback } from 'react';
import { subRentalService } from '../../services/subRentalService';
import { useAlertModal } from "../../../../shared/alertModal";

const SubRentalForm = ({ isOpen, onClose, formData, setFormData, isEditing, onSuccess }) => {
  const [suppliers, setSuppliers] = useState([]);
  const [machines, setMachines] = useState([]);
  const [machineSearch, setMachineSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [loadingMachines, setLoadingMachines] = useState(false);
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);
  const { showAlert } = useAlertModal();

  const cargarMaquinas = useCallback(async () => {
    setLoadingMachines(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:3000/api/machines/table?page=1&limit=1000&search=",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      setMachines(data.data || []);
    } catch (err) {
      console.error("Error cargando máquinas:", err);
    } finally {
      setLoadingMachines(false);
    }
  }, []);

  const cargarProveedores = useCallback(async () => {
    try {
      const token = localStorage.getItem('token')?.replace(/^"|"$/g, '');
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
      };

      const resSuppliers = await fetch('http://localhost:3000/api/suppliers', { method: 'GET', headers });

      if (resSuppliers.ok) {
        const dataSuppliers = await resSuppliers.json();
        setSuppliers(dataSuppliers);
      }
    } catch (err) {
      console.error("Error al cargar proveedores:", err);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      cargarMaquinas();
      cargarProveedores();
    }
  }, [isOpen, cargarMaquinas, cargarProveedores]);

  useEffect(() => {
    if (isOpen && isEditing && (machines.length > 0 || suppliers.length > 0)) {
      setFormData(prev => ({
        ...prev,
        stock_id: prev.stock_id ? parseInt(prev.stock_id, 10) : '',
        supplier_id: prev.supplier_id ? parseInt(prev.supplier_id, 10) : ''
      }));
    }
  }, [machines, suppliers, isOpen, isEditing, setFormData]);

  const hasSubRentalStock = (machine) => {
    if (!machine.stock_details || !Array.isArray(machine.stock_details)) return false;
    return machine.stock_details.some(stock => stock.is_owned === false);
  };

  const filteredMachines = machines.filter((m) =>
    hasSubRentalStock(m) &&
    m.machinery_name.toLowerCase().includes(machineSearch.toLowerCase())
  );

  const handleMachineSelect = (machine) => {
    setMachineSearch(machine.machinery_name);
    
    const subRentalStock = machine.stock_details.find(stock => stock.is_owned === false);
    if (subRentalStock) {
      setFormData({ ...formData, stock_id: Number(subRentalStock.stock_id) });
    }
    setShowDropdown(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    let valorProcesado = value;
    if (name === 'supplier_id') {
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

  if (!isOpen) return null;

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
            
            {/* Selector de Maquinaria - Autocomplete */}
            <div className="form-group">
              <label className="form-label">Maquinaria Asignada *</label>
              <div className="machine-search-wrapper">
                <input
                  type="text"
                  className="form-input"
                  placeholder="Buscar maquinaria..."
                  value={machineSearch}
                  onChange={(e) => {
                    setMachineSearch(e.target.value);
                    setShowDropdown(true);
                  }}
                  onFocus={() => setShowDropdown(true)}
                  onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
                  required
                />
                {showDropdown && (
                  <ul className="machine-dropdown">
                    {loadingMachines ? (
                      <li className="machine-dropdown-item disabled">Cargando...</li>
                    ) : filteredMachines.length === 0 ? (
                      <li className="machine-dropdown-item disabled">Sin resultados</li>
                    ) : (
                      filteredMachines.map((machine) => (
                        <li
                          key={machine.machinery_id}
                          className="machine-dropdown-item"
                          onMouseDown={() => handleMachineSelect(machine)}
                        >
                          {machine.machinery_name}
                        </li>
                      ))
                    )}
                  </ul>
                )}
              </div>
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