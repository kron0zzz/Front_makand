import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { X, Plus, Trash2, Truck } from "lucide-react";

import { useOrders } from "../../hooks/useOrders";

import "./OrderForm.css";
import { useAlertModal } from "../../../../shared/alertModal";
import StockSelectionModal from "../../../../shared/components/stockSelection/StockSelectionModal";

const OrderForm = ({
  isOpen,
  onClose,
  formData,
  setFormData
}) => {
  const { showAlert } = useAlertModal();

  const { crearPedidoCompleto } = useOrders();

  const [projects, setProjects] = useState([]);
  const [machines, setMachines] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [allStocks, setAllStocks] = useState([]);

  const [selectedCustomerId, setSelectedCustomerId] = useState("");

  const [projectSearch, setProjectSearch] = useState("");
  const [showProjectDropdown, setShowProjectDropdown] = useState(false);

  const [discountDisplay, setDiscountDisplay] = useState("");
  const discountInitialized = useRef(false);
  const initialDiscountRef = useRef("");

  // Nuevos estados para el transporte de entrega (ida)
  const [includeDeliveryTransport, setIncludeDeliveryTransport] = useState(false);
  const [deliveryTransportPriceDisplay, setDeliveryTransportPriceDisplay] = useState("");

  useLayoutEffect(() => {
    if (isOpen && !discountInitialized.current) {
      initialDiscountRef.current = formData.discount_amount || "0";
      const rawDiscount = initialDiscountRef.current.replace(/\D/g, "");
      setDiscountDisplay(rawDiscount === "" ? "" : Number(rawDiscount).toLocaleString("es-CO"));
      discountInitialized.current = true;
    }
    if (!isOpen) {
      discountInitialized.current = false;
      setIncludeDeliveryTransport(false);
      setDeliveryTransportPriceDisplay("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const [details, setDetails] = useState([
    {
      machinery_id: "",
      quantity_to_dispatch: 1,
      rental_unit_price: "",
      machineSearch: "",
      showMachineDropdown: false,
      isMotorized: false,
      selectedStocks: [],
      stock_id: null
    }
  ]);

  const [stockModalOpen, setStockModalOpen] = useState(false);
  const [stockModalIndex, setStockModalIndex] = useState(null);
  const [stockModalMachine, setStockModalMachine] = useState(null);

  const cargarProyectos = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3000/api/projects", {
        headers: {
          Authorization: `Bearer ${token}`
        }
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
      const response = await fetch("http://localhost:3000/api/machines/table?page=1&limit=1000&search=", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
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
        headers: {
          Authorization: `Bearer ${token}`
        }
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
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      const data = await response.json();
      setAllStocks(data.data || []);
    } catch (error) {
      console.error(error);
    }
  }, []);

  const openStockModal = (index, machine) => {
    setStockModalIndex(index);
    setStockModalMachine(machine);
    setStockModalOpen(true);
  };

  const handleStockConfirm = (selectedStocks) => {
    if (stockModalIndex === null) return;

    const nuevosDetalles = [...details];
    nuevosDetalles[stockModalIndex].selectedStocks = selectedStocks;
    nuevosDetalles[stockModalIndex].quantity_to_dispatch = selectedStocks.length;
    
    if (selectedStocks.length > 0) {
      nuevosDetalles[stockModalIndex].stock_id = selectedStocks[0].stock_id;
    } else {
      nuevosDetalles[stockModalIndex].stock_id = null;
    }
    
    setDetails(nuevosDetalles);
  };

  useEffect(() => {
    if (!isOpen) return;

    let isActive = true;

    const inicializarFormulario = async () => {
      await Promise.all([
        cargarProyectos(),
        cargarMaquinas(),
        cargarClientes(),
        cargarStocks()
      ]);

      if (!isActive) return;

      setFormData((prev) => ({
        ...prev,
        order_creation_date: new Date().toISOString().split("T")[0],
        discount_amount: prev?.discount_amount || "0"
      }));
      setProjectSearch("");
      setSelectedCustomerId("");
      setIncludeDeliveryTransport(false);
      setDeliveryTransportPriceDisplay("");
      setDetails([
        {
          machinery_id: "",
          quantity_to_dispatch: 1,
          rental_unit_price: "",
          machineSearch: "",
          showMachineDropdown: false,
          isMotorized: false,
          selectedStocks: [],
          stock_id: null
        }
      ]);
    };

    inicializarFormulario();

    return () => {
      isActive = false;
    };
  }, [
    isOpen,
    cargarProyectos,
    cargarMaquinas,
    cargarClientes,
    cargarStocks,
    setFormData
  ]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleDiscountChange = (e) => {
    const raw = e.target.value.replace(/\D/g, "");
    if (raw === "") {
      setDiscountDisplay("");
      return;
    }
    setDiscountDisplay(Number(raw).toLocaleString("es-CO"));
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
    const matchesSearch = project.project_name.toLowerCase().includes(projectSearch.toLowerCase());
    const matchesCustomer = !selectedCustomerId || project.customer_id == selectedCustomerId;
    return matchesSearch && matchesCustomer;
  });

  const agregarDetalle = () => {
    setDetails([
      ...details,
      {
        machinery_id: "",
        quantity_to_dispatch: 1,
        rental_unit_price: "",
        machineSearch: "",
        showMachineDropdown: false,
        isMotorized: false,
        selectedStocks: [],
        stock_id: null
      }
    ]);
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    for (const item of details) {
      const maquina = machines.find((m) => Number(m.machinery_id) === Number(item.machinery_id));
      if (!maquina) {
        await showAlert("Seleccione una máquina válida para cada detalle.");
        return;
      }

      if (maquina.is_motorized) {
        if (!item.selectedStocks || item.selectedStocks.length === 0) {
          await showAlert(`Seleccione al menos un equipo disponible para "${maquina.machinery_name}".`);
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
        const stockDisponible = Number(maquina.available_stock) || Number(maquina.total_stock) || 0;
        if (cantidad > stockDisponible) {
          await showAlert(`La cantidad para "${maquina.machinery_name}" supera el stock disponible (${stockDisponible}).`);
          return;
        }
        if (!item.rental_unit_price || Number(item.rental_unit_price) <= 0) {
          await showAlert(`Ingrese un precio válido para "${maquina.machinery_name}".`);
          return;
        }
      }
    }

    if (includeDeliveryTransport) {
      const transportVal = deliveryTransportPriceDisplay === "" ? 0 : Number(deliveryTransportPriceDisplay.replace(/\./g, ""));
      if (isNaN(transportVal) || transportVal < 0) {
        await showAlert("Ingrese un precio de transporte de entrega válido.");
        return;
      }
    }

    try {
      const detailsPayload = [];

      details.forEach((item) => {
        const maquina = machines.find((m) => Number(m.machinery_id) === Number(item.machinery_id));
        if (!maquina) return;

        if (maquina.is_motorized) {
          item.selectedStocks.forEach((stock) => {
            detailsPayload.push({
              stock_id: stock.stock_id,
              quantity_to_dispatch: 1,
              rental_unit_price: Number(item.rental_unit_price),
              machinery_rental_status: true
            });
          });
        } else {
          detailsPayload.push({
            stock_id: item.stock_id,
            quantity_to_dispatch: Number(item.quantity_to_dispatch),
            rental_unit_price: Number(item.rental_unit_price),
            machinery_rental_status: true
          });
        }
      });

      const additionalChargesPayload = [];

      if (includeDeliveryTransport && deliveryTransportPriceDisplay) {
        const rawPrice = Number(deliveryTransportPriceDisplay.replace(/\./g, "").replace(/\D/g, ""));
        if (rawPrice > 0) {
          additionalChargesPayload.push({
            charge_type_id: 1, // 1 suele ser Transporte (según tu base de datos)
            charge_description: "Transporte de entrega inicial",
            charge_amount: rawPrice
          });
        }
      }

      const payload = {
        project_id: Number(formData.project_id),
        order_creation_date: formData.order_creation_date,
        discount_amount: discountDisplay === "" ? "0" : Number(discountDisplay.replace(/\./g, "")).toString(),
        order_description: formData.order_description,
        // Nuevos campos adaptados al backend para el transporte de ida
        delivery_transport_price: includeDeliveryTransport 
          ? (deliveryTransportPriceDisplay === "" ? "0" : Number(deliveryTransportPriceDisplay.replace(/\./g, "")).toString()) 
          : "0",
        additional_charges: additionalChargesPayload,
        details: detailsPayload
      };

      await crearPedidoCompleto(payload);

      await showAlert("Pedido creado correctamente");
      onClose();
    } catch (error) {
      await showAlert(error.message);
    }
  };

  return (
    <div className="form-modal-overlay">
      <div className="form-modal-container">
        <div className="form-header">
          <h2>Registrar Pedido</h2>
          <button onClick={onClose} className="form-close-btn">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="form-body">
          <div className="form-grid">
            <div>
               <label className="form-label">Cliente</label>
               <select
                 className="form-input"
                 value={selectedCustomerId}
                 onChange={(e) => {
                   const value = e.target.value;
                   setSelectedCustomerId(value);
                   setFormData({ ...formData, project_id: "" });
                   setProjectSearch("");
                 }}
               >
                 <option value="">Todos los clientes</option>
                 {customers.map(c => (
                   <option key={c.customer_id} value={c.customer_id}>
                     {c.customer_name}
                   </option>
                 ))}
               </select>
             </div>

            <div style={{ position: "relative" }}>
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
                    setFormData({ ...formData, project_id: "" });
                  }
                }}
                onFocus={() => setShowProjectDropdown(true)}
                required={!formData.project_id}
              />

              {showProjectDropdown && (
                <ul
                  style={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    right: 0,
                    background: "white",
                    border: "1px solid #d1d5db",
                    borderRadius: "0.375rem",
                    maxHeight: "150px",
                    overflowY: "auto",
                    zIndex: 50,
                    listStyle: "none",
                    padding: 0,
                    margin: "4px 0 0 0",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
                  }}
                >
                  {filteredProjects.length > 0 ? (
                    filteredProjects.map((project) => (
                      <li
                        key={project.project_id}
                        style={{
                          padding: "8px 12px",
                          cursor: "pointer",
                          borderBottom: "1px solid #f3f4f6"
                        }}
                        onClick={() => {
                          setFormData({
                            ...formData,
                            project_id: project.project_id
                          });
                          setProjectSearch(project.project_name);
                          setShowProjectDropdown(false);
                        }}
                      >
                        {project.project_name}
                      </li>
                    ))
                  ) : (
                    <li style={{ padding: "8px 12px", color: "#6b7280" }}>
                      No se encontraron proyectos
                    </li>
                  )}
                </ul>
               )}
            </div>

             <div>
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
               {/* el descuento no se va a hacer(porque es innecesario y que hp pereza),
                   dejen esto así comentado

             <div>
               <label className="form-label">Descuento (COP)</label>
               <input
                 type="text"
                 name="discount_amount"
                 className="form-input"
                 inputMode="numeric"
                 value={discountDisplay}
                 onChange={handleDiscountChange}
               />
             </div>

             */}
            <div className="form-full-width">
              <label className="form-label">Descripción</label>
              <textarea
                name="order_description"
                className="form-input"
                rows="3"
                value={formData.order_description || ""}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Sección de Transporte de Entrega (Ida) */}
          <div style={{ marginTop: "16px", padding: "12px", background: "#f9fafb", borderRadius: "8px", border: "1px solid #e5e7eb" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
              <Truck size={18} color="#4b5563" />
              <label style={{ fontWeight: "600", fontSize: "14px", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}>
                <input
                  type="checkbox"
                  checked={includeDeliveryTransport}
                  onChange={(e) => setIncludeDeliveryTransport(e.target.checked)}
                  style={{ width: "16px", height: "16px", cursor: "pointer" }}
                />
                ¿Incluye servicio de transporte (ida)?
              </label>
            </div>

            {includeDeliveryTransport && (
              <div style={{ marginTop: "8px" }}>
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

          <hr style={{ margin: "16px 0" }} />

          <div style={{ marginTop: "12px" }}>
            <h3>Maquinaria</h3>

            {details.map((detail, index) => {
              const maquinaSeleccionada = machines.find(
                (machine) =>
                  Number(machine.machinery_id) === Number(detail.machinery_id)
              );

               const filteredMachines = machines.filter((machine) => {
                 const matchesSearch = machine.machinery_name.toLowerCase().includes((detail.machineSearch || "").toLowerCase());
                 const alreadySelected = details.some((d, i) => i !== index && d.machinery_id === String(machine.machinery_id));
                 return matchesSearch && !alreadySelected;
               });

              return (
                <div
                  key={index}
                  className="machinery-row"
                  style={{ padding: "16px", border: "1px solid #e5e7eb", borderRadius: "12px", marginBottom: "16px" }}
                >
                  <div className="machinery-fields-row">
                    <div className="machinery-field-machine" style={{ position: "relative" }}>
                      <label className="form-label">Máquina *</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Escribe para buscar máquina..."
                        value={detail.machineSearch}
                        onChange={(e) => {
                          const newDetails = [...details];
                          newDetails[index].machineSearch = e.target.value;
                          newDetails[index].showMachineDropdown = true;
                          if (e.target.value === "") {
                             newDetails[index].machinery_id = "";
                             newDetails[index].isMotorized = false;
                             newDetails[index].selectedStocks = [];
                             newDetails[index].stock_id = null;
                             newDetails[index].rental_unit_price = "";
                             newDetails[index].quantity_to_dispatch = 1;
                           }
                          setDetails(newDetails);
                        }}
                        onFocus={() => {
                          const newDetails = [...details];
                          newDetails[index].showMachineDropdown = true;
                          setDetails(newDetails);
                        }}
                        required={!detail.machinery_id}
                      />

                      {detail.showMachineDropdown && (
                        <ul
                          style={{
                            position: "absolute",
                            top: "100%",
                            left: 0,
                            right: 0,
                            background: "white",
                            border: "1px solid #d1d5db",
                            borderRadius: "0.375rem",
                            maxHeight: "150px",
                            overflowY: "auto",
                            zIndex: 50,
                            listStyle: "none",
                            padding: 0,
                            margin: "4px 0 0 0",
                            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
                          }}
                        >
                           {filteredMachines.length > 0 ? (
                             filteredMachines.map((machine) => (
                               <li
                                 key={machine.machinery_id}
                                 style={{
                                   padding: "8px 12px",
                                   cursor: "pointer",
                                   borderBottom: "1px solid #f3f4f6"
                                 }}
                                 onClick={() => {
                                     actualizarDetalle(index, "machinery_id", machine.machinery_id);
                                     const isMotorized = Boolean(machine.is_motorized);
                                     const newDetails = [...details];
                                     newDetails[index].machineSearch = machine.machinery_name;
                                     newDetails[index].showMachineDropdown = false;
                                     newDetails[index].isMotorized = isMotorized;
                                     newDetails[index].selectedStocks = [];
                                     newDetails[index].rental_unit_price = machine.daily_rental_price || "";
                                     newDetails[index].quantity_to_dispatch = isMotorized ? 0 : 1;
                                     if (!isMotorized) {
                                       const stock = (allStocks || []).find(
                                         (s) => Number(s.machinery_id) === Number(machine.machinery_id) && s.status_id === 1
                                       );
                                       newDetails[index].stock_id = stock ? stock.stock_id : null;
                                     } else {
                                       newDetails[index].stock_id = null;
                                     }
                                     setDetails(newDetails);
                                   }}
                               >
                                 {machine.machinery_name}
                               </li>
                             ))
                           ) : (
                             <li style={{ padding: "8px 12px", color: "#6b7280" }}>
                               No se encontraron máquinas
                             </li>
                           )}
                        </ul>
                      )}
                    </div>

                    {maquinaSeleccionada?.is_motorized ? (
                      <div className="machinery-field-quantity">
                        <label className="form-label">Cantidad</label>
                        <input
                          type="number"
                          className="form-input"
                          value={detail.quantity_to_dispatch}
                          readOnly
                        />
                        <small style={{ color: "#6b7280" }}>
                          {detail.selectedStocks.length} equipo(s) seleccionado(s)
                        </small>
                        <button
                          type="button"
                          className="btn-secondary"
                          style={{ marginTop: "8px", width: "100%" }}
                          onClick={() => openStockModal(index, maquinaSeleccionada)}
                        >
                          Seleccionar equipos
                        </button>
                      </div>
                    ) : (
                      <div className="machinery-field-quantity">
                        <label className="form-label">Cantidad</label>
                        <input
                          type="number"
                          min="1"
                          max={maquinaSeleccionada?.total_stock || undefined}
                          className="form-input"
                          value={detail.quantity_to_dispatch}
                          onChange={(e) =>
                            actualizarDetalle(
                              index,
                              "quantity_to_dispatch",
                              e.target.value
                            )
                          }
                        />
                        {maquinaSeleccionada && (
                          <small style={{ color: "#6b7280" }}>
                            Disponibles: {maquinaSeleccionada.total_stock ?? 0}
                          </small>
                        )}
                      </div>
                    )}

                    <div>
                      <label className="form-label">
                        {maquinaSeleccionada?.is_motorized ? "Precio por unidad" : "Precio"}
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        className="form-input"
                        value={detail.rental_unit_price || maquinaSeleccionada?.daily_rental_price || ""}
                        onChange={(e) =>
                          actualizarDetalle(
                            index,
                            "rental_unit_price",
                            e.target.value
                          )
                        }
                      />
                    </div>

                    <div className="machinery-field-delete">
                      <button
                        type="button"
                        className="btn-cancel"
                        onClick={() => eliminarDetalle(index)}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>

                  {index === details.length - 1 && (
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={agregarDetalle}
                      style={{ marginTop: "12px" }}
                    >
                      <Plus size={18} />
                      Agregar
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          <div className="form-footer">
            <button
              type="button"
              onClick={onClose}
              className="btn-cancel"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-submit"
            >
              Registrar Pedido
            </button>
          </div>
        </form>
      </div>

      <StockSelectionModal
        key={stockModalMachine?.machinery_id}
        isOpen={stockModalOpen}
        onClose={() => setStockModalOpen(false)}
        machinery={stockModalMachine}
        onConfirm={handleStockConfirm}
        initialSelectedIds={stockModalIndex !== null ? details[stockModalIndex]?.selectedStocks || [] : []}
      />
    </div>
  );
};

export default OrderForm;