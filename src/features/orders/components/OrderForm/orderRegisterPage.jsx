import { useCallback, useEffect, useState } from "react";
import { Plus, Trash2, Truck, Wand, Package } from "lucide-react";

import { useOrders } from "../../hooks/useOrders";

import "./orderRegisterPage.css";
import { useAlertModal } from "../../../../shared/alertModal";
import StockSelectionModal from "../../../../shared/components/stockSelection/StockSelectionModal";

const OrderRegisterPage = ({ onBack }) => {
  const { showAlert } = useAlertModal();
  const { crearPedidoCompleto } = useOrders();

  const [formData, setFormData] = useState(() => ({
    order_creation_date: new Date().toISOString().split("T")[0],
    discount_amount: "0",
  }));

  const [projects, setProjects] = useState([]);
  const [machines, setMachines] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [allStocks, setAllStocks] = useState([]);

  const [selectedCustomerId, setSelectedCustomerId] = useState("");

  const [projectSearch, setProjectSearch] = useState("");
  const [showProjectDropdown, setShowProjectDropdown] = useState(false);

  const [includeDeliveryTransport, setIncludeDeliveryTransport] = useState(false);
  const [deliveryTransportPriceDisplay, setDeliveryTransportPriceDisplay] = useState("");

  const [details, setDetails] = useState([]);

  const [stockModalOpen, setStockModalOpen] = useState(false);
  const [stockModalIndex, setStockModalIndex] = useState(null);
  const [stockModalMachine, setStockModalMachine] = useState(null);

  // Estado del control izquierdo para agregar nueva maquinaria
  const [machineSearch, setMachineSearch] = useState("");
  const [showMachineDropdown, setShowMachineDropdown] = useState(false);
  const [selectedMachine, setSelectedMachine] = useState(null);
  const [inputQuantity, setInputQuantity] = useState(1);
  const [priceDisplay, setPriceDisplay] = useState("");

  const cargarProyectos = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3000/api/projects", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error(error);
    }
  }, []);

  const cargarMaquinas = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:3000/api/machines/table?page=1&limit=1000&search=",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await response.json();
      setMachines(data.data || []);
    } catch (error) {
      console.error(error);
    }
  }, []);

  const cargarClientes = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3000/api/customers", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setCustomers(data);
    } catch (error) {
      console.error(error);
    }
  }, []);

  const cargarStocks = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:3000/api/stock/table?page=1&limit=1000&search=",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await response.json();
      setAllStocks(data.data || []);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    const inicializarFormulario = async () => {
      await Promise.all([
        cargarProyectos(),
        cargarMaquinas(),
        cargarClientes(),
        cargarStocks(),
      ]);
    };

    inicializarFormulario();
  }, [cargarProyectos, cargarMaquinas, cargarClientes, cargarStocks]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePriceChange = (e) => {
    const raw = e.target.value.replace(/\D/g, "");
    if (raw === "") {
      setPriceDisplay("");
      return;
    }
    setPriceDisplay(Number(raw).toLocaleString("es-CO"));
  };

  const handleDeliveryTransportPriceChange = (e) => {
    const raw = e.target.value.replace(/\D/g, "");
    if (raw === "") {
      setDeliveryTransportPriceDisplay("");
      return;
    }
    setDeliveryTransportPriceDisplay(Number(raw).toLocaleString("es-CO"));
  };

  const filteredProjects = projects.filter((project) => {
    const matchesSearch = project.project_name
      .toLowerCase()
      .includes(projectSearch.toLowerCase());
    const matchesCustomer =
      !selectedCustomerId || project.customer_id == selectedCustomerId;
    return matchesSearch && matchesCustomer;
  });

  const filteredMachines = machines.filter((machine) => {
    const matchesSearch = machine.machinery_name
      .toLowerCase()
      .includes((machineSearch || "").toLowerCase());
    const alreadySelected = details.some(
      (d) => String(d.machinery_id) === String(machine.machinery_id)
    );
    return matchesSearch && !alreadySelected;
  });

  const openStockModal = (index, machine) => {
    setStockModalIndex(index);
    setStockModalMachine(machine);
    setStockModalOpen(true);
  };

  const handleStockConfirm = (selectedStocks) => {
    if (stockModalIndex === null) return;

    const nuevosDetalles = [...details];
    const maquina = nuevosDetalles[stockModalIndex];
    maquina.selectedStocks = selectedStocks;
    maquina.quantity_to_dispatch = selectedStocks.length;

    if (selectedStocks.length > 0) {
      maquina.stock_id = selectedStocks[0].stock_id;
    } else {
      maquina.stock_id = null;
    }

    setDetails(nuevosDetalles);
  };

  const agregarMaquinaria = () => {
    if (!selectedMachine) {
      showAlert("Seleccione una máquina válida.");
      return;
    }

    const rawPrice = priceDisplay === "" ? 0 : Number(priceDisplay.replace(/\./g, ""));

    if (!rawPrice || Number(rawPrice) <= 0) {
      showAlert(`Ingrese un precio válido para "${selectedMachine.machinery_name}".`);
      return;
    }

    const isMotorized = Boolean(selectedMachine.is_motorized);
    const nuevoDetalle = {
      machinery_id: selectedMachine.machinery_id,
      machineSearch: selectedMachine.machinery_name,
      isMotorized,
      rental_unit_price: rawPrice,
      quantity_to_dispatch: 0,
      selectedStocks: [],
      stock_id: null,
    };

    if (!isMotorized) {
      const cantidad = Number(inputQuantity) || 0;
      if (cantidad <= 0) {
        showAlert(`Ingrese una cantidad válida para "${selectedMachine.machinery_name}".`);
        return;
      }
      const stock = (allStocks || []).find(
        (s) =>
          Number(s.machinery_id) === Number(selectedMachine.machinery_id) &&
          s.status_id === 1
      );
      if (!stock) {
        showAlert(`No hay stock disponible para la máquina "${selectedMachine.machinery_name}".`);
        return;
      }
      const stockDisponible =
        Number(selectedMachine.available_stock) ||
        Number(selectedMachine.total_stock) ||
        0;
      if (cantidad > stockDisponible) {
        showAlert(
          `La cantidad para "${selectedMachine.machinery_name}" supera el stock disponible (${stockDisponible}).`
        );
        return;
      }
      nuevoDetalle.quantity_to_dispatch = cantidad;
      nuevoDetalle.stock_id = stock ? stock.stock_id : null;
    }

    setDetails((prev) => [...prev, nuevoDetalle]);

    // Resetear controles izquiernos
    setMachineSearch("");
    setSelectedMachine(null);
    setInputQuantity(1);
    setPriceDisplay("");
    setShowMachineDropdown(false);
  };

  const eliminarDetalle = (index) => {
    const nuevosDetalles = [...details];
    nuevosDetalles.splice(index, 1);
    setDetails(nuevosDetalles);
  };

  const actualizarDetalle = (index, campo, valor) => {
    const nuevosDetalles = [...details];
    nuevosDetalles[index][campo] = valor;
    setDetails(nuevosDetalles);
  };

  const totalDetails = details.reduce((acc, item) => {
    const price = Number(item.rental_unit_price) || 0;
    const qty = Number(item.quantity_to_dispatch) || 0;
    return acc + price * qty;
  }, 0);

  const totalTransport = includeDeliveryTransport
    ? Number(deliveryTransportPriceDisplay === "" ? 0 : deliveryTransportPriceDisplay.replace(/\./g, ""))
    : 0;

  const totalGeneral = totalDetails + totalTransport;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.project_id) {
      await showAlert("Seleccione un proyecto para el pedido.");
      return;
    }

    for (const item of details) {
      const maquina = machines.find(
        (m) => Number(m.machinery_id) === Number(item.machinery_id)
      );
      if (!maquina) {
        await showAlert("Seleccione una máquina válida para cada detalle.");
        return;
      }

      if (maquina.is_motorized) {
        if (!item.selectedStocks || item.selectedStocks.length === 0) {
          await showAlert(
            `Seleccione al menos un equipo disponible para "${maquina.machinery_name}".`
          );
          return;
        }
        if (!item.rental_unit_price || Number(item.rental_unit_price) <= 0) {
          await showAlert(`Ingrese un precio válido para "${maquina.machinery_name}".`);
          return;
        }
      } else {
        if (!item.stock_id) {
          await showAlert(`No hay stock disponible para la máquina "${maquina.machinery_name}".`);
          return;
        }
        const cantidad = Number(item.quantity_to_dispatch) || 0;
        if (cantidad <= 0) {
          await showAlert(`Ingrese una cantidad válida para "${maquina.machinery_name}".`);
          return;
        }
        const stockDisponible =
          Number(maquina.available_stock) || Number(maquina.total_stock) || 0;
        if (cantidad > stockDisponible) {
          await showAlert(
            `La cantidad para "${maquina.machinery_name}" supera el stock disponible (${stockDisponible}).`
          );
          return;
        }
        if (!item.rental_unit_price || Number(item.rental_unit_price) <= 0) {
          await showAlert(`Ingrese un precio válido para "${maquina.machinery_name}".`);
          return;
        }
      }
    }

    if (includeDeliveryTransport) {
      const transportVal =
        deliveryTransportPriceDisplay === ""
          ? 0
          : Number(deliveryTransportPriceDisplay.replace(/\./g, ""));
      if (isNaN(transportVal) || transportVal < 0) {
        await showAlert("Ingrese un precio de transporte de entrega válido.");
        return;
      }
    }

    try {
      const detailsPayload = [];

      details.forEach((item) => {
        const maquina = machines.find(
          (m) => Number(m.machinery_id) === Number(item.machinery_id)
        );
        if (!maquina) return;

        if (maquina.is_motorized) {
          item.selectedStocks.forEach((stock) => {
            detailsPayload.push({
              stock_id: stock.stock_id,
              quantity_to_dispatch: 1,
              rental_unit_price: Number(item.rental_unit_price),
              machinery_rental_status: true,
            });
          });
        } else {
          detailsPayload.push({
            stock_id: item.stock_id,
            quantity_to_dispatch: Number(item.quantity_to_dispatch),
            rental_unit_price: Number(item.rental_unit_price),
            machinery_rental_status: true,
          });
        }
      });

      const additionalChargesPayload = [];

      if (includeDeliveryTransport && deliveryTransportPriceDisplay) {
        const rawPrice = Number(
          deliveryTransportPriceDisplay.replace(/\./g, "").replace(/\D/g, "")
        );
        if (rawPrice > 0) {
          additionalChargesPayload.push({
            charge_type_id: 1,
            charge_description: "Transporte de entrega inicial",
            charge_amount: rawPrice,
          });
        }
      }

      const payload = {
        project_id: Number(formData.project_id),
        order_creation_date: formData.order_creation_date,
        discount_amount: "0",
        order_description: formData.order_description,
        delivery_transport_price: includeDeliveryTransport
          ? deliveryTransportPriceDisplay === ""
            ? "0"
            : Number(deliveryTransportPriceDisplay.replace(/\./g, "")).toString()
          : "0",
        additional_charges: additionalChargesPayload,
        details: detailsPayload,
      };

      await crearPedidoCompleto(payload);
      await showAlert("Pedido creado correctamente");
      onBack();
    } catch (error) {
      await showAlert(error.message);
    }
  };

  return (
    <div className="register-page-container">
      <div className="register-page-header">
        <h1>Creación de pedido</h1>
        <div className="register-page-total">
          Total: ${totalGeneral.toLocaleString("es-CO")}
        </div>
      </div>

      <form id="register-page-form" onSubmit={handleSubmit} className="register-page-form">
        <div className="register-page-center">
          {/* Columna izquierda: datos del pedido + controles de maquinaria */}
          <div className="register-left">
            <div className="register-left-section">
              <label className="form-label">Cliente</label>
              <select
                className="form-input"
                value={selectedCustomerId}
                onChange={(e) => {
                  const value = e.target.value;
                  setSelectedCustomerId(value);
                  setFormData((prev) => ({ ...prev, project_id: "" }));
                  setProjectSearch("");
                }}
              >
                <option value="">Todos los clientes</option>
                {customers.map((c) => (
                  <option key={c.customer_id} value={c.customer_id}>
                    {c.customer_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="register-left-section">
              <label className="form-label">Proyecto *</label>
              <input
                type="text"
                className="form-input"
                placeholder="Escribe para buscar un proyecto..."
                value={projectSearch}
                onChange={(e) => {
                  setProjectSearch(e.target.value);
                  setShowProjectDropdown(true);
                  if (e.target.value === "") {
                    setFormData((prev) => ({ ...prev, project_id: "" }));
                  }
                }}
                onFocus={() => setShowProjectDropdown(true)}
                required={!formData.project_id}
              />

              {showProjectDropdown && (
                <ul className="register-dropdown">
                  {filteredProjects.length > 0 ? (
                    filteredProjects.map((project) => (
                      <li
                        key={project.project_id}
                        className="register-dropdown-item"
                        onClick={() => {
                          setFormData((prev) => ({
                            ...prev,
                            project_id: project.project_id,
                          }));
                          setProjectSearch(project.project_name);
                          setShowProjectDropdown(false);
                        }}
                      >
                        {project.project_name}
                      </li>
                    ))
                  ) : (
                    <li className="register-dropdown-empty">
                      No se encontraron proyectos
                    </li>
                  )}
                </ul>
              )}
            </div>

            <div className="register-left-section">
              <label className="form-label">Fecha Inicio *</label>
              <input
                type="date"
                name="order_creation_date"
                className="form-input"
                value={formData.order_creation_date || ""}
                onChange={handleChange}
                required
              />
            </div>

            <div className="register-left-section">
              <label className="form-label">Descripción</label>
              <textarea
                name="order_description"
                className="form-input"
                rows="3"
                value={formData.order_description || ""}
                onChange={handleChange}
              />
            </div>

            <div className="register-left-section">
              <div className="register-transport-row">
                <Truck size={18} color="#4b5563" />
                <label className="register-transport-label">
                  <input
                    type="checkbox"
                    checked={includeDeliveryTransport}
                    onChange={(e) => setIncludeDeliveryTransport(e.target.checked)}
                  />
                  ¿Incluye servicio de transporte (ida)?
                </label>
              </div>

              {includeDeliveryTransport && (
                <div className="register-transport-price">
                  <label className="form-label">Precio de transporte de entrega (COP)</label>
                  <input
                    type="text"
                    className="form-input"
                    inputMode="numeric"
                    placeholder="Ej: 50.000"
                    value={deliveryTransportPriceDisplay}
                    onChange={handleDeliveryTransportPriceChange}
                  />
                </div>
              )}
            </div>

            <hr className="register-divider" />

            {/* Controles de maquinaria */}
            <div className="register-machinery-controls">
              <h3>Maquinaria</h3>

              <div className="register-machine-search">
                <label className="form-label">Seleccionar maquinaria</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Escribe para buscar máquina..."
                  value={machineSearch}
                  onChange={(e) => {
                    setMachineSearch(e.target.value);
                    setShowMachineDropdown(true);
                    if (e.target.value === "") {
                      setSelectedMachine(null);
                    }
                  }}
                  onFocus={() => setShowMachineDropdown(true)}
                />

                {showMachineDropdown && (
                  <ul className="register-dropdown">
                    {filteredMachines.length > 0 ? (
                      filteredMachines.map((machine) => (
                        <li
                          key={machine.machinery_id}
                          className="register-dropdown-item"
                          onClick={() => {
                            setSelectedMachine(machine);
                            setMachineSearch(machine.machinery_name);
                            setShowMachineDropdown(false);
                            setInputQuantity(1);
                            setPriceDisplay(
                              Number(machine.daily_rental_price || 0).toLocaleString("es-CO")
                            );
                          }}
                        >
                          {machine.machinery_name}
                        </li>
                      ))
                    ) : (
                      <li className="register-dropdown-empty">
                        No se encontraron máquinas
                      </li>
                    )}
                  </ul>
                )}
              </div>

              {selectedMachine?.is_motorized ? (
                <div className="register-machine-quantity">
                  <label className="form-label">Cantidad</label>
                  <input
                    type="number"
                    className="form-input"
                    value={0}
                    readOnly
                    disabled
                  />
                  <small className="register-hint">
                    La cantidad se define al seleccionar equipos.
                  </small>
                </div>
              ) : (
                <div className="register-machine-quantity">
                  <label className="form-label">Cantidad</label>
                  <input
                    type="number"
                    min="1"
                    max={selectedMachine?.total_stock || undefined}
                    className="form-input"
                    value={inputQuantity}
                    onChange={(e) => setInputQuantity(e.target.value)}
                    disabled={!selectedMachine}
                  />
                  {selectedMachine && (
                    <small className="register-hint">
                      Disponibles: {selectedMachine.total_stock ?? 0}
                    </small>
                  )}
                </div>
              )}

              <div className="register-machine-price">
                <label className="form-label">Precio</label>
                <input
                  type="text"
                  className="form-input"
                  inputMode="numeric"
                  placeholder="Ej: 50.000"
                  value={priceDisplay}
                  onChange={handlePriceChange}
                  disabled={!selectedMachine}
                />
              </div>

              <button
                type="button"
                className="btn-submit register-add-btn"
                onClick={agregarMaquinaria}
                disabled={!selectedMachine}
              >
                <Plus size={18} />
                Agregar maquinaria
              </button>
            </div>
          </div>

          {/* Columna derecha: lista de maquinaria agregada */}
          <div className="register-right">
            <h3>Maquinaria agregada</h3>

            {details.length === 0 ? (
              <div className="register-right-empty">
                <Package size={32} color="#d1d5db" />
                <span>No hay maquinaria agregada</span>
              </div>
            ) : (
              <div className="register-machines-list">
                {details.map((detail, index) => {
                  const maquina = machines.find(
                    (m) => Number(m.machinery_id) === Number(detail.machinery_id)
                  );
                  const isMotorized = Boolean(detail.isMotorized);

                  return (
                    <div key={index} className="register-machine-row">
                      <div className="register-machine-name" title={detail.machineSearch}>
                        <span>{detail.machineSearch || "Máquina"}</span>
                      </div>

                      {isMotorized ? (
                        <div className="register-machine-quantity-cell">
                          <small className="register-hint">
                            {detail.selectedStocks.length} equipo(s)
                          </small>
                          <button
                            type="button"
                            className="register-stock-btn"
                            title="Seleccionar equipos"
                            onClick={() => openStockModal(index, maquina || detail)}
                          >
                            <Wand size={16} />
                          </button>
                        </div>
                      ) : (
                        <input
                          type="number"
                          min="1"
                          className="form-input register-machine-qty"
                          value={detail.quantity_to_dispatch}
                          onChange={(e) =>
                            actualizarDetalle(index, "quantity_to_dispatch", e.target.value)
                          }
                        />
                      )}

                      <input
                        type="number"
                        step="0.01"
                        className="form-input register-machine-price"
                        value={detail.rental_unit_price || ""}
                        onChange={(e) =>
                          actualizarDetalle(index, "rental_unit_price", e.target.value)
                        }
                      />

                      <button
                        type="button"
                        className="register-delete-btn"
                        title="Eliminar máquina"
                        onClick={() => eliminarDetalle(index)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </form>

      <div className="register-page-footer">
        <button type="button" className="btn-cancel" onClick={onBack}>
          Cancelar
        </button>
        <button type="submit" className="btn-submit" form="register-page-form">
          Confirmar creación
        </button>
      </div>

      <StockSelectionModal
        key={stockModalMachine?.machinery_id}
        isOpen={stockModalOpen}
        onClose={() => setStockModalOpen(false)}
        machinery={stockModalMachine}
        onConfirm={handleStockConfirm}
        initialSelectedIds={
          stockModalIndex !== null ? details[stockModalIndex]?.selectedStocks || [] : []
        }
      />
    </div>
  );
};

export default OrderRegisterPage;
