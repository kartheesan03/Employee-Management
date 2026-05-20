import React, { useState, useEffect, useCallback } from 'react';
import { FiPlus, FiSearch, FiShoppingCart } from 'react-icons/fi';
import Layout from '../components/layout/Layout';
import DataTable from '../components/common/DataTable';
import StatsCard from '../components/common/StatsCard';
import StatusBadge from '../components/common/StatusBadge';
import Modal from '../components/common/Modal';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { erpAPI } from '../services/api';
import { toast } from 'react-toastify';

const Vendors = () => {
  const [vendors, setVendors] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({
    name: '', email: '', phone: '', contact_person: '', category: '',
    address: '', payment_terms: '', rating: 0,
  });

  const fetchData = useCallback(async () => {
    try {
      const [vRes, sRes] = await Promise.all([
        erpAPI.getVendors({ search }),
        erpAPI.getStats(),
      ]);
      setVendors(vRes.data.vendors);
      setStats(sRes.data.stats);
    } catch (error) {
      toast.error('Failed to load vendors');
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editItem) {
        await erpAPI.updateVendor(editItem.id, form);
        toast.success('Vendor updated');
      } else {
        await erpAPI.createVendor(form);
        toast.success('Vendor created');
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
      name: item.name, email: item.email || '', phone: item.phone || '',
      contact_person: item.contact_person || '', category: item.category || '',
      address: item.address || '', payment_terms: item.payment_terms || '',
      rating: item.rating || 0,
    });
    setShowModal(true);
  };

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'contact_person', label: 'Contact Person' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'category', label: 'Category' },
    { key: 'rating', label: 'Rating', render: (val) => `${parseFloat(val || 0).toFixed(1)} / 5.0` },
    { key: 'status', label: 'Status', render: (val) => <StatusBadge status={val} /> },
    {
      key: 'actions', label: 'Actions', render: (_, row) => (
        <button className="btn btn-sm btn-outline" onClick={(e) => { e.stopPropagation(); openEdit(row); }}>Edit</button>
      ),
    },
  ];

  if (loading) return <Layout title="Vendors"><LoadingSpinner /></Layout>;

  return (
    <Layout title="Vendors">
      <div className="stats-grid">
        <StatsCard title="Total Vendors" value={stats.totalVendors || 0} icon={FiShoppingCart} color="primary" />
        <StatsCard title="Active Vendors" value={stats.activeVendors || 0} color="success" />
        <StatsCard title="Total Orders" value={stats.totalOrders || 0} color="info" />
        <StatsCard title="Pending Orders" value={stats.pendingOrders || 0} color="warning" />
      </div>

      <div className="page-header">
        <div className="filters-bar">
          <div style={{ position: 'relative' }}>
            <FiSearch style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#80868b' }} />
            <input className="filter-input" style={{ paddingLeft: 34 }} placeholder="Search vendors..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>
        <button className="btn btn-primary" onClick={() => { setEditItem(null); setForm({ name: '', email: '', phone: '', contact_person: '', category: '', address: '', payment_terms: '', rating: 0 }); setShowModal(true); }}>
          <FiPlus /> Add Vendor
        </button>
      </div>

      <DataTable columns={columns} data={vendors} onRowClick={openEdit} />

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editItem ? 'Edit Vendor' : 'Add Vendor'} size="large">
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Company Name *</label>
              <input className="form-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div className="form-group">
              <label className="form-label">Contact Person</label>
              <input className="form-input" value={form.contact_person} onChange={(e) => setForm({ ...form, contact_person: e.target.value })} />
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
              <label className="form-label">Category</label>
              <input className="form-input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Payment Terms</label>
              <input className="form-input" value={form.payment_terms} onChange={(e) => setForm({ ...form, payment_terms: e.target.value })} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Address</label>
            <textarea className="form-textarea" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
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

export default Vendors;
