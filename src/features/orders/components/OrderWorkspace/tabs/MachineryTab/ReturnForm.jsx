import { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";

import "./ReturnForm.css";

const ReturnForm = ({
    isOpen,
    onClose,
    orderDetail,
    onSubmit
}) => {

    const [returnDate, setReturnDate] = useState("");
    const [quantity, setQuantity] = useState(1);

    const returned = useMemo(() => {

        return (orderDetail?.returns || []).reduce(

            (acc, item) =>
                acc + Number(item.returned_quantity),

            0

        );

    }, [orderDetail]);



    const pending =

        Number(orderDetail?.quantity_to_dispatch || 0)
        - returned;



    useEffect(() => {

        if (!isOpen || !orderDetail) return;

        setReturnDate("");

        setQuantity(

            pending > 0
                ? 1
                : 0

        );

    }, [isOpen, orderDetail, pending]);



    if (!isOpen || !orderDetail) return null;



    const isMotorized =

        Number(orderDetail.quantity_to_dispatch) === 1;



    const handleSubmit = async (e) => {

        e.preventDefault();

        await onSubmit({

            order_detail_id:
                orderDetail.order_detail_id,

            return_date:
                returnDate,

            returned_quantity:
                Number(quantity)

        });

        onClose();

    };



    return (

        <div className="return-modal-overlay">

            <div className="return-modal">

                <div className="return-header">

                    <h2>

                        Registrar devolución

                    </h2>

                    <button
                        onClick={onClose}
                        className="close-btn"
                    >

                        <X size={20}/>

                    </button>

                </div>

                <form
                    onSubmit={handleSubmit}
                >

                    <div className="return-machine">

                        <strong>

                            {orderDetail.machinery_name_snapshot}

                        </strong>

                    </div>

                    <div className="return-grid">

                        <div>

                            <label>

                                Fecha

                            </label>

                            <input
                                type="date"
                                value={returnDate}
                                onChange={(e)=>

                                    setReturnDate(
                                        e.target.value
                                    )

                                }
                                required
                            />

                        </div>

                        <div>

                            <label>

                                Cantidad

                            </label>

                            <input
                                type="number"
                                min="1"
                                max={pending}
                                value={quantity}
                                disabled={isMotorized}
                                onChange={(e)=>

                                    setQuantity(
                                        e.target.value
                                    )

                                }
                                required
                            />

                            <small>

                                Pendientes por devolver:

                                {" "}

                                {pending}

                            </small>

                        </div>

                    </div>

                    <div className="return-footer">

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
                        >

                            Registrar devolución

                        </button>

                    </div>

                </form>

            </div>

        </div>

    );

};

export default ReturnForm;