// // import { Pencil, Trash2, Truck, AlertTriangle } from "lucide-react";
// // import { formatDate } from "../../../../../../shared/utils/dateUtils";
// // import { useAlertModal } from "../../../../../../shared/alertModal";
// // import "./ReturnCard.css";

// // const ReturnCard = ({ returnData, onDeleteReturn }) => {
// //     const { showAlert } = useAlertModal();

// //     const handleDelete = async () => {
// //         const result = await onDeleteReturn(returnData.return_id);

// //         if (result && !result.success) {
// //             await showAlert(result.message);
// //         }
// //     };

// //     return (
// //         <div className="return-card">
// //             <div>
// //                 <strong>{formatDate(returnData.return_date)}</strong>
// //                 <p>Cantidad devuelta: {returnData.returned_quantity}</p>

// //                 {/* Sección visual para mostrar cobros adicionales si existen */}
// //                 {returnData.additional_charges && returnData.additional_charges.length > 0 && (
// //                     <div className="return-charges-list" style={{ marginTop: "8px", display: "flex", flexDirection: "column", gap: "4px" }}>
// //                         {returnData.additional_charges.map((charge, index) => (
// //                             <div key={index} style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.85rem", color: "#d97706" }}>
// //                                 {charge.charge_type_id === 1 ? <Truck size={14} /> : <AlertTriangle size={14} />}
// //                                 <span>{charge.charge_description}: <strong>${Number(charge.charge_amount || charge.amount).toLocaleString()}</strong></span>
// //                             </div>
// //                         ))}
// //                     </div>
// //                 )}
// //             </div>

// //             <div className="return-actions">
// //                 <button>
// //                     <Pencil size={16}/>
// //                 </button>
// //                 <button onClick={handleDelete}>
// //                     <Trash2 size={16}/>
// //                 </button>
// //             </div>
// //         </div>
// //     );
// // };

// // export default ReturnCard;


// import { Pencil, Trash2, Truck, AlertTriangle } from "lucide-react";
// import { formatDate } from "../../../../../../shared/utils/dateUtils";
// import { useAlertModal } from "../../../../../../shared/alertModal";
// import "./ReturnCard.css";

// const ReturnCard = ({ returnData, onDeleteReturn }) => {
//     console.log("Datos de la devolución recibida en la card:", returnData);
//     const { showAlert } = useAlertModal();

//     const handleDelete = async () => {
//         const result = await onDeleteReturn(returnData.return_id);
//         if (result && !result.success) {
//             await showAlert(result.message);
//         }
//     };

//     return (
//         <div className="return-card">
//             <div className="return-info-container">
//                 <div className="return-main-info">
//                     <strong>{formatDate(returnData.return_date)}</strong>
//                     <p>Cantidad devuelta: {returnData.returned_quantity}</p>
//                 </div>

//                 {/* Sección visual para los cobros adicionales dentro de la devolución */}
//                 {returnData.additional_charges && returnData.additional_charges.length > 0 && (
//                     <div className="return-charges-section">
//                         {returnData.additional_charges.map((charge, index) => {
//                             // Identificamos si es transporte (ID 1) o daño/pérdida (ID 2)
//                             const isTransport = charge.charge_type_id === 1;
                            
//                             return (
//                                 <div key={index} className="charge-badge-item">
//                                     {isTransport ? (
//                                         <Truck size={16} className="charge-icon transport" />
//                                     ) : (
//                                         <AlertTriangle size={16} className="charge-icon damage" />
//                                     )}
//                                     <span className="charge-desc">
//                                         {charge.charge_description || (isTransport ? "Costo de transporte" : "Cargo por daño o pérdida")}
//                                     </span>
//                                     <span className="charge-amount">
//                                         ${Number(charge.charge_amount || charge.amount).toLocaleString()}
//                                     </span>
//                                 </div>
//                             );
//                         })}
//                     </div>
//                 )}
//             </div>

//             <div className="return-actions">
//                 <button className="btn-icon">
//                     <Pencil size={16} />
//                 </button>
//                 <button className="btn-icon delete" onClick={handleDelete}>
//                     <Trash2 size={16} />
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default ReturnCard;



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
                                    <span className="charge-amount">
                                        ${Number(charge.charge_amount || charge.amount || 0).toLocaleString()}
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