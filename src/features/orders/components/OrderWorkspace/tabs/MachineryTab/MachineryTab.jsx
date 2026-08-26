import { useMemo } from "react";
import MachineCard from "./MachineCard";
import "./MachineryTab.css";

const MachineryTab = ({ order, onRegisterReturn, onDeleteReturn }) => {

  const isBlocked = order?.order_status_id === 5 || order?.order_status_id === 4;

  const details = order?.details;

  const groupedDetails = useMemo(() => {
    if (!details?.length) return [];

    const groups = [];

    details.forEach(detail => {
      const isMotorized = Boolean(detail.is_motorized);

      if (isMotorized) {
        const key = `${detail.machinery_id || detail.machinery_name_snapshot}`;
        const existing = groups.find(g => g._groupKey === key && g._isMotorized);

        if (existing) {
          existing.subDetails.push(detail);
        } else {
          groups.push({
            _groupKey: key,
            _isMotorized: true,
            order_detail_id: detail.order_detail_id,
            order_id: detail.order_id,
            machinery_id: detail.machinery_id,
            machinery_name_snapshot: detail.machinery_name_snapshot,
            is_motorized: true,
            quantity_to_dispatch: 0,
            rental_unit_price: detail.rental_unit_price,
            subtotal_weight_kg: detail.subtotal_weight_kg,
            stock_id: detail.stock_id,
            returns: [],
            subDetails: [detail]
          });
        }
      } else {
        groups.push({
          ...detail,
          _isMotorized: false,
          subDetails: null
        });
      }
    });

    groups.forEach(group => {
      if (group._isMotorized) {
        let totalQuantity = 0;
        let totalWeight = 0;
        let allReturns = [];

        group.subDetails.forEach(sd => {
          totalQuantity += 1;
          totalWeight += Number(sd.subtotal_weight_kg || 0);
          allReturns = allReturns.concat(sd.returns || []);
        });

        group.quantity_to_dispatch = totalQuantity;
        group.subtotal_weight_kg = totalWeight;
        group.returns = allReturns;
      }
    });

    return groups;
  }, [details]);

  if (!groupedDetails.length) {
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

        {groupedDetails.map((detail) => (

          <MachineCard
            key={detail._groupKey || detail.order_detail_id}
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
