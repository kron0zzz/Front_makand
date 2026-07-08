import { useEffect, useState } from "react";
import { X } from "lucide-react";

import { formatDate } from "../../../../../../shared/utils/dateUtils";
import "./CutForm.css";

const CutForm = ({
    isOpen,
    onClose,
    order,
    onSubmit
}) => {

    const [periodStartDate, setPeriodStartDate] = useState("");
    const [periodEndDate, setPeriodEndDate] = useState("");

    useEffect(() => {

        if (!isOpen || !order) return;

        setPeriodStartDate(

            order.last_cut_date
                ? order.last_cut_date.split("T")[0]
                : ""

        );

        setPeriodEndDate("");

    }, [isOpen, order]);



    if (!isOpen || !order) return null;



    const handleSubmit = async (e) => {

        e.preventDefault();

        if (periodEndDate < periodStartDate) {

            alert(
                "La fecha final debe ser posterior a la fecha inicial."
            );

            return;

        }

        await onSubmit(

            order.order_id,

            {

                order_id: order.order_id,

                period_start_date: periodStartDate,

                period_end_date: periodEndDate

            }

        );

        onClose();

    };



    return (

        <div className="cut-modal-overlay">

            <div className="cut-modal">

                <div className="cut-header">

                    <h2>

                        Registrar corte

                    </h2>

                    <button

                        className="close-btn"

                        onClick={onClose}

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

                                onChange={(e)=>

                                    setPeriodEndDate(
                                        e.target.value
                                    )

                                }

                                required

                            />

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

                            type="submit"

                            className="btn-submit"

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