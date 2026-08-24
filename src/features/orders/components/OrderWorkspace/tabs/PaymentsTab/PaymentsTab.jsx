import { Plus, CreditCard, Banknote } from "lucide-react";

import { formatDate } from "../../../../../../shared/utils/dateUtils";

import "./PaymentsTab.css";
import PaymentForm from "./PaymentForm";
import { useState } from "react";

const PaymentsTab = ({paymentsData,onCreatePayment, order}) => {

    const [showPaymentForm, setShowPaymentForm] = useState(false);

    const isBlocked = order?.order_status_id === 5 || order?.order_status_id === 4;

    const {

        payments = [],

        total_billed = 0

    } = paymentsData;



    const totalPaid =

        payments.reduce(

            (acc, payment) =>

                acc + Number(payment.payment_amount),

            0

        );



    const totalBilled =

        Number(total_billed);



    const pending =

        Math.max(

            totalBilled - totalPaid,

            0

        );



    const percentage =

        totalBilled === 0

            ? 0

            : Math.round(

                totalPaid /

                totalBilled * 100

            );



    return (

        <div className="payments-tab">

            <div className="payments-header">

                <div>

                    <h2>

                        Abonos

                    </h2>

                </div>

                <button
                    className="btn-payment"
                    onClick={() => setShowPaymentForm(true)}
                    disabled={isBlocked}
                >
                    <Plus size={18}/>
                    Registrar Abono

                </button>

            </div>



            <div className="payments-summary">

                <div>

                    <span>

                        Facturado

                    </span>

                    <strong>

                        $

                        {totalBilled.toLocaleString()}

                    </strong>

                </div>

                <div>

                    <span>

                        Pagado

                    </span>

                    <strong className="paid">

                        $

                        {totalPaid.toLocaleString()}

                    </strong>

                </div>

                <div>

                    <span>

                        Pendiente

                    </span>

                    <strong className="pending">

                        $

                        {pending.toLocaleString()}

                    </strong>

                </div>

            </div>



            <div className="payment-progress">

                <div

                    className="payment-progress-fill"

                    style={{

                        width: `${percentage}%`

                    }}

                />

            </div>

            <p className="progress-label">

                {percentage}% pagado

            </p>



            {

                payments.length === 0 && (

                    <div className="empty-payments">

                        No existen pagos registrados.

                    </div>

                )

            }



            <div className="payments-list">

                {

                    [...payments]

                        .sort(

                            (a, b) =>

                                new Date(b.payment_date) -

                                new Date(a.payment_date)

                        )

                        .map(payment => (

                            <div

                                className="payment-card"

                                key={payment.payment_id}

                            >

                                <div
                                    className={
                                        payment.payment_in_cash
                                            ? "payment-icon cash"
                                            : "payment-icon transfer"
                                    }
                                >
                                    {
                                        payment.payment_in_cash
                                            ? <Banknote size={22}/>
                                            : <CreditCard size={22}/>
                                    }

                                </div>

                                <div className="payment-info">

                                    <div className="payment-top">

                                        <strong>

                                            $

                                            {

                                                Number(

                                                    payment.payment_amount

                                                ).toLocaleString()

                                            }

                                        </strong>

                                    </div>

                                    <div className="payment-bottom">

                                        <span>

                                            {

                                                formatDate(

                                                    payment.payment_date

                                                )

                                            }

                                        </span>

                                    </div>

                                </div>

                            </div>

                        ))

                }

            </div>

            <PaymentForm
                isOpen={showPaymentForm}
                onClose={() => setShowPaymentForm(false)}
                order={order}
                onSubmit={onCreatePayment}
            />

        </div>

    );

};

export default PaymentsTab;