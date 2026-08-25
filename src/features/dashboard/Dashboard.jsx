import { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, AreaChart, Area
} from 'recharts';
import {
  Users, Briefcase, ShoppingCart, DollarSign,
  FolderOpen, Wrench, Package, TrendingUp,
  Clock, CheckCircle, AlertCircle, XCircle, Loader2,
  ArrowDownRight, Wallet, RefreshCw, ChevronRight,
  Activity
} from 'lucide-react';
import { apiClient } from '../../shared/services/api';
import './Dashboard.css';

const COLORS = {
  primary: '#6366f1',
  success: '#22c55e',
  warning: '#f59e0b',
  danger: '#ef4444',
  info: '#06b6d4',
  purple: '#8b5cf6',
  orange: '#ff6b35',
  pink: '#ec4899',
  emerald: '#10b981',
  slate: '#64748b',
};

const STATUS_COLORS = {
  'Cerrado': COLORS.slate,
  'Activo': COLORS.sucess,
  'Pendiente': COLORS.warning,
  'Anulado': COLORS.danger,
  'En espera': COLORS.info,
  'En reparación': COLORS.purple,
  'Disponible': COLORS.emerald,
  'En uso': COLORS.orange,
  'Mantenimiento': COLORS.slate,
};

const PIE_COLORS = [
  COLORS.primary, COLORS.success, COLORS.warning, COLORS.danger,
  COLORS.info, COLORS.purple, COLORS.orange, COLORS.pink, COLORS.emerald,
];

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiClient.get('/dashboard');
        setDashboardData(response.data);
      } catch (err) {
        console.error('Error cargando dashboard:', err);
        setError('Error al cargar los datos del dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatNumber = (value) => {
    return new Intl.NumberFormat('es-CO').format(value);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusColor = (status) => {
    return STATUS_COLORS[status] || COLORS.slate;
  };

  const getStatusIcon = (status) => {
    if (status === 'Cerrado' || status === 'Completado') return <CheckCircle size={14} />;
    if (status === 'Anulado') return <XCircle size={14} />;
    if (status === 'Pendiente' || status === 'En espera') return <Clock size={14} />;
    return <Activity size={14} />;
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="dashboard-loading">
          <Loader2 size={32} className="spinner" />
          <p>Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <div className="dashboard-error">
          <AlertCircle size={32} />
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Reintentar</button>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return null;
  }

  const { summary, financial, ordersByStatus, machineryByStatus, recentOrders, recentPayments } = dashboardData;

  const financialCards = [
    {
      title: 'Facturado Total',
      value: formatCurrency(financial.totalBilled),
      icon: Wallet,
      color: COLORS.primary,
      change: null,
    },
    {
      title: 'Pagos Recibidos',
      value: formatCurrency(financial.totalPaid),
      icon: CheckCircle,
      color: COLORS.success,
      change: null,
    },
    {
      title: 'Saldo Pendiente',
      value: formatCurrency(financial.totalPendingBalance),
      icon: AlertCircle,
      color: COLORS.warning,
      change: null,
    },
    {
      title: 'Ingresos Este Mes',
      value: formatCurrency(financial.revenueThisMonth),
      icon: TrendingUp,
      color: COLORS.emerald,
      change: null,
    },
  ];

  const summaryCards = [
    { title: 'Pedidos', value: summary.totalOrders, icon: ShoppingCart, color: COLORS.primary, view: 'pedidos' },
    { title: 'Clientes', value: summary.totalCustomers, icon: Users, color: COLORS.info, view: 'clientes' },
    { title: 'Empleados', value: summary.totalEmployees, icon: Briefcase, color: COLORS.success, view: 'empleados' },
    { title: 'Maquinaria', value: summary.totalMachinery, icon: Wrench, color: COLORS.orange, view: 'maquinaria' },
    { title: 'Proveedores', value: summary.totalSuppliers, icon: Package, color: COLORS.purple, view: 'proveedores' },
    { title: 'Proyectos', value: summary.totalProjects, icon: FolderOpen, color: COLORS.pink, view: 'proyectos' },
  ];

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Dashboard</h1>
          <p className="dashboard-subtitle">Resumen general del sistema Makand</p>
        </div>
        <div className="dashboard-actions">
          <button className="btn-refresh" onClick={() => window.location.reload()}>
            <RefreshCw size={16} />
            Actualizar
          </button>
        </div>
      </div>

      <div className="dashboard-tabs">
        <button
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <Activity size={16} />
          Vista General
        </button>
        <button
          className={`tab-btn ${activeTab === 'financial' ? 'active' : ''}`}
          onClick={() => setActiveTab('financial')}
        >
          <DollarSign size={16} />
          Finanzas
        </button>
        <button
          className={`tab-btn ${activeTab === 'activity' ? 'active' : ''}`}
          onClick={() => setActiveTab('activity')}
        >
          <Clock size={16} />
          Actividad Reciente
        </button>
      </div>

      {activeTab === 'overview' && (
        <div className="dashboard-overview">
          <div className="financial-grid">
            {financialCards.map((card) => (
              <div key={card.title} className="financial-card">
                <div className="financial-card-header">
                  <span className="financial-card-title">{card.title}</span>
                  <div className="financial-card-icon" style={{ backgroundColor: `${card.color}15`, color: card.color }}>
                    <card.icon size={20} />
                  </div>
                </div>
                <div className="financial-card-value" style={{ color: card.color }}>
                  {card.value}
                </div>
              </div>
            ))}
          </div>

          <div className="charts-grid">
            <div className="chart-card">
              <div className="chart-card-header">
                <h3 className="chart-card-title">Pedidos por Estado</h3>
                <span className="chart-card-badge">{formatNumber(summary.totalOrders)} total</span>
              </div>
              <div className="chart-wrapper">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={ordersByStatus} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="statusName" tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={{ stroke: '#e5e7eb' }} />
                    <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={{ stroke: '#e5e7eb' }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#ffffff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '12px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                      }}
                    />
                    <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                       {ordersByStatus.map((entry) => (
                        <Cell key={entry.statusName} fill={getStatusColor(entry.statusName)} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="chart-card">
              <div className="chart-card-header">
                <h3 className="chart-card-title">Maquinaria por Estado</h3>
                <span className="chart-card-badge">{formatNumber(summary.totalMachinery)} total</span>
              </div>
              <div className="chart-wrapper">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={machineryByStatus}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={110}
                      paddingAngle={3}
                      dataKey="count"
                      nameKey="statusName"
                    >
                      {machineryByStatus.map((entry, index) => (
                        <Cell key={entry.statusName} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#ffffff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '12px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                      }}
                    />
                    <Legend
                      verticalAlign="bottom"
                      height={36}
                      iconType="circle"
                      iconSize={10}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="summary-grid">
            {summaryCards.map((card) => (
              <div key={card.title} className="summary-card">
                <div className="summary-card-icon" style={{ backgroundColor: `${card.color}15`, color: card.color }}>
                  <card.icon size={22} />
                </div>
                <div className="summary-card-info">
                  <span className="summary-card-value">{formatNumber(card.value)}</span>
                  <span className="summary-card-label">{card.title}</span>
                </div>
                <ChevronRight size={16} className="summary-card-arrow" />
              </div>
            ))}
          </div>

          <div className="activity-grid">
            <div className="activity-card">
              <div className="activity-card-header">
                <h3 className="activity-card-title">Pedidos Recientes</h3>
                <button className="btn-view-all">Ver todos</button>
              </div>
              <div className="activity-table-wrapper">
                <table className="activity-table">
                  <thead>
                    <tr>
                      <th>Pedido</th>
                      <th>Proyecto</th>
                      <th>Cliente</th>
                      <th>Estado</th>
                      <th>Fecha</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order) => (
                      <tr key={order.order_id}>
                        <td className="order-id">#{order.order_id}</td>
                        <td>{order.project_name || 'N/A'}</td>
                        <td>{order.customer_name}</td>
                        <td>
                          <span className="status-badge" style={{ backgroundColor: `${getStatusColor(order.statusName)}20`, color: getStatusColor(order.statusName) }}>
                            {getStatusIcon(order.statusName)}
                            <span>{order.statusName}</span>
                          </span>
                        </td>
                        <td>{formatDate(order.order_creation_date)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="activity-card">
              <div className="activity-card-header">
                <h3 className="activity-card-title">Pagos Recientes</h3>
                <button className="btn-view-all">Ver todos</button>
              </div>
              <div className="activity-table-wrapper">
                <table className="activity-table">
                  <thead>
                    <tr>
                      <th>Pago ID</th>
                      <th>Pedido</th>
                      <th>Monto</th>
                      <th>Fecha</th>
                      <th>Efectivo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentPayments.map((payment) => (
                      <tr key={payment.payment_id}>
                        <td className="order-id">#{payment.payment_id}</td>
                        <td>#{payment.order_id}</td>
                        <td className="payment-amount">{formatCurrency(payment.payment_amount)}</td>
                        <td>{formatDate(payment.payment_date)}</td>
                        <td>
                          <span className={`cash-badge ${payment.payment_in_cash ? 'cash' : 'transfer'}`}>
                            {payment.payment_in_cash ? 'Efectivo' : 'Transferencia'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'financial' && (
        <div className="dashboard-financial">
          <div className="financial-hero">
            <div className="financial-hero-card primary">
              <div className="financial-hero-icon">
                <Wallet size={32} />
              </div>
              <div>
                <span className="financial-hero-label">Total Facturado</span>
                <span className="financial-hero-value">{formatCurrency(financial.totalBilled)}</span>
              </div>
            </div>
            <div className="financial-hero-card success">
              <div className="financial-hero-icon">
                <CheckCircle size={32} />
              </div>
              <div>
                <span className="financial-hero-label">Total Pagado</span>
                <span className="financial-hero-value">{formatCurrency(financial.totalPaid)}</span>
              </div>
            </div>
            <div className="financial-hero-card warning">
              <div className="financial-hero-icon">
                <AlertCircle size={32} />
              </div>
              <div>
                <span className="financial-hero-label">Saldo Pendiente</span>
                <span className="financial-hero-value">{formatCurrency(financial.totalPendingBalance)}</span>
              </div>
            </div>
            <div className="financial-hero-card emerald">
              <div className="financial-hero-icon">
                <TrendingUp size={32} />
              </div>
              <div>
                <span className="financial-hero-label">Ingresos Este Mes</span>
                <span className="financial-hero-value">{formatCurrency(financial.revenueThisMonth)}</span>
              </div>
            </div>
          </div>

          <div className="chart-card full-width">
            <div className="chart-card-header">
              <h3 className="chart-card-title">Resumen Financiero</h3>
            </div>
            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={[
                  { name: 'Facturado', value: financial.totalBilled, fill: COLORS.primary },
                  { name: 'Pagos', value: financial.totalPaid, fill: COLORS.success },
                  { name: 'Pendiente', value: financial.totalPendingBalance, fill: COLORS.warning },
                  { name: 'Mes Actual', value: financial.revenueThisMonth, fill: COLORS.emerald },
                ]} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#6b7280' }} />
                  <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '12px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    }}
                    formatter={(value) => [formatCurrency(value), 'Monto']}
                  />
                  <Area type="monotone" dataKey="value" stroke="#6366f1" fill="#6366f1" fillOpacity={0.1} strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'activity' && (
        <div className="dashboard-activity">
          <div className="activity-grid">
            <div className="activity-card">
              <div className="activity-card-header">
                <h3 className="activity-card-title">Últimos Pedidos</h3>
              </div>
              <div className="activity-table-wrapper">
                <table className="activity-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Proyecto</th>
                      <th>Cliente</th>
                      <th>Estado</th>
                      <th>Fecha</th>
                      
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order) => (
                      <tr key={order.order_id}>
                        <td className="order-id">#{order.order_id}</td>
                        <td>{order.project_name || 'N/A'}</td>
                        <td>{order.customer_name}</td>
                        <td>
                          <span className="status-badge" style={{ backgroundColor: `${getStatusColor(order.statusName)}20`, color: getStatusColor(order.statusName) }}>
                            {getStatusIcon(order.statusName)}
                            <span>{order.statusName}</span>
                          </span>
                        </td>
                        <td>{formatDate(order.order_creation_date)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="activity-card">
              <div className="activity-card-header">
                <h3 className="activity-card-title">Últimos Pagos</h3>
              </div>
              <div className="activity-table-wrapper">
                <table className="activity-table">
                  <thead>
                    <tr>
                      <th>ID Pago</th>
                      <th>Pedido</th>
                      <th>Monto</th>
                      <th>Fecha</th>
                      <th>Efectivo</th>
                      <th>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentPayments.map((payment) => (
                      <tr key={payment.payment_id}>
                        <td className="order-id">#{payment.payment_id}</td>
                        <td>#{payment.order_id}</td>
                        <td className="payment-amount">{formatCurrency(payment.payment_amount)}</td>
                        <td>{formatDate(payment.payment_date)}</td>
                        <td>
                          <span className={`cash-badge ${payment.payment_in_cash ? 'cash' : 'transfer'}`}>
                            {payment.payment_in_cash ? 'Efectivo' : 'Transferencia'}
                          </span>
                        </td>
                        <td>
                          {payment.is_cancelled ? (
                            <span className="status-badge" style={{ backgroundColor: `${COLORS.danger}20`, color: COLORS.danger }}>
                              <XCircle size={14} /> Anulado
                            </span>
                          ) : (
                            <span className="status-badge" style={{ backgroundColor: `${COLORS.success}20`, color: COLORS.success }}>
                              <CheckCircle size={14} /> Activo
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;