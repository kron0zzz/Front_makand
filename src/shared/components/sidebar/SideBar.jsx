import { useState } from "react";
import { useLocation } from "react-router-dom";
import './SideBar.css';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, Menu, X, LogOut, User, Building, Wrench, 
  ChevronDown, ChevronUp, ShoppingCart, FolderOpen, Users, FileText, 
  FolderKanban, ReceiptText, UserCog 
} from "lucide-react";

const menuItems = [
  { name: "Dashboard", icon: LayoutDashboard, key: "dashboard" },
  {
    name: "Usuarios", icon: Users, key: "users-parent",
    submenu: [
      { name: "Cargos", icon: Wrench, key: "cargos" },
      { name: "Roles", icon: UserCog, key: "roles" },
      { name: "Usuarios", icon: Users, key: "usuarios" },
    ]
  },
  {
    name: "Compras", icon: FolderOpen, key: "compras-parent",
    submenu: [
      { name: "Proveedores", icon: Building, key: "proveedores" },
      { name: "Facturas de Compra", icon: FileText, key: "facturas_compra" },
      { name: "SubAlquileres", icon: FileText, key: "subalquileres" },
    ]
  },
  {
    name: "Proyectos", icon: Building, key: "projects-parent",
    submenu: [
      { name: "Proyectos", icon: FolderKanban, key: "proyectos" },
      {
        name: "Maquinaria", icon: Wrench, key: "maquinaria-parent",
        submenu: [
          { name: "Maquinaria", icon: Wrench, key: "maquinaria" },
          /*{ name: "Vehículos", icon: Truck, key: "vehiculos" },
          { name: "Estado Máquina", icon: Wrench, key: "estados_maquinaria" },*/
          { name: "Categorías Máquina", icon: FileText, key: "categorias_maquinaria" },
          { name: "Mantenimientos", icon: Wrench, key: "mantenimientos" },
        ]
      },
      /*{
        name: "Pedidos", icon: FileText, key: "pedido-parent",
        submenu: [
          { name: "Pedidos", icon: FileText, key: "pedidos" },
          { name: "Estados de Pedido", icon: ShoppingCart, key: "estados-pedido" },
        ]
      },*/
      { name: "Pedidos", icon: FileText, key: "pedidos" },
    ]
  },
  {
    name: "Ventas", icon: ShoppingCart, key: "ventas-parent",
    submenu: [
      { name: "Clientes", icon: Users, key: "clientes" },
      { name: "Empleados", icon: Users, key: "empleados" },
      { name: "Tipos de Cobro", icon: ReceiptText, key: "tipos-cobro" },
    ]
  },
];

const keyToPath = (key) => key === 'dashboard' ? '/' : `/${key.replace(/_/g, '-')}`;

export function Sidebar({ collapsed, onToggleCollapse, onLogout, user, onNavigate }) {
  const [expandedMenus, setExpandedMenus] = useState([]);
  const location = useLocation();
  const { hasPermission } = useAuth();

  const permissionMap = {
    'usuarios': 'Listar Usuario',
    'cargos': 'Listar Cargo',
    'roles': 'Listar Rol',
    'proveedores': 'Listar Proveedor',
    'facturas_compra': 'Listar Factura de Compra',
    'subalquileres': 'Listar Subalquiler',
    'proyectos': 'Listar Proyecto',
    'maquinaria': 'Listar Maquinaria',
    'vehiculos': 'Listar Vehículo',
    'estados_maquinaria': 'Listar Estado de Maquinaria',
    'categorias_maquinaria': 'Listar Categoría de Maquinaria',
    'mantenimientos': 'Listar Mantenimiento',
    'pedidos': 'Listar Orden',
    'estados-pedido': 'Listar Estado de Orden',
    'clientes': 'Listar Cliente',
    'empleados': 'Listar Empleado',
    'tipos-cobro': 'Listar Tipo de Cargo'
  };

  const canAccess = (item) => {
    if (!user) return false;
    if (item.submenu) return item.submenu.some(sub => canAccess(sub));
    if (item.key === 'dashboard') return user.role_id === 1;
    
    const requiredPermission = permissionMap[item.key];
    return requiredPermission ? hasPermission(requiredPermission) : false;
  };

  const toggleMenu = (menuKey) => {
    setExpandedMenus(prev => prev.includes(menuKey) ? prev.filter(m => m !== menuKey) : [...prev, menuKey]);
  };

  const isMenuExpanded = (menuKey) => expandedMenus.includes(menuKey);
  const isMenuActive = (item) => location.pathname === keyToPath(item.key) || (item.submenu?.some(sub => isMenuActive(sub)));

  const renderMenuItem = (item, level = 0) => {
    const Icon = item.icon;
    const hasSubmenu = item.submenu && item.submenu.length > 0;
    const isExpanded = isMenuExpanded(item.key);
    const isActive = isMenuActive(item);

    return (
      <div key={item.key}>
        <button
          onClick={() => hasSubmenu ? toggleMenu(item.key) : onNavigate(keyToPath(item.key))}
          className={`sidebar-link ${hasSubmenu && isExpanded ? "menu-expanded" : ""} ${!hasSubmenu && isActive ? "active-page" : ""}`}
        >
          <span className="sidebar-icon"><Icon size={20} /></span>
          {!collapsed && (
            <>
              <span className="sidebar-label">{item.name}</span>
              {hasSubmenu && <span style={{ marginLeft: "auto" }}>{isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}</span>}
            </>
          )}
        </button>
        {hasSubmenu && !collapsed && isExpanded && (
          <div className="sidebar-submenu">
            {item.submenu.filter(canAccess).map(subItem => renderMenuItem(subItem, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <aside className={`sidebar ${collapsed ? "sidebar-closed" : "sidebar-open"}`}>
      <div className="sidebar-top">
        <div className="brand-wrapper">
          <div className="brand-logo">MK</div>
          {!collapsed && <div><p className="brand-title">Makand</p><p className="brand-subtitle">Control</p></div>}
        </div>
        <button className="sidebar-toggle" onClick={onToggleCollapse}>{collapsed ? <Menu size={20} /> : <X size={20} />}</button>
      </div>
      <nav className="sidebar-nav">
        {menuItems.filter(canAccess).map(item => renderMenuItem(item))}
      </nav>
      <div className="sidebar-footer">
        <div className="sidebar-user">
          <User size={18} />
          {!collapsed && (
            <div className="sidebar-user-info">
              <div className="sidebar-user-name">{user?.user_email || "Cargando..."}</div>
              <div className="sidebar-user-role">{user?.role_name || "Usuario"}</div>
            </div>
          )}
        </div>
        <button className="sidebar-logout" onClick={onLogout}><LogOut size={18} />{!collapsed && <span>Cerrar sesión</span>}</button>
      </div>
    </aside>
  );
}
