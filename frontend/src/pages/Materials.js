import React, { useState, useEffect, useCallback } from 'react';
import { FiPlus, FiSearch, FiPackage } from 'react-icons/fi';
import Layout from '../components/layout/Layout';
import DataTable from '../components/common/DataTable';
import StatsCard from '../components/common/StatsCard';
import StatusBadge from '../components/common/StatusBadge';
import Modal from '../components/common/Modal';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { materialsAPI } from '../services/api';
import { toast } from 'react-toastify';

const Materials = () => {
  const [materials, setMaterials] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({
    name: '', sku: '', category: '', description: '', quantity: 0,
    unit: 'pieces', unit_price: 0, reorder_level: 10, location: '', barcode: '',
  });

  const fetchData = useCallback(async () => {
    try {
      const [matRes, statsRes] = await Promise.all([
        materialsAPI.getAll({ search, status: statusFilter }),
        materialsAPI.getStats(),
      ]);
      setMaterials(matRes.data.materials);
      setStats(statsRes.data.stats);
    } catch (error) {
      toast.error('Failed to load materials');
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editItem) {
        await materialsAPI.update(editItem.id, form);
        toast.success('Material updated');
      } else {
        await materialsAPI.create(form);
        toast.success('Material created');
      }
      setShowModal(false);
      setEditItem(null);
      resetForm();
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Operation failed');
    }
  };

  const resetForm = () => {
    setForm({ name: '', sku: '', category: '', description: '', quantity: 0, unit: 'pieces', unit_price: 0, reorder_level: 10, location: '', barcode: '' });
  };

  const openEdit = (item) => {
    setEditItem(item);
    setForm({
      name: item.name, sku: item.sku, category: item.category, description: item.description || '',
      quantity: item.quantity, unit: item.unit, unit_price: item.unit_price, reorder_level: item.reorder_level,
      location: item.location || '', barcode: item.barcode || '',
    });
    setShowModal(true);
  };

  const columns = [
    { key: 'sku', label: 'SKU' },
    { key: 'name', label: 'Name' },
    { key: 'category', label: 'Category' },
    { key: 'quantity', label: 'Qty', render: (val, row) => `${val} ${row.unit}` },
    { key: 'unit_price', label: 'Unit Price', render: (val) => `$${parseFloat(val).toFixed(2)}` },
    { key: 'location', label: 'Location' },
    { key: 'status', label: 'Status', render: (val) => <StatusBadge status={val} /> },
    {
      key: 'actions', label: 'Actions', render: (_, row) => (
        <button className="btn btn-sm btn-outline" onClick={(e) => { e.stopPropagation(); openEdit(row); }}>Edit</button>
      ),
    },
  ];

  if (loading) return <Layout title="Materials"><LoadingSpinner /></Layout>;

  return (
    <Layout title="Materials">
      <div className="stats-grid">
        <StatsCard title="Total Materials" value={stats.totalMaterials || 0} icon={FiPackage} color="primary" />
        <StatsCard title="In Stock" value={stats.inStock || 0} color="success" />
        <StatsCard title="Low Stock" value={stats.lowStock || 0} color="warning" />
        <StatsCard title="Out of Stock" value={stats.outOfStock || 0} color="danger" />
      </div>

      <div className="page-header">
        <div className="filters-bar">
          <div style={{ position: 'relative' }}>
            <FiSearch style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#80868b' }} />
            <input className="filter-input" style={{ paddingLeft: 34 }} placeholder="Search materials..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <select className="filter-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">All Status</option>
            <option value="in_stock">In Stock</option>
            <option value="low_stock">Low Stock</option>
            <option value="out_of_stock">Out of Stock</option>
          </select>
        </div>
        <button className="btn btn-primary" onClick={() => { resetForm(); setEditItem(null); setShowModal(true); }}>
          <FiPlus /> Add Material
        </button>
      </div>

      <DataTable columns={columns} data={materials} onRowClick={openEdit} />

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editItem ? 'Edit Material' : 'Add Material'} size="large">
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Name *</label>
              <input className="form-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div className="form-group">
              <label className="form-label">SKU *</label>
              <input className="form-input" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} required />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Category *</label>
              <input className="form-input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required />
            </div>
            <div className="form-group">
              <label className="form-label">Location</label>
              <input className="form-input" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Quantity</label>
              <input className="form-input" type="number" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: parseInt(e.target.value) || 0 })} />
            </div>
            <div className="form-group">
              <label className="form-label">Unit</label>
              <select className="form-select" value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })}>
                <option value="pieces">Pieces</option>
                <option value="kg">Kilograms</option>
                <option value="liters">Liters</option>
                <option value="meters">Meters</option>
                <option value="rolls">Rolls</option>
                <option value="sheets">Sheets</option>
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Unit Price ($)</label>
              <input className="form-input" type="number" step="0.01" value={form.unit_price} onChange={(e) => setForm({ ...form, unit_price: parseFloat(e.target.value) || 0 })} />
            </div>
            <div className="form-group">
              <label className="form-label">Reorder Level</label>
              <input className="form-input" type="number" value={form.reorder_level} onChange={(e) => setForm({ ...form, reorder_level: parseInt(e.target.value) || 0 })} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea className="form-textarea" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Barcode</label>
            <input className="form-input" value={form.barcode} onChange={(e) => setForm({ ...form, barcode: e.target.value })} />
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

export default Materials;
