import { useEffect, useState } from "react";
import { X, Banknote, CreditCard  } from "lucide-react";

import "./PaymentForm.css";
import { useAlertModal } from "../../../../../../shared/alertModal";

const PaymentForm = ({
  isOpen,
    onClose,
    order,
    onSubmit
}) => {
  const { showAlert, showConfirm } = useAlertModal();

  const [paymentDate, setPaymentDate] = useState("");
    const [paymentAmount, setPaymentAmount] = useState("");
    const [paymentInCash, setPaymentInCash] = useState(true);



    useEffect(() => {

        if (!isOpen || !order) return;

        setPaymentDate("");

        setPaymentAmount("");

    }, [isOpen, order]);



    if (!isOpen || !order) return null;



    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            await onSubmit(

                order.order_id,

                {

                    order_id: order.order_id,

                    payment_date: paymentDate,

                    payment_amount: Number(paymentAmount.replace(/\./g,"")),

                    payment_in_cash: paymentInCash

                }

            );

            onClose();

            await showAlert("Abono registrado correctamente");

        } catch (err) {

            await showAlert(`Error al registrar abono: ${err.message}`);

        }

    };



    const handleAmountChange = (e) => {

        const raw =
            e.target.value.replace(/\D/g,"");

        if(raw===""){
            setPaymentAmount("");
            return;
        }

        setPaymentAmount(
            Number(raw).toLocaleString("es-CO")
        );
    };



    return (

        <div className="payment-modal-overlay">

            <div className="payment-modal">

                <div className="payment-header">

                    <h2>

                        Registrar abono

                    </h2>

                    <button

                        className="close-btn"

                        onClick={onClose}

                    >

                        <X size={20}/>

                    </button>

                </div>



                <form onSubmit={handleSubmit}>

                    <div className="payment-order">

                        <strong>

                            Pedido #{order.order_id}

                        </strong>

                    </div>



                    <div className="payment-grid">

                        <div>

                            <label>

                                Fecha del abono*

                            </label>

                            <input

                                type="date"

                                value={paymentDate}

                                onChange={(e)=>

                                    setPaymentDate(

                                        e.target.value

                                    )

                                }

                                required

                            />

                        </div>



                        <div>

                            <label>

                                Monto del abono (COP)*

                            </label>

                            <input

                                type="text"
                                inputMode="numeric"
                                value={paymentAmount}
                                onChange={handleAmountChange}
                                required

                            />

                        </div>


                        <div className="payment-method">

                            <label>

                                Forma de pago

                            </label>

                            <div className="radio-group">

                                <label
                                    className={
                                        paymentInCash
                                        ? "radio-card active"
                                        : "radio-card"
                                    }
                                >

                                    <input
                                        type="radio"
                                        checked={paymentInCash}
                                        onChange={() => setPaymentInCash(true)}
                                    />
                                    <Banknote size={18}/>
                                    <span>Efectivo</span>

                                </label>

                                <label
                                    className={
                                        !paymentInCash
                                        ? "radio-card active"
                                        : "radio-card"
                                    }
                                >

                                    <input
                                        type="radio"
                                        checked={!paymentInCash}
                                        onChange={() => setPaymentInCash(false)}
                                    />
                                    <CreditCard  size={18}/>
                                    <span>Transferencia</span>

                                </label>

                            </div>

                        </div>

                    </div>



                    <div className="payment-footer">

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

                            Registrar pago

                        </button>

                    </div>

                </form>

            </div>

        </div>

    );

};

export default PaymentForm;