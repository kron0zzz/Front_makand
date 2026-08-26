import { useState } from "react";
import ReturnForm from "./ReturnForm"

import {

    Package,
    Weight,
    DollarSign,
    Boxes,
    Undo2,
    ChevronDown,
    ChevronUp

} from "lucide-react";

import ReturnCard from "./ReturnCard";

import "./MachineCard.css";

const MachineCard = ({ detail, onRegisterReturn, onDeleteReturn, isBlocked }) => {

    const [open,setOpen]=useState(false);
    const [showReturnForm, setShowReturnForm] = useState(false);

    const isMotorized = detail._isMotorized;

    const cantidadDevuelta =

        detail.returns.reduce(

            (acc,r)=>

                acc+Number(r.returned_quantity),

            0

        );

    const cantidadPendiente =

        detail.quantity_to_dispatch-
        cantidadDevuelta;

    const porcentaje =

        Math.round(

            cantidadDevuelta/
            detail.quantity_to_dispatch*100

        );

    const subtotal =

        Number(detail.quantity_to_dispatch)*
        Number(detail.rental_unit_price);

    const pendingStockForReturn = isMotorized && detail.subDetails
        ? detail.subDetails
            .filter(sd => {
                const returned = (sd.returns || []).reduce(
                    (acc, r) => acc + Number(r.returned_quantity), 0
                );
                return Number(sd.quantity_to_dispatch) - returned > 0;
            })
            .map(sd => ({
                ...sd,
                status_name: "Ocupada",
                status_id: 3
            }))
        : [];

    const handleReturnSubmit = async (data) => {
        if (data.isMotorized && data.selectedStocks && data.selectedStocks.length > 0) {
            for (const stock of data.selectedStocks) {
                await onRegisterReturn(
                    detail.order_id,
                    {
                        order_detail_id: stock.order_detail_id,
                        return_date: data.return_date,
                        returned_quantity: 1
                    }
                );
            }
        } else {
            await onRegisterReturn(
                detail.order_id,
                {
                    order_detail_id: detail.order_detail_id,
                    return_date: data.return_date,
                    returned_quantity: Number(data.returned_quantity),
                    additional_charges: data.additional_charges
                }
            );
        }
    };

    return(

        <div className="machine-card">

            <div className="machine-header">

                <div>

                    <h3>

                        {detail.machinery_name_snapshot}

                    </h3>

                </div>

                <span
                    className={
                        cantidadPendiente===0
                        ?"machine-status returned"
                        :"machine-status active"
                    }
                >
                    {
                        cantidadPendiente===0
                        ?"DEVUELTO"
                        :"EN OBRA"
                    }
                </span>

            </div>

            <div className="machine-grid">

                <div className="machine-data">
                    <div className="data-label">
                        <Package size={18}/>

                        <span>
                            Alquiladas
                        </span>
                    </div>
                    <strong>
                        {detail.quantity_to_dispatch}
                    </strong>

                </div>

                <div className="machine-data">
                    <div className="data-label">
                        <Undo2 size={18}/>

                        <span>
                            Devueltas
                        </span>
                    </div>

                    <strong>
                        {cantidadDevuelta}
                    </strong>
                </div>

                <div className="machine-data">
                    <div className="data-label">
                        <Boxes size={18}/>
                        <span>
                            Pendientes
                        </span>
                    </div>

                    <strong>
                        {cantidadPendiente}
                    </strong>
                </div>

                <div className="machine-data">
                    <div className="data-label">
                        <Weight size={18}/>
                        <span>
                            Peso
                        </span>
                    </div>

                    <strong>
                        {Number(detail.subtotal_weight_kg)} kg
                    </strong>
                </div>

                <div className="machine-data">
                    <div className="data-label">
                        <DollarSign size={18}/>
                        <span>
                            Precio Unit.
                        </span>
                    </div>

                    <strong>
                        ${Number(detail.rental_unit_price).toLocaleString()}
                    </strong>
                </div>

                <div className="machine-data">
                    <div className="data-label">
                        <DollarSign size={18}/>
                        <span>
                            Total
                        </span>
                    </div>
                    <strong>
                        ${subtotal.toLocaleString()}
                    </strong>
                </div>

            </div>

            <div className="progress">

                <div

                    className="progress-fill"

                    style={{

                        width:`${porcentaje}%`

                    }}

                />

            </div>

            <p className="progress-label">
                {porcentaje}% devuelto
            </p>

            <div className="machine-buttons">
                {
                    cantidadPendiente>0&&(
                        <button
                            className="btn-return"
                            onClick={() => setShowReturnForm(true)}
                            disabled={isBlocked}
                        >
                            <Undo2 size={17}/>
                            {isMotorized ? "Devolver maquinaria" : "Registrar devolución"}
                        </button>
                    )
                }
                <button
                    className="btn-history"
                    onClick={()=>setOpen(!open)}
                    disabled={isBlocked}
                >
                    {
                        open
                        ?"Ocultar devoluciones"
                        :"Ver devoluciones"
                    }

                    {
                        open
                        ?<ChevronUp size={17}/>
                        :<ChevronDown size={17}/>
                    }
                </button>

            </div>

            {
                open&&(
                    <div className="returns-container">
                        {
                            detail.returns.length===0
                            ?
                            <div className="empty-returns">
                                No existen devoluciones registradas.
                            </div>
                            :
                            detail.returns.map(ret=>(
                                <ReturnCard
                                    key={ret.return_id}
                                    returnData={ret}
                                    additionalCharges={ret.additional_charges || []}
                                    onDeleteReturn={(returnId) => onDeleteReturn(detail.order_id, returnId)}
                                    isBlocked={isBlocked}
                                />
                            ))
                        }
                    </div>
                )
            }


            <ReturnForm
                isOpen={showReturnForm}
                onClose={() => setShowReturnForm(false)}
                orderDetail={detail}
                isMotorized={isMotorized}
                pendingStocks={pendingStockForReturn}
                onSubmit={handleReturnSubmit}
            />

        </div>

    );

};

export default MachineCard;
