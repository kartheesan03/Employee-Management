import React, { useState, useEffect, useCallback } from 'react';
import { FiPlus, FiDollarSign } from 'react-icons/fi';
import Layout from '../components/layout/Layout';
import DataTable from '../components/common/DataTable';
import StatsCard from '../components/common/StatsCard';
import StatusBadge from '../components/common/StatusBadge';
import Modal from '../components/common/Modal';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { erpAPI } from '../services/api';
import { toast } from 'react-toastify';

const PurchaseOrders = () => {
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    order_number: '', vendor_id: '', order_date: new Date().toISOString().split('T')[0],
    expected_delivery: '', total_amount: 0, tax_amount: 0, net_amount: 0, notes: '',
  });

  const fetchData = useCallback(async () => {
    try {
      const [oRes, sRes] = await Promise.all([
        erpAPI.getPurchaseOrders({ status: statusFilter }),
        erpAPI.getStats(),
      ]);
      setOrders(oRes.data.orders);
      setStats(sRes.data.stats);
    } catch (error) {
      toast.error('Failed to load purchase orders');
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await erpAPI.createPurchaseOrder(form);
      toast.success('Purchase order created');
      setShowModal(false);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Operation failed');
    }
  };

  const columns = [
    { key: 'order_number', label: 'Order #' },
    { key: 'vendor', label: 'Vendor', render: (_, row) => row.vendor?.name || '-' },
    { key: 'order_date', label: 'Order Date' },
    { key: 'expected_delivery', label: 'Expected Delivery' },
    { key: 'net_amount', label: 'Amount', render: (val) => `$${parseFloat(val || 0).toLocaleString()}` },
    { key: 'status', label: 'Status', render: (val) => <StatusBadge status={val} /> },
    { key: 'payment_status', label: 'Payment', render: (val) => <StatusBadge status={val} /> },
  ];

  if (loading) return <Layout title="Purchase Orders"><LoadingSpinner /></Layout>;

  return (
    <Layout title="Purchase Orders">
      <div className="stats-grid">
        <StatsCard title="Total Orders" value={stats.totalOrders || 0} icon={FiDollarSign} color="primary" />
        <StatsCard title="Pending" value={stats.pendingOrders || 0} color="warning" />
        <StatsCard title="Total Value" value={`$${(stats.totalOrderValue || 0).toLocaleString()}`} color="success" />
        <StatsCard title="Unpaid" value={stats.unpaidOrders || 0} color="danger" />
      </div>

      <div className="page-header">
        <div className="filters-bar">
          <select className="filter-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">All Status</option>
            <option value="draft">Draft</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="ordered">Ordered</option>
            <option value="received">Received</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <FiPlus /> New Order
        </button>
      </div>

      <DataTable columns={columns} data={orders} />

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="New Purchase Order" size="large">
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Order Number *</label>
              <input className="form-input" value={form.order_number} onChange={(e) => setForm({ ...form, order_number: e.target.value })} required />
            </div>
            <div className="form-group">
              <label className="form-label">Vendor ID *</label>
              <input className="form-input" type="number" value={form.vendor_id} onChange={(e) => setForm({ ...form, vendor_id: e.target.value })} required />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Order Date *</label>
              <input className="form-input" type="date" value={form.order_date} onChange={(e) => setForm({ ...form, order_date: e.target.value })} required />
            </div>
            <div className="form-group">
              <label className="form-label">Expected Delivery</label>
              <input className="form-input" type="date" value={form.expected_delivery} onChange={(e) => setForm({ ...form, expected_delivery: e.target.value })} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Total Amount ($)</label>
              <input className="form-input" type="number" step="0.01" value={form.total_amount} onChange={(e) => setForm({ ...form, total_amount: parseFloat(e.target.value) || 0 })} />
            </div>
            <div className="form-group">
              <label className="form-label">Tax Amount ($)</label>
              <input className="form-input" type="number" step="0.01" value={form.tax_amount} onChange={(e) => setForm({ ...form, tax_amount: parseFloat(e.target.value) || 0 })} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Net Amount ($)</label>
            <input className="form-input" type="number" step="0.01" value={form.net_amount} onChange={(e) => setForm({ ...form, net_amount: parseFloat(e.target.value) || 0 })} />
          </div>
          <div className="form-group">
            <label className="form-label">Notes</label>
            <textarea className="form-textarea" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          </div>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 20 }}>
            <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary">Create Order</button>
          </div>
        </form>
      </Modal>
    </Layout>
  );
};

export default PurchaseOrders;
