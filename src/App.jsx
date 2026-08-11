import { useState, lazy, Suspense } from 'react';
import { AuthProvider } from "./shared/context/AuthContext";
import { AlertModalProvider } from "./shared/alertModal";
import LoginPage from './features/login/pages/loginPage';
import './App.css';
import './shared/alertModal/AlertModal.css';

const Sidebar = lazy(() => import('./shared/components/sidebar/SideBar').then(module => ({ default: module.Sidebar })));

const CustomerPage = lazy(() => import('./features/customers/pages/CustomerPage/CustomerPage'));
const SupplierPage = lazy(() => import('./features/suppliers/pages/SupplierPage'));
const VehiculosPage = lazy(() => import('./features/vehicles/pages/VehiculosPage'));
const MachineryStatusPage = lazy(() => import('./features/machinery_status/pages/MachineryStatusPage'));
const MachineryCategoryPage = lazy(() => import('./features/machinery_category/pages/MachineryCategoryPage'));
const MachineryPage = lazy(() => import('./features/machinery/pages/MachineryPage'));
const PositionPage = lazy(() => import('./features/positions/pages/PositionPage'));
const EmployeePage = lazy(() => import('./features/employees/pages/EmployeePage'));
const PurchaseInvoicePage = lazy(() => import('./features/purchase_invoices/pages/PurchaseInvoicePage'));
const SubRentalPage = lazy(() => import('./features/sub_rental/pages/SubRentalPage'));
const OrderPage = lazy(() => import('./features/orders/pages/OrderPage'));
const OrderWorkspace = lazy(() => import('./features/orders/components/OrderWorkspace/OrderWorkspace'));
const ProjectsPage = lazy(() => import('./features/projects/pages/ProjectsPage'));
const ChargeTypesPage = lazy(() => import('./features/charge-types/pages/ChargeTypesPage'));
const MaintenancesPage = lazy(() => import('./features/maintenances/pages/MaintenancesPage'));
const UsersPage = lazy(() => import('./features/users/pages/UsersPage'));
const OrderStatusPage = lazy(() => import('./features/order-status/pages/OrderStatusPage'));
const Dashboard = lazy(() => import('./features/dashboard/Dashboard'));
const RolePage = lazy(() => import('./features/roles/pages/RolePage'));
const ResetPasswordPage = lazy(() => import('./features/login/pages/ResetPasswordPage'));

function LoadingFallback() {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      color: '#6b7280',
      fontSize: '14px'
    }}>
      Cargando...
    </div>
  );
}

function AppContent() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));
  const [currentView, setCurrentView] = useState('dashboard');
  const [collapsed, setCollapsed] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : { name: "Usuario", role: "Sin rol" };
  });

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

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard': return <Dashboard />;
      case 'clientes': return <CustomerPage />;
      case 'proveedores': return <SupplierPage />;
      case 'vehiculos': return <VehiculosPage />;
      case 'estados_maquinaria': return <MachineryStatusPage />;
      case 'categorias_maquinaria': return <MachineryCategoryPage />;
      case 'maquinaria': return <MachineryPage />;
      case 'cargos': return <PositionPage />;
      case 'empleados': return <EmployeePage />;
      case 'facturas_compra': return <PurchaseInvoicePage />;
      case 'subalquileres': return <SubRentalPage />;
      
      case "pedidos":
        return (
          <OrderPage
              onOpenWorkspace={(orderId) => {
                  setSelectedOrderId(orderId);
                  setCurrentView("pedido-workspace");
              }}
          />
        );

      case "pedido-workspace":
        return (
          <OrderWorkspace
              orderId={selectedOrderId}
              onBack={() => {
                  setSelectedOrderId(null);
                  setCurrentView("pedidos");
              }}
          />
        );
      
      case 'proyectos': return <ProjectsPage />;
      case 'tipos-cobro': return <ChargeTypesPage />;
      case 'mantenimientos': return <MaintenancesPage />;
      case 'usuarios': return <UsersPage />;
      case 'estados-pedido': return <OrderStatusPage />;
      case 'roles': return <RolePage />;
      
      default: return <div className="p-6"><h1>Seleccione una opción</h1></div>;
    }
  };

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="app-layout" style={{ display: 'flex', minHeight: '100vh' }}>
      <Suspense fallback={<div style={{ width: 280, minHeight: '100vh', background: '#ffffff', borderRight: '1px solid #e5e7eb' }} />}>
        <Sidebar
          currentView={currentView}
          onViewChange={setCurrentView}
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed(!collapsed)}
          onLogout={handleLogout}
          user={user} 
        />
      </Suspense>
      <main style={{ flex: 1, background: '#f4f4f4' }}>
        <Suspense fallback={<LoadingFallback />}>
          {renderContent()}
        </Suspense>
      </main>
    </div>
  );
}

function App() {
  // Verificamos si la URL actual trae un token de recuperación de contraseña
  const queryParams = new URLSearchParams(window.location.search);
  const hasResetToken = queryParams.has("token");
  return (
    <AuthProvider>
      <AlertModalProvider>
      {hasResetToken ? (
        <Suspense fallback={<LoadingFallback />}>
          <ResetPasswordPage />
        </Suspense>
      ) : (
        <AppContent />
      )}
      </AlertModalProvider>
    </AuthProvider>
  );
}

export default App;
