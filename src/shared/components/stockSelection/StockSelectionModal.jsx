import { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";
import "./StockSelectionModal.css";

const StockSelectionModal = ({
  isOpen,
  onClose,
  machinery,
  onConfirm,
  initialSelectedIds = [],
  statusFilter = 1,
  preloadedStocks = null
}) => {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const prevIsOpenRef = useRef(false);

  useEffect(() => {
    if (!isOpen || !machinery) return;

    const loadStocks = async () => {
      if (preloadedStocks) {
        const filtered = (preloadedStocks || [])
          .filter(
            (s) => Number(s.machinery_id) === Number(machinery.machinery_id)
          )
          .filter((s) => !statusFilter || Number(s.status_id) === Number(statusFilter));
        setStocks(filtered);
        return;
      }

      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `http://localhost:3000/api/stock/table?search=${encodeURIComponent(machinery.machinery_name || "")}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        const filtered = (data.data || [])
          .filter(
            (s) => Number(s.machinery_id) === Number(machinery.machinery_id)
          )
          .filter((s) => !statusFilter || Number(s.status_id) === Number(statusFilter));
        setStocks(filtered);
      } catch (error) {
        console.error("Error al cargar stock:", error);
      } finally {
        setLoading(false);
      }
    };

    loadStocks();
  }, [isOpen, machinery, statusFilter, preloadedStocks]);

  useEffect(() => {
    if (isOpen && !prevIsOpenRef.current) {
      setSelectedIds(
        initialSelectedIds.map((s) => (typeof s === "object" ? s.stock_id : s))
      );
    }
    prevIsOpenRef.current = isOpen;
  }, [isOpen, initialSelectedIds]);

  if (!isOpen || !machinery) return null;

  const toggleStock = (stockId) => {
    setSelectedIds((prev) =>
      prev.includes(stockId)
        ? prev.filter((id) => id !== stockId)
        : [...prev, stockId]
    );
  };

  const handleConfirm = () => {
    const selectedStocks = stocks.filter((s) => selectedIds.includes(s.stock_id));
    onConfirm(selectedStocks);
    onClose();
  };

  return (
    <div className="stock-modal-overlay">
      <div className="stock-modal-container">
        <div className="stock-modal-header">
          <h2>Seleccionar Equipos</h2>
          <span className="stock-modal-machine-name">{machinery.machinery_name}</span>
          <button type="button" onClick={onClose} className="stock-modal-close">
            <X size={20} />
          </button>
        </div>

        <div className="stock-modal-body">
          {loading ? (
            <p className="stock-modal-loading">Cargando equipos disponibles...</p>
          ) : stocks.length === 0 ? (
            <p className="stock-modal-empty">
              No hay equipos disponibles para esta máquina.
            </p>
          ) : (
            <div className="stock-modal-list">
              {stocks.map((stock) => {
                const checked = selectedIds.includes(stock.stock_id);
                return (
                  <label
                    key={stock.stock_id}
                    className={`stock-card ${checked ? "checked" : ""}`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleStock(stock.stock_id)}
                    />
                    <div className="stock-card-content">
                      <div className="stock-card-main">
                        <span className="stock-card-serial">
                          {stock.serial_number || `#${stock.stock_id}`}
                        </span>
                        <span className="stock-card-id">ID: {stock.stock_id}</span>
                      </div>
                      <span
                        className={`stock-card-badge stock-card-badge-${(stock.status_name || "").toLowerCase().replace(/\s+/g, "-")}`}
                      >
                        {stock.status_name || "DESCONOCIDO"}
                      </span>
                    </div>
                  </label>
                );
              })}
            </div>
          )}
        </div>

        <div className="stock-modal-footer">
          <button type="button" onClick={onClose} className="btn-cancel">
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="btn-submit"
            disabled={loading || selectedIds.length === 0}
          >
            Confirmar ({selectedIds.length})
          </button>
        </div>
      </div>
    </div>
  );
};

export default StockSelectionModal;
