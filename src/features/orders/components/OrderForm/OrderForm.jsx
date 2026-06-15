import { useEffect, useState } from "react";
import { X, Plus, Trash2 } from "lucide-react";

import { useOrders } from "../../hooks/useOrders";

import "./OrderForm.css";

const OrderForm = ({
  isOpen,
  onClose,
  formData,
  setFormData,
  isEditing = false
}) => {

  const { crearPedidoCompleto } =
    useOrders();

  const [projects, setProjects] =
    useState([]);

  const [machines, setMachines] =
    useState([]);

  const [details, setDetails] =
    useState([
      {
        machinery_id: "",
        quantity_to_dispatch: 1,
        rental_unit_price: ""
      }
    ]);



  useEffect(() => {

    if (!isOpen) return;

    cargarProyectos();
    cargarMaquinas();

    setFormData({
      order_creation_date:
        new Date()
          .toISOString()
          .split("T")[0],

      discount_amount: "0.00"
    });

  }, [isOpen]);



  const cargarProyectos =
    async () => {

      try {

        const token =
          localStorage.getItem(
            "token"
          );

        const response =
          await fetch(
            "http://localhost:3000/api/projects",
            {
              headers: {
                Authorization:
                  `Bearer ${token}`
              }
            }
          );

        const data =
          await response.json();

        setProjects(data);

      } catch (error) {

        console.error(error);

      }

    };



  const cargarMaquinas =
    async () => {

      try {

        const token =
          localStorage.getItem(
            "token"
          );

        const response =
          await fetch(
            "http://localhost:3000/api/machines",
            {
              headers: {
                Authorization:
                  `Bearer ${token}`
              }
            }
          );

        const data =
          await response.json();

        setMachines(data);

      } catch (error) {

        console.error(error);

      }

    };



  if (!isOpen) return null;



  const handleChange =
    (e) => {

      const {
        name,
        value
      } = e.target;

      setFormData({
        ...formData,
        [name]: value
      });

    };



  const agregarDetalle =
    () => {

      setDetails([
        ...details,
        {
          machinery_id: "",
          quantity_to_dispatch: 1,
          rental_unit_price: ""
        }
      ]);

    };



  const eliminarDetalle =
    (index) => {

      const nuevosDetalles =
        [...details];

      nuevosDetalles.splice(
        index,
        1
      );

      setDetails(
        nuevosDetalles
      );

    };



  const actualizarDetalle =
    (
      index,
      campo,
      valor
    ) => {

      const nuevosDetalles =
        [...details];

      nuevosDetalles[index][campo] =
        valor;

      if (
  campo ===
  "machinery_id"
) {

  const maquina =
    machines.find(
      (m) =>
        Number(
          m.machinery_id
        ) === Number(valor)
    );

  if (maquina) {

    nuevosDetalles[index]
      .rental_unit_price =
      maquina.daily_rental_price;

    // Si es motorizada,
    // siempre será 1 unidad

    if (
      maquina.is_motorized
    ) {

      nuevosDetalles[index]
        .quantity_to_dispatch = 1;

    }

  }

}

      setDetails(
        nuevosDetalles
      );

    };



  const handleSubmit =
    async (e) => {

      e.preventDefault();

      try {

        const payload = {

          project_id:
            Number(
              formData.project_id
            ),

          order_creation_date:
            formData.order_creation_date,

          discount_amount:
            formData.discount_amount ||
            "0.00",

          order_description:
            formData.order_description,

          details:
            details.map(
              (item) => ({
                machinery_id:
                  Number(
                    item.machinery_id
                  ),

                quantity_to_dispatch:
                  Number(
                    item.quantity_to_dispatch
                  ),

                rental_unit_price:
                  item.rental_unit_price
              })
            )

        };

        await crearPedidoCompleto(
          payload
        );

        alert(
          "Pedido creado correctamente"
        );

        onClose();

      } catch (error) {

        alert(
          error.message
        );

      }

    };



  return (
    <div className="form-modal-overlay">

      <div className="form-modal-container">

        <div className="form-header">

          <h2>
            Registrar Pedido
          </h2>

          <button
            onClick={onClose}
            className="form-close-btn"
          >

            <X size={20} />

          </button>

        </div>



        <form
          onSubmit={
            handleSubmit
          }
          className="form-body"
        >

          <div className="form-grid">

            <div>

              <label className="form-label">
                Proyecto *
              </label>

              <select
                name="project_id"
                className="form-input"
                value={
                  formData.project_id ||
                  ""
                }
                onChange={
                  handleChange
                }
                required
              >

                <option value="">
                  Seleccione
                </option>

                {projects.map(
                  (
                    project
                  ) => (
                    <option
                      key={
                        project.project_id
                      }
                      value={
                        project.project_id
                      }
                    >
                      {
                        project.project_name
                      }
                    </option>
                  )
                )}

              </select>

            </div>



            <div>

              <label className="form-label">
                Fecha Inicio *
              </label>

              <input
                type="date"
                name="order_creation_date"
                className="form-input"
                value={
                  formData.order_creation_date ||
                  ""
                }
                onChange={
                  handleChange
                }
                required
              />

            </div>



            <div>

              <label className="form-label">
                Descuento
              </label>

              <input
                type="number"
                step="0.01"
                name="discount_amount"
                className="form-input"
                value={
                  formData.discount_amount ||
                  "0.00"
                }
                onChange={
                  handleChange
                }
              />

            </div>



            <div className="form-full-width">

              <label className="form-label">
                Descripción
              </label>

              <textarea
                name="order_description"
                className="form-input"
                rows="3"
                value={
                  formData.order_description ||
                  ""
                }
                onChange={
                  handleChange
                }
              />

            </div>

          </div>



          <hr />



          <div
            style={{
              marginTop:
                "20px"
            }}
          >

            <h3>
              Maquinaria
            </h3>

            {details.map(
              (
                detail,
                index
              ) => {
                const maquinaSeleccionada =
                  machines.find(
                    machine =>
                      Number(
                        machine.machinery_id
                      ) === Number(
                        detail.machinery_id
                      )
                  );
              
                
                return(

                <div
                  key={index}
                  className="form-grid"
                  style={{
                    marginBottom:
                      "20px"
                  }}
                >

                  <div>

                    <label className="form-label">
                      Máquina
                    </label>

                    <select
                      className="form-input"
                      value={
                        detail.machinery_id
                      }
                      onChange={(e) =>
                        actualizarDetalle(
                          index,
                          "machinery_id",
                          e.target.value
                        )
                      }
                    >

                      <option value="">
                        Seleccione
                      </option>

                      {machines.map(
                        (
                          machine
                        ) => (
                          <option
                            key={
                              machine.machinery_id
                            }
                            value={
                              machine.machinery_id
                            }
                          >
                            {
                              machine.machinery_name
                            }
                          </option>
                        )
                      )}

                    </select>

                  </div>





                  <div>

                    <label className="form-label">
                      Cantidad
                    </label>

                    <input
                      type="number"
                      min="1"
                      className="form-input"
                      disabled={
                        maquinaSeleccionada?.is_motorized
                      }
                      value={
                        detail.quantity_to_dispatch
                      }
                      onChange={(e) =>
                        actualizarDetalle(
                          index,
                          "quantity_to_dispatch",
                          e.target.value
                        )
                      }
                    />

                    {
                      maquinaSeleccionada?.is_motorized ? (

                        <small
                          style={{
                            color: "#6b7280"
                          }}
                        >
                          La maquinaria motorizada
                          se alquila por unidad.
                        </small>

                      ) : maquinaSeleccionada ? (

                        <small
                          style={{
                            color: "#6b7280"
                          }}
                        >
                          Disponibles: {
                            maquinaSeleccionada.stock_quantity
                          }
                        </small>

                      ) : null
                    }

                  </div>





                  <div>

                    <label className="form-label">
                      Precio
                    </label>

                    <input
                      type="number"
                      step="0.01"
                      className="form-input"
                      value={
                        detail.rental_unit_price
                      }
                      onChange={(e) =>
                        actualizarDetalle(
                          index,
                          "rental_unit_price",
                          e.target.value
                        )
                      }
                    />

                  </div>



                  <div
                    style={{
                      display:
                        "flex",
                      alignItems:
                        "end"
                    }}
                  >

                    <button
                      type="button"
                      className="btn-cancel"
                      onClick={() =>
                        eliminarDetalle(
                          index
                        )
                      }
                    >

                      <Trash2
                        size={18}
                      />

                    </button>

                  </div>

                </div>

              )}
            )}



            <button
              type="button"
              className="btn-secondary"
              onClick={
                agregarDetalle
              }
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