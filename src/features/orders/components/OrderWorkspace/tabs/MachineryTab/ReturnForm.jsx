import { useEffect, useMemo, useState } from "react";
import { X, Truck, AlertTriangle } from "lucide-react";

import "./ReturnForm.css";
import { useAlertModal } from "../../../../../../shared/alertModal";

const ReturnForm = ({
    isOpen,
    onClose,
    orderDetail,
    onSubmit
}) => {
    const { showAlert } = useAlertModal();

    const [returnDate, setReturnDate] = useState("");
    const [quantity, setQuantity] = useState(1);

    const [hasTransport, setHasTransport] = useState(false);
    const [returnTransportCost, setReturnTransportCost] = useState("");

    const [hasDamage, setHasDamage] = useState(false);
    const [damageFee, setDamageFee] = useState("");
    const [damageNotes, setDamageNotes] = useState("");

    const returned = useMemo(() => {
        return (orderDetail?.returns || []).reduce(
            (acc, item) => acc + Number(item.returned_quantity),
            0
        );
    }, [orderDetail]);

    const pending = Number(orderDetail?.quantity_to_dispatch || 0) - returned;

    useEffect(() => {
        if (!isOpen || !orderDetail) return;
        setReturnDate("");
        setQuantity(pending > 0 ? 1 : 0);
        setHasTransport(false);
        setReturnTransportCost("");
        setHasDamage(false);
        setDamageFee("");
        setDamageNotes("");
    }, [isOpen, orderDetail, pending]);

    if (!isOpen || !orderDetail) return null;

    const isMotorized = Number(orderDetail.quantity_to_dispatch) === 1;

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const additional_charges = [];

            if (hasTransport && Number(returnTransportCost) > 0) {
                additional_charges.push({
                    charge_type_id: 1, 
                    description: "Transporte de devolución",
                    amount: Number(returnTransportCost)
                });
            }

            if (hasDamage && Number(damageFee) > 0) {
                additional_charges.push({
                    charge_type_id: 2, 
                    description: damageNotes || "Cargo por daños o pérdidas",
                    amount: Number(damageFee)
                });
            }

            await onSubmit({
                order_detail_id: orderDetail.order_detail_id,
                return_date: returnDate,
                returned_quantity: Number(quantity),
                additional_charges // <--- Aquí enviamos la lista que el backend procesa
            });
            onClose();
            await showAlert("Devolución registrada correctamente");
        } catch (err) {
            await showAlert(`Error al registrar devolución: ${err.message}`);
        }
    };

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
                                value={returnDate}
                                onChange={(e) => setReturnDate(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label>Cantidad</label>
                            <input
                                type="number"
                                min="1"
                                max={pending}
                                value={quantity}
                                disabled={isMotorized}
                                onChange={(e) => setQuantity(e.target.value)}
                                required
                            />
                            <small>Pendientes por devolver: {pending}</small>
                        </div>
                    </div>

                    {/* Bloque: Transporte */}
                    <div className="return-optional-box">
                        <label className="optional-header">
                            <input
                                type="checkbox"
                                checked={hasTransport}
                                onChange={(e) => setHasTransport(e.target.checked)}
                                style={{ width: "16px", height: "16px", accentColor: "#ff6b35" }}
                            />
                            <Truck size={18} />
                            ¿Incluye costo de transporte de vuelta?
                        </label>

                        {hasTransport && (
                            <div className="optional-content">
                                <div>
                                    <label>Precio de transporte de vuelta (COP)</label>
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={returnTransportCost}
                                        onChange={(e) => setReturnTransportCost(e.target.value)}
                                        placeholder="Ej: 50.000"
                                        required={hasTransport}
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
                                checked={hasDamage}
                                onChange={(e) => setHasDamage(e.target.checked)}
                                style={{ width: "16px", height: "16px", accentColor: "#ff6b35" }}
                            />
                            <AlertTriangle size={18} />
                            ¿Reportar pérdidas o daños?
                        </label>

                        {hasDamage && (
                            <div className="optional-content">
                                <div>
                                    <label>Cargo por daños / pérdidas (COP)</label>
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={damageFee}
                                        onChange={(e) => setDamageFee(e.target.value)}
                                        placeholder="Ej: 30.000"
                                        required={hasDamage}
                                    />
                                </div>
                                <div>
                                    <label>Notas de daños</label>
                                    <input
                                        type="text"
                                        value={damageNotes}
                                        onChange={(e) => setDamageNotes(e.target.value)}
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
                        <button className="btn-submit" type="submit">
                            Registrar devolución
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ReturnForm;