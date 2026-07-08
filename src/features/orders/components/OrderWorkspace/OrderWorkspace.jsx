import { useEffect, useState } from "react";

import OrderWorkspaceTabs from "./tabs/OrderWorkspaceTabs";
import MachineryTab from "./tabs/MachineryTab/MachineryTab";
import CutsTab from "./tabs/CutsTab/CutsTab"

import { useWorkspace } from "../../hooks/useWorkspace";

const OrderWorkspace = ({ orderId, onBack }) => {

    const [activeTab, setActiveTab] = useState("info");

    const {

        workspace,
        cuts,
        loading,
        error,
        cargarWorkspace,
        registrarDevolucion,
        
        cargarCortes,
        registrarCorte

    } = useWorkspace();


    useEffect(() => {

        if(orderId){

            cargarWorkspace(orderId);
            cargarCortes(orderId);

        }

    }, [
        orderId,
        cargarWorkspace,
        cargarCortes
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

                        <p>Info en construccion</p>

                    </div>

                );

            case "machinery":

                return (

                    <MachineryTab

                        order={workspace}
                        onRegisterReturn={registrarDevolucion}

                    />

                );

            case "cuts":

                return (

                    <div>

                        <CutsTab
                            cuts = {cuts}
                            //orderId = {workspace.order_id}
                            order={workspace}
                            onCreateCut = {registrarCorte}
                        />

                    </div>

                );

            case "payments":

                return (

                    <div>

                        <p>Pagos en construcción.</p>

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