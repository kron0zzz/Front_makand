import { Pencil, Trash2, Truck, AlertTriangle } from "lucide-react";
import { formatDate } from "../../../../../../shared/utils/dateUtils";
import { useAlertModal } from "../../../../../../shared/alertModal";
import "./ReturnCard.css";

const ReturnCard = ({ returnData, additionalCharges = [], onDeleteReturn }) => {
    console.log("Datos de la devolución recibida en la card:", returnData);
    const { showAlert } = useAlertModal();

    const handleDelete = async () => {
        const result = await onDeleteReturn(returnData.return_id);
        if (result && !result.success) {
            await showAlert(result.message);
        }
    };

    // Usamos los cargos que vengan por prop, o del objeto, o un arreglo vacío por seguridad
    const displayCharges = additionalCharges.length > 0 
        ? additionalCharges 
        : (returnData.additional_charges || []);

    return (
        <div className="return-card">
            <div className="return-info-container">
                <div className="return-main-info">
                    <strong>{formatDate(returnData.return_date)}</strong>
                    <p>Cantidad devuelta: {returnData.returned_quantity}</p>
                </div>

                {/* Sección visual para los cobros adicionales dentro de la devolución */}
                {displayCharges && displayCharges.length > 0 && (
                    <div className="return-charges-section">
                        {displayCharges.map((charge, index) => {
                            // Identificamos si es transporte (ID 1) o daño/pérdida (ID 2)
                            const isTransport = charge.charge_type_id === 1;
                            
                            return (
                                <div key={index} className="charge-badge-item">
                                    {isTransport ? (
                                        <Truck size={16} className="charge-icon transport" />
                                    ) : (
                                        <AlertTriangle size={16} className="charge-icon damage" />
                                    )}
                                    <span className="charge-desc">
                                        {charge.charge_description || (isTransport ? "Costo de transporte" : "Cargo por daño o pérdida")}
                                    </span>

                                    <span>
                                        ${Number(charge.amount).toLocaleString('es-CO')}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            <div className="return-actions">
                <button className="btn-icon">
                    <Pencil size={16} />
                </button>
                <button className="btn-icon delete" onClick={handleDelete}>
                    <Trash2 size={16} />
                </button>
            </div>
        </div>
    );
};

export default ReturnCard;