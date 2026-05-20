//import React from "react";
import {Truck, LayoutDashboard, Menu, X, LogOut, User, Building, Wrench} from "lucide-react";

const menuItems = [
  {
    name: "Dashboard",
    icon: LayoutDashboard,
    key: "dashboard",
  },
  {
    name: "Clientes",
    icon: Building,
    key: "clientes",
  },
  {
    name: "Proveedores",
    icon: Building,
    key: "proveedores",
  },
  {
    name: "Vehículos",
    icon: Truck,
    key: "vehiculos",
  },
  {
    name: "Estado Máquina",
    icon: Wrench, 
    key: "estados_maquinaria"
  },
  {
  name: "Categorías Máquina",
  icon: Wrench, 
  key: "categorias_maquinaria",
  },
  {
  name: "Cargos",
  icon: Wrench, 
  key: "cargos",
  }
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
  return (
    <aside
      className={`sidebar ${
        collapsed ? "sidebar-closed" : "sidebar-open"
      }`}
    >
      {/* Header */}
      <div className="sidebar-top">
        <div className="brand-wrapper">
          <div className="brand-logo">MK</div>

          {!collapsed && (
            <div>
              <p className="brand-title">Makand</p>
              <p className="brand-subtitle">Control</p>
            </div>
          )}
        </div>

        <button
          className="sidebar-toggle"
          onClick={onToggleCollapse}
          aria-label={
            collapsed ? "Expandir menú" : "Colapsar menú"
          }
        >
          {collapsed ? <Menu size={20} /> : <X size={20} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.key}
              onClick={() => onViewChange(item.key)}
              className={`sidebar-link ${
                currentView === item.key ? "active" : ""
              }`}
              aria-label={item.name}
            >
              <span className="sidebar-icon">
                <Icon size={20} />
              </span>

              {!collapsed && (
                <span className="sidebar-label">
                  {item.name}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
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

        <button
          className="sidebar-logout"
          onClick={onLogout}
          aria-label="Cerrar sesión"
        >
          <LogOut size={18} />

          {!collapsed && <span>Cerrar sesión</span>}
        </button>
      </div>
    </aside>
  );
}
