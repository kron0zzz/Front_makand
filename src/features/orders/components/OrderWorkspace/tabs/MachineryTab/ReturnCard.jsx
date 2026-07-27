import { Pencil, Trash2 } from "lucide-react";
import { formatDate } from "../../../../../../shared/utils/dateUtils";
import "./ReturnCard.css";

const ReturnCard = ({ returnData, onDeleteReturn }) => {

    const handleDelete = () => {
        onDeleteReturn(returnData.return_id);
    };

    return (

        <div className="return-card">

            <div>

                <strong>

                    {formatDate(returnData.return_date)}

                </strong>

                <p>

                    Cantidad devuelta:

                    {returnData.returned_quantity}

                </p>

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