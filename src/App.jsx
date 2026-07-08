// // import { useState } from 'react';
// // import { Sidebar } from './shared/components/sidebar/SideBar';
// // import { AuthProvider } from "./shared/context/AuthContext"; // Importación correcta
// // import CustomerPage from './features/customers/pages/CustomerPage/CustomerPage';
// // import SupplierPage from './features/suppliers/pages/SupplierPage';
// // import VehiculosPage from './features/vehicles/pages/VehiculosPage';
// // import MachineryStatusPage from './features/machinery_status/pages/MachineryStatusPage';
// // import MachineryCategoryPage from './features/machinery_category/pages/MachineryCategoryPage';
// // import MachineryPage from './features/machinery/pages/MachineryPage';
// // import PositionPage from './features/positions/pages/PositionPage';
// // import EmployeePage from './features/employees/pages/EmployeePage';
// // import PurchaseInvoicePage from './features/purchase_invoices/pages/PurchaseInvoicePage';
// // import SubRentalPage from './features/sub_rental/pages/SubRentalPage';
// // import OrderPage from './features/orders/pages/OrderPage';
// // import ProjectsPage from './features/projects/pages/ProjectsPage';
// // import ChargeTypesPage from './features/charge-types/pages/ChargeTypesPage';
// // import MaintenancesPage from './features/maintenances/pages/MaintenancesPage';
// // import UsersPage from './features/users/pages/UsersPage';
// // import OrderStatusPage from './features/order-status/pages/OrderStatusPage';
// // import Dashboard from './features/dashboard/Dashboard'; 
// // import RolePage from './features/roles/pages/RolePage'; 
// // import LoginPage from './features/login/pages/loginPage';
// // import './App.css';

// // // Componente interno para separar la lógica de autenticación
// // function AppContent() {
// //   const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));
// //   const [currentView, setCurrentView] = useState('dashboard');
// //   const [collapsed, setCollapsed] = useState(false);

// //   const handleLogin = () => {
// //     setIsAuthenticated(true);
// //   };

// //   const handleLogout = () => {
// //     localStorage.removeItem("token");
// //     localStorage.removeItem("user"); // También limpiamos el usuario del contexto
// //     setIsAuthenticated(false);
// //   };

// //   const renderContent = () => {
// //     switch (currentView) {
// //       case 'dashboard': return <Dashboard />;
// //       case 'clientes': return <CustomerPage />;
// //       case 'proveedores': return <SupplierPage />;
// //       case 'vehiculos': return <VehiculosPage />;
// //       case 'estados_maquinaria': return <MachineryStatusPage />;
// //       case 'categorias_maquinaria': return <MachineryCategoryPage />;
// //       case 'maquinaria': return <MachineryPage />;
// //       case 'cargos': return <PositionPage />;
// //       case 'empleados': return <EmployeePage />;
// //       case 'facturas_compra': return <PurchaseInvoicePage />;
// //       case 'subalquileres': return <SubRentalPage />;
// //       case 'pedidos': return <OrderPage />;
// //       case 'proyectos': return <ProjectsPage />;
// //       case 'tipos-cobro': return <ChargeTypesPage />;
// //       case 'mantenimientos': return <MaintenancesPage />;
// //       case 'usuarios': return <UsersPage />;
// //       case 'estados-pedido': return <OrderStatusPage />;
// //       case 'roles': return <RolePage />;

// //       default: return <div className="p-6"><h1>Seleccione una opción</h1></div>;
// //     }
// //   };

// //   if (!isAuthenticated) {
// //     return <LoginPage onLogin={handleLogin} />;
// //   }

// //   return (
// //     <div className="app-layout" style={{ display: 'flex', minHeight: '100vh' }}>
// //       <Sidebar
// //         currentView={currentView}
// //         onViewChange={setCurrentView}
// //         collapsed={collapsed}
// //         onToggleCollapse={() => setCollapsed(!collapsed)}
// //         onLogout={handleLogout}
// //       />
// //       <main style={{ flex: 1, background: '#f4f4f4' }}>
// //         {renderContent()}
// //       </main>
// //     </div>
// //   );
// // }

// // // Componente principal que envuelve todo en el Provider
// // function App() {
// //   return (
// //     <AuthProvider>
// //       <AppContent />
// //     </AuthProvider>
// //   );
// // }

// // export default App;





// import { useState } from 'react';
// import { Sidebar } from './shared/components/sidebar/SideBar';
// import { AuthProvider } from "./shared/context/AuthContext";
// import CustomerPage from './features/customers/pages/CustomerPage/CustomerPage';
// import SupplierPage from './features/suppliers/pages/SupplierPage';
// import VehiculosPage from './features/vehicles/pages/VehiculosPage';
// import MachineryStatusPage from './features/machinery_status/pages/MachineryStatusPage';
// import MachineryCategoryPage from './features/machinery_category/pages/MachineryCategoryPage';
// import MachineryPage from './features/machinery/pages/MachineryPage';
// import PositionPage from './features/positions/pages/PositionPage';
// import EmployeePage from './features/employees/pages/EmployeePage';
// import PurchaseInvoicePage from './features/purchase_invoices/pages/PurchaseInvoicePage';
// import SubRentalPage from './features/sub_rental/pages/SubRentalPage';
// import OrderPage from './features/orders/pages/OrderPage';
// import ProjectsPage from './features/projects/pages/ProjectsPage';
// import ChargeTypesPage from './features/charge-types/pages/ChargeTypesPage';
// import MaintenancesPage from './features/maintenances/pages/MaintenancesPage';
// import UsersPage from './features/users/pages/UsersPage';
// import OrderStatusPage from './features/order-status/pages/OrderStatusPage';
// import Dashboard from './features/dashboard/Dashboard'; 
// import RolePage from './features/roles/pages/RolePage'; 
// import LoginPage from './features/login/pages/loginPage';
// import './App.css';

// function AppContent() {
//   const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));
//   const [currentView, setCurrentView] = useState('dashboard');
//   const [collapsed, setCollapsed] = useState(false);
  
//   // Estado para el usuario, inicializado desde localStorage
//   const [user, setUser] = useState(() => {
//     const savedUser = localStorage.getItem("user");
//     if (savedUser) {
//       try {
//         return JSON.parse(savedUser);
//       } catch (e) {
//         console.error("Error al parsear el usuario:", e);
//         return { name: "Usuario", role: "Sin rol" };
//       }
//     }
//     return { name: "Usuario", role: "Sin rol" };
//   });


//   const handleLogin = () => {
//     setIsAuthenticated(true);
//     // Lee directamente el valor actualizado tras el login
//     const savedUser = localStorage.getItem("user");
//     if (savedUser) {
//       setUser(JSON.parse(savedUser));
//     }
//   };
//   console.log("Usuario que recibe el Sidebar:", user);
  

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     setIsAuthenticated(false);
//     setUser({ name: "Usuario", role: "Sin rol" });
//   };

//   const renderContent = () => {
//     switch (currentView) {
//       case 'dashboard': return <Dashboard />;
//       case 'clientes': return <CustomerPage />;
//       case 'proveedores': return <SupplierPage />;
//       case 'vehiculos': return <VehiculosPage />;
//       case 'estados_maquinaria': return <MachineryStatusPage />;
//       case 'categorias_maquinaria': return <MachineryCategoryPage />;
//       case 'maquinaria': return <MachineryPage />;
//       case 'cargos': return <PositionPage />;
//       case 'empleados': return <EmployeePage />;
//       case 'facturas_compra': return <PurchaseInvoicePage />;
//       case 'subalquileres': return <SubRentalPage />;
//       case 'pedidos': return <OrderPage />;
//       case 'proyectos': return <ProjectsPage />;
//       case 'tipos-cobro': return <ChargeTypesPage />;
//       case 'mantenimientos': return <MaintenancesPage />;
//       case 'usuarios': return <UsersPage />;
//       case 'estados-pedido': return <OrderStatusPage />;
//       case 'roles': return <RolePage />;
//       default: return <div className="p-6"><h1>Seleccione una opción</h1></div>;
//     }
//   };

//   if (!isAuthenticated) {
//     return <LoginPage onLogin={handleLogin} />;
//   }

//   return (
//     <div className="app-layout" style={{ display: 'flex', minHeight: '100vh' }}>
//       <Sidebar
//         currentView={currentView}
//         onViewChange={setCurrentView}
//         collapsed={collapsed}
//         onToggleCollapse={() => setCollapsed(!collapsed)}
//         onLogout={handleLogout}
//         user={user} 
//       />
//       <main style={{ flex: 1, background: '#f4f4f4' }}>
//         {renderContent()}
//       </main>
//     </div>
//   );
// }

// function App() {
//   return (
//     <AuthProvider>
//       <AppContent />
//     </AuthProvider>
//   );
// }

// export default App;





import { useState } from 'react';
import { Sidebar } from './shared/components/sidebar/SideBar';
import { AuthProvider } from "./shared/context/AuthContext";
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
import Dashboard from './features/dashboard/Dashboard'; 
import RolePage from './features/roles/pages/RolePage'; 
import LoginPage from './features/login/pages/loginPage';
import './App.css';

function AppContent() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));
  const [currentView, setCurrentView] = useState('dashboard');
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
      <Sidebar
        currentView={currentView}
        onViewChange={setCurrentView}
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed(!collapsed)}
        onLogout={handleLogout}
        user={user} 
      />
      <main style={{ flex: 1, background: '#f4f4f4' }}>
        {renderContent()}
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;