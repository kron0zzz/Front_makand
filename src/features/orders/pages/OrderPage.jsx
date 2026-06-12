import { useState, useMemo, useEffect } from "react";
import { Plus, Search, Eye, Trash2 } from "lucide-react";

import { useOrders } from "../hooks/useOrders";

//import OrderForm from "../components/orderForm/OrderForm";
import OrderDetail from "../components/OrderDetail/OrderDetail";

import "./OrderPage.css";

const OrderPage = () => {

  const {
    orders,
    cargarPedidos,
    eliminarPedido,
    obtenerPedidoCompleto
  } = useOrders();

  const [busqueda, setBusqueda] = useState("");

  const [formData, setFormData] = useState({});

  const [mostrarModalForm, setMostrarModalForm] =
    useState(false);

  const [mostrarModalDetalle, setMostrarModalDetalle] =
    useState(false);

  const [pedidoSeleccionado, setPedidoSeleccionado] =
    useState(null);



  useEffect(() => {

    cargarPedidos();

  }, [cargarPedidos]);



  const pedidosFiltrados = useMemo(() => {

    const datos =
      Array.isArray(orders)
        ? orders
        : [];

    const termino =
      busqueda.toLowerCase();

    return datos.filter((order) => {

      const proyecto =
        order.project_name?.toLowerCase() || "";

      const cliente =
        `${order.customer_first_name || ""} ${order.customer_last_name || ""}`
          .toLowerCase();

      const pedido =
        order.order_id?.toString() || "";

      return (
        proyecto.includes(termino) ||
        cliente.includes(termino) ||
        pedido.includes(termino)
      );

    });

  }, [orders, busqueda]);




  const abrirDetallePedido = async (orderId) => {

    try {

      const pedidoCompleto =
        await obtenerPedidoCompleto(orderId);

      setPedidoSeleccionado(
        pedidoCompleto
      );

      setMostrarModalDetalle(true);

    } catch (error) {

      console.error(error);

      alert(
        "No se pudo cargar el detalle del pedido"
      );

    }

  };



  return (
    <div className="page-container">

      <div className="header-container">

        <div className="header-text">
          <h1>Pedidos</h1>
          <p>
            Gestión de alquileres - Makand
          </p>
        </div>

        <div className="header-actions">

          <div className="search-container-small">

            <Search
              size={18}
              color="#9ca3af"
            />

            <input
              type="text"
              className="search-input"
              placeholder="Buscar..."
              value={busqueda}
              onChange={(e) =>
                setBusqueda(
                  e.target.value
                )
              }
            />

          </div>

          <button
            className="btn-nuevo"
            onClick={() => {

              setFormData({});

              setMostrarModalForm(
                true
              );

            }}
          >

            <Plus size={20} />

            Nuevo Pedido

          </button>

        </div>

      </div>



      <div className="table-wrapper">

        <table className="custom-table">

          <thead>

            <tr>

              <th>ID</th>

              <th>Fecha</th>

              <th>Proyecto</th>

              <th>Cliente</th>

              <th>Estado</th>

              <th>Gestión</th>

            </tr>

          </thead>

          <tbody>

            {pedidosFiltrados.length > 0 ? (

              pedidosFiltrados.map(
                (order) => (

                  <tr
                    key={
                      order.order_id
                    }
                  >

                    <td>
                      #
                      {
                        order.order_id
                      }
                    </td>

                    <td>
                      {
                        order.order_creation_date
                      }
                    </td>

                    <td>
                      {
                        order.project_name
                      }
                    </td>

                    <td>
                      {`${order.customer_first_name} ${order.customer_last_name}`}
                    </td>

                    <td>
                      {
                        order.order_status_name
                      }
                    </td>

                    <td className="actions-cell">

                      <button
                        className="action-btn view"
                        title="Ver"
                        onClick={() => {

                          abrirDetallePedido(
                            order.order_id
                          )

                        }}
                      >

                        <Eye size={18} />

                      </button>



                      <button
                        className="action-btn delete"
                        title="Eliminar"
                        onClick={() =>
                          eliminarPedido(
                            order.order_id
                          )
                        }
                      >

                        <Trash2 size={18} />

                      </button>

                    </td>

                  </tr>

                )
              )

            ) : (

              <tr>

                <td
                  colSpan="6"
                  className="empty-row"
                  style={{
                    textAlign:
                      "center",
                    padding:
                      "40px"
                  }}
                >

                  No se encontraron
                  coincidencias para "
                  {busqueda}
                  "

                </td>

              </tr>

            )}

          </tbody>

        </table>

      </div>



      {/*<OrderForm
        isOpen={
          mostrarModalForm
        }
        onClose={async () => {

          setMostrarModalForm(
            false
          );

          await cargarPedidos();

        }}
        formData={formData}
        setFormData={setFormData}
      />
*/}


      <OrderDetail
        isOpen={
          mostrarModalDetalle
        }
        onClose={() =>
          setMostrarModalDetalle(
            false
          )
        }
        order={
          pedidoSeleccionado
        }
      />

    </div>
  );

};

export default OrderPage;