
// import { Sidebar } from './shared/components/sidebar/SideBar'
// import './App.css'

// function App() {
  

//   return (
//     <>
//       <Sidebar/>
      
//     </>
//   )
// }

// export default App






















import { useState } from 'react';
import { Sidebar } from './shared/components/sidebar/SideBar';
import CustomerPage from './features/customers/pages/CustomerPage/CustomerPage';
import SupplierPage from './features/suppliers/pages/SupplierPage';
import VehiculosPage from './features/vehicles/pages/VehiculosPage';

import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [collapsed, setCollapsed] = useState(false);

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard': return <div className="p-6"><h1>Dashboard</h1></div>;
      case 'clientes': return <CustomerPage />; 
      case 'proveedores': return <SupplierPage />; 
      case 'vehiculos': return <VehiculosPage />; 
      default: return <div className="p-6"><h1>Seleccione una opción</h1></div>;
    }
  };

  return (
    <div className="app-layout" style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar 
        currentView={currentView} 
        onViewChange={setCurrentView} 
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed(!collapsed)}
      />
      <main style={{ flex: 1, background: '#f4f4f4' }}>
        {renderContent()}
      </main>
    </div>
  );
}

export default App;