import { useState, useEffect } from 'react';
import { Wrench, Users, ShoppingCart, ClipboardList, DollarSign, FolderOpen, Car, Briefcase, UserCheck, Package } from 'lucide-react';
import './Dashboard.css';

export const Dashboard = () => {
  const [stats, setStats] = useState({
    maquinaria: 0,
    proveedores: 0,
    pedidos: 0,
    mantenimientos: 0,
    tiposCobro: 0,
    proyectos: 0,
    clientes: 0,
    empleados: 0,
    vehiculos: 0,
    facturasCompra: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const endpoints = [
          { key: 'maquinaria', url: 'http://localhost:3000/api/machines/table' },
          { key: 'proveedores', url: 'http://localhost:3000/api/suppliers/table' },
          { key: 'pedidos', url: 'http://localhost:3000/api/orders' },
          { key: 'mantenimientos', url: 'http://localhost:3000/api/maintenances' },
          { key: 'tiposCobro', url: 'http://localhost:3000/api/chargetypes' },
          { key: 'proyectos', url: 'http://localhost:3000/api/projects' },
          { key: 'clientes', url: 'http://localhost:3000/api/customers/table' },
          { key: 'empleados', url: 'http://localhost:3000/api/employees/table' },
          { key: 'vehiculos', url: 'http://localhost:3000/api/vehicles' },
          { key: 'facturasCompra', url: 'http://localhost:3000/api/purchase-invoices' },
        ];

        const parse = async (url) => {
          try {
            const res = await fetch(url);
            if (!res.ok) return [];
            const data = await res.json();
            return Array.isArray(data) ? data : [];
          } catch {
            return [];
          }
        };

        const resultados = await Promise.all(endpoints.map(e => parse(e.url)));

        setStats({
          maquinaria: resultados[0].length,
          proveedores: resultados[1].length,
          pedidos: resultados[2].length,
          mantenimientos: resultados[3].length,
          tiposCobro: resultados[4].length,
          proyectos: resultados[5].length,
          clientes: resultados[6].length,
          empleados: resultados[7].length,
          vehiculos: resultados[8].length,
          facturasCompra: resultados[9].length,
        });
      } catch (err) {
        console.error('Error cargando dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, []);

  const tarjetas = [
    { titulo: 'Clientes', valor: stats.clientes, icono: Users, color: '#3b82f6', vista: 'clientes' },
    { titulo: 'Proveedores', valor: stats.proveedores, icono: Briefcase, color: '#8b5cf6', vista: 'proveedores' },
    { titulo: 'Empleados', valor: stats.empleados, icono: UserCheck, color: '#10b981', vista: 'empleados' },
    { titulo: 'Maquinaria', valor: stats.maquinaria, icono: Wrench, color: '#ff6b35', vista: 'maquinaria' },
    { titulo: 'Vehículos', valor: stats.vehiculos, icono: Car, color: '#f59e0b', vista: 'vehiculos' },
    { titulo: 'Proyectos', valor: stats.proyectos, icono: FolderOpen, color: '#ec4899', vista: 'proyectos' },
    { titulo: 'Pedidos', valor: stats.pedidos, icono: ShoppingCart, color: '#06b6d4', vista: 'pedidos' },
    { titulo: 'Mantenimientos', valor: stats.mantenimientos, icono: ClipboardList, color: '#ef4444', vista: 'mantenimientos' },
    { titulo: 'Tipos de Cobro', valor: stats.tiposCobro, icono: DollarSign, color: '#84cc16', vista: 'tipos-cobro' },
    { titulo: 'Facturas Compra', valor: stats.facturasCompra, icono: Package, color: '#6366f1', vista: 'facturas_compra' },
  ];

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Dashboard</h1>
          <p className="dashboard-subtitle">Resumen general del sistema Makand</p>
        </div>
      </div>

      {loading ? (
        <div className="dashboard-loading">
          <div className="loading-spinner"></div>
          <p>Cargando datos...</p>
        </div>
      ) : (
        <div className="stats-grid">
          {tarjetas.map((item) => (
            <div key={item.titulo} className="stat-card">
              <div className="stat-icon" style={{ backgroundColor: `${item.color}15`, color: item.color }}>
                <item.icono size={28} />
              </div>
              <div className="stat-info">
                <span className="stat-value">{item.valor}</span>
                <span className="stat-label">{item.titulo}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;