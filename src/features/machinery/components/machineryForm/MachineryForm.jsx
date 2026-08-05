import { useState, useEffect } from "react";
import { X, Save, Package, Settings2, Wrench } from "lucide-react";
import { useAlertModal } from "../../../../shared/alertModal";
import MotorizedStockEditor from "./MotorizedStockEditor";
import "./MachineryForm.css";

const MachineryForm = ({ isOpen, onClose, formData, setFormData, isEditing, crearMaquinaria, actualizarMaquinaria }) => {
  const { showAlert } = useAlertModal();

  const [categories, setCategories] = useState([]);
  const [errorForm, setErrorForm] = useState("");

  useEffect(() => {
    const cargarOpciones = async () => {
      try {
        setErrorForm("");
        const token = localStorage.getItem("token");
        const [resCategories] = await Promise.all([
          fetch("http://localhost:3000/api/machine-categories", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (resCategories.ok) {
          const datos = await resCategories.json();
          setCategories(datos);
        }
      } catch (error) {
        console.error("Error al cargar categorías:", error);
        setErrorForm("No se pudieron cargar las categorías.");
      }
    };

    if (isOpen) {
      cargarOpciones();
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && isEditing && !formData.category_id && categories.length > 0) {
      const encontrada = categories.find(
        (c) =>
          (c.category_name || "").toLowerCase() ===
          (formData.category_name || "").toLowerCase()
      );
      if (encontrada) {
        const id = encontrada.category_id || encontrada.machinery_category_id;
        setFormData((prev) => ({ ...prev, category_id: id ? id.toString() : "" }));
      }
    }
  }, [isOpen, isEditing, formData, categories, setFormData]);

  if (!isOpen) return null;

  const handleMotorizedChange = (e) => {
    const isMotorized = e.target.checked;
    setFormData((prev) => ({
      ...prev,
      is_motorized: isMotorized,
      stock_quantity: isMotorized ? "" : (prev.stock_quantity || ""),
      teamCount: isMotorized ? 0 : (prev.teamCount || 0),
      teams: [],
    }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorForm("");

    const dataToSend = {
      category_id: parseInt(formData.category_id),
      machinery_name: formData.machinery_name,
      machinery_description: formData.machinery_description || "",
      sale_price: parseFloat(formData.sale_price) || 0,
      daily_rental_price: parseFloat(formData.daily_rental_price) || 0,
      weight_kg: formData.weight_kg ? parseFloat(formData.weight_kg) : null,
      is_motorized: !!formData.is_motorized,
    };

    try {
      let result;

      if (isEditing) {
        result = await actualizarMaquinaria(formData.machinery_id, dataToSend);
      } else {
        const stockData = {
          stock_quantity: formData.stock_quantity
            ? parseInt(formData.stock_quantity)
            : 0,
          teams: formData.teams || [],
        };
        result = await crearMaquinaria(dataToSend, stockData);
      }

      if (result) {
        await showAlert(
          isEditing
            ? "¡Maquinaria actualizada con éxito!"
            : "¡Maquinaria registrada con éxito!"
        );
        onClose();
      } else {
        setErrorForm("Ocurrió un problema en el servidor al intentar guardar la maquinaria.");
      }
    } catch (error) {
      setErrorForm(error.message || "Error al guardar la maquinaria.");
    }
  };

  const isMotorized = !!formData.is_motorized;

  return (
    <div className="form-modal-overlay">
      <div className="form-modal-container">
        <div className="form-header">
          <h2>
            {isEditing ? "Editar Maquinaria" : "Registrar Nueva Maquinaria"}
          </h2>
          <button type="button" onClick={onClose} className="form-close-btn">
            <X size={20} />
          </button>
        </div>

        {errorForm && (
          <div className="form-error-alert">{errorForm}</div>
        )}

        <form onSubmit={handleSubmit} className="form-body">
          {/* ── Sección Catálogo ── */}
          <div className="form-section">
            <div className="form-section-title">
              <Settings2 size={16} />
              Información del Catálogo
            </div>

            <div className="form-grid">
              <div>
                <label className="form-label">Nombre *</label>
                <input
                  name="machinery_name"
                  type="text"
                  className="form-input"
                  value={formData.machinery_name || ""}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="form-label">Categoría *</label>
                <select
                  name="category_id"
                  className="form-input"
                  value={formData.category_id ? formData.category_id.toString() : ""}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccione una categoría</option>
                  {categories.map((cat) => {
                    const id = cat.category_id || cat.machinery_category_id;
                    const name = cat.category_name || cat.machinery_category_name;
                    return (
                      <option key={id?.toString()} value={id?.toString()}>
                        {name}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div>
                <label className="form-label">Precio de Venta ($) *</label>
                <input
                  name="sale_price"
                  type="text"
                  className="form-input"
                  value={formData.sale_price ?? ""}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="form-label">Alquiler Diario ($) *</label>
                <input
                  name="daily_rental_price"
                  type="text"
                  className="form-input"
                  value={formData.daily_rental_price ?? ""}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="form-label">Peso (Kg)</label>
                <input
                  name="weight_kg"
                  type="number"
                  min="0"
                  step="0.01"
                  className="form-input"
                  value={formData.weight_kg ?? ""}
                  onChange={handleChange}
                />
              </div>

              <div className="checkbox-field-container">
                <input
                  name="is_motorized"
                  type="checkbox"
                  id="is_motorized"
                  className="motorized-checkbox"
                  checked={!!formData.is_motorized}
                  onChange={handleMotorizedChange}
                  disabled={isEditing}
                />
                <label htmlFor="is_motorized" className="form-label motorized-label">
                  <span className="checkbox-text">¿Es Motorizado?</span>
                  <span className="checkbox-desc">Tipo de equipo que requiere registro individual por unidad</span>
                </label>
              </div>

              <div className="form-full-width">
                <label className="form-label">Descripción</label>
                <textarea
                  name="machinery_description"
                  rows="3"
                  className="form-input"
                  value={formData.machinery_description || ""}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* ── Sección Inventario ── */}
          {!isEditing && (
            <div className="form-section">
              <div className="form-section-title">
                <Package size={16} />
                {isMotorized ? "Equipos a Registrar" : "Inventario"}
              </div>

              {isMotorized ? (
                <MotorizedStockEditor
                  quantity={formData.teamCount || 0}
                  machineryName={formData.machinery_name || ""}
                  existingSerials={formData.existingSerials || []}
                  onQuantityChange={(val) => {
                    setFormData((prev) => ({ ...prev, teamCount: val }));
                  }}
                  onTeamsChange={(teams) => {
                    setFormData((prev) => ({ ...prev, teams }));
                  }}
                />
              ) : (
                <div className="inventory-card">
                  <div className="inventory-field">
                    <label className="form-label">Cantidad Inicial</label>
                    <input
                      name="stock_quantity"
                      type="number"
                      min="1"
                      className="form-input"
                      value={formData.stock_quantity ?? ""}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <small className="inventory-hint">
                    Se creará un único registro de stock con esta cantidad.
                  </small>
                </div>
              )}
            </div>
          )}

          {/* ── Info en modo edición ── */}
          {isEditing && (
            <div className="form-section">
              <div className="form-section-title">
                <Wrench size={16} />
                Gestión de Stock
              </div>
              <div className="info-card-static">
                <p>
                  Los equipos físicos se administran en los distintos procesos del sistema (alquiler, compra, mantenimiento, etc.). Desde este formulario solo se modifican los
                  datos del catálogo.
                </p>
              </div>
            </div>
          )}

          {/* ── Botones ── */}
          <div className="form-footer">
            <button type="button" onClick={onClose} className="btn-cancel">
              Cancelar
            </button>
            <button type="submit" className="btn-submit">
              <Save size={16} />
              {isEditing ? "Guardar Cambios" : "Registrar Maquinaria"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MachineryForm;