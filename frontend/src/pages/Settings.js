import React, { useState } from 'react';
import { FiSave } from 'react-icons/fi';
import Layout from '../components/layout/Layout';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import { toast } from 'react-toastify';

const Settings = () => {
  const { user } = useAuth();
  const [form, setForm] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    phone: user?.phone || '',
    department: user?.department || '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await authAPI.updateProfile(form);
      toast.success('Profile updated');
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  return (
    <Layout title="Settings">
      <div className="card" style={{ maxWidth: 600 }}>
        <div className="card-header">
          <h3>Profile Settings</h3>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">First Name</label>
                <input className="form-input" value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Last Name</label>
                <input className="form-input" value={form.last_name} onChange={(e) => setForm({ ...form, last_name: e.target.value })} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input className="form-input" value={user?.email || ''} disabled />
            </div>
            <div className="form-group">
              <label className="form-label">Role</label>
              <input className="form-input" value={user?.role || ''} disabled style={{ textTransform: 'capitalize' }} />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Phone</label>
                <input className="form-input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Department</label>
                <input className="form-input" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} />
              </div>
            </div>
            <button type="submit" className="btn btn-primary" style={{ marginTop: 20 }}>
              <FiSave /> Save Changes
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;
