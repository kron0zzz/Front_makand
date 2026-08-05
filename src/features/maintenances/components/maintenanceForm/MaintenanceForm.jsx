import { useState, useEffect, useCallback } from 'react';
import { X } from 'lucide-react';
import { useMaintenances } from "../../hooks/useMaintenances";
import { maintenanceService } from "../../services/maintenanceService";
import './MaintenanceForm.css';
import { useAlertModal } from "../../../../shared/alertModal";
import StockSelectionModal from "../../../../shared/components/stockSelection/StockSelectionModal";

const MaintenanceForm = ({ isOpen, onClose, formData, setFormData, isEditing }) => {
  const { showAlert, showConfirm } = useAlertModal();
  const { cargarMaintenances } = useMaintenances();
  const [machines, setMachines] = useState([]);
  const [machineSearch, setMachineSearch] = useState("");
  const [selectedMachine, setSelectedMachine] = useState(null);
  const [selectedStocks, setSelectedStocks] = useState([]);
  const [stockModalOpen, setStockModalOpen] = useState(false);
  const [loadingMachines, setLoadingMachines] = useState(false);

  useEffect(() => {
    if (isOpen) {
      cargarMaquinas();
    }
  }, [isOpen]);

  useEffect(() => {
    if (isEditing && formData?.stock_id) {
      const stockId = formData.stock_id;
      const stock = selectedStocks.find((s) => s.stock_id === stockId);
      if (stock) return;
      fetchStockForForm(stockId);
    }
  }, [isEditing, formData?.stock_id, isOpen]);

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

  const fetchStockForForm = async (stockId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:3000/api/stock/table?search=&page=1&limit=1000`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      const stock = (data.data || []).find(
        (s) => Number(s.stock_id) === Number(stockId)
      );
      if (stock) {
        setSelectedStocks([stock]);
        setSelectedMachine({
          machinery_id: stock.machinery_id,
          machinery_name: stock.machinery_name,
        });
      }
    } catch (err) {
      console.error("Error cargando stock:", err);
    }
  };

  const filteredMachines = machines.filter((m) =>
    m.machinery_name.toLowerCase().includes(machineSearch.toLowerCase())
  );

  const handleMachineSelect = (machine) => {
    setSelectedMachine(machine);
    setMachineSearch(machine.machinery_name);
    setFormData({ ...formData, machinery_id: machine.machinery_id });
    setSelectedStocks([]);
  };

  const openStockModal = () => {
    if (!selectedMachine) return;
    setStockModalOpen(true);
  };

  const handleStockConfirm = (stocks) => {
    setSelectedStocks(stocks);
    setStockModalOpen(false);
  };

  const removeStock = (stockId) => {
    setSelectedStocks((prev) => prev.filter((s) => s.stock_id !== stockId));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedStocks.length === 0) {
      await showAlert("Debes seleccionar al menos una máquina en mantenimiento.");
      return;
    }
    const dataToSend = {
      maintenance_date: formData.maintenance_date,
      revision_notes: formData.revision_notes || "",
    };
    try {
      for (const stock of selectedStocks) {
        await maintenanceService.crear({ ...dataToSend, stock_id: stock.stock_id });
      }
      await cargarMaintenances();
      setSelectedStocks([]);
      setSelectedMachine(null);
      setMachineSearch("");
      onClose();
      await showAlert(
        `Mantenimiento registrado para ${selectedStocks.length} máquina(s) correctamente.`
      );
    } catch (err) {
      console.error("Error al crear mantenimiento:", err);
      await showAlert(
        err.response?.data?.message || "Error al registrar el mantenimiento."
      );
    }
  };

  const fechaLimpia = formData.maintenance_date
    ? formData.maintenance_date.split("T")[0]
    : "";

  if (!isOpen) return null;

  return (
    <div className="form-modal-overlay">
      <div className="form-modal-container">
        <div className="form-header">
          <h2>
            {isEditing ? "Editar Mantenimiento" : "Registrar Nuevo Mantenimiento"}
          </h2>
          <button type="button" onClick={onClose} className="form-close-btn">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="form-body">
          <div className="form-grid">
            <div>
              <label className="form-label">ID</label>
              <input
                type="text"
                className="form-input form-input-disabled"
                value={isEditing ? `ID: ${formData.maintenance_id}` : "Asignado automáticamente"}
                disabled
              />
            </div>

            <div>
              <label className="form-label">Máquina *</label>
              <div className="machine-search-wrapper">
                <input
                  type="text"
                  className="form-input"
                  placeholder="Buscar máquina..."
                  value={machineSearch}
                  onChange={(e) => {
                    setMachineSearch(e.target.value);
                    if (!isEditing) {
                      setSelectedMachine(null);
                      setSelectedStocks([]);
                    }
                  }}
                  onFocus={() => setMachineSearch("")}
                  required
                />
                {machineSearch && (
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

            {selectedMachine && (
              <div className="machine-selected-row">
                <span className="machine-selected-name">
                  {selectedMachine.machinery_name}
                </span>
                <button
                  type="button"
                  className="btn-secondary btn-sm"
                  onClick={openStockModal}
                >
                  Seleccionar Equipos ({selectedStocks.length})
                </button>
              </div>
            )}

            {selectedStocks.length > 0 && (
              <div className="selected-stocks-tags">
                {selectedStocks.map((stock) => (
                  <span key={stock.stock_id} className="stock-tag">
                    #{stock.stock_id} - {stock.machinery_name}{" "}
                    {stock.serial_number ? `(${stock.serial_number})` : ""}
                    <button
                      type="button"
                      className="stock-tag-remove"
                      onMouseDown={() => removeStock(stock.stock_id)}
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>
            )}

            <div>
              <label className="form-label">Fecha de Mantenimiento *</label>
              <input
                name="maintenance_date"
                type="date"
                className="form-input"
                value={fechaLimpia}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="form-label">Notas de Revisión</label>
              <textarea
                name="revision_notes"
                className="form-input"
                value={formData.revision_notes || ""}
                onChange={handleChange}
                rows="3"
              />
            </div>
          </div>

          <div className="form-footer">
            <button type="button" onClick={onClose} className="btn-cancel">
              Cancelar
            </button>
            <button type="submit" className="btn-submit">
              {isEditing ? "Guardar Cambios" : "Registrar Mantenimiento"}
            </button>
          </div>
        </form>
      </div>

      <StockSelectionModal
        key={selectedMachine?.machinery_id}
        isOpen={stockModalOpen}
        onClose={() => setStockModalOpen(false)}
        machinery={selectedMachine}
        onConfirm={handleStockConfirm}
        initialSelectedIds={selectedStocks}
        statusFilter={2}
      />
    </div>
  );
};

export default MaintenanceForm;