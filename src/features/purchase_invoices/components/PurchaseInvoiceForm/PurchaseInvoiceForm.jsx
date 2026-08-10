import { useState, useEffect } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import { purchaseInvoiceService } from "../../services/purchaseInvoiceService";
import { useAlertModal } from "../../../../shared/alertModal";
import NewMachineryFields from "./NewMachineryFields";
import MotorizedStockEditor from "../../../machinery/components/machineryForm/MotorizedStockEditor";
import "./PurchaseInvoiceForm.css";

const PurchaseInvoiceForm = ({ isOpen, onClose, formData, setFormData, isEditing, onSuccess }) => {
  const [suppliers, setSuppliers] = useState([]);
  const [machines, setMachines] = useState([]);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);
  const [tipoMaquinaria, setTipoMaquinaria] = useState("existente");
  const [detalles, setDetalles] = useState([]);
  const { showAlert } = useAlertModal();

  const [formularioExistente, setFormularioExistente] = useState({
    machinery_id: "",
    quantity: "",
    unit_cost: "",
    machineSearch: "",
    showDropdown: false,
    serial_numbers: [],
  });

  const [formularioNuevo, setFormularioNuevo] = useState({
    category_id: "",
    machinery_name: "",
    machinery_description: "",
    sale_price: "",
    daily_rental_price: "",
    weight_kg: "",
    is_motorized: false,
    quantity: "",
    unit_cost: "",
    serial_numbers: [],
  });

  useEffect(() => {
    if (!isOpen) return;

    const cargarDatos = async () => {
      try {
        const token = localStorage.getItem("token");
        const [resSuppliers, resMachines] = await Promise.all([
          fetch("http://localhost:3000/api/suppliers", {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }),
          fetch(
            "http://localhost:3000/api/machines/table?page=1&limit=1000&search=",
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          ),
        ]);

        if (resSuppliers.ok) {
          const dataSuppliers = await resSuppliers.json();
          setSuppliers(dataSuppliers);
        }

        if (resMachines.ok) {
          const dataMachines = await resMachines.json();
          setMachines(dataMachines.data || []);
        }
      } catch (err) {
        console.error("Error al cargar datos iniciales:", err);
      }
    };

    cargarDatos();
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setDetalles([]);
      setFormularioExistente({
        machinery_id: "",
        quantity: "",
        unit_cost: "",
        machineSearch: "",
        showDropdown: false,
        serial_numbers: [],
      });
      setFormularioNuevo({
        category_id: "",
        machinery_name: "",
        machinery_description: "",
        sale_price: "",
        daily_rental_price: "",
        weight_kg: "",
        is_motorized: false,
        quantity: "",
        unit_cost: "",
        serial_numbers: [],
      });
      setTipoMaquinaria("existente");
      setError("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "supplier_id" ? parseInt(value, 10) : value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          invoice_photo: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const filteredMachines = machines.filter((machine) => {
    const matchesSearch = machine.machinery_name
      .toLowerCase()
      .includes((formularioExistente.machineSearch || "").toLowerCase());
    const alreadySelected = detalles.some(
      (d) => d.tipo === "existente" && d.machinery_id === String(machine.machinery_id)
    );
    return matchesSearch && !alreadySelected;
  });

  const agregarExistente = async () => {
    if (!formularioExistente.machinery_id) {
      await showAlert("Seleccione una maquinaria.");
      return;
    }
    if (!formularioExistente.quantity || Number(formularioExistente.quantity) <= 0) {
      await showAlert("Ingrese una cantidad válida.");
      return;
    }
    if (!formularioExistente.unit_cost || Number(formularioExistente.unit_cost) <= 0) {
      await showAlert("Ingrese un costo unitario válido.");
      return;
    }

    const maquina = machines.find(
      (m) => Number(m.machinery_id) === Number(formularioExistente.machinery_id)
    );

    const detalle = {
      tipo: "existente",
      machinery_id: Number(formularioExistente.machinery_id),
      machinery_name: maquina?.machinery_name || "",
      quantity: Number(formularioExistente.quantity),
      unit_cost: Number(formularioExistente.unit_cost),
    };

    if (maquina?.is_motorized && formularioExistente.serial_numbers) {
      detalle.serial_numbers = formularioExistente.serial_numbers;
    }

    setDetalles((prev) => [...prev, detalle]);

    setFormularioExistente({
      machinery_id: "",
      quantity: "",
      unit_cost: "",
      machineSearch: "",
      showDropdown: false,
      serial_numbers: [],
    });
  };

  const agregarNuevo = () => {
    if (!formularioNuevo.machinery_name) {
      showAlert("Ingrese el nombre de la maquinaria.");
      return;
    }
    if (!formularioNuevo.category_id) {
      showAlert("Seleccione una categoría.");
      return;
    }
    if (!formularioNuevo.sale_price || Number(formularioNuevo.sale_price) <= 0) {
      showAlert("Ingrese un precio de venta válido.");
      return;
    }
    if (!formularioNuevo.daily_rental_price || Number(formularioNuevo.daily_rental_price) <= 0) {
      showAlert("Ingrese un precio de alquiler diario válido.");
      return;
    }
    if (!formularioNuevo.quantity || Number(formularioNuevo.quantity) <= 0) {
      showAlert("Ingrese una cantidad válida.");
      return;
    }
    if (!formularioNuevo.unit_cost || Number(formularioNuevo.unit_cost) <= 0) {
      showAlert("Ingrese un costo unitario válido.");
      return;
    }

    const detalle = {
      tipo: "nuevo",
      new_machinery: {
        category_id: Number(formularioNuevo.category_id),
        machinery_name: formularioNuevo.machinery_name,
        machinery_description: formularioNuevo.machinery_description || "",
        sale_price: Number(formularioNuevo.sale_price) || 0,
        daily_rental_price: Number(formularioNuevo.daily_rental_price) || 0,
        weight_kg: formularioNuevo.weight_kg ? Number(formularioNuevo.weight_kg) : null,
        is_motorized: !!formularioNuevo.is_motorized,
      },
      quantity: Number(formularioNuevo.quantity),
      unit_cost: Number(formularioNuevo.unit_cost),
    };

    if (formularioNuevo.is_motorized && formularioNuevo.serial_numbers) {
      detalle.serial_numbers = formularioNuevo.serial_numbers;
    }

    setDetalles((prev) => [...prev, detalle]);

    setFormularioNuevo({
      category_id: "",
      machinery_name: "",
      machinery_description: "",
      sale_price: "",
      daily_rental_price: "",
      weight_kg: "",
      is_motorized: false,
      quantity: "",
      unit_cost: "",
      serial_numbers: [],
    });
  };

  const eliminarDetalle = (index) => {
    setDetalles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.supplier_id) {
      setError("Seleccione un proveedor.");
      return;
    }
    if (!formData.purchase_date) {
      setError("Ingrese la fecha de compra.");
      return;
    }

    setCargando(true);

    try {
      if (isEditing) {
        await purchaseInvoiceService.actualizar(formData.invoice_id, {
          supplier_id: Number(formData.supplier_id),
          purchase_date: formData.purchase_date,
          invoice_photo: formData.invoice_photo || null,
        });
        await showAlert("¡Factura actualizada con éxito!");
        onSuccess?.();
        onClose();
      } else {
        if (detalles.length === 0) {
          setError("Agregue al menos un producto a la compra.");
          setCargando(false);
          return;
        }

        for (const detalle of detalles) {
          if (detalle.tipo === "existente") {
            if (!detalle.machinery_id) {
              setError("Una maquinaria existente no tiene ID válido.");
              setCargando(false);
              return;
            }
            if (!detalle.quantity || detalle.quantity <= 0) {
              setError("Una maquinaria existente tiene cantidad inválida.");
              setCargando(false);
              return;
            }
            if (!detalle.unit_cost || detalle.unit_cost <= 0) {
              setError("Una maquinaria existente tiene costo unitario inválido.");
              setCargando(false);
              return;
            }
            const maquina = machines.find((m) => Number(m.machinery_id) === Number(detalle.machinery_id));
            if (maquina?.is_motorized && (!detalle.serial_numbers || detalle.serial_numbers.length !== detalle.quantity)) {
              setError("Asigne todos los equipos y seriales para la maquinaria motorizada.");
              setCargando(false);
              return;
            }
          } else {
            const nm = detalle.new_machinery;
            if (!nm || !nm.machinery_name || !nm.category_id) {
              setError("Una maquinaria nueva tiene datos de catálogo incompletos.");
              setCargando(false);
              return;
            }
            if (!detalle.quantity || detalle.quantity <= 0) {
              setError("Una maquinaria nueva tiene cantidad inválida.");
              setCargando(false);
              return;
            }
            if (!detalle.unit_cost || detalle.unit_cost <= 0) {
              setError("Una maquinaria nueva tiene costo unitario inválido.");
              setCargando(false);
              return;
            }
            if (nm.is_motorized && (!detalle.serial_numbers || detalle.serial_numbers.length !== detalle.quantity)) {
              setError("Asigne todos los equipos y seriales para la maquinaria motorizada.");
              setCargando(false);
              return;
            }
          }
        }

        const detailsPayload = detalles.map((detalle) => {
          if (detalle.tipo === "existente") {
            const payload = {
              machinery_id: detalle.machinery_id,
              quantity: detalle.quantity,
              unit_cost: detalle.unit_cost,
            };

            if (detalle.serial_numbers && detalle.serial_numbers.length > 0) {
              payload.serial_numbers = detalle.serial_numbers;
            }

            return payload;
          }

          const payload = {
            new_machinery: detalle.new_machinery,
            quantity: detalle.quantity,
            unit_cost: detalle.unit_cost,
          };

          if (detalle.serial_numbers && detalle.serial_numbers.length > 0) {
            payload.serial_numbers = detalle.serial_numbers;
          }

          return payload;
        });

        const payload = {
          supplier_id: Number(formData.supplier_id),
          purchase_date: formData.purchase_date,
          invoice_photo: formData.invoice_photo || null,
          details: detailsPayload,
        };

        await purchaseInvoiceService.crearCompleta(payload);
        await showAlert("¡Compra registrada con éxito!");
        onSuccess?.();
        onClose();
      }
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.error || err.message || "Error al procesar la solicitud.";
      setError(msg);
      await showAlert(msg);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="purchase-modal-overlay">
      <div className="purchase-modal-container">
        <div className="purchase-modal-header">
          <h2>{isEditing ? "Editar Factura de Compra" : "Registrar Nueva Factura"}</h2>
          <button className="purchase-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {error && <div className="purchase-error-alert">{error}</div>}

        <form onSubmit={handleSubmit} className="purchase-form-body">
          <div className="purchase-section">
            <div className="purchase-section-title">Información de la Factura</div>
            <div className="purchase-form-grid">
              <div className="purchase-form-group">
                <label className="purchase-form-label">Proveedor *</label>
                <select
                  name="supplier_id"
                  className="purchase-form-input"
                  value={formData.supplier_id || ""}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccione un proveedor...</option>
                  {suppliers.map((sup) => (
                    <option key={sup.supplier_id} value={sup.supplier_id}>
                      {sup.supplier_name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="purchase-form-group">
                <label className="purchase-form-label">Fecha de Compra *</label>
                <input
                  type="date"
                  name="purchase_date"
                  className="purchase-form-input"
                  value={formData.purchase_date ? formData.purchase_date.substring(0, 10) : ""}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="purchase-form-group purchase-form-full-width">
                <label className="purchase-form-label">Foto / Imagen de Factura</label>
                <input
                  type="file"
                  accept="image/*"
                  className="purchase-form-input"
                  onChange={handleFileChange}
                />
                {formData.invoice_photo && (
                  <div style={{ marginTop: "8px" }}>
                    <span className="purchase-label-text">Vista previa seleccionada:</span>
                    <img
                      src={formData.invoice_photo}
                      alt="Previsualización"
                      style={{
                        display: "block",
                        width: "80px",
                        height: "80px",
                        objectFit: "cover",
                        borderRadius: "8px",
                        marginTop: "4px",
                        border: "1px solid #e2e8f0",
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="purchase-section">
            <div className="purchase-section-title">Agregar Maquinaria</div>

            {!isEditing && (
              <>
                <div className="purchase-type-selector">
                  <label className={`purchase-type-option ${tipoMaquinaria === "existente" ? "active" : ""}`}>
                    <input
                      type="radio"
                      name="tipoMaquinaria"
                      value="existente"
                      checked={tipoMaquinaria === "existente"}
                      onChange={(e) => setTipoMaquinaria(e.target.value)}
                    />
                    <span>Maquinaria Existente</span>
                  </label>
                  <label className={`purchase-type-option ${tipoMaquinaria === "nuevo" ? "active" : ""}`}>
                    <input
                      type="radio"
                      name="tipoMaquinaria"
                      value="nuevo"
                      checked={tipoMaquinaria === "nuevo"}
                      onChange={(e) => setTipoMaquinaria(e.target.value)}
                    />
                    <span>Nueva Maquinaria</span>
                  </label>
                </div>

                {tipoMaquinaria === "existente" && (
                  <div className="purchase-existing-form">
                    {(() => {
                      const maquinaSeleccionada = machines.find(
                        (m) => Number(m.machinery_id) === Number(formularioExistente.machinery_id)
                      );
                      const esMotorizada = !!maquinaSeleccionada?.is_motorized;

                      return (
                        <>
                          <div className="purchase-form-grid">
                            <div className="purchase-form-group" style={{ position: "relative" }}>
                              <label className="purchase-form-label">Maquinaria *</label>
                              <input
                                type="text"
                                className="purchase-form-input"
                                placeholder="Escribe para buscar maquinaria..."
                                value={formularioExistente.machineSearch}
                                onChange={(e) => {
                                  setFormularioExistente((prev) => ({
                                    ...prev,
                                    machineSearch: e.target.value,
                                    showDropdown: true,
                                    machinery_id: e.target.value === "" ? "" : prev.machinery_id,
                                  }));
                                }}
                                onFocus={() =>
                                  setFormularioExistente((prev) => ({ ...prev, showDropdown: true }))
                                }
                              />
                              {formularioExistente.showDropdown && (
                                <ul className="purchase-dropdown">
                                  {filteredMachines.length > 0 ? (
                                    filteredMachines.map((machine) => (
                                      <li
                                        key={machine.machinery_id}
                                        className="purchase-dropdown-item"
                                        onClick={() => {
                                        setFormularioExistente((prev) => ({
                                          ...prev,
                                          machinery_id: machine.machinery_id,
                                          machineSearch: machine.machinery_name,
                                          showDropdown: false,
                                          quantity: machine.is_motorized ? 0 : prev.quantity,
                                          serial_numbers: [],
                                        }));
                                        }}
                                      >
                                        {machine.machinery_name}
                                      </li>
                                    ))
                                  ) : (
                                    <li className="purchase-dropdown-empty">No se encontraron máquinas</li>
                                  )}
                                </ul>
                              )}
                            </div>

                            {!esMotorizada && (
                              <div className="purchase-form-group">
                                <label className="purchase-form-label">Cantidad *</label>
                                <input
                                  type="number"
                                  min="1"
                                  className="purchase-form-input"
                                  value={formularioExistente.quantity}
                                  onChange={(e) =>
                                    setFormularioExistente((prev) => ({
                                      ...prev,
                                      quantity: e.target.value,
                                    }))
                                  }
                                />
                              </div>
                            )}

                            <div className="purchase-form-group">
                              <label className="purchase-form-label">Costo Unitario ($) *</label>
                              <input
                                type="number"
                                step="0.01"
                                min="0"
                                className="purchase-form-input"
                                value={formularioExistente.unit_cost}
                                onChange={(e) =>
                                  setFormularioExistente((prev) => ({
                                    ...prev,
                                    unit_cost: e.target.value,
                                  }))
                                }
                              />
                            </div>
                          </div>

                          {esMotorizada && (
                            <div className="purchase-form-full-width" style={{ marginBottom: "12px" }}>
                              <label className="purchase-form-label">Asignar Equipos *</label>
                              <MotorizedStockEditor
                                quantity={formularioExistente.quantity || 0}
                                machineryName={formularioExistente.machineSearch || ""}
                                existingSerials={[]}
                                onQuantityChange={(val) => {
                                  setFormularioExistente((prev) => ({ ...prev, quantity: val }));
                                }}
                                onTeamsChange={(teams) => {
                                  const serialNumbers = teams
                                    .map((team) => (team.serial || "").trim())
                                    .filter((serial) => serial.length > 0);
                                  setFormularioExistente((prev) => ({
                                    ...prev,
                                    teams,
                                    serial_numbers: serialNumbers,
                                  }));
                                }}
                              />
                            </div>
                          )}

                          <button
                            type="button"
                            className="purchase-btn-add"
                            onClick={agregarExistente}
                          >
                            <Plus size={18} />
                            Agregar
                          </button>
                        </>
                      );
                    })()}
                  </div>
                )}

                {tipoMaquinaria === "nuevo" && (
                  <div className="purchase-new-form">
                    <NewMachineryFields
                      formData={formularioNuevo}
                      setFormData={setFormularioNuevo}
                    />
                    <button
                      type="button"
                      className="purchase-btn-add"
                      onClick={agregarNuevo}
                      style={{ marginTop: "16px" }}
                    >
                      <Plus size={18} />
                      Agregar
                    </button>
                  </div>
                )}
              </>
            )}

            {isEditing && (
              <div className="info-card-static">
                <p>
                  En modo edición solo se pueden modificar los datos generales de la factura (proveedor, fecha y soporte).
                  Para ajustar los productos de la compra, crea una nueva factura.
                </p>
              </div>
            )}
          </div>

          {detalles.length > 0 && (
            <div className="purchase-section">
              <div className="purchase-section-title">Productos Agregados</div>
              <div className="purchase-table-wrapper">
                <table className="purchase-table">
                  <thead>
                    <tr>
                      <th>Tipo</th>
                      <th>Maquinaria</th>
                      <th>Cantidad</th>
                      <th>Costo Unitario</th>
                      <th>Subtotal</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {detalles.map((detalle, index) => (
                      <tr key={index}>
                        <td>
                          <span className={`purchase-badge ${detalle.tipo === "existente" ? "badge-existente" : "badge-nuevo"}`}>
                            {detalle.tipo === "existente" ? "Existente" : "Nueva"}
                          </span>
                        </td>
                        <td>{detalle.machinery_name || detalle.new_machinery?.machinery_name}</td>
                        <td>{detalle.quantity}</td>
                        <td>${Number(detalle.unit_cost).toLocaleString()}</td>
                        <td>${(detalle.quantity * detalle.unit_cost).toLocaleString()}</td>
                        <td>
                          <button
                            type="button"
                            className="purchase-btn-delete"
                            onClick={() => eliminarDetalle(index)}
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="purchase-form-footer">
            <button
              type="button"
              className="purchase-btn-cancel"
              onClick={onClose}
              disabled={cargando}
            >
              Cancelar
            </button>
            <button type="submit" className="purchase-btn-submit" disabled={cargando}>
              {cargando ? "Procesando..." : "Registrar compra"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PurchaseInvoiceForm;
