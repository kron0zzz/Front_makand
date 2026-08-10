// import { Pencil, Trash2 } from "lucide-react";
// import { formatDate } from "../../../../../../shared/utils/dateUtils";
// import { useAlertModal } from "../../../../../../shared/alertModal";
// import "./ReturnCard.css";

// const ReturnCard = ({ returnData, onDeleteReturn }) => {

//     const { showAlert } = useAlertModal();

//     const handleDelete = async () => {
//         const result = await onDeleteReturn(returnData.return_id);

//         if (result && !result.success) {
//             await showAlert(result.message);
//         }
//     };

//     return (

//         <div className="return-card">

//             <div>

//                 <strong>

//                     {formatDate(returnData.return_date)}

//                 </strong>

//                 <p>

//                     Cantidad devuelta:

//                     {returnData.returned_quantity}

//                 </p>

//             </div>

//             <div className="return-actions">

//                 <button>

//                     <Pencil size={16}/>

//                 </button>

//                 <button onClick={handleDelete}>

//                     <Trash2 size={16}/>

//                 </button>

//             </div>

//         </div>

//     );

// };

// export default ReturnCard;


import { Pencil, Trash2 } from "lucide-react";
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