import { Plus, FileText, X, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { formatDate } from "../../../../../../shared/utils/dateUtils";
import { apiClient } from "../../../../../../shared/services/api";

import "./CutsTab.css";
import CutForm from "./CutForm";

const CutsTab = ({ cuts, paymentsData, order, onCreateCut }) => {

    const [showCutForm, setShowCutForm] = useState(false);
    const [showInvoiceModal, setShowInvoiceModal] = useState(false);
    const [cutStartId, setCutStartId] = useState("");
    const [cutEndId, setCutEndId] = useState("");
    const [invoiceLoading, setInvoiceLoading] = useState(false);

    const isBlocked = order?.order_status_id === 5 || order?.order_status_id === 4;

    const totalAmount =
        cuts.reduce(
            (acc, cut) =>
                acc + Number(cut.cut_amount),
            0
        );

    // Extract payments and filter out cancelled ones
    const payments = paymentsData?.payments || [];
    const activePayments = payments
        .filter(p => !p.is_cancelled)
        .sort((a, b) => new Date(a.payment_date) - new Date(b.payment_date));

    // Calculate payment status for each cut using chronological assignment
    // Payments are applied sequentially to cuts in chronological order
    const cutsWithPaymentStatus = (() => {
        const sortedCutsChrono = [...cuts].sort(
            (a, b) => new Date(a.period_end_date) - new Date(b.period_end_date)
        );

        let remainingPayment = activePayments.reduce(
            (sum, p) => sum + Number(p.payment_amount),
            0
        );

        return sortedCutsChrono.map(cut => {
            const cutAmount = Number(cut.cut_amount);
            const amountPaid = Math.min(remainingPayment, cutAmount);
            remainingPayment = Math.max(remainingPayment - cutAmount, 0);
            const pendingBalance = Math.max(cutAmount - amountPaid, 0);
            const percentage = cutAmount > 0
                ? Math.round((amountPaid / cutAmount) * 100)
                : 100;

            let status = "pending";
            if (percentage === 100) {
                status = "paid";
            } else if (percentage > 0) {
                status = "partial";
            }

            return {
                ...cut,
                amountPaid,
                pendingBalance,
                percentage,
                status
            };
        });
    })();

    // Map status to the original cuts order for display
    const statusMap = new Map(
        cutsWithPaymentStatus.map(c => [c.cut_id, c])
    );

    const pendingCuts = order?.pending_cuts || [];
    const cutStatus = order?.cut_status;
    const hasPendingCuts = cutStatus === 'PENDING' && pendingCuts.length > 0;

    const formatPendingDate = (dateStr) => {
        if (!dateStr) return "";
        const [year, month, day] = dateStr.split("-");
        return `${day}/${month}/${year}`;
    };

    // Sort cuts by period_end_date ascending for the selection dropdowns
    const sortedCuts = [...cuts].sort((a, b) => 
        new Date(a.period_end_date) - new Date(b.period_end_date)
    );

    const handleGenerateInvoice = async () => {
        if (!cutStartId || !cutEndId) return;
        
        const startId = Number(cutStartId);
        const endId = Number(cutEndId);
        
        if (startId > endId) {
            alert("El corte de inicio debe ser anterior o igual al corte final");
            return;
        }

        setInvoiceLoading(true);
        try {
            const response = await apiClient.get(`/orders/${order.order_id}/invoice`, {
                params: { cut_start_id: startId, cut_end_id: endId },
                responseType: 'blob'
            });

            // Create download link
            const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `factura-cortes-${startId}-a-${endId}-pedido-${order.order_id}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);

            setShowInvoiceModal(false);
            setCutStartId("");
            setCutEndId("");
        } catch (error) {
            console.error('Error generating invoice:', error);
            alert('Error al generar la factura');
        } finally {
            setInvoiceLoading(false);
        }
    };

    return (
        <div className="cuts-tab">
            <div className="cuts-header">
                <div>
                    <h2>
                        Cortes de facturación
                    </h2>

                </div>

                <div className="cuts-header-actions">
                    <button
                        className="btn-cut"
                        onClick={() => setShowCutForm(true)}
                        disabled={isBlocked}
                    >

                        <Plus size={18}/>
                        Registrar corte
                    </button>

                    {cuts.length > 0 && (
                        <button
                            className="btn-invoice"
                            onClick={() => setShowInvoiceModal(true)}
                            disabled={isBlocked}
                        >
                            <FileText size={18}/>
                            Facturar
                        </button>
                    )}
                </div>
            </div>

            {hasPendingCuts && (
                <div className="pending-cuts-alert">
                    <div className="pending-cuts-header">
                        ⚠️ Cortes pendientes
                    </div>
                    <div className="pending-cuts-list">
                        {pendingCuts.length === 1 ? (
                            <span>
                                Corte pendiente desde el {formatPendingDate(pendingCuts[0].date)}
                            </span>
                        ) : (
                            <div>
                                <span>Cortes pendientes:</span>
                                <ul>
                                    {pendingCuts.map((cut, index) => (
                                        <li key={index}>
                                            {formatPendingDate(cut.date)}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {!hasPendingCuts && cutStatus === 'UP_TO_DATE' && order?.cut_frequency && (
                <div className="cuts-up-to-date">
                    ✅ Cortes al día
                </div>
            )}

            <div className="cuts-summary">
                <div>
                    <span>
                        Total cortes
                    </span>

                    <strong>
                        {cuts.length}
                    </strong>
                </div>

                <div>

                    <span>
                        Valor facturado
                    </span>

                    <strong>
                        ${totalAmount.toLocaleString()}
                    </strong>

                </div>

            </div>




            {
                cuts.length === 0 && (
                    <div className="empty-cuts">
                        No existen cortes registrados.
                    </div>
                )
            }





            <div className="timeline">

                {

                    [...cuts]

                    .sort(

                        (a,b)=>

                            formatDate(b.period_end_date)-

                            formatDate(a.period_end_date)

                    )

                    .map(cut=>{

                        const paymentInfo = statusMap.get(cut.cut_id) || {
                            amountPaid: 0,
                            pendingBalance: Number(cut.cut_amount),
                            percentage: 0,
                            status: "pending"
                        };

                        const statusConfig = {
                            paid: { label: "Pagado", color: "#16a34a", bg: "#dcfce7", icon: "✓" },
                            partial: { label: "Parcial", color: "#d97706", bg: "#fef3c7", icon: "↻" },
                            pending: { label: "Pendiente", color: "#dc2626", bg: "#fee2e2", icon: "○" }
                        };

                        const config = statusConfig[paymentInfo.status];

                        return (

                            <div
                                className="timeline-item"
                                key={cut.cut_id}
                            >

                                <div className="timeline-marker">

                                    <div className="timeline-head">

                                        <div className="timeline-dot"/>

                                        <span className="timeline-date">
                                            {formatDate(cut.period_end_date)}
                                        </span>

                                    </div>

                                </div>

                                <div className="timeline-card">

                                    <div className="timeline-card-header">

                                        <div className="timeline-range">

                                            <span>

                                                Desde

                                                <strong>

                                                    {
                                                        formatDate(
                                                            cut.period_start_date
                                                        )
                                                    }

                                                </strong>

                                            </span>

                                            <span className="arrow">

                                                ↓

                                            </span>

                                            <span>

                                                Hasta

                                                <strong>

                                                    {
                                                        formatDate(
                                                            cut.period_end_date
                                                        )
                                                    }

                                                </strong>

                                            </span>

                                        </div>

                                        <div className="cut-status-badge" style={{ background: config.bg, color: config.color, display: "inline-flex", alignItems: "center", gap: "6px", padding: "4px 12px", borderRadius: "20px", fontSize: "0.8rem", fontWeight: 600 }}>

                                            <span className="status-icon">{config.icon}</span>

                                            <span className="status-label">{config.label}</span>

                                        </div>

                                    </div>

                                    <div className="timeline-info">

                                        <div>

                                            <small>Corte</small>

                                            <strong>

                                                #{cut.cut_id}

                                            </strong>

                                        </div>

                                        <div>

                                            <small>Registrado</small>

                                            <strong>

                                                {
                                                    formatDate(
                                                        cut.cut_date
                                                    )
                                                }

                                            </strong>

                                        </div>

                                        <div>

                                            <small>Valor</small>

                                            <strong className="amount">

                                                $

                                                {

                                                    Number(
                                                        cut.cut_amount
                                                    ).toLocaleString()

                                                }

                                            </strong>

                                        </div>

                                        <div>

                                            <small>Falta</small>

                                            <strong className="pending-amount" style={{ color: "#dc2626" }}>

                                                ${paymentInfo.pendingBalance.toLocaleString()}

                                            </strong>

                                        </div>

                                    </div>

                                </div>

                            </div>

                    )})

                }

            </div>

            <CutForm
                isOpen={showCutForm}
                onClose={() => setShowCutForm(false)}
                order={order}
                onSubmit={onCreateCut}
            />

            {/* Invoice Modal */}
            {showInvoiceModal && (
                <div className="modal-overlay" onClick={() => setShowInvoiceModal(false)}>
                    <div className="modal-container" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Generar Factura</h2>
                            <button className="modal-close" onClick={() => setShowInvoiceModal(false)}>
                                <X size={20} />
                            </button>
                        </div>
                        <div className="modal-body">
                            <p className="modal-description">
                                Seleccione el rango de cortes a incluir en la factura. Los cortes deben pertenecer a este pedido.
                            </p>
                            
                            <div className="invoice-range-selector">
                                <div className="selector-group">
                                    <label>Corte inicial</label>
                                    <select
                                        value={cutStartId}
                                        onChange={(e) => setCutStartId(e.target.value)}
                                        className="cut-select"
                                    >
                                        <option value="">Seleccionar...</option>
                                        {sortedCuts.map(cut => (
                                            <option key={cut.cut_id} value={cut.cut_id}>
                                                Corte #{cut.cut_id} - {formatDate(cut.period_start_date)} a {formatDate(cut.period_end_date)}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="selector-arrow">
                                    <ChevronRight size={24} />
                                </div>

                                <div className="selector-group">
                                    <label>Corte final</label>
                                    <select
                                        value={cutEndId}
                                        onChange={(e) => setCutEndId(e.target.value)}
                                        className="cut-select"
                                    >
                                        <option value="">Seleccionar...</option>
                                        {sortedCuts.map(cut => (
                                            <option key={cut.cut_id} value={cut.cut_id}>
                                                Corte #{cut.cut_id} - {formatDate(cut.period_start_date)} a {formatDate(cut.period_end_date)}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="modal-actions">
                                <button
                                    className="btn-cancel"
                                    onClick={() => {
                                        setShowInvoiceModal(false);
                                        setCutStartId("");
                                        setCutEndId("");
                                    }}
                                >
                                    Cancelar
                                </button>
                                <button
                                    className="btn-generate"
                                    onClick={handleGenerateInvoice}
                                    disabled={invoiceLoading || !cutStartId || !cutEndId}
                                >
                                    {invoiceLoading ? 'Generando...' : 'Generar Factura'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>

        

    );

};

export default CutsTab;