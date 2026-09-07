import { useCallback, useEffect, useRef, useState } from "react";
import { X, Truck } from "lucide-react";

import { useOrders } from "../../hooks/useOrders";

import "./OrderForm.css";
import { useAlertModal } from "../../../../shared/alertModal";

const OrderForm = ({
  isOpen,
  onClose,
  orderId,
  initialOrder
}) => {
  const { showAlert } = useAlertModal();

  const {
    actualizarPedido,
    obtenerPedidoCompleto
  } = useOrders();

  const [projects, setProjects] = useState([]);
  const [customers, setCustomers] = useState([]);

  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [projectSearch, setProjectSearch] = useState("");
  const [showProjectDropdown, setShowProjectDropdown] = useState(false);

  const [formData, setFormData] = useState({
    order_creation_date: "",
    project_id: "",
    order_description: ""
  });

  const [includeDeliveryTransport, setIncludeDeliveryTransport] = useState(false);
  const [deliveryTransportPriceDisplay, setDeliveryTransportPriceDisplay] = useState("");

  const [hasCuts, setHasCuts] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);

  const initializedRef = useRef(false);

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
      return data;
    } catch (error) {
      console.error(error);
      return [];
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
      return data;
    } catch (error) {
      console.error(error);
      return [];
    }
  }, []);

  useEffect(() => {
    if (!isOpen) {
      initializedRef.current = false;
      return;
    }

    if (initializedRef.current) return;
    if (!orderId) return;

    initializedRef.current = true;
    setLoading(true);

    const inicializarFormulario = async () => {
      try {
        const [projectsList, customersList] = await Promise.all([
          cargarProyectos(),
          cargarClientes()
        ]);

        let order = initialOrder;

        if (!order) {
          order = await obtenerPedidoCompleto(orderId);
        }

        if (!order) return;

        const project = (projectsList || []).find(
          (p) => Number(p.project_id) === Number(order.project_id)
        );

        if (project) {
          setSelectedCustomerId(String(project.customer_id));
          setProjectSearch(project.project_name);
        }

        const creationDate = order.order_creation_date
          ? new Date(order.order_creation_date).toISOString().split("T")[0]
          : "";

        const transportCharge = (order.additional_charges || []).find(
          (c) => Number(c.charge_type_id) === 1
        );

        setFormData({
          order_creation_date: creationDate,
          project_id: String(order.project_id),
          order_description: order.order_description || ""
        });

        setHasCuts(!!order.last_cut_date);
        setIncludeDeliveryTransport(!!transportCharge);
        setDeliveryTransportPriceDisplay(
          transportCharge
            ? Number(transportCharge.charge_amount).toLocaleString("es-CO")
            : ""
        );
        setCurrentOrder(order);
      } catch {
        await showAlert("Error al cargar los datos del pedido.");
      } finally {
        setLoading(false);
      }
    };

    inicializarFormulario();
  }, [
    isOpen,
    orderId,
    initialOrder,
    cargarProyectos,
    cargarClientes,
    obtenerPedidoCompleto,
    showAlert
  ]);

  useEffect(() => {
    if (!isOpen) {
      initializedRef.current = false;
      setSelectedCustomerId("");
      setProjectSearch("");
      setShowProjectDropdown(false);
      setFormData({
        order_creation_date: "",
        project_id: "",
        order_description: ""
      });
      setIncludeDeliveryTransport(false);
      setDeliveryTransportPriceDisplay("");
      setHasCuts(false);
      setLoading(false);
      setSubmitting(false);
      setCurrentOrder(null);
    }
  }, [isOpen]);

  const filteredProjects = projects.filter((project) => {
    const matchesSearch = project.project_name
      .toLowerCase()
      .includes(projectSearch.toLowerCase());
    const matchesCustomer =
      !selectedCustomerId || project.customer_id == selectedCustomerId;
    return matchesSearch && matchesCustomer;
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleCustomerChange = (e) => {
    const value = e.target.value;
    setSelectedCustomerId(value);
    setFormData({ ...formData, project_id: "" });
    setProjectSearch("");
  };

  const handleProjectSelect = (project) => {
    setFormData({
      ...formData,
      project_id: String(project.project_id)
    });
    setProjectSearch(project.project_name);
    setShowProjectDropdown(false);
  };

  const handleTransportToggle = (e) => {
    if (hasCuts) {
      showAlert(
        "No es posible modificar el servicio de transporte porque hay cortes registrados."
      );
      return;
    }
    setIncludeDeliveryTransport(e.target.checked);
    if (!e.target.checked) {
      setDeliveryTransportPriceDisplay("");
    }
  };

  const handleTransportPriceChange = (e) => {
    if (hasCuts) return;
    const raw = e.target.value.replace(/\D/g, "");
    if (raw === "") {
      setDeliveryTransportPriceDisplay("");
      return;
    }
    setDeliveryTransportPriceDisplay(Number(raw).toLocaleString("es-CO"));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.project_id) {
      await showAlert("Seleccione un proyecto.");
      return;
    }

    if (!formData.order_creation_date) {
      await showAlert("Ingrese la fecha de inicio.");
      return;
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

    setSubmitting(true);

    try {
      const payload = {
        order_creation_date: formData.order_creation_date,
        project_id: Number(formData.project_id),
        order_status_id: currentOrder?.order_status_id,
        user_id: currentOrder?.user_id,
        discount_amount: currentOrder?.discount_amount || 0,
        order_description: formData.order_description
      };

      if (!hasCuts) {
        payload.include_delivery_transport = includeDeliveryTransport;
        payload.delivery_transport_price = includeDeliveryTransport
          ? deliveryTransportPriceDisplay === ""
            ? 0
            : Number(deliveryTransportPriceDisplay.replace(/\./g, ""))
          : 0;
      }

      await actualizarPedido(orderId, payload);
      await showAlert("Pedido actualizado correctamente");
      onClose();
    } catch (error) {
      await showAlert(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="form-modal-overlay">
      <div className="form-modal-container">
        <div className="form-header">
          <h2>Editar Pedido</h2>
          <button onClick={onClose} className="form-close-btn">
            <X size={20} />
          </button>
        </div>

        {loading ? (
          <div className="form-body">
            <p style={{ textAlign: "center", color: "#6b7280" }}>
              Cargando datos del pedido...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="form-body">
            <div className="form-grid">
              <div>
                <label className="form-label">Cliente</label>
                <select
                  className="form-input"
                  value={selectedCustomerId}
                  onChange={handleCustomerChange}
                >
                  <option value="">Todos los clientes</option>
                  {customers.map((c) => (
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
                          onClick={() => handleProjectSelect(project)}
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
                  value={formData.order_creation_date}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-full-width">
                <label className="form-label">Descripción</label>
                <textarea
                  name="order_description"
                  className="form-input"
                  rows="3"
                  value={formData.order_description}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div
              style={{
                marginTop: "16px",
                padding: "12px",
                background: "#f9fafb",
                borderRadius: "8px",
                border: "1px solid #e5e7eb"
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "8px"
                }}
              >
                <Truck size={18} color="#4b5563" />
                <label
                  style={{
                    fontWeight: "600",
                    fontSize: "14px",
                    cursor: hasCuts ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    color: hasCuts ? "#9ca3af" : "inherit"
                  }}
                >
                  <input
                    type="checkbox"
                    checked={includeDeliveryTransport}
                    onChange={handleTransportToggle}
                    disabled={hasCuts}
                    style={{
                      width: "16px",
                      height: "16px",
                      cursor: hasCuts ? "not-allowed" : "pointer"
                    }}
                  />
                  ¿Incluye servicio de transporte (ida)?
                </label>
              </div>

              {includeDeliveryTransport && !hasCuts && (
                <div style={{ marginTop: "8px" }}>
                  <label className="form-label">
                    Precio de transporte de entrega (COP)
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    inputMode="numeric"
                    placeholder="Ej: 50.000"
                    value={deliveryTransportPriceDisplay}
                    onChange={handleTransportPriceChange}
                  />
                </div>
              )}

              {hasCuts && (
                <p
                  style={{
                    marginTop: "8px",
                    fontSize: "12px",
                    color: "#dc2626"
                  }}
                >
                  No es posible modificar el servicio de transporte porque hay
                  cortes registrados.
                </p>
              )}
            </div>

            <div className="form-footer">
              <button
                type="button"
                onClick={onClose}
                className="btn-cancel"
                disabled={submitting}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn-submit"
                disabled={submitting}
              >
                {submitting ? "Guardando..." : "Guardar Cambios"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default OrderForm;
