import React, { useState, useEffect, useCallback } from 'react';
import { FiPlus, FiTrendingUp } from 'react-icons/fi';
import Layout from '../components/layout/Layout';
import DataTable from '../components/common/DataTable';
import StatsCard from '../components/common/StatsCard';
import StatusBadge from '../components/common/StatusBadge';
import Modal from '../components/common/Modal';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { crmAPI } from '../services/api';
import { toast } from 'react-toastify';

const SalesPipeline = () => {
  const [leads, setLeads] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [stageFilter, setStageFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    customer_id: '', title: '', value: 0, stage: 'new', probability: 0,
    expected_close_date: '', source: '', description: '',
  });

  const fetchData = useCallback(async () => {
    try {
      const [lRes, sRes] = await Promise.all([
        crmAPI.getLeads({ stage: stageFilter }),
        crmAPI.getStats(),
      ]);
      setLeads(lRes.data.leads);
      setStats(sRes.data.stats);
    } catch (error) {
      toast.error('Failed to load leads');
    } finally {
      setLoading(false);
    }
  }, [stageFilter]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await crmAPI.createLead(form);
      toast.success('Lead created');
      setShowModal(false);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Operation failed');
    }
  };

  const updateStage = async (id, stage) => {
    try {
      await crmAPI.updateLead(id, { stage });
      toast.success('Lead stage updated');
      fetchData();
    } catch (error) {
      toast.error('Failed to update lead');
    }
  };

  const columns = [
    { key: 'title', label: 'Deal' },
    { key: 'customer', label: 'Customer', render: (_, row) => row.customer?.company_name || '-' },
    { key: 'value', label: 'Value', render: (val) => `$${parseFloat(val || 0).toLocaleString()}` },
    { key: 'stage', label: 'Stage', render: (val) => <StatusBadge status={val} /> },
    { key: 'probability', label: 'Probability', render: (val) => `${val}%` },
    { key: 'expected_close_date', label: 'Close Date' },
    {
      key: 'actions', label: 'Actions', render: (_, row) => (
        <select
          className="filter-select"
          value={row.stage}
          onChange={(e) => updateStage(row.id, e.target.value)}
          style={{ padding: '4px 8px', fontSize: 12 }}
        >
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="qualified">Qualified</option>
          <option value="proposal">Proposal</option>
          <option value="negotiation">Negotiation</option>
          <option value="closed_won">Won</option>
          <option value="closed_lost">Lost</option>
        </select>
      ),
    },
  ];

  if (loading) return <Layout title="Sales Pipeline"><LoadingSpinner /></Layout>;

  return (
    <Layout title="Sales Pipeline">
      <div className="stats-grid">
        <StatsCard title="Active Leads" value={stats.totalLeads || 0} icon={FiTrendingUp} color="primary" />
        <StatsCard title="Won Deals" value={stats.wonDeals || 0} color="success" />
        <StatsCard title="Lost Deals" value={stats.lostDeals || 0} color="danger" />
        <StatsCard title="Total Revenue" value={`$${(stats.totalRevenue || 0).toLocaleString()}`} color="info" />
      </div>

      <div className="page-header">
        <div className="filters-bar">
          <select className="filter-select" value={stageFilter} onChange={(e) => setStageFilter(e.target.value)}>
            <option value="">All Stages</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="qualified">Qualified</option>
            <option value="proposal">Proposal</option>
            <option value="negotiation">Negotiation</option>
            <option value="closed_won">Won</option>
            <option value="closed_lost">Lost</option>
          </select>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <FiPlus /> New Lead
        </button>
      </div>

      <DataTable columns={columns} data={leads} />

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="New Lead" size="large">
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Title *</label>
              <input className="form-input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            </div>
            <div className="form-group">
              <label className="form-label">Customer ID *</label>
              <input className="form-input" type="number" value={form.customer_id} onChange={(e) => setForm({ ...form, customer_id: e.target.value })} required />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Value ($)</label>
              <input className="form-input" type="number" step="0.01" value={form.value} onChange={(e) => setForm({ ...form, value: parseFloat(e.target.value) || 0 })} />
            </div>
            <div className="form-group">
              <label className="form-label">Probability (%)</label>
              <input className="form-input" type="number" min="0" max="100" value={form.probability} onChange={(e) => setForm({ ...form, probability: parseInt(e.target.value) || 0 })} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Stage</label>
              <select className="form-select" value={form.stage} onChange={(e) => setForm({ ...form, stage: e.target.value })}>
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="qualified">Qualified</option>
                <option value="proposal">Proposal</option>
                <option value="negotiation">Negotiation</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Expected Close Date</label>
              <input className="form-input" type="date" value={form.expected_close_date} onChange={(e) => setForm({ ...form, expected_close_date: e.target.value })} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Source</label>
            <input className="form-input" value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea className="form-textarea" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 20 }}>
            <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary">Create Lead</button>
          </div>
        </form>
      </Modal>
    </Layout>
  );
};

export default SalesPipeline;
