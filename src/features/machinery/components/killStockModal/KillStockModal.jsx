import { useState } from "react";
import { X, Ban, AlertTriangle } from "lucide-react";
import "./KillStockModal.css";

const KillStockForm = ({ machinery, onClose, onConfirmar }) => {
  const [cantidad, setCantidad] = useState("");
  const [error, setError] = useState("");
  const [procesando, setProcesando] = useState(false);

  const disponibles = Number(machinery?.total_stock ?? 0);

  const validarCantidad = (valor) => {
    if (!valor) {
      return "Ingresa la cantidad de equipos no motorizados que vas a dar de baja.";
    }

    const numero = parseInt(valor, 10);

    if (!Number.isInteger(numero) || numero <= 0) {
      return "La cantidad debe ser un número entero mayor a cero.";
    }

    if (numero > disponibles) {
      return `La cantidad a dar de baja (${numero}) no puede ser superior a la cantidad disponible (${disponibles}).`;
    }

    return "";
  };

  const handleChange = (e) => {
    setCantidad(e.target.value.replace(/[^0-9]/g, ""));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const mensajeError = validarCantidad(cantidad);
    if (mensajeError) {
      setError(mensajeError);
      return;
    }

    setProcesando(true);
    const confirmado = await onConfirmar(parseInt(cantidad, 10));
    setProcesando(false);

    if (confirmado) {
      onClose();
    }
  };

  return (
    <div className="kill-modal-overlay">
      <div className="kill-modal-container">
        <div className="kill-modal-header">
          <h2>
            <Ban size={18} /> Dar de baja de maquinaria
          </h2>
          <button onClick={onClose} className="kill-modal-close" aria-label="Cerrar" disabled={procesando}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="kill-modal-body">
            <div className="kill-modal-info">
              <AlertTriangle size={18} />
              <div>
                <p>
                  Se descontarán <strong>{cantidad || 0}</strong> unidad(es) del stock de{" "}
                  <strong>{machinery.machinery_name}</strong>.
                </p>
                <p className="kill-modal-hint">
                  Si la cantidad restante llega a 0, el estado del stock cambiará a "No disponible".
                </p>
              </div>
            </div>

            <div className="kill-modal-field">
              <label className="kill-modal-label" htmlFor="kill-cantidad">
                Cantidad de equipos a dar de baja
              </label>
              <input
                id="kill-cantidad"
                type="text"
                inputMode="numeric"
                className={`kill-modal-input ${error ? "kill-modal-input-error" : ""}`}
                placeholder="Ej: 10"
                value={cantidad}
                onChange={handleChange}
                disabled={procesando || disponibles <= 0}
                autoFocus
              />
              <span className="kill-modal-available">Cantidad disponible: {disponibles} unds</span>
            </div>

            {error && <div className="kill-modal-error">{error}</div>}
            {disponibles <= 0 && (
              <div className="kill-modal-error">
                No hay unidades disponibles de esta maquinaria para dar de baja.
              </div>
            )}
          </div>

          <div className="kill-modal-footer">
            <button type="button" className="kill-modal-btn cancel" onClick={onClose} disabled={procesando}>
              Cancelar
            </button>
            <button type="submit" className="kill-modal-btn danger" disabled={procesando || disponibles <= 0}>
              <Ban size={16} />
              {procesando ? "Procesando..." : "Dar de baja"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const KillStockModal = ({ isOpen, onClose, machinery, onConfirmar }) => {
  if (!isOpen || !machinery) return null;

  return <KillStockForm machinery={machinery} onClose={onClose} onConfirmar={onConfirmar} />;
};

export default KillStockModal;
