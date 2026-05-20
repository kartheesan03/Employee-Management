import React, { useState, useEffect, useCallback } from 'react';
import { FiPlus, FiSearch, FiUsers } from 'react-icons/fi';
import Layout from '../components/layout/Layout';
import DataTable from '../components/common/DataTable';
import StatsCard from '../components/common/StatsCard';
import StatusBadge from '../components/common/StatusBadge';
import Modal from '../components/common/Modal';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { crmAPI } from '../services/api';
import { toast } from 'react-toastify';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({
    company_name: '', contact_name: '', email: '', phone: '',
    address: '', industry: '', source: 'other', customer_type: 'lead', notes: '',
  });

  const fetchData = useCallback(async () => {
    try {
      const [cRes, sRes] = await Promise.all([
        crmAPI.getCustomers({ search, customer_type: typeFilter }),
        crmAPI.getStats(),
      ]);
      setCustomers(cRes.data.customers);
      setStats(sRes.data.stats);
    } catch (error) {
      toast.error('Failed to load customers');
    } finally {
      setLoading(false);
    }
  }, [search, typeFilter]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editItem) {
        await crmAPI.updateCustomer(editItem.id, form);
        toast.success('Customer updated');
      } else {
        await crmAPI.createCustomer(form);
        toast.success('Customer created');
      }
      setShowModal(false);
      setEditItem(null);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Operation failed');
    }
  };

  const openEdit = (item) => {
    setEditItem(item);
    setForm({
      company_name: item.company_name, contact_name: item.contact_name,
      email: item.email || '', phone: item.phone || '', address: item.address || '',
      industry: item.industry || '', source: item.source, customer_type: item.customer_type,
      notes: item.notes || '',
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setForm({ company_name: '', contact_name: '', email: '', phone: '', address: '', industry: '', source: 'other', customer_type: 'lead', notes: '' });
  };

  const columns = [
    { key: 'company_name', label: 'Company' },
    { key: 'contact_name', label: 'Contact' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'industry', label: 'Industry' },
    { key: 'customer_type', label: 'Type', render: (val) => <StatusBadge status={val} /> },
    { key: 'total_revenue', label: 'Revenue', render: (val) => `$${parseFloat(val || 0).toLocaleString()}` },
    {
      key: 'actions', label: 'Actions', render: (_, row) => (
        <button className="btn btn-sm btn-outline" onClick={(e) => { e.stopPropagation(); openEdit(row); }}>Edit</button>
      ),
    },
  ];

  if (loading) return <Layout title="Customers"><LoadingSpinner /></Layout>;

  return (
    <Layout title="Customers">
      <div className="stats-grid">
        <StatsCard title="Total Customers" value={stats.totalCustomers || 0} icon={FiUsers} color="primary" />
        <StatsCard title="Active" value={stats.activeCustomers || 0} color="success" />
        <StatsCard title="Active Leads" value={stats.totalLeads || 0} color="info" />
        <StatsCard title="Total Revenue" value={`$${(stats.totalRevenue || 0).toLocaleString()}`} color="success" />
      </div>

      <div className="page-header">
        <div className="filters-bar">
          <div style={{ position: 'relative' }}>
            <FiSearch style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#80868b' }} />
            <input className="filter-input" style={{ paddingLeft: 34 }} placeholder="Search customers..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <select className="filter-select" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
            <option value="">All Types</option>
            <option value="lead">Lead</option>
            <option value="prospect">Prospect</option>
            <option value="customer">Customer</option>
            <option value="churned">Churned</option>
          </select>
        </div>
        <button className="btn btn-primary" onClick={() => { resetForm(); setEditItem(null); setShowModal(true); }}>
          <FiPlus /> Add Customer
        </button>
      </div>

      <DataTable columns={columns} data={customers} onRowClick={openEdit} />

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editItem ? 'Edit Customer' : 'Add Customer'} size="large">
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Company Name *</label>
              <input className="form-input" value={form.company_name} onChange={(e) => setForm({ ...form, company_name: e.target.value })} required />
            </div>
            <div className="form-group">
              <label className="form-label">Contact Name *</label>
              <input className="form-input" value={form.contact_name} onChange={(e) => setForm({ ...form, contact_name: e.target.value })} required />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Email</label>
              <input className="form-input" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Phone</label>
              <input className="form-input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Industry</label>
              <input className="form-input" value={form.industry} onChange={(e) => setForm({ ...form, industry: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Source</label>
              <select className="form-select" value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })}>
                <option value="website">Website</option>
                <option value="referral">Referral</option>
                <option value="social_media">Social Media</option>
                <option value="cold_call">Cold Call</option>
                <option value="exhibition">Exhibition</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Customer Type</label>
            <select className="form-select" value={form.customer_type} onChange={(e) => setForm({ ...form, customer_type: e.target.value })}>
              <option value="lead">Lead</option>
              <option value="prospect">Prospect</option>
              <option value="customer">Customer</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Address</label>
            <textarea className="form-textarea" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Notes</label>
            <textarea className="form-textarea" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          </div>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 20 }}>
            <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary">{editItem ? 'Update' : 'Create'}</button>
          </div>
        </form>
      </Modal>
    </Layout>
  );
};

export default Customers;
