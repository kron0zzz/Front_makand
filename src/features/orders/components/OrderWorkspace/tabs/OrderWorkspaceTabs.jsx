import { Info, Wrench, Calendar, Wallet } from "lucide-react";
import "./OrderWorkspaceTabs.css";


const tabs = [

  {
    key: "info",
    label: "Información",
    icon: Info
  },

  {
    key: "machinery",
    label: "Maquinaria",
    icon: Wrench
  },

  {
    key: "cuts",
    label: "Cortes",
    icon: Calendar
  },

  {
    key: "payments",
    label: "Abonos",
    icon: Wallet
  }

];

const OrderWorkspaceTabs = ({
  activeTab,
  onChange
}) => {

  return (

    <div className="workspace-tabs">

      {tabs.map((tab) => {
        const Icon = tab.icon;
        return(
          <button
            key={tab.key}
            className={`
              workspace-tab
              ${
                activeTab === tab.key
                  ? "active"
                  : ""
              }
            `}
            onClick={() =>
              onChange(tab.key)
            }
          >

            <Icon size={18} />

            <span>
              {tab.label}
            </span>

          </button>
        );

      })}

    </div>

  );

};

export default OrderWorkspaceTabs;