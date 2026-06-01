import { useState } from "react";
import './SideBar.css'

import {
  Truck,
  LayoutDashboard,
  Menu,
  X,
  LogOut,
  User,
  Building,
  Wrench,
  ChevronDown,
  ChevronUp,
  ShoppingCart,
  FolderOpen,
  Users,
  FileText
} from "lucide-react";

const menuItems = [

  //Dasboard
  {
    name: "Dashboard",
    icon: LayoutDashboard,
    key: "dashboard",
  },


  //Usuarios
  {
    name: "Usuarios",
    icon: Users,
    key: "users-parent",

    submenu: [
      {
        name: "Cargos",
        icon: Wrench,
        key: "cargos",
      },
    ]
  },
  

  // COMPRAS
  {
    name: "Compras",
    icon: FolderOpen,
    key: "compras-parent",

    submenu: [
      {
        name: "Proveedores",
        icon: Building,
        key: "proveedores",
      },
    ]
  },

 
  

  // Proyectos
  {
    name: "Proyectos",
    icon: Building,
    key: "projects-parent",

    submenu: [
      {
        name: "Maquinaria",
        icon: Wrench,
        key: "maquinaria-parent",

        submenu: [
          {
            name: "Maquinaria",
            icon: Wrench,
            key: "maquinaria",
          },
          {
            name: "Vehículos",
            icon: Truck,
            key: "vehiculos",
          },
          {
            name: "Estado Máquina",
            icon: Wrench,
            key: "estados_maquinaria",
          },
          {
            name: "Categorías Máquina",
            icon: FileText,
            key: "categorias_maquinaria",
          },
        ]
      },
    ]

    
  },



  //Ventas
  {
    name: "Ventas",
    icon: ShoppingCart,
    key: "ventas-parent",

    submenu: [
      {
        name: "Clientes",
        icon: Users,
        key: "clientes",
      },
      {
        name: "Empleados",
        icon: Users,
        key: "empleados",
      },
    ]
  },
];

export function Sidebar({
  currentView,
  onViewChange,
  collapsed,
  onToggleCollapse,
  onLogout,
  user = {
    name: "Usuario",
    role: "Administrador",
  },
}) {

  const [expandedMenus, setExpandedMenus] = useState([]);

  const toggleMenu = (menuKey) => {

    if (expandedMenus.includes(menuKey)) {

      setExpandedMenus(
        expandedMenus.filter((m) => m !== menuKey)
      );

    } else {

      setExpandedMenus([
        ...expandedMenus,
        menuKey
      ]);

    }

  };

  const isMenuExpanded = (menuKey) => {
    return expandedMenus.includes(menuKey);
  };

  const isMenuActive = (item) => {

    if (item.key === currentView) return true;

    if (item.submenu) {
      return item.submenu.some((sub) =>
        isMenuActive(sub)
      );
    }

    return false;
  };

  const renderMenuItem = (item, level = 0) => {

    const Icon = item.icon;

    const hasSubmenu =
      item.submenu && item.submenu.length > 0;

    const isExpanded = isMenuExpanded(item.key);

    const isActive = isMenuActive(item);

    return (

      <div key={item.key}>
        <button
          onClick={() => {
            if (hasSubmenu) {
              toggleMenu(item.key);
            } else {
              onViewChange(item.key);
            }
          }}

          className={`
            sidebar-link
            ${
              hasSubmenu && isExpanded
                ? "menu-expanded"
                : ""
            }
            ${
              !hasSubmenu && isActive
                ? "active-page"
                : ""
            }
          `}

        
        >

          <span className="sidebar-icon">
            <Icon size={20} />
          </span>

          {!collapsed && (
            <>
              <span className="sidebar-label">
                {item.name}
              </span>

              {hasSubmenu && (
                <span style={{ marginLeft: "auto" }}>
                  {isExpanded ? (
                    <ChevronUp size={16} />
                  ) : (
                    <ChevronDown size={16} />
                  )}
                </span>
              )}
            </>
          )}

        </button>

        {/* SUBMENU */}
        {hasSubmenu && !collapsed && isExpanded && (

          <div className="sidebar-submenu">
            {item.submenu.map((subItem) =>
              renderMenuItem(subItem, level + 1)
            )}
          </div>

        )}

      </div>

    );

  };

  return (

    <aside
      className={`sidebar ${
        collapsed
          ? "sidebar-closed"
          : "sidebar-open"
      }`}
    >

      {/* HEADER */}
      <div className="sidebar-top">
        <div className="brand-wrapper">
          <div className="brand-logo">
            MK
          </div>

          {!collapsed && (
            <div>
              <p className="brand-title">
                Makand
              </p>

              <p className="brand-subtitle">
                Control
              </p>
            </div>
          )}
        </div>

        <button className="sidebar-toggle" onClick={onToggleCollapse} aria-label={collapsed ? "Expandir menú": "Colapsar menú"}>
          {collapsed
            ? <Menu size={20} />
            : <X size={20} />
          }
        </button>

      </div>

      {/* NAV */}
      <nav className="sidebar-nav">

        {menuItems.map((item) =>
          renderMenuItem(item)
        )}

      </nav>

      {/* FOOTER */}
      <div className="sidebar-footer">
        <div className="sidebar-user">
          <User size={18} />
          {!collapsed && (
            <div className="sidebar-user-info">
              <div className="sidebar-user-name">
                {user.name}
              </div>
              <div className="sidebar-user-role">
                {user.role}
              </div>
            </div>
          )}
        </div>

        <button className="sidebar-logout" onClick={onLogout} aria-label="Cerrar sesión">
          <LogOut size={18} />
          {!collapsed && (
            <span>Cerrar sesión</span>
          )}
        </button>

      </div>

    </aside>

  );

}