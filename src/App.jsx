import { useState } from 'react';
// Ajuste de ruta: Según tu imagen 2e8318.png, Sidebar está en shared/components/sidebar/
import { Sidebar } from './shared/components/sidebar/Sidebar'; 
import VehiculosPage from './features/vehicles/pages/VehiculosPage';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('vehiculos');
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100%' }}>
      <Sidebar
        currentView={currentView}
        onViewChange={(view) => setCurrentView(view)}
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed(!collapsed)}
      />
      
      <main style={{ 
        flex: 1, 
        // El margen se ajusta dinámicamente según el estado del Sidebar
        marginLeft: collapsed ? '80px' : '260px', 
        transition: 'margin-left 0.3s ease-in-out',
        padding: '20px',
        backgroundColor: '#f4f7f6',
        minHeight: '100vh'
      }}>
        {/* Renderizado condicional de las vistas */}
        {currentView === 'vehiculos' ? (
          <VehiculosPage />
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-10 text-center">
            <h1 className="text-2xl font-bold text-gray-700">
              Vista de <span className="capitalize">{currentView}</span> en construcción
            </h1>
            <p className="text-gray-500 mt-2">Usa la barra lateral para volver a Vehículos.</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;