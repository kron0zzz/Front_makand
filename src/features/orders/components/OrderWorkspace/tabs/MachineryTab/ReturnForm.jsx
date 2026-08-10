// // import { useEffect, useMemo, useState } from "react";
// // import { X } from "lucide-react";

// // import "./ReturnForm.css";
// // import { useAlertModal } from "../../../../../../shared/alertModal";

// // const ReturnForm = ({
// //   isOpen,
// //     onClose,
// //     orderDetail,
// //     onSubmit
// // }) => {
// //   const { showAlert, showConfirm } = useAlertModal();

// //     const [returnDate, setReturnDate] = useState("");
// //     const [quantity, setQuantity] = useState(1);

// //     const returned = useMemo(() => {

// //         return (orderDetail?.returns || []).reduce(

// //             (acc, item) =>
// //                 acc + Number(item.returned_quantity),

// //             0

// //         );

// //     }, [orderDetail]);



// //     const pending =

// //         Number(orderDetail?.quantity_to_dispatch || 0)
// //         - returned;



// //     useEffect(() => {

// //         if (!isOpen || !orderDetail) return;

// //         setReturnDate("");

// //         setQuantity(

// //             pending > 0
// //                 ? 1
// //                 : 0

// //         );

// //     }, [isOpen, orderDetail, pending]);



// //     if (!isOpen || !orderDetail) return null;



// //     const isMotorized =

// //         Number(orderDetail.quantity_to_dispatch) === 1;



// //     const handleSubmit = async (e) => {

// //         e.preventDefault();

// //         try {

// //             await onSubmit({

// //                 order_detail_id:
// //                     orderDetail.order_detail_id,

// //                 return_date:
// //                     returnDate,

// //                 returned_quantity:
// //                     Number(quantity)

// //             });

// //             onClose();

// //             await showAlert("Devolución registrada correctamente");

// //         } catch (err) {

// //             await showAlert(`Error al registrar devolución: ${err.message}`);

// //         }

// //     };



// //     return (

// //         <div className="return-modal-overlay">

// //             <div className="return-modal">

// //                 <div className="return-header">

// //                     <h2>

// //                         Registrar devolución

// //                     </h2>

// //                     <button
// //                         onClick={onClose}
// //                         className="close-btn"
// //                     >

// //                         <X size={20}/>

// //                     </button>

// //                 </div>

// //                 <form
// //                     onSubmit={handleSubmit}
// //                 >

// //                     <div className="return-machine">

// //                         <strong>

// //                             {orderDetail.machinery_name_snapshot}

// //                         </strong>

// //                     </div>

// //                     <div className="return-grid">

// //                         <div>

// //                             <label>

// //                                 Fecha

// //                             </label>

// //                             <input
// //                                 type="date"
// //                                 value={returnDate}
// //                                 onChange={(e)=>

// //                                     setReturnDate(
// //                                         e.target.value
// //                                     )

// //                                 }
// //                                 required
// //                             />

// //                         </div>

// //                         <div>

// //                             <label>

// //                                 Cantidad

// //                             </label>

// //                             <input
// //                                 type="number"
// //                                 min="1"
// //                                 max={pending}
// //                                 value={quantity}
// //                                 disabled={isMotorized}
// //                                 onChange={(e)=>

// //                                     setQuantity(
// //                                         e.target.value
// //                                     )

// //                                 }
// //                                 required
// //                             />

// //                             <small>

// //                                 Pendientes por devolver:

// //                                 {" "}

// //                                 {pending}

// //                             </small>

// //                         </div>

// //                     </div>

// //                     <div className="return-footer">

// //                         <button
// //                             type="button"
// //                             className="btn-cancel"
// //                             onClick={onClose}
// //                         >

// //                             Cancelar

// //                         </button>

// //                         <button
// //                             className="btn-submit"
// //                             type="submit"
// //                         >

// //                             Registrar devolución

// //                         </button>

// //                     </div>

// //                 </form>

// //             </div>

// //         </div>

// //     );

// // };

// // export default ReturnForm;


// import { useEffect, useMemo, useState } from "react";
// import { X } from "lucide-react";

// import "./ReturnForm.css";
// import { useAlertModal } from "../../../../../../shared/alertModal";

// const ReturnForm = ({
//     isOpen,
//     onClose,
//     orderDetail,
//     onSubmit
// }) => {
//     const { showAlert } = useAlertModal();

//     const [returnDate, setReturnDate] = useState("");
//     const [quantity, setQuantity] = useState(1);
//     const [returnTransportCost, setReturnTransportCost] = useState(0);
//     const [damageFee, setDamageFee] = useState(0);
//     const [damageNotes, setDamageNotes] = useState("");

//     const returned = useMemo(() => {
//         return (orderDetail?.returns || []).reduce(
//             (acc, item) =>
//                 acc + Number(item.returned_quantity),
//             0
//         );
//     }, [orderDetail]);

//     const pending =
//         Number(orderDetail?.quantity_to_dispatch || 0)
//         - returned;

//     useEffect(() => {
//         if (!isOpen || !orderDetail) return;

//         setReturnDate("");
//         setQuantity(
//             pending > 0
//                 ? 1
//                 : 0
//         );
//         setReturnTransportCost(0);
//         setDamageFee(0);
//         setDamageNotes("");
//     }, [isOpen, orderDetail, pending]);

//     if (!isOpen || !orderDetail) return null;

//     const isMotorized =
//         Number(orderDetail.quantity_to_dispatch) === 1;

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         try {
//             await onSubmit({
//                 order_detail_id:
//                     orderDetail.order_detail_id,
//                 return_date:
//                     returnDate,
//                 returned_quantity:
//                     Number(quantity),
//                 return_transport_cost:
//                     Number(returnTransportCost),
//                 damage_fee:
//                     Number(damageFee),
//                 damage_notes:
//                     damageNotes
//             });

//             onClose();

//             await showAlert("Devolución registrada correctamente");

//         } catch (err) {

//             await showAlert(`Error al registrar devolución: ${err.message}`);

//         }
//     };

//     return (

//         <div className="return-modal-overlay">

//             <div className="return-modal">

//                 <div className="return-header">

//                     <h2>

//                         Registrar devolución

//                     </h2>

//                     <button
//                         onClick={onClose}
//                         className="close-btn"
//                     >

//                         <X size={20}/>

//                     </button>

//                 </div>

//                 <form
//                     onSubmit={handleSubmit}
//                 >

//                     <div className="return-machine">

//                         <strong>

//                             {orderDetail.machinery_name_snapshot}

//                         </strong>

//                     </div>

//                     <div className="return-grid">

//                         <div>

//                             <label>

//                                 Fecha

//                             </label>

//                             <input
//                                 type="date"
//                                 value={returnDate}
//                                 onChange={(e)=>
//                                     setReturnDate(
//                                         e.target.value
//                                     )
//                                 }
//                                 required
//                             />

//                         </div>

//                         <div>

//                             <label>

//                                 Cantidad

//                             </label>

//                             <input
//                                 type="number"
//                                 min="1"
//                                 max={pending}
//                                 value={quantity}
//                                 disabled={isMotorized}
//                                 onChange={(e)=>
//                                     setQuantity(
//                                         e.target.value
//                                     )
//                                 }
//                                 required
//                             />

//                             <small>

//                                 Pendientes por devolver:
//                                 {" "}
//                                 {pending}

//                             </small>

//                         </div>

//                     </div>

//                     <div className="return-grid">

//                         <div>

//                             <label>
//                                 Transporte de vuelta
//                             </label>

//                             <input
//                                 type="number"
//                                 min="0"
//                                 step="0.01"
//                                 value={returnTransportCost}
//                                 onChange={(e) =>
//                                     setReturnTransportCost(e.target.value)
//                                 }
//                             />

//                         </div>

//                         <div>

//                             <label>
//                                 Cargo por daños/pérdidas
//                             </label>

//                             <input
//                                 type="number"
//                                 min="0"
//                                 step="0.01"
//                                 value={damageFee}
//                                 onChange={(e) =>
//                                     setDamageFee(e.target.value)
//                                 }
//                             />

//                         </div>

//                     </div>

//                     {/* Fila estructurada para Notas de daños con su etiqueta arriba */}
//                     <div className="return-grid" style={{ gridTemplateColumns: "1fr" }}>
//                         <div>
//                             <label>
//                                 Notas de daños
//                             </label>

//                             <input
//                                 type="text"
//                                 value={damageNotes}
//                                 onChange={(e) =>
//                                     setDamageNotes(e.target.value)
//                                 }
//                                 placeholder="Opcional..."
//                             />
//                         </div>
//                     </div>

//                     <div className="return-footer">

//                         <button
//                             type="button"
//                             className="btn-cancel"
//                             onClick={onClose}
//                         >

//                             Cancelar

//                         </button>

//                         <button
//                             className="btn-submit"
//                             type="submit"
//                         >

//                             Registrar devolución

//                         </button>

//                     </div>

//                 </form>

//             </div>

//         </div>

//     );

// };

// export default ReturnForm;


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
            await onSubmit({
                order_detail_id: orderDetail.order_detail_id,
                return_date: returnDate,
                returned_quantity: Number(quantity),
                return_transport_cost: hasTransport ? Number(returnTransportCost || 0) : 0,
                damage_fee: hasDamage ? Number(damageFee || 0) : 0,
                damage_notes: hasDamage ? damageNotes : ""
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