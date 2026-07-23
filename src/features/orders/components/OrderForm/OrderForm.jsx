import { useCallback, useEffect, useState } from "react";
import { X, Plus, Trash2 } from "lucide-react";

import { useOrders } from "../../hooks/useOrders";

import "./OrderForm.css";

const OrderForm = ({
  isOpen,
  onClose,
  formData,
  setFormData
}) => {

  const { crearPedidoCompleto } = useOrders();

  const [projects, setProjects] = useState([]);
  const [machines, setMachines] = useState([]);

  // Estados para la búsqueda interactiva de proyectos
  const [projectSearch, setProjectSearch] = useState("");
  const [showProjectDropdown, setShowProjectDropdown] = useState(false);

  const [details, setDetails] = useState([
    {
      machinery_id: "",
      quantity_to_dispatch: 1,
      rental_unit_price: "",
      // Estados de búsqueda individuales para cada máquina en los detalles
      machineSearch: "",
      showMachineDropdown: false
    }
  ]);

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
      const response = await fetch("http://localhost:3000/api/machines", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await response.json();
      setMachines(data);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    let isActive = true;

    const inicializarFormulario = async () => {
      await Promise.all([
        cargarProyectos(),
        cargarMaquinas()
      ]);

      if (!isActive) return;

      setFormData((prev) => ({
        ...prev,
        order_creation_date: new Date().toISOString().split("T")[0],
        discount_amount: prev?.discount_amount || "0.00"
      }));
      setProjectSearch("");
      setDetails([
        {
          machinery_id: "",
          quantity_to_dispatch: 1,
          rental_unit_price: "",
          machineSearch: "",
          showMachineDropdown: false
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

  const filteredProjects = projects.filter((project) =>
    project.project_name.toLowerCase().includes(projectSearch.toLowerCase())
  );

  const agregarDetalle = () => {
    setDetails([
      ...details,
      {
        machinery_id: "",
        quantity_to_dispatch: 1,
        rental_unit_price: "",
        machineSearch: "",
        showMachineDropdown: false
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

    if (campo === "quantity_to_dispatch") {
      const maquinaActual = machines.find(
        (m) => Number(m.machinery_id) === Number(nuevosDetalles[index].machinery_id)
      );

      if (maquinaActual && !maquinaActual.is_motorized) {
        const stockDisponible = Number(maquinaActual.stock_quantity) || 0;
        const cantidadIngresada = Number(valor) || 0;

        if (cantidadIngresada > stockDisponible) {
          alert(`La cantidad no puede superar el stock disponible (${stockDisponible})`);
          return;
        }
      }
    }

    nuevosDetalles[index][campo] = valor;

    if (campo === "machinery_id") {
      const maquina = machines.find(
        (m) => Number(m.machinery_id) === Number(valor)
      );

      if (maquina) {
        nuevosDetalles[index].rental_unit_price = maquina.daily_rental_price;

        if (maquina.is_motorized) {
          nuevosDetalles[index].quantity_to_dispatch = 1;
        } else {
          const stock = Number(maquina.stock_quantity) || 0;
          if (stock > 0 && Number(nuevosDetalles[index].quantity_to_dispatch) > stock) {
            nuevosDetalles[index].quantity_to_dispatch = stock;
          }
        }
      }
    }

    setDetails(nuevosDetalles);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    for (const item of details) {
      const maquina = machines.find((m) => Number(m.machinery_id) === Number(item.machinery_id));
      if (maquina && !maquina.is_motorized) {
        const stock = Number(maquina.stock_quantity) || 0;
        const cantidad = Number(item.quantity_to_dispatch) || 0;
        if (cantidad > stock) {
          alert(`La cantidad para la máquina "${maquina.machinery_name}" supera el stock disponible (${stock}).`);
          return;
        }
      }
    }

    try {
      const payload = {
        project_id: Number(formData.project_id),
        order_creation_date: formData.order_creation_date,
        discount_amount: formData.discount_amount || "0.00",
        order_description: formData.order_description,
        details: details.map((item) => ({
          machinery_id: Number(item.machinery_id),
          quantity_to_dispatch: Number(item.quantity_to_dispatch),
          rental_unit_price: item.rental_unit_price
        }))
      };

      await crearPedidoCompleto(payload);

      alert("Pedido creado correctamente");
      onClose();
    } catch (error) {
      alert(error.message);
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
            {/* Input con autocompletado para Proyecto */}
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

              {showProjectDropdown && projectSearch.trim() !== "" && (
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

            <div>
              <label className="form-label">Descuento</label>
              <input
                type="number"
                step="0.01"
                name="discount_amount"
                className="form-input"
                value={formData.discount_amount || "0.00"}
                onChange={handleChange}
              />
            </div>

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

          <hr />

          <div style={{ marginTop: "20px" }}>
            <h3>Maquinaria</h3>

            {details.map((detail, index) => {
              const maquinaSeleccionada = machines.find(
                (machine) =>
                  Number(machine.machinery_id) === Number(detail.machinery_id)
              );

              const filteredMachines = machines.filter((machine) =>
                machine.machinery_name.toLowerCase().includes((detail.machineSearch || "").toLowerCase())
              );

              return (
                <div
                  key={index}
                  className="form-grid"
                  style={{ marginBottom: "20px" }}
                >
                  {/* Input con autocompletado para Máquina */}
                  <div style={{ position: "relative" }}>
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

                    {detail.showMachineDropdown && (detail.machineSearch || "").trim() !== "" && (
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
                                const newDetails = [...details];
                                newDetails[index].machineSearch = machine.machinery_name;
                                newDetails[index].showMachineDropdown = false;
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

                  <div>
                    <label className="form-label">Cantidad</label>
                    <input
                      type="number"
                      min="1"
                      max={!maquinaSeleccionada?.is_motorized ? maquinaSeleccionada?.stock_quantity : undefined}
                      className="form-input"
                      disabled={maquinaSeleccionada?.is_motorized}
                      value={detail.quantity_to_dispatch}
                      onChange={(e) =>
                        actualizarDetalle(
                          index,
                          "quantity_to_dispatch",
                          e.target.value
                        )
                      }
                    />

                    {maquinaSeleccionada?.is_motorized ? (
                      <small style={{ color: "#6b7280" }}>
                        La maquinaria motorizada se alquila por unidad.
                      </small>
                    ) : maquinaSeleccionada ? (
                      <small style={{ color: "#6b7280" }}>
                        Disponibles: {maquinaSeleccionada.stock_quantity}
                      </small>
                    ) : null}
                  </div>

                  <div>
                    <label className="form-label">Precio</label>
                    <input
                      type="number"
                      step="0.01"
                      className="form-input"
                      value={detail.rental_unit_price}
                      onChange={(e) =>
                        actualizarDetalle(
                          index,
                          "rental_unit_price",
                          e.target.value
                        )
                      }
                    />
                  </div>

                  <div style={{ display: "flex", alignItems: "end" }}>
                    <button
                      type="button"
                      className="btn-cancel"
                      onClick={() => eliminarDetalle(index)}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              );
            })}

            <button
              type="button"
              className="btn-secondary"
              onClick={agregarDetalle}
            >
              <Plus size={18} />
              Agregar Máquina
            </button>
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
    </div>
  );
};

export default OrderForm;