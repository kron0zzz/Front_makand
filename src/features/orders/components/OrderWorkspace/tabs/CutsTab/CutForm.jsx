import { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";

import { formatDate } from "../../../../../../shared/utils/dateUtils";
import "./CutForm.css";
import { useAlertModal } from "../../../../../../shared/alertModal";

const CutForm = ({
    isOpen,
    onClose,
    order,
    onSubmit
}) => {
    const { showAlert } = useAlertModal();

    const [periodStartDate, setPeriodStartDate] = useState("");
    const [periodEndDate, setPeriodEndDate] = useState("");

    useEffect(() => {

        if (!isOpen || !order) return;

        // eslint-disable-next-line react-hooks/set-state-in-effect
        setPeriodStartDate(
            order.last_cut_date
                ? order.last_cut_date.split("T")[0]
                : order.order_creation_date
                    ? order.order_creation_date.split("T")[0]
                    : ""
        );

        setPeriodEndDate("");

    }, [isOpen, order]);

    const minDate = useMemo(() => {
        if (!periodStartDate) return undefined;
        const d = new Date(periodStartDate + "T00:00:00");
        d.setDate(d.getDate() + 1);
        return d.toISOString().split("T")[0];
    }, [periodStartDate]);

    const isAllowedCutDate = (dateStr) => {
        if (!dateStr || !order?.cut_frequency) return false;

        const [year, month, day] = dateStr.split("-").map(Number);
        const lastDayOfMonth = new Date(year, month, 0).getDate();
        if (order.cut_frequency === "MENSUAL") {
            return day === lastDayOfMonth;
        }
        if (order.cut_frequency === "QUINCENAL") {
            return day === 15 || day === lastDayOfMonth;
        }
        return false;
    };

    if (!isOpen || !order) return null;

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!isAllowedCutDate(periodEndDate)) {
            await showAlert(
                order.cut_frequency === "MENSUAL"
                    ? "La fecha debe ser el último día del mes."
                    : "La fecha debe ser el día 15 o el último día del mes."
            );
            return;
        }

        if (periodEndDate < periodStartDate) {
            await showAlert(
                "La fecha final debe ser posterior a la fecha inicial."
            );
            return;
        }

        try {

            await onSubmit(
                order.order_id,
                {
                    order_id: order.order_id,
                    period_start_date: periodStartDate,
                    period_end_date: periodEndDate,
                    include_pending_extra_charges: true
                }
            );

            onClose();
            await showAlert("Corte registrado correctamente");

        } catch (err) {
            await showAlert(`Error al registrar corte: ${err.message}`);
        }

    };

    return (

        <div className="cut-modal-overlay">

            <div className="cut-modal">

                <div className="cut-header">

                    <h2>
                        Registrar corte
                    </h2>

                    <button
                        onClick={onClose}
                        className="close-btn"
                    >
                        <X size={20}/>
                    </button>

                </div>

                <form onSubmit={handleSubmit}>

                    <div className="cut-order">
                        <strong>
                            Pedido #{order.order_id}
                        </strong>
                    </div>

                    <div className="cut-grid">

                        <div>

                            <label>
                                Fecha inicio del período
                            </label>

                            <div className="cut-date-display">
                                {formatDate(periodStartDate)}
                            </div>

                        </div>

                        <div>

                            <label>
                                Fecha fin del período
                            </label>

                            <input
                                type="date"
                                value={periodEndDate}
                                min={minDate}
                                onChange={(e) => setPeriodEndDate(e.target.value)}
                                className="cut-date-input"
                                required
                            />

                            {order.cut_frequency && (
                                <small className="cut-date-hint">
                                    Días válidos:&nbsp;
                                    {order.cut_frequency === "MENSUAL"
                                        ? "último día del mes"
                                        : "día 15 o último día del mes"}
                                    &nbsp;(puede ser una fecha futura)
                                </small>
                            )}

                        </div>

                    </div>

                    <div className="cut-footer">

                        <button
                            type="button"
                            className="btn-cancel"
                            onClick={onClose}
                        >
                            Cancelar
                        </button>

                        <button
                            className="btn-submit"
                            type="submit"
                            disabled={!isAllowedCutDate(periodEndDate)}
                        >
                            Registrar corte
                        </button>

                    </div>

                </form>

            </div>

        </div>

    );

};

export default CutForm;
