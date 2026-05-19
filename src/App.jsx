import { useState } from 'react';
import { Sidebar } from './shared/components/sidebar/SideBar';
import VehiculosPage from './features/vehicles/pages/VehiculosPage';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('vehiculos');
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="app-layout">
      <Sidebar
        currentView={currentView}
        onViewChange={(view) => setCurrentView(view)}
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed(!collapsed)}
      />

      <main className={`main-content${collapsed ? ' main-content--collapsed' : ''}`}>
        {currentView === 'vehiculos' ? (
          <VehiculosPage />
        ) : (
          <div className="construction-notice">
            <h1>Vista de <span className="capitalize-name">{currentView}</span> en construcción</h1>
            <p>Usa la barra lateral para volver a Vehículos.</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;