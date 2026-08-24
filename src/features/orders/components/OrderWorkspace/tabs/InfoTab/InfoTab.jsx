import "./InfoTab.css";

import {
    Package,
    User,
    FolderKanban,
    Calendar,
    FileText
} from "lucide-react";

import { formatDate } from "../../../../../../shared/utils/dateUtils";
import { useAlertModal } from "../../../../../../shared/alertModal";

const InfoTab = ({ order, onCloseOrder, onAnularOrder }) => {
  const { showAlert } = useAlertModal();

    const totalPedido =
        order.details?.reduce(
            (acc, item) =>
                acc +
                Number(item.rental_unit_price) *
                Number(item.quantity_to_dispatch),
            0
        ) || 0;

    const totalReferencias =
        order.details?.length || 0;

    const totalUnidades =
        order.details?.reduce(
            (acc, item) =>
                acc + Number(item.quantity_to_dispatch),
            0
        ) || 0;

    const totalPeso =
        order.details?.reduce(
            (acc, item) =>
                acc + Number(item.subtotal_weight_kg),
            0
        ) || 0;


    //estados posibles
    const steps = [
        "En progreso",
        "Devuelto",
        "Pagado",
        "Cerrado"
    ];
    const currentStep = order.order_status_id;



    const handleCloseOrder = async () => {

        const result = await onCloseOrder(order.order_id);

        if (!result) return;

        if (result.success) {

            await showAlert(result.message);

        } else {

            await showAlert(
                `No fue posible cerrar el pedido.\n\n${result.message}`
            );

        }

    };

    const handleAnularOrder = async () => {

        const result = await onAnularOrder(order.order_id);

        if (!result) return;

        if (result.success) {

            await showAlert(result.message);

        } else {

            await showAlert(
                `No fue posible anular el pedido.\n\n${result.message}`
            );

        }

    };

    return (

        <div className="info-tab">


            <div className="info-grid">

                <div className="info-card-customer">

                    <div className="customer-section">

                        <div className="info-title">
                            <User size={18}/>
                            <h3>Cliente</h3>
                        </div>

                        <p className="main-text">
                            {order.customer_name}
                        </p>

                        <small>
                            Teléfono
                        </small>

                        <p>
                            {order.customer_phone}
                        </p>

                    </div>

                    <div className="customer-divider"/>

                    <div className="project-section">

                        <div className="info-title">
                            <FolderKanban size={18}/>
                            <h3>Proyecto</h3>
                        </div>

                        <p className="main-text">
                            {order.project_name}
                        </p>

                        <small>
                            {order.project_city}
                        </small>

                        <small>
                            {order.project_address}
                        </small>

                        <small>
                            Teléfono: {order.project_phone}
                        </small>

                    </div>

                </div>

                <div className="info-card">
                    <div className="info-title">
                        <Package size={18}/>
                        <h3>
                            Estado del pedido
                        </h3>
                    </div>

                    {
                        currentStep === 5
                        ?
                        (
                            <div className="cancelled-status">
                                Pedido anulado
                            </div>
                        )
                        :
                        (
                            <div className="stepper">
                                {
                                    steps.map((step, index) => {

                                        const active = currentStep > index;

                                        return (

                                            <div className="step" key={step}>

                                                <div
                                                    className={
                                                        active
                                                            ? "step-circle active"
                                                            : "step-circle"
                                                    }
                                                />

                                                <span
                                                    className={
                                                        active
                                                            ? "step-label active"
                                                            : "step-label"
                                                    }
                                                >
                                                    {step}
                                                </span>

                                            </div>

                                        );

                                    })
                                }
                            </div>
                        )
                    }
                </div>
            </div>

            <div className="summary-grid">

                <div className="summary-card">

                    <Calendar size={18}/>

                    <span>
                        Creado
                    </span>

                    <strong>
                        {formatDate(order.order_creation_date)}
                    </strong>

                    <small>
                        Registrado por
                    </small>

                    <p className="summary-user">
                        {order.user_email}
                    </p>

                </div>

                <div className="summary-card">

                    <Calendar size={18}/>

                    <span>Último corte</span>

                    <strong>

                        {
                            order.last_cut_date
                                ? formatDate(order.last_cut_date)
                                : "Sin cortes"
                        }

                    </strong>

                </div>

                <div className="summary-card">

                    <Package size={18}/>

                    <span>Total diario</span>

                    <strong>

                        $
                        {totalPedido.toLocaleString()}

                    </strong>

                    <small>
                        Descuento aplicado
                    </small>

                    <p className="summary-user">
                        $
                        {Number(order.discount_amount).toLocaleString()}
                    </p>

                </div>
                <div className="summary-card">

                    <Calendar size={18}/>
                    <span>
                        Fecha cierre
                    </span>

                    <strong>
                        {
                            order.order_closing_date
                            ?
                            formatDate(order.order_closing_date)
                            :
                            "Pedido vigente"
                        }
                    </strong>
                </div>
            </div>

            <section className="info-card">

                <div className="info-title">

                    <FileText size={18}/>

                    <h3>Observaciones</h3>

                </div>

                <p>

                    {
                        order.order_description ||
                        "Sin observaciones."
                    }

                </p>

            </section>

            <section className="info-card">

                <div className="info-title">

                    <Package size={18}/>

                    <h3>

                        Resumen de maquinaria

                    </h3>

                </div>

                <div className="machinery-summary">

                    <div>

                        <span>Referencias</span>

                        <strong>{totalReferencias}</strong>

                    </div>

                    <div>

                        <span>Unidades</span>

                        <strong>{totalUnidades}</strong>

                    </div>

                    <div>

                        <span>Peso total</span>

                        <strong>

                            {totalPeso.toLocaleString()} kg

                        </strong>

                    </div>

                </div>

            </section>

            <section className="info-card">

                <div className="info-title">

                    <Package size={18} />

                    <h3>Acciones del pedido</h3>

                </div>

                <p className="actions-description">
                    Una vez cerrado o anulado, el pedido quedará finalizado y no será posible registrar nuevas devoluciones, cortes o pagos.
                </p>

                <div className="actions-buttons">

                    <button
                        className={
                            order.order_status_id === 4 || order.order_status_id === 5
                                ? "btn-close-order disabled"
                                : "btn-close-order"
                        }
                        disabled={order.order_status_id === 4 || order.order_status_id === 5}
                        onClick={handleCloseOrder}
                    >
                        {
                            order.order_status_id === 4
                                ? "Pedido cerrado"
                                : "Cerrar pedido"
                        }
                    </button>

                    <button
                        className={
                            order.order_status_id === 4 || order.order_status_id === 5
                                ? "btn-cancel-order disabled"
                                : "btn-cancel-order"
                        }
                        disabled={order.order_status_id === 4 || order.order_status_id === 5}
                        onClick={handleAnularOrder}
                    >
                        {
                            order.order_status_id === 5
                                ? "Pedido anulado"
                                : "Anular pedido"
                        }
                    </button>

                </div>

            </section>

        </div>

    );

};

export default InfoTab;