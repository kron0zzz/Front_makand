import { useState } from 'react';

import { Sidebar } from './shared/components/sidebar/SideBar';

import CustomerPage from './features/customers/pages/CustomerPage/CustomerPage';
import SupplierPage from './features/suppliers/pages/SupplierPage';
import VehiculosPage from './features/vehicles/pages/VehiculosPage';
import MachineryStatusPage from './features/machinery_status/pages/MachineryStatusPage';
import MachineryCategoryPage from './features/machinery_category/pages/MachineryCategoryPage';
import MachineryPage from './features/machinery/pages/MachineryPage';
import PositionPage from './features/positions/pages/PositionPage';

import LoginPage from './features/login/pages/loginPage';

import './App.css';

function App() {

  // Estado login
  const [isAuthenticated, setIsAuthenticated] =
    useState(false);

  // Estado sidebar
  const [currentView, setCurrentView] =
    useState('dashboard');

  const [collapsed, setCollapsed] =
    useState(false);

  // Login exitoso
  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  // Logout
  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  // Render dinámico del contenido
  const renderContent = () => {

    switch (currentView) {

      case 'dashboard':
        return (
          <div className="p-6">
            <h1>Dashboard</h1>
          </div>
        );

      case 'clientes':
        return <CustomerPage />;

      case 'proveedores':
        return <SupplierPage />;

      case 'vehiculos':
        return <VehiculosPage />;

      case 'estados_maquinaria':
        return <MachineryStatusPage />;

      case 'categorias_maquinaria':
        return <MachineryCategoryPage />;

      case 'maquinaria':
        return <MachineryPage />;

      case 'cargos':
        return <PositionPage />;

      default:
        return (
          <div className="p-6">
            <h1>
              Seleccione una opción
            </h1>
          </div>
        );
    }
  };

  // Si NO está autenticado
  // renderiza login
  if (!isAuthenticated) {
    return (
      <LoginPage
        onLogin={handleLogin}
      />
    );
  }

  // Si está autenticado
  // renderiza sistema
  return (
    <div
      className="app-layout"
      style={{
        display: 'flex',
        minHeight: '100vh',
      }}
    >

      <Sidebar
        currentView={currentView}
        onViewChange={setCurrentView}
        collapsed={collapsed}
        onToggleCollapse={() =>
          setCollapsed(!collapsed)
        }
        onLogout={handleLogout}
      />

      <main
        style={{
          flex: 1,
          background: '#f4f4f4',
        }}
      >
        {renderContent()}
      </main>

    </div>
  );
}

export default App;