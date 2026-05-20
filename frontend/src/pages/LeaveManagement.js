import React, { useState, useEffect } from 'react';
import { FiPlus, FiUserCheck } from 'react-icons/fi';
import Layout from '../components/layout/Layout';
import StatsCard from '../components/common/StatsCard';
import StatusBadge from '../components/common/StatusBadge';
import Modal from '../components/common/Modal';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { hrmsAPI } from '../services/api';
import { toast } from 'react-toastify';

const LeaveManagement = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    employee_id: '', leave_type: 'casual', start_date: '', end_date: '', reason: '',
  });

  const fetchLeaves = async () => {
    try {
      const res = await hrmsAPI.getLeaves({});
      setLeaves(res.data.leaves);
    } catch (error) {
      toast.error('Failed to load leave requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLeaves(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await hrmsAPI.createLeave(form);
      toast.success('Leave request submitted');
      setShowModal(false);
      fetchLeaves();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to submit leave');
    }
  };

  const handleApprove = async (id) => {
    try {
      await hrmsAPI.updateLeave(id, { status: 'approved' });
      toast.success('Leave approved');
      fetchLeaves();
    } catch (error) {
      toast.error('Failed to update leave');
    }
  };

  const handleReject = async (id) => {
    try {
      await hrmsAPI.updateLeave(id, { status: 'rejected' });
      toast.success('Leave rejected');
      fetchLeaves();
    } catch (error) {
      toast.error('Failed to update leave');
    }
  };

  const pendingCount = leaves.filter(l => l.status === 'pending').length;
  const approvedCount = leaves.filter(l => l.status === 'approved').length;

  if (loading) return <Layout title="Leave Management"><LoadingSpinner /></Layout>;

  return (
    <Layout title="Leave Management">
      <div className="stats-grid">
        <StatsCard title="Total Requests" value={leaves.length} icon={FiUserCheck} color="primary" />
        <StatsCard title="Pending" value={pendingCount} color="warning" />
        <StatsCard title="Approved" value={approvedCount} color="success" />
      </div>

      <div className="page-header">
        <h2>Leave Requests</h2>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <FiPlus /> New Request
        </button>
      </div>

      <div className="card">
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Type</th>
                <th>From</th>
                <th>To</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {leaves.length === 0 ? (
                <tr><td colSpan="7" className="empty-row">No leave requests</td></tr>
              ) : leaves.map((l) => (
                <tr key={l.id}>
                  <td>{l.employee?.user ? `${l.employee.user.first_name} ${l.employee.user.last_name}` : `Employee #${l.employee_id}`}</td>
                  <td style={{ textTransform: 'capitalize' }}>{l.leave_type}</td>
                  <td>{l.start_date}</td>
                  <td>{l.end_date}</td>
                  <td>{l.reason?.substring(0, 50)}{l.reason?.length > 50 ? '...' : ''}</td>
                  <td><StatusBadge status={l.status} /></td>
                  <td>
                    {l.status === 'pending' && (
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="btn btn-sm btn-success" onClick={() => handleApprove(l.id)}>Approve</button>
                        <button className="btn btn-sm btn-danger" onClick={() => handleReject(l.id)}>Reject</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="New Leave Request" size="medium">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Employee ID *</label>
            <input className="form-input" type="number" value={form.employee_id} onChange={(e) => setForm({ ...form, employee_id: e.target.value })} required />
          </div>
          <div className="form-group">
            <label className="form-label">Leave Type *</label>
            <select className="form-select" value={form.leave_type} onChange={(e) => setForm({ ...form, leave_type: e.target.value })}>
              <option value="casual">Casual Leave</option>
              <option value="sick">Sick Leave</option>
              <option value="annual">Annual Leave</option>
              <option value="maternity">Maternity Leave</option>
              <option value="paternity">Paternity Leave</option>
              <option value="unpaid">Unpaid Leave</option>
            </select>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Start Date *</label>
              <input className="form-input" type="date" value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} required />
            </div>
            <div className="form-group">
              <label className="form-label">End Date *</label>
              <input className="form-input" type="date" value={form.end_date} onChange={(e) => setForm({ ...form, end_date: e.target.value })} required />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Reason *</label>
            <textarea className="form-textarea" value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} required />
          </div>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 20 }}>
            <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary">Submit Request</button>
          </div>
        </form>
      </Modal>
    </Layout>
  );
};

export default LeaveManagement;
