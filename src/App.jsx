import { useState } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { Sidebar } from './shared/components/sidebar/SideBar';
import { AuthProvider } from "./shared/context/AuthContext";
import { AlertModalProvider } from "./shared/alertModal";
import CustomerPage from './features/customers/pages/CustomerPage/CustomerPage';
import SupplierPage from './features/suppliers/pages/SupplierPage';
import VehiculosPage from './features/vehicles/pages/VehiculosPage';
import MachineryStatusPage from './features/machinery_status/pages/MachineryStatusPage';
import MachineryCategoryPage from './features/machinery_category/pages/MachineryCategoryPage';
import MachineryPage from './features/machinery/pages/MachineryPage';
import PositionPage from './features/positions/pages/PositionPage';
import EmployeePage from './features/employees/pages/EmployeePage';
import PurchaseInvoicePage from './features/purchase_invoices/pages/PurchaseInvoicePage';
import SubRentalPage from './features/sub_rental/pages/SubRentalPage';
import OrderPage from './features/orders/pages/OrderPage';
import ProjectsPage from './features/projects/pages/ProjectsPage';
import ChargeTypesPage from './features/charge-types/pages/ChargeTypesPage';
import MaintenancesPage from './features/maintenances/pages/MaintenancesPage';
import UsersPage from './features/users/pages/UsersPage';
import OrderStatusPage from './features/order-status/pages/OrderStatusPage';
import OrderWorkspace from "./features/orders/components/OrderWorkspace/OrderWorkspace";
import OrderRegisterPage from "./features/orders/components/OrderForm/orderRegisterPage";
import Dashboard from './features/dashboard/Dashboard'; 
import RolePage from './features/roles/pages/RolePage'; 
import LoginPage from './features/login/pages/loginPage';
import ResetPasswordPage from "./features/login/pages/ResetPasswordPage";
import './App.css';
import './shared/alertModal/AlertModal.css';

function AppContent() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));
  const [collapsed, setCollapsed] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : { name: "Usuario", role: "Sin rol" };
  });

  console.log("DEBUG - Usuario actual:", user);

  const handleLogin = () => {
    setIsAuthenticated(true);
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    setUser({ name: "Usuario", role: "Sin rol" });
  };

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="app-layout" style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed(!collapsed)}
        onLogout={handleLogout}
        user={user}
        onNavigate={navigate}
      />
      <main style={{ flex: 1, background: '#f4f4f4' }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/clientes" element={<CustomerPage />} />
          <Route path="/proveedores" element={<SupplierPage />} />
          <Route path="/vehiculos" element={<VehiculosPage />} />
          <Route path="/estados-maquinaria" element={<MachineryStatusPage />} />
          <Route path="/categorias-maquinaria" element={<MachineryCategoryPage />} />
          <Route path="/maquinaria" element={<MachineryPage />} />
          <Route path="/cargos" element={<PositionPage />} />
          <Route path="/empleados" element={<EmployeePage />} />
          <Route path="/facturas-compra" element={<PurchaseInvoicePage />} />
          <Route path="/subalquileres" element={<SubRentalPage />} />
          <Route path="/pedidos" element={
            <OrderPage
              onOpenWorkspace={(orderId) => {
                setSelectedOrderId(orderId);
                navigate("/pedido-workspace");
              }}
            />
          } />
          <Route path="/pedido-workspace" element={
            <OrderWorkspace
              orderId={selectedOrderId}
              onBack={() => {
                setSelectedOrderId(null);
                navigate("/pedidos");
              }}
            />
          } />
          <Route path="/pedido-registro" element={
            <OrderRegisterPage
              onBack={() => {
                navigate("/pedidos");
              }}
            />
          } />
          <Route path="/proyectos" element={<ProjectsPage />} />
          <Route path="/tipos-cobro" element={<ChargeTypesPage />} />
          <Route path="/mantenimientos" element={<MaintenancesPage />} />
          <Route path="/usuarios" element={<UsersPage />} />
          <Route path="/estados-pedido" element={<OrderStatusPage />} />
          <Route path="/roles" element={<RolePage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  const queryParams = new URLSearchParams(window.location.search);
  const hasResetToken = queryParams.has("token");
  return (
    <AuthProvider>
      <AlertModalProvider>
      {hasResetToken ? (
        <ResetPasswordPage />
      ) : (
        <AppContent />
      )}
      </AlertModalProvider>
    </AuthProvider>
  );
}

export default App;
