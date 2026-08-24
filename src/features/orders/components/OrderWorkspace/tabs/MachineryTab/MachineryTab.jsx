import MachineCard from "./MachineCard";
import "./MachineryTab.css";

const MachineryTab = ({ order, onRegisterReturn, onDeleteReturn }) => {

  const isBlocked = order?.order_status_id === 5 || order?.order_status_id === 4;

  if (!order?.details?.length) {
    return (
      <div className="empty-machinery">
        Este pedido no tiene maquinaria registrada.
      </div>
    );
  }

  return (

    <div className="machinery-tab">

      <h2>Equipos alquilados</h2>

      <div className="machinery-list">

        {order.details.map(detail => (

          <MachineCard
            key={detail.order_detail_id}
            detail={detail}
            onRegisterReturn={onRegisterReturn}
            onDeleteReturn={onDeleteReturn}
            isBlocked={isBlocked}
          />

        ))}

      </div>

    </div>

  );

};

export default MachineryTab;