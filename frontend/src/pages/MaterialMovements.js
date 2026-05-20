import React, { useState, useEffect } from 'react';
import { FiTruck } from 'react-icons/fi';
import Layout from '../components/layout/Layout';
import StatsCard from '../components/common/StatsCard';
import Modal from '../components/common/Modal';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { materialsAPI } from '../services/api';
import { toast } from 'react-toastify';

const MaterialMovements = () => {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    material_id: '', movement_type: 'inbound', quantity: 1,
    from_location: '', to_location: '', reference_number: '', notes: '',
  });

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const res = await materialsAPI.getAll({ limit: 100 });
        setMaterials(res.data.materials);
      } catch (error) {
        toast.error('Failed to load materials');
      } finally {
        setLoading(false);
      }
    };
    fetchMaterials();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await materialsAPI.recordMovement(form.material_id, {
        movement_type: form.movement_type,
        quantity: parseInt(form.quantity),
        from_location: form.from_location,
        to_location: form.to_location,
        reference_number: form.reference_number,
        notes: form.notes,
      });
      toast.success('Movement recorded successfully');
      setShowModal(false);
      setForm({ material_id: '', movement_type: 'inbound', quantity: 1, from_location: '', to_location: '', reference_number: '', notes: '' });
      const res = await materialsAPI.getAll({ limit: 100 });
      setMaterials(res.data.materials);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to record movement');
    }
  };

  if (loading) return <Layout title="Material Movements"><LoadingSpinner /></Layout>;

  return (
    <Layout title="Material Movements">
      <div className="stats-grid">
        <StatsCard title="Total Materials" value={materials.length} icon={FiTruck} color="primary" />
      </div>

      <div className="page-header">
        <h2>Track Material Movements</h2>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <FiTruck /> Record Movement
        </button>
      </div>

      <div className="card">
        <div className="card-header"><h3>Materials Inventory</h3></div>
        <div className="card-body">
          <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#5f6368', textTransform: 'uppercase', background: '#f0f2f5', borderBottom: '1px solid #dadce0' }}>SKU</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#5f6368', textTransform: 'uppercase', background: '#f0f2f5', borderBottom: '1px solid #dadce0' }}>Name</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#5f6368', textTransform: 'uppercase', background: '#f0f2f5', borderBottom: '1px solid #dadce0' }}>Quantity</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#5f6368', textTransform: 'uppercase', background: '#f0f2f5', borderBottom: '1px solid #dadce0' }}>Location</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#5f6368', textTransform: 'uppercase', background: '#f0f2f5', borderBottom: '1px solid #dadce0' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {materials.map((m) => (
                <tr key={m.id}>
                  <td style={{ padding: '12px 16px', borderBottom: '1px solid #dadce0' }}>{m.sku}</td>
                  <td style={{ padding: '12px 16px', borderBottom: '1px solid #dadce0' }}>{m.name}</td>
                  <td style={{ padding: '12px 16px', borderBottom: '1px solid #dadce0' }}>{m.quantity} {m.unit}</td>
                  <td style={{ padding: '12px 16px', borderBottom: '1px solid #dadce0' }}>{m.location || '-'}</td>
                  <td style={{ padding: '12px 16px', borderBottom: '1px solid #dadce0' }}>
                    <span className={`status-badge status-${m.status === 'in_stock' ? 'success' : m.status === 'low_stock' ? 'warning' : 'danger'}`}>
                      {m.status?.replace(/_/g, ' ')}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Record Material Movement" size="medium">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Material *</label>
            <select className="form-select" value={form.material_id} onChange={(e) => setForm({ ...form, material_id: e.target.value })} required>
              <option value="">Select material</option>
              {materials.map((m) => (
                <option key={m.id} value={m.id}>{m.name} ({m.sku}) - Qty: {m.quantity}</option>
              ))}
            </select>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Movement Type *</label>
              <select className="form-select" value={form.movement_type} onChange={(e) => setForm({ ...form, movement_type: e.target.value })}>
                <option value="inbound">Inbound</option>
                <option value="outbound">Outbound</option>
                <option value="transfer">Transfer</option>
                <option value="adjustment">Adjustment</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Quantity *</label>
              <input className="form-input" type="number" min="1" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} required />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">From Location</label>
              <input className="form-input" value={form.from_location} onChange={(e) => setForm({ ...form, from_location: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">To Location</label>
              <input className="form-input" value={form.to_location} onChange={(e) => setForm({ ...form, to_location: e.target.value })} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Reference Number</label>
            <input className="form-input" value={form.reference_number} onChange={(e) => setForm({ ...form, reference_number: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Notes</label>
            <textarea className="form-textarea" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          </div>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 20 }}>
            <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary">Record Movement</button>
          </div>
        </form>
      </Modal>
    </Layout>
  );
};

export default MaterialMovements;
