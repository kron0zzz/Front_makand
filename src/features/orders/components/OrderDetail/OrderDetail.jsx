// import {
//   X,
//   FolderKanban,
//   User,
//   Phone,
//   Mail,
//   FileText,
//   Calendar,
//   Activity,
//   Package
// } from "lucide-react";

// import "./OrderDetail.css";

// const OrderDetail = ({
//   isOpen,
//   onClose,
//   order
// }) => {

//   if (!isOpen || !order) return null;

//   const totalPedido =
//     order.details?.reduce(
//       (acc, item) =>
//         acc +
//         (
//           Number(item.rental_unit_price) *
//           Number(item.quantity_to_dispatch)
//         ),
//       0
//     ) || 0;

//   return (
//     <div className="modal-overlay">

//       <div className="modal-container">

//         <div className="modal-header">

//           <h2>
//             Detalle del Pedido
//           </h2>

//           <button
//             onClick={onClose}
//             className="close-button"
//           >
//             <X size={20} />
//           </button>

//         </div>

//         <div className="modal-content">

//           <div className="detail-grid">

//             {/* Pedido */}

//             <div className="full-width user-avatar-section">

//               <div className="avatar-icon-wrapper">
//                 <Package size={24} />
//               </div>

//               <div>

//                 <p className="label-text">
//                   Pedido
//                 </p>

//                 <p className="value-text value-text-large">
//                   #{order.order_id}
//                 </p>

//               </div>

//             </div>

//             {/* Proyecto */}

//             <div>

//               <div className="info-item-header">
//                 <FolderKanban
//                   size={16}
//                   color="#9ca3af"
//                 />
//                 <p className="label-text">
//                   Proyecto
//                 </p>
//               </div>

//               <p className="value-text">
//                 {order.project_name}
//               </p>

//             </div>

//             {/* Estado */}

//             <div>

//               <div className="info-item-header">
//                 <Activity
//                   size={16}
//                   color="#9ca3af"
//                 />
//                 <p className="label-text">
//                   Estado
//                 </p>
//               </div>

//               <span className="status-badge status-active">
//                 {order.order_status_name}
//               </span>

//             </div>

//             {/* Cliente */}

//             <div>

//               <div className="info-item-header">
//                 <User
//                   size={16}
//                   color="#9ca3af"
//                 />
//                 <p className="label-text">
//                   Cliente
//                 </p>
//               </div>

//               <p className="value-text">
//                 {order.customer_first_name}
//                 {" "}
//                 {order.customer_last_name}
//               </p>

//             </div>

//             {/* Teléfono */}

//             <div>

//               <div className="info-item-header">
//                 <Phone
//                   size={16}
//                   color="#9ca3af"
//                 />
//                 <p className="label-text">
//                   Teléfono Cliente
//                 </p>
//               </div>

//               <p className="value-text">
//                 {order.customer_phone}
//               </p>

//             </div>

//             {/* Usuario */}

//             <div>

//               <div className="info-item-header">
//                 <Mail
//                   size={16}
//                   color="#9ca3af"
//                 />
//                 <p className="label-text">
//                   Registrado por
//                 </p>
//               </div>

//               <p className="value-text">
//                 {order.user_email}
//               </p>

//             </div>

//             {/* Fecha */}

//             <div>

//               <div className="info-item-header">
//                 <Calendar
//                   size={16}
//                   color="#9ca3af"
//                 />
//                 <p className="label-text">
//                   Fecha Creación
//                 </p>
//               </div>

//               <p className="value-text">
//                 {
//                   new Date(
//                     order.order_creation_date
//                   ).toLocaleDateString()
//                 }
//               </p>

//             </div>

//             {/* Dirección */}

//             <div className="full-width">

//               <div className="info-item-header">
//                 <FolderKanban
//                   size={16}
//                   color="#9ca3af"
//                 />
//                 <p className="label-text">
//                   Dirección Proyecto
//                 </p>
//               </div>

//               <p className="value-text">
//                 {order.project_address}
//               </p>

//             </div>

//             {/* Descripción */}

//             <div className="full-width">

//               <div className="info-item-header">
//                 <FileText
//                   size={16}
//                   color="#9ca3af"
//                 />
//                 <p className="label-text">
//                   Observaciones
//                 </p>
//               </div>

//               <p className="value-text">
//                 {order.order_description ||
//                   "Sin observaciones"}
//               </p>

//             </div>

//           </div>

//           {/* Maquinaria */}

//           <div
//             style={{
//               marginTop: "25px"
//             }}
//           >

//             <h3
//               style={{
//                 marginBottom: "15px"
//               }}
//             >
//               Maquinaria del Pedido
//             </h3>

//             <table className="custom-table">

//               <thead>

//                 <tr>

//                   <th>
//                     Máquina
//                   </th>

//                   <th>
//                     Cantidad
//                   </th>

//                   <th>
//                     Precio Unitario
//                   </th>

//                   <th>
//                     Peso Total
//                   </th>

//                 </tr>

//               </thead>

//               <tbody>

//                 {order.details?.map(
//                   (item) => (

//                     <tr
//                       key={
//                         item.order_detail_id
//                       }
//                     >

//                       <td>
//                         {
//                           item.machinery_name_snapshot
//                         }
//                       </td>

//                       <td>
//                         {
//                           item.quantity_to_dispatch
//                         }
//                       </td>

//                       <td>
//                         $
//                         {
//                           Number(
//                             item.rental_unit_price
//                           ).toLocaleString()
//                         }
//                       </td>

//                       <td>
//                         {
//                           Number(
//                             item.subtotal_weight_kg
//                           ).toLocaleString()
//                         }
//                         {" "}kg
//                       </td>

//                     </tr>

//                   )
//                 )}

//               </tbody>

//             </table>

//           </div>

//           {/* Resumen */}

//           <div
//             style={{
//               marginTop: "20px",
//               textAlign: "right"
//             }}
//           >

//             <p
//               className="value-text"
//               style={{
//                 fontSize: "18px",
//                 fontWeight: "bold"
//               }}
//             >
//               Total alquiler:
//               {" "}
//               $
//               {totalPedido.toLocaleString()}
//             </p>

//           </div>

//           <div className="action-buttons">

//             <button
//               onClick={onClose}
//               className="btn-secondary"
//             >
//               Cerrar
//             </button>

//           </div>

//         </div>

//       </div>

//     </div>
//   );
// };

// export default OrderDetail;









///                     LO DE RIOSSSSS


import {
  X,
  FolderKanban,
  User,
  Phone,
  Mail,
  FileText,
  Calendar,
  Activity,
  Package
} from "lucide-react";

import "./OrderDetail.css";
import {formatDate} from "../../../../shared/utils/dateUtils"

const OrderDetail = ({
  isOpen,
  onClose,
  order
}) => {

  if (!isOpen || !order) return null;

  const totalPedido =
    order.details?.reduce(
      (acc, item) =>
        acc +
        (
          Number(item.rental_unit_price) *
          Number(item.quantity_to_dispatch)
        ),
      0
    ) || 0;

  return (
    <div className="modal-overlay">

      <div className="modal-container">

        <div className="modal-header">

          <h2>
            Detalle del Pedido
          </h2>

          <button
            onClick={onClose}
            className="close-button"
          >
            <X size={20} />
          </button>

        </div>

        <div className="modal-content">

          <div className="detail-grid">

            {/* Pedido */}

            <div className="full-width user-avatar-section">

              <div className="orderId">
                <div className="avatar-icon-wrapper">
                  <Package size={24} />
                </div>

                <div>

                  <p className="label-text">
                    Pedido
                  </p>

                  <p className="value-text value-text-large">
                    #{order.order_id}
                  </p>

                </div>
              </div>

              {/* Estado */}

              <div>

                <div className="info-item-header">
                  <Activity
                    size={16}
                    color="#9ca3af"
                  />
                  <p className="label-text">
                    Estado
                  </p>
                </div>

                <span className="status-badge status-active">
                  {order.order_status_name}
                </span>

              </div>

            </div>

            {/* Proyecto */}

            <div>

              <div className="info-item-header">
                <FolderKanban
                  size={16}
                  color="#9ca3af"
                />
                <p className="label-text">
                  Proyecto
                </p>
              </div>

              <p className="value-text">
                {order.project_name}
                {" "}
                ({order.project_city})
              </p>

            </div>





            {/* Dirección */}

            <div>

              <div className="info-item-header">
                <FolderKanban
                  size={16}
                  color="#9ca3af"
                />
                <p className="label-text">
                  Dirección Proyecto
                </p>
              </div>

              <p className="value-text">
                {order.project_address}
              </p>

            </div>

            

            {/* Cliente */}

            <div>

              <div className="info-item-header">
                <User
                  size={16}
                  color="#9ca3af"
                />
                <p className="label-text">
                  Cliente
                </p>
              </div>

              <p className="value-text">
                {order.customer_first_name}
                {" "}
                {order.customer_last_name}
              </p>
              <p className="value-text">
                id: {order.customer_id}
              </p>

            </div>

            {/* Teléfono */}

            <div>

              <div className="info-item-header">
                <Phone
                  size={16}
                  color="#9ca3af"
                />
                <p className="label-text">
                  Teléfono Cliente
                </p>
              </div>

              <p className="value-text">
                {order.customer_phone}
              </p>

            </div>

            {/* Usuario */}

            <div>

              <div className="info-item-header">
                <Mail
                  size={16}
                  color="#9ca3af"
                />
                <p className="label-text">
                  Registrado por
                </p>
              </div>

              <p className="value-text">
                {order.user_email}
              </p>

            </div>

            {/* Fecha creacion*/}

            <div>

              <div className="info-item-header">
                <Calendar
                  size={16}
                  color="#9ca3af"
                />
                <p className="label-text">
                  Fecha Creación
                </p>
              </div>

              <p className="value-text">
                {
                  formatDate( 
                    order.order_creation_date
                  )
                }
              </p>

            </div>


            {/* Fecha Cierre */}

            <div>

              <div className="info-item-header">
                <Calendar
                  size={16}
                  color="#9ca3af"
                />
                <p className="label-text">
                  Fecha Cierre
                </p>
              </div>

              <p className="value-text">
                {
                  order.order_closing_date
                    ? formatDate(order.order_closing_date)
                    : "El pedido aún no ha sido cerrado"
                }
              </p>

            </div>



            {/* Último Corte */}

            <div>

              <div className="info-item-header">
                <Calendar
                  size={16}
                  color="#9ca3af"
                />
                <p className="label-text">
                  Último Corte
                </p>
              </div>

              <p className="value-text">
                {
                  order.last_cut_date
                    ? formatDate(order.last_cut_date)
                    : "Aún no se ha generado ningún corte"
                }
              </p>

            </div>

            

            {/* Descripción */}

            <div className="full-width">

              <div className="info-item-header">
                <FileText
                  size={16}
                  color="#9ca3af"
                />
                <p className="label-text">
                  Observaciones
                </p>
              </div>

              <p className="value-text">
                {order.order_description ||
                  "Sin observaciones"}
              </p>

            </div>

          </div>

          {/* Maquinaria */}

          <div
            style={{
              marginTop: "25px"
            }}
          >

            <h3
              style={{
                marginBottom: "15px"
              }}
            >
              Maquinaria del Pedido
            </h3>

            <table className="custom-table">

              <thead>

                <tr>

                  <th>
                    Máquina
                  </th>

                  <th>
                    Cantidad
                  </th>

                  <th>
                    Precio Unitario
                  </th>

                  <th>
                    Peso Total
                  </th>

                  <th>
                    Estado
                  </th>

                </tr>

              </thead>

              <tbody>

                {order.details?.map(
                  (item) => (

                    <tr
                      key={
                        item.order_detail_id
                      }
                    >

                      <td>
                        {
                          item.machinery_name_snapshot
                        }
                      </td>

                      <td>
                        {
                          item.quantity_to_dispatch
                        }
                      </td>

                      <td>
                        $
                        {
                          Number(
                            item.rental_unit_price
                          ).toLocaleString()
                        }
                      </td>

                      <td>
                        {
                          Number(
                            item.subtotal_weight_kg
                          ).toLocaleString()
                        }
                        {" "}kg
                      </td>


                      <td>

                        <span
                          className={
                            item.machinery_rental_status
                              ? "status-badge status-inactive"
                              : "status-badge status-active"
                          }
                        >
                          {
                            item.machinery_rental_status
                              ? "En obra"
                              : "Devuelto"
                          }
                        </span>

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

          {/* Resumen */}

          <div
            style={{
              marginTop: "20px",
              textAlign: "right"
            }}
          >

            <p
              className="value-text"
              style={{
                fontSize: "18px",
                fontWeight: "bold"
              }}
            >
              Total alquiler diario:
              {" "}
              $
              {totalPedido.toLocaleString()}
            </p>

          </div>

          <div className="action-buttons">

            <button
              onClick={onClose}
              className="btn-secondary"
            >
              Cerrar
            </button>

          </div>

        </div>

      </div>

    </div>
  );
};

export default OrderDetail;