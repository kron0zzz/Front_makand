import { useState, useEffect } from "react";
import "./InfoTab.css";

import {
    Package,
    User,
    FolderKanban,
    Calendar,
    FileText,
    CreditCard,
    ChevronLeft,
    ChevronRight,
    X,
    Search
} from "lucide-react";

import { formatDate } from "../../../../../../shared/utils/dateUtils";
import { useAlertModal } from "../../../../../../shared/alertModal";
import { apiClient } from "../../../../../../shared/services/api";

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

    const [additionalCharges, setAdditionalCharges] = useState([]);
    const [chargesPagination, setChargesPagination] = useState({ page: 1, limit: 9, total: 0, totalPages: 0 });
    const [chargesLoading, setChargesLoading] = useState(false);
    const [showAllChargesModal, setShowAllChargesModal] = useState(false);
    const [allCharges, setAllCharges] = useState([]);
    const [allChargesPagination, setAllChargesPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 });
    const [allChargesLoading, setAllChargesLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchAdditionalCharges = async (page = 1, limit = 9) => {
        setChargesLoading(true);
        try {
            const response = await apiClient.get('/additional-charges/table', {
                params: { page, limit, order_id: order.order_id }
            });
            setAdditionalCharges(response.data.data || []);
            setChargesPagination(response.data.pagination || { page, limit, total: 0, totalPages: 0 });
        } catch (error) {
            console.error('Error fetching additional charges:', error);
        } finally {
            setChargesLoading(false);
        }
    };

    const fetchAllCharges = async (page = 1, limit = 10, search = "") => {
        setAllChargesLoading(true);
        try {
            const response = await apiClient.get('/additional-charges/table', {
                params: { page, limit, search, order_id: order.order_id }
            });
            setAllCharges(response.data.data || []);
            setAllChargesPagination(response.data.pagination || { page, limit, total: 0, totalPages: 0 });
        } catch (error) {
            console.error('Error fetching all charges:', error);
        } finally {
            setAllChargesLoading(false);
        }
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value);
    };

    useEffect(() => {
        fetchAdditionalCharges(1, 9);
    }, [order.order_id]);

    useEffect(() => {
        if (showAllChargesModal) {
            fetchAllCharges(1, 10, searchTerm);
        }
    }, [showAllChargesModal, searchTerm]);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= chargesPagination.totalPages) {
            fetchAdditionalCharges(newPage, chargesPagination.limit);
        }
    };

    const handleAllChargesPageChange = (newPage) => {
        if (newPage >= 1 && newPage <= allChargesPagination.totalPages) {
            fetchAllCharges(newPage, allChargesPagination.limit, searchTerm);
        }
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleSearch = () => {
        fetchAllCharges(1, allChargesPagination.limit, searchTerm);
    };

    const openAllChargesModal = () => {
        setShowAllChargesModal(true);
        setSearchTerm("");
    };

    const closeAllChargesModal = () => {
        setShowAllChargesModal(false);
        setAllCharges([]);
        setAllChargesPagination({ page: 1, limit: 10, total: 0, totalPages: 0 });
        setSearchTerm("");
    };

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

                    <small>
                        Frecuencia de cortes
                    </small>

                    <p className="summary-user">
                        {order.cut_frequency}
                    </p>

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

            <section className="info-card machinery-charges-section">
                <div className="info-title">
                    <Package size={18} />
                    <h3>Resumen de maquinaria y cobros</h3>
                </div>
                <div className="machinery-charges-grid">
                    <div className="machinery-summary-card">
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
                                <strong>{totalPeso.toLocaleString()} kg</strong>
                            </div>
                        </div>
                    </div>
                    <div className="additional-charges-card">
                        <div className="charges-header">
                            <div className="charges-title">
                                <CreditCard size={18} />
                                <h4>Cobros adicionales</h4>
                            </div>
                            <button className="btn-view-all" onClick={openAllChargesModal}>
                                Ver todos
                            </button>
                        </div>
                        <div className="charges-table-wrapper">
                            <table className="charges-table">
                                <thead>
                                    <tr>
                                        <th>Tipo de cobro</th>
                                        <th>Monto</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {chargesLoading ? (
                                        <tr>
                                            <td colSpan="2" className="loading-cell">Cargando...</td>
                                        </tr>
                                    ) : additionalCharges.length === 0 ? (
                                        <tr>
                                            <td colSpan="2" className="empty-cell">Sin cobros adicionales</td>
                                        </tr>
                                    ) : (
                                        additionalCharges.map((charge) => (
                                            <tr key={charge.additional_charge_id}>
                                                <td>{charge.charge_type_name || 'N/A'}</td>
                                                <td className="charge-amount">{formatCurrency(charge.charge_amount)}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                        {chargesPagination.totalPages > 1 && (
                            <div className="charges-pagination">
                                <button
                                    className="pagination-btn"
                                    onClick={() => handlePageChange(chargesPagination.page - 1)}
                                    disabled={chargesPagination.page === 1}
                                >
                                    <ChevronLeft size={16} />
                                </button>
                                <span className="pagination-info">
                                    Página {chargesPagination.page} de {chargesPagination.totalPages}
                                </span>
                                <button
                                    className="pagination-btn"
                                    onClick={() => handlePageChange(chargesPagination.page + 1)}
                                    disabled={chargesPagination.page === chargesPagination.totalPages}
                                >
                                    <ChevronRight size={16} />
                                </button>
                            </div>
                        )}
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

            {showAllChargesModal && (
                <div className="modal-overlay" onClick={closeAllChargesModal}>
                    <div className="modal-container" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Cobros adicionales</h2>
                            <button className="modal-close" onClick={closeAllChargesModal}>
                                <X size={20} />
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="modal-search">
                                <Search size={18} />
                                <input
                                    type="text"
                                    placeholder="Buscar por tipo o descripción..."
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                />
                            </div>
                            <div className="modal-table-wrapper">
                                <table className="modal-charges-table">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Tipo de cobro</th>
                                            <th>Descripción</th>
                                            <th>Monto</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {allChargesLoading ? (
                                            <tr>
                                                <td colSpan="4" className="loading-cell">Cargando...</td>
                                            </tr>
                                        ) : allCharges.length === 0 ? (
                                            <tr>
                                                <td colSpan="4" className="empty-cell">Sin cobros adicionales</td>
                                            </tr>
                                        ) : (
                                            allCharges.map((charge) => (
                                                <tr key={charge.additional_charge_id}>
                                                    <td className="charge-id">#{charge.additional_charge_id}</td>
                                                    <td>{charge.charge_type_name || 'N/A'}</td>
                                                    <td>{charge.charge_description || '-'}</td>
                                                    <td className="charge-amount">{formatCurrency(charge.charge_amount)}</td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            {allChargesPagination.totalPages > 1 && (
                                <div className="modal-pagination">
                                    <button
                                        className="pagination-btn"
                                        onClick={() => handleAllChargesPageChange(allChargesPagination.page - 1)}
                                        disabled={allChargesPagination.page === 1}
                                    >
                                        <ChevronLeft size={16} />
                                    </button>
                                    <span className="pagination-info">
                                        Página {allChargesPagination.page} de {allChargesPagination.totalPages}
                                        (Total: {allChargesPagination.total})
                                    </span>
                                    <button
                                        className="pagination-btn"
                                        onClick={() => handleAllChargesPageChange(allChargesPagination.page + 1)}
                                        disabled={allChargesPagination.page === allChargesPagination.totalPages}
                                    >
                                        <ChevronRight size={16} />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

        </div>

    );

};

export default InfoTab;