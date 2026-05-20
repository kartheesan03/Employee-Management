import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiBox, FiUser, FiMail, FiLock } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import './Auth.css';

const Register = () => {
  const [form, setForm] = useState({
    first_name: '', last_name: '', email: '', password: '', confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      const { confirmPassword, ...data } = form;
      await register(data);
      toast.success('Registration successful!');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <FiBox className="auth-logo" />
          <h1>Create Account</h1>
          <p>Join SMTBMS today</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-row">
            <div className="auth-input-group">
              <FiUser className="auth-input-icon" />
              <input type="text" name="first_name" placeholder="First Name" value={form.first_name} onChange={handleChange} required className="auth-input" />
            </div>
            <div className="auth-input-group">
              <FiUser className="auth-input-icon" />
              <input type="text" name="last_name" placeholder="Last Name" value={form.last_name} onChange={handleChange} required className="auth-input" />
            </div>
          </div>

          <div className="auth-input-group">
            <FiMail className="auth-input-icon" />
            <input type="email" name="email" placeholder="Email address" value={form.email} onChange={handleChange} required className="auth-input" />
          </div>

          <div className="auth-input-group">
            <FiLock className="auth-input-icon" />
            <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} required minLength={6} className="auth-input" />
          </div>

          <div className="auth-input-group">
            <FiLock className="auth-input-icon" />
            <input type="password" name="confirmPassword" placeholder="Confirm Password" value={form.confirmPassword} onChange={handleChange} required className="auth-input" />
          </div>

          <button type="submit" className="auth-submit" disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <div className="auth-footer">
          <p>Already have an account? <Link to="/login">Sign In</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Register;
