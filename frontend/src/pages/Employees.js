import React, { useState, useEffect, useCallback } from 'react';
import { FiPlus, FiSearch, FiUsers } from 'react-icons/fi';
import Layout from '../components/layout/Layout';
import DataTable from '../components/common/DataTable';
import StatsCard from '../components/common/StatsCard';
import StatusBadge from '../components/common/StatusBadge';
import Modal from '../components/common/Modal';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { hrmsAPI } from '../services/api';
import { toast } from 'react-toastify';

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    user_id: '', employee_id: '', department: '', designation: '',
    date_of_joining: '', salary: 0, employment_type: 'full_time',
  });

  const fetchData = useCallback(async () => {
    try {
      const [empRes, statsRes] = await Promise.all([
        hrmsAPI.getEmployees({ search }),
        hrmsAPI.getStats(),
      ]);
      setEmployees(empRes.data.employees);
      setStats(statsRes.data.stats);
    } catch (error) {
      toast.error('Failed to load employees');
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await hrmsAPI.createEmployee(form);
      toast.success('Employee created');
      setShowModal(false);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Operation failed');
    }
  };

  const columns = [
    { key: 'employee_id', label: 'Emp ID' },
    { key: 'name', label: 'Name', render: (_, row) => `${row.user?.first_name || ''} ${row.user?.last_name || ''}` },
    { key: 'email', label: 'Email', render: (_, row) => row.user?.email },
    { key: 'department', label: 'Department' },
    { key: 'designation', label: 'Designation' },
    { key: 'employment_type', label: 'Type', render: (val) => <StatusBadge status={val} /> },
    { key: 'status', label: 'Status', render: (val) => <StatusBadge status={val} /> },
  ];

  if (loading) return <Layout title="Employees"><LoadingSpinner /></Layout>;

  return (
    <Layout title="Employees">
      <div className="stats-grid">
        <StatsCard title="Total Employees" value={stats.totalEmployees || 0} icon={FiUsers} color="primary" />
        <StatsCard title="Active" value={stats.activeEmployees || 0} color="success" />
        <StatsCard title="On Leave" value={stats.onLeave || 0} color="warning" />
        <StatsCard title="Pending Leaves" value={stats.pendingLeaves || 0} color="info" />
      </div>

      <div className="page-header">
        <div className="filters-bar">
          <div style={{ position: 'relative' }}>
            <FiSearch style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#80868b' }} />
            <input className="filter-input" style={{ paddingLeft: 34 }} placeholder="Search employees..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <FiPlus /> Add Employee
        </button>
      </div>

      <DataTable columns={columns} data={employees} />

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add Employee" size="large">
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">User ID *</label>
              <input className="form-input" type="number" value={form.user_id} onChange={(e) => setForm({ ...form, user_id: e.target.value })} required />
            </div>
            <div className="form-group">
              <label className="form-label">Employee ID *</label>
              <input className="form-input" value={form.employee_id} onChange={(e) => setForm({ ...form, employee_id: e.target.value })} required />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Department *</label>
              <input className="form-input" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} required />
            </div>
            <div className="form-group">
              <label className="form-label">Designation *</label>
              <input className="form-input" value={form.designation} onChange={(e) => setForm({ ...form, designation: e.target.value })} required />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Date of Joining *</label>
              <input className="form-input" type="date" value={form.date_of_joining} onChange={(e) => setForm({ ...form, date_of_joining: e.target.value })} required />
            </div>
            <div className="form-group">
              <label className="form-label">Salary</label>
              <input className="form-input" type="number" value={form.salary} onChange={(e) => setForm({ ...form, salary: parseFloat(e.target.value) || 0 })} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Employment Type</label>
            <select className="form-select" value={form.employment_type} onChange={(e) => setForm({ ...form, employment_type: e.target.value })}>
              <option value="full_time">Full Time</option>
              <option value="part_time">Part Time</option>
              <option value="contract">Contract</option>
              <option value="intern">Intern</option>
            </select>
          </div>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 20 }}>
            <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary">Create Employee</button>
          </div>
        </form>
      </Modal>
    </Layout>
  );
};

export default Employees;
