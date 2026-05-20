import React, { useState, useEffect } from 'react';
import { FiClipboard } from 'react-icons/fi';
import Layout from '../components/layout/Layout';
import StatsCard from '../components/common/StatsCard';
import StatusBadge from '../components/common/StatusBadge';
import Modal from '../components/common/Modal';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { hrmsAPI } from '../services/api';
import { toast } from 'react-toastify';

const Attendance = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    employee_id: '', date: new Date().toISOString().split('T')[0],
    check_in: '09:00', check_out: '18:00', status: 'present', notes: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await hrmsAPI.getAttendance({});
        setRecords(res.data.attendance);
      } catch (error) {
        toast.error('Failed to load attendance');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await hrmsAPI.markAttendance(form);
      toast.success('Attendance marked');
      setShowModal(false);
      const res = await hrmsAPI.getAttendance({});
      setRecords(res.data.attendance);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to mark attendance');
    }
  };

  if (loading) return <Layout title="Attendance"><LoadingSpinner /></Layout>;

  return (
    <Layout title="Attendance Management">
      <div className="stats-grid">
        <StatsCard title="Total Records" value={records.length} icon={FiClipboard} color="primary" />
      </div>

      <div className="page-header">
        <h2>Attendance Records</h2>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <FiClipboard /> Mark Attendance
        </button>
      </div>

      <div className="card">
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Date</th>
                <th>Check In</th>
                <th>Check Out</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {records.length === 0 ? (
                <tr><td colSpan="5" className="empty-row">No attendance records</td></tr>
              ) : records.map((r) => (
                <tr key={r.id}>
                  <td>{r.employee?.user ? `${r.employee.user.first_name} ${r.employee.user.last_name}` : `Employee #${r.employee_id}`}</td>
                  <td>{r.date}</td>
                  <td>{r.check_in || '-'}</td>
                  <td>{r.check_out || '-'}</td>
                  <td><StatusBadge status={r.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Mark Attendance" size="medium">
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Employee ID *</label>
              <input className="form-input" type="number" value={form.employee_id} onChange={(e) => setForm({ ...form, employee_id: e.target.value })} required />
            </div>
            <div className="form-group">
              <label className="form-label">Date *</label>
              <input className="form-input" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Check In</label>
              <input className="form-input" type="time" value={form.check_in} onChange={(e) => setForm({ ...form, check_in: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Check Out</label>
              <input className="form-input" type="time" value={form.check_out} onChange={(e) => setForm({ ...form, check_out: e.target.value })} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Status</label>
            <select className="form-select" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              <option value="present">Present</option>
              <option value="absent">Absent</option>
              <option value="half_day">Half Day</option>
              <option value="late">Late</option>
              <option value="on_leave">On Leave</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Notes</label>
            <textarea className="form-textarea" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          </div>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 20 }}>
            <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary">Save</button>
          </div>
        </form>
      </Modal>
    </Layout>
  );
};

export default Attendance;
