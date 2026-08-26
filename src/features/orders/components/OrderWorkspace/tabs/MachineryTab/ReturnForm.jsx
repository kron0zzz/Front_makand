import { useEffect, useMemo, useState } from "react";
import { X, Truck, AlertTriangle, Plus } from "lucide-react";

import "./ReturnForm.css";
import { useAlertModal } from "../../../../../../shared/alertModal";
import StockSelectionModal from "../../../../../../shared/components/stockSelection/StockSelectionModal";

const ReturnForm = ({
    isOpen,
    onClose,
    orderDetail,
    isMotorized = false,
    pendingStocks = [],
    onSubmit
}) => {
    const { showAlert } = useAlertModal();

    const [form, setForm] = useState({
        returnDate: "",
        quantity: 1,
        hasTransport: false,
        returnTransportCost: "",
        hasDamage: false,
        damageFee: "",
        damageNotes: "",
        selectedStocks: []
    });

    const [showStockModal, setShowStockModal] = useState(false);

    const returned = useMemo(() => {
        return (orderDetail?.returns || []).reduce(
            (acc, item) => acc + Number(item.returned_quantity),
            0
        );
    }, [orderDetail]);

    const pending = Number(orderDetail?.quantity_to_dispatch || 0) - returned;

    const pendingStockItems = useMemo(() => {
        if (!isMotorized) return [];
        return pendingStocks.filter(sd => {
            const sdReturned = (sd.returns || []).reduce(
                (acc, r) => acc + Number(r.returned_quantity), 0
            );
            return Number(sd.quantity_to_dispatch) - sdReturned > 0;
        });
    }, [pendingStocks, isMotorized]);

    useEffect(() => {
        if (!isOpen || !orderDetail) return;
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setForm({
            returnDate: "",
            quantity: pending > 0 ? 1 : 0,
            hasTransport: false,
            returnTransportCost: "",
            hasDamage: false,
            damageFee: "",
            damageNotes: "",
            selectedStocks: []
        });
    }, [isOpen, orderDetail, pending]);

    if (!isOpen || !orderDetail) return null;

    const handleStockConfirm = (stocks) => {
        setForm(f => ({ ...f, selectedStocks: stocks }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const additional_charges = [];

            if (form.hasTransport && Number(form.returnTransportCost) > 0) {
                additional_charges.push({
                    charge_type_id: 1,
                    description: "Transporte de devolución",
                    amount: Number(form.returnTransportCost)
                });
            }

            if (form.hasDamage && Number(form.damageFee) > 0) {
                additional_charges.push({
                    charge_type_id: 2,
                    description: form.damageNotes || "Cargo por daños o pérdidas",
                    amount: Number(form.damageFee)
                });
            }

            await onSubmit({
                order_detail_id: orderDetail.order_detail_id,
                return_date: form.returnDate,
                returned_quantity: Number(form.quantity),
                additional_charges,
                isMotorized,
                selectedStocks: form.selectedStocks
            });
            onClose();
            await showAlert("Devolución registrada correctamente");
        } catch (err) {
            await showAlert(`Error al registrar devolución: ${err.message}`);
        }
    };

    const updateField = (field, value) =>
        setForm(f => ({ ...f, [field]: value }));

    return (
        <div className="return-modal-overlay">
            <div className="return-modal">
                <div className="return-header">
                    <h2>Registrar devolución</h2>
                    <button onClick={onClose} className="close-btn">
                        <X size={20}/>
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="return-machine">
                        <strong>{orderDetail.machinery_name_snapshot}</strong>
                    </div>

                    <div className="return-grid">
                        <div>
                            <label>Fecha</label>
                            <input
                                type="date"
                                value={form.returnDate}
                                onChange={(e) => updateField("returnDate", e.target.value)}
                                required
                            />
                        </div>

                        {isMotorized ? (
                            <div>
                                <label>Unidades a devolver</label>
                                <button
                                    type="button"
                                    className="btn-secondary"
                                    style={{ width: "100%", padding: "10px" }}
                                    onClick={() => setShowStockModal(true)}
                                >
                                    <Plus size={16}/>
                                    Seleccionar equipos ({form.selectedStocks.length})
                                </button>
                                {form.selectedStocks.length > 0 && (
                                    <div className="selected-stocks-tags" style={{ marginTop: "8px" }}>
                                        {form.selectedStocks.map((stock) => (
                                            <span key={stock.stock_id} className="stock-tag">
                                                {stock.serial_number || `#${stock.stock_id}`}
                                                <button
                                                    type="button"
                                                    className="stock-tag-remove"
                                                    onMouseDown={() =>
                                                        updateField(
                                                            "selectedStocks",
                                                            form.selectedStocks.filter(s => s.stock_id !== stock.stock_id)
                                                        )
                                                    }
                                                >
                                                    &times;
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                )}
                                <small
                                    style={{ display: "block", marginTop: "6px", color: "#6b7280" }}
                                >
                                    Pendientes por devolver: {pendingStockItems.length}
                                </small>
                            </div>
                        ) : (
                            <div>
                                <label>Cantidad</label>
                                <input
                                    type="number"
                                    min="1"
                                    max={pending}
                                    value={form.quantity}
                                    onChange={(e) => updateField("quantity", e.target.value)}
                                    required
                                />
                                <small>Pendientes por devolver: {pending}</small>
                            </div>
                        )}
                    </div>

                    {/* Bloque: Transporte */}
                    <div className="return-optional-box">
                        <label className="optional-header">
                            <input
                                type="checkbox"
                                checked={form.hasTransport}
                                onChange={(e) => updateField("hasTransport", e.target.checked)}
                                style={{ width: "16px", height: "16px", accentColor: "#ff6b35" }}
                            />
                            <Truck size={18} />
                            ¿Incluye costo de transporte de vuelta?
                        </label>

                        {form.hasTransport && (
                            <div className="optional-content">
                                <div>
                                    <label>Precio de transporte de vuelta (COP)</label>
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={form.returnTransportCost}
                                        onChange={(e) => updateField("returnTransportCost", e.target.value)}
                                        placeholder="Ej: 50.000"
                                        required={form.hasTransport}
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Bloque: Daños o pérdidas */}
                    <div className="return-optional-box">
                        <label className="optional-header">
                            <input
                                type="checkbox"
                                checked={form.hasDamage}
                                onChange={(e) => updateField("hasDamage", e.target.checked)}
                                style={{ width: "16px", height: "16px", accentColor: "#ff6b35" }}
                            />
                            <AlertTriangle size={18} />
                            ¿Reportar pérdidas o daños?
                        </label>

                        {form.hasDamage && (
                            <div className="optional-content">
                                <div>
                                    <label>Cargo por daños / pérdidas (COP)</label>
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={form.damageFee}
                                        onChange={(e) => updateField("damageFee", e.target.value)}
                                        placeholder="Ej: 30.000"
                                        required={form.hasDamage}
                                    />
                                </div>
                                <div>
                                    <label>Notas de daños</label>
                                    <input
                                        type="text"
                                        value={form.damageNotes}
                                        onChange={(e) => updateField("damageNotes", e.target.value)}
                                        placeholder="Detalle de piezas faltantes o rotas..."
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="return-footer">
                        <button type="button" className="btn-cancel" onClick={onClose}>
                            Cancelar
                        </button>
                        <button
                            className="btn-submit"
                            type="submit"
                            disabled={isMotorized && form.selectedStocks.length === 0}
                        >
                            Registrar devolución
                        </button>
                    </div>
                </form>

                <StockSelectionModal
                    isOpen={showStockModal}
                    onClose={() => setShowStockModal(false)}
                    machinery={{
                        machinery_id: orderDetail.machinery_id,
                        machinery_name: orderDetail.machinery_name_snapshot
                    }}
                    onConfirm={handleStockConfirm}
                    preloadedStocks={pendingStockItems}
                    statusFilter={0}
                    initialSelectedIds={form.selectedStocks}
                />
            </div>
        </div>
    );
};

export default ReturnForm;
