import { useState, useEffect } from "react";
import {
  Plus,
  Search,
  ArrowRightCircle,
  Ban
} from "lucide-react";

import { useOrders } from "../hooks/useOrders";
import { useAuth } from "../../../shared/context/AuthContext";
import { formatDate } from "../../../shared/utils/dateUtils";

import OrderForm from "../components/OrderForm/OrderForm";

import Pagination from "../../../shared/components/pagination/Pagination";
import useDebounce from "../../../shared/hooks/useDebounce";

import "./OrderPage.css";
import { useAlertModal } from "../../../shared/alertModal";

const OrderPage = ({ onOpenWorkspace }) => {
  const { showAlert, showSuccess } = useAlertModal();

  const { hasPermission } = useAuth();

  const {
    orders,
    cargarPedidos,
    anularPedido,

    page,
    cambiarPagina,
    cambiarBusqueda,
    pagination

  } = useOrders();

  const [busqueda, setBusqueda] = useState("");
  const [formData, setFormData] = useState({});
  const [mostrarModalForm, setMostrarModalForm] = useState(false);

  const handleAnularPedido = async (orderId) => {

    const result =
      await anularPedido(orderId);

    if (!result) return;

    if (result.success) {

      await showSuccess(result.message);

    } else {

      await showAlert(
        `No fue posible anular el pedido.\n\n${result.message}`,
        'Anulación no permitida'
      );

    }

  };

  const busquedaDebounce =
    useDebounce(busqueda, 300);

  useEffect(() => {

    cambiarBusqueda(busquedaDebounce);

  }, [busquedaDebounce]);

  return (

    <div className="page-container">

      <div className="header-container">

        <div className="header-text">

          <h1>Pedidos</h1>

          <p>

            Gestión de pedidos - Makand

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
                setBusqueda(e.target.value)
              }
            />

          </div>

          {hasPermission("Crear Pedido") && (

            <button
              className="btn-nuevo"
              onClick={() => {

                setFormData({});
                setMostrarModalForm(true);

              }}
            >

              <Plus size={20} />

              Nuevo Pedido

            </button>

          )}

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

            {orders.length > 0 ? (

              orders.map((order) => {

                const isCancelled = order.order_status_id === 5;

                return (

                  <tr
                    key={order.order_id}
                    className={
                      isCancelled
                        ? "row-cancelled"
                        : ""
                    }
                  >

                    <td>

                      #{order.order_id}

                    </td>

                    <td>

                      {formatDate(
                        order.order_creation_date
                      )}

                    </td>

                    <td>

                      {order.project_name}

                    </td>

                    <td>

                      {order.customer_name}

                    </td>

                    <td>

                      <span className={`status-badge status-${order.order_status_id}`}>
                        {order.order_status_name}
                      </span>

                    </td>

                    <td className="actions-cell">

                      {hasPermission("Gestionar Pedido") && (

                        <button
                          className="action-btn"
                          title="Gestionar Pedido"
                          onClick={() =>
                            onOpenWorkspace(
                              order.order_id
                            )
                          }
                        >

                          <ArrowRightCircle size={18} />

                        </button>

                      )}

                      {hasPermission("Anular Pedido") &&
                        !isCancelled && (

                          <button
                            className="action-btn delete"
                            title="Anular"
                            onClick={() =>
                              handleAnularPedido(
                                order.order_id
                              )
                            }
                          >

                            <Ban size={18} />

                          </button>

                        )}

                    </td>

                  </tr>

                );

              })

            ) : (

              <tr>

                <td
                  colSpan="6"
                  className="empty-row"
                  style={{
                    textAlign: "center",
                    padding: "40px"
                  }}
                >

                  No se encontraron coincidencias para "{busqueda}"

                </td>

              </tr>

            )}

          </tbody>

        </table>

      </div>

      <Pagination
        page={page}
        totalPages={pagination.totalPages}
        total={pagination.total}
        onPageChange={cambiarPagina}
      />

      <OrderForm
        isOpen={mostrarModalForm}
        onClose={async () => {

          setMostrarModalForm(false);
          await cargarPedidos();

        }}
        formData={formData}
        setFormData={setFormData}
      />

    </div>

  );

};

export default OrderPage;