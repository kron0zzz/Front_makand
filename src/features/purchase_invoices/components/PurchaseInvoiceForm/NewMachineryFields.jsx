import { useState, useEffect } from "react";
import { Settings2, Package } from "lucide-react";
import MotorizedStockEditor from "../../../machinery/components/machineryForm/MotorizedStockEditor";
import "./NewMachineryFields.css";

const NewMachineryFields = ({ formData, setFormData }) => {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const cargarCategorias = async () => {
      try {
        setError("");
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:3000/api/machine-categories", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          const datos = await response.json();
          setCategories(datos);
        }
      } catch (err) {
        console.error("Error al cargar categorías:", err);
        setError("No se pudieron cargar las categorías.");
      }
    };

    cargarCategorias();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const isMotorized = !!formData.is_motorized;

  return (
    <div className="new-machinery-fields">
      {error && <div className="form-error-alert">{error}</div>}

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
            />
          </div>

          <div>
            <label className="form-label">Categoría *</label>
            <select
              name="category_id"
              className="form-input"
              value={formData.category_id ? formData.category_id.toString() : ""}
              onChange={handleChange}
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
              type="number"
              step="0.01"
              min="0"
              className="form-input"
              value={formData.sale_price ?? ""}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="form-label">Alquiler Diario ($) *</label>
            <input
              name="daily_rental_price"
              type="number"
              step="0.01"
              min="0"
              className="form-input"
              value={formData.daily_rental_price ?? ""}
              onChange={handleChange}
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
              onChange={handleChange}
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

      <div className="form-section">
        <div className="form-section-title">
          <Package size={16} />
          Datos de Compra
        </div>

        <div className="form-grid">
          {isMotorized ? (
            <div className="form-full-width">
              <label className="form-label">Equipos a Registrar *</label>
              <MotorizedStockEditor
                quantity={formData.quantity || 0}
                machineryName={formData.machinery_name || ""}
                existingSerials={[]}
                onQuantityChange={(val) => {
                  setFormData((prev) => ({ ...prev, quantity: val }));
                }}
                onTeamsChange={(teams) => {
                  const serialNumbers = teams
                    .map((team) => (team.serial || "").trim())
                    .filter((serial) => serial.length > 0);
                  setFormData((prev) => ({
                    ...prev,
                    teams,
                    serial_numbers: serialNumbers,
                  }));
                }}
              />
            </div>
          ) : (
            <div>
              <label className="form-label">Cantidad *</label>
              <input
                name="quantity"
                type="number"
                min="1"
                className="form-input"
                value={formData.quantity ?? ""}
                onChange={handleChange}
              />
            </div>
          )}

          <div>
            <label className="form-label">Costo Unitario ($) *</label>
            <input
              name="unit_cost"
              type="number"
              step="0.01"
              min="0"
              className="form-input"
              value={formData.unit_cost ?? ""}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewMachineryFields;
