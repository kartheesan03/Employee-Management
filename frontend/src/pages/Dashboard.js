import React, { useState, useEffect } from 'react';
import { FiPackage, FiUsers, FiShoppingCart, FiDollarSign, FiAlertTriangle, FiTrendingUp, FiUserCheck, FiClipboard } from 'react-icons/fi';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import Layout from '../components/layout/Layout';
import StatsCard from '../components/common/StatsCard';
import DataTable from '../components/common/DataTable';
import StatusBadge from '../components/common/StatusBadge';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { dashboardAPI } from '../services/api';
import './Dashboard.css';

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await dashboardAPI.getStats();
        setData(response.data);
      } catch (error) {
        console.error('Dashboard error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <Layout title="Dashboard"><LoadingSpinner /></Layout>;

  const stats = data?.stats || {};

  const materialChartData = {
    labels: ['In Stock', 'Low Stock', 'Out of Stock'],
    datasets: [{
      data: [
        stats.materials?.total - stats.materials?.lowStock || 0,
        stats.materials?.lowStock || 0,
        0,
      ],
      backgroundColor: ['#0d904f', '#e37400', '#d93025'],
      borderWidth: 0,
    }],
  };

  const pipelineData = {
    labels: (data?.salesPipeline || []).map(s => s.stage?.replace(/_/g, ' ')),
    datasets: [{
      label: 'Deal Value ($)',
      data: (data?.salesPipeline || []).map(s => parseFloat(s.total_value) || 0),
      backgroundColor: '#1a73e8',
      borderRadius: 6,
    }],
  };

  const recentOrderColumns = [
    { key: 'order_number', label: 'Order #' },
    { key: 'vendor', label: 'Vendor', render: (_, row) => row.vendor?.name || '-' },
    { key: 'net_amount', label: 'Amount', render: (val) => `$${parseFloat(val || 0).toLocaleString()}` },
    { key: 'status', label: 'Status', render: (val) => <StatusBadge status={val} /> },
  ];

  return (
    <Layout title="Dashboard">
      <div className="stats-grid">
        <StatsCard title="Total Materials" value={stats.materials?.total || 0} icon={FiPackage} color="primary" />
        <StatsCard title="Low Stock Alerts" value={stats.materials?.lowStock || 0} icon={FiAlertTriangle} color="warning" />
        <StatsCard title="Active Employees" value={stats.hr?.active || 0} icon={FiUsers} color="success" />
        <StatsCard title="Pending Leaves" value={stats.hr?.pendingLeaves || 0} icon={FiUserCheck} color="info" />
        <StatsCard title="Active Vendors" value={stats.erp?.vendors || 0} icon={FiShoppingCart} color="primary" />
        <StatsCard title="Pending Orders" value={stats.erp?.pendingOrders || 0} icon={FiClipboard} color="warning" />
        <StatsCard title="Total Customers" value={stats.crm?.customers || 0} icon={FiTrendingUp} color="success" />
        <StatsCard title="Revenue" value={`$${(stats.crm?.totalRevenue || 0).toLocaleString()}`} icon={FiDollarSign} color="danger" />
      </div>

      <div className="dashboard-charts">
        <div className="card">
          <div className="card-header">
            <h3>Material Stock Status</h3>
          </div>
          <div className="card-body chart-container">
            <Doughnut data={materialChartData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }} />
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3>Sales Pipeline</h3>
          </div>
          <div className="card-body chart-container">
            <Bar data={pipelineData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } }} />
          </div>
        </div>
      </div>

      <div className="dashboard-tables">
        <div className="card">
          <div className="card-header">
            <h3>Recent Purchase Orders</h3>
          </div>
          <DataTable columns={recentOrderColumns} data={data?.recentOrders || []} />
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
