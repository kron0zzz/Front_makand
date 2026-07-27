import { useEffect, useState } from "react";

import OrderWorkspaceTabs from "./tabs/OrderWorkspaceTabs";

import InfoTab from "./tabs/InfoTab/InfoTab";
import MachineryTab from "./tabs/MachineryTab/MachineryTab";
import CutsTab from "./tabs/CutsTab/CutsTab"
import PaymentsTab from "./tabs/PaymentsTab/PaymentsTab"

import { useWorkspace } from "../../hooks/useWorkspace";

const OrderWorkspace = ({ orderId, onBack }) => {

    const [activeTab, setActiveTab] = useState("info");

    const {

        workspace,
        loading,
        error,
        cargarWorkspace,
        registrarDevolucion,
        eliminarDevolucion,
        cerrarPedido,
        
        cuts,
        cargarCortes,
        registrarCorte,

        paymentsData,
        cargarAbonos,
        registrarAbono

    } = useWorkspace();


    useEffect(() => {

        if(orderId){

            cargarWorkspace(orderId);
            cargarCortes(orderId);
            cargarAbonos(orderId);

        }

    }, [
        orderId,
        cargarWorkspace,
        cargarCortes,
        cargarAbonos
    ]);


    if (loading) {

        return (

            <div className="page-container">

                Cargando workspace...

            </div>

        );

    }


    if (error) {

        return (

            <div className="page-container">

                <button
                    className="btn-secondary"
                    onClick={onBack}
                >
                    Volver a pedidos
                </button>

                <p>
                    {error}
                </p>
            </div>

        );

    }


    if (!workspace) return null;


    const renderTab = () => {

        switch (activeTab) {

            case "info":

                return (

                    <div>

                        <InfoTab
                            order={workspace}
                            onCloseOrder={cerrarPedido}
                        />

                    </div>

                );

            case "machinery":

                return (

                    <MachineryTab

                        order={workspace}
                        onRegisterReturn={registrarDevolucion}
                        onDeleteReturn={eliminarDevolucion}

                    />

                );

            case "cuts":

                return (

                    <div>

                        <CutsTab
                            cuts = {cuts}
                            order={workspace}
                            onCreateCut = {registrarCorte}
                        />

                    </div>

                );

            case "payments":

                return (

                    <div>

                        <PaymentsTab
                            paymentsData = {paymentsData}
                            order={workspace}
                            onCreatePayment = {registrarAbono}
                        />

                    </div>

                );

            default:

                return null;

        }

    };


    return (

        <div className="page-container">

            <button

                className="btn-secondary"

                onClick={onBack}

            >

                ← Volver a pedidos

            </button>

            <div className="header">

                <h1>

                    Pedido #{workspace.order_id}

                </h1>

                <h3>

                    {workspace.order_status_name}

                </h3>

            </div>

            <hr />

            <OrderWorkspaceTabs

                activeTab={activeTab}

                onChange={setActiveTab}

            />

            {renderTab()}

        </div>

    );

};

export default OrderWorkspace;