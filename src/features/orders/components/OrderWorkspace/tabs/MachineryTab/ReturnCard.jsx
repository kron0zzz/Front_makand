import { Pencil, Trash2, Truck, AlertTriangle } from "lucide-react";
import { formatDate } from "../../../../../../shared/utils/dateUtils";
import { useAlertModal } from "../../../../../../shared/alertModal";
import "./ReturnCard.css";

const ReturnCard = ({ returnData, onDeleteReturn }) => {
    const { showAlert } = useAlertModal();

    const handleDelete = async () => {
        const result = await onDeleteReturn(returnData.return_id);

        if (result && !result.success) {
            await showAlert(result.message);
        }
    };

    return (
        <div className="return-card">
            <div>
                <strong>{formatDate(returnData.return_date)}</strong>
                <p>Cantidad devuelta: {returnData.returned_quantity}</p>

                {/* Sección visual para mostrar cobros adicionales si existen */}
                {returnData.additional_charges && returnData.additional_charges.length > 0 && (
                    <div className="return-charges-list" style={{ marginTop: "8px", display: "flex", flexDirection: "column", gap: "4px" }}>
                        {returnData.additional_charges.map((charge, index) => (
                            <div key={index} style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.85rem", color: "#d97706" }}>
                                {charge.charge_type_id === 1 ? <Truck size={14} /> : <AlertTriangle size={14} />}
                                <span>{charge.charge_description}: <strong>${Number(charge.charge_amount || charge.amount).toLocaleString()}</strong></span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="return-actions">
                <button>
                    <Pencil size={16}/>
                </button>
                <button onClick={handleDelete}>
                    <Trash2 size={16}/>
                </button>
            </div>
        </div>
    );
};

export default ReturnCard;