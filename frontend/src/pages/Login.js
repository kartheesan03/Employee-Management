import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiBox, FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import './Auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Login successful!');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <FiBox className="auth-logo" />
          <h1>SMTBMS</h1>
          <p>Smart Material Tracking & Business Management</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-input-group">
            <FiMail className="auth-input-icon" />
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="auth-input"
            />
          </div>

          <div className="auth-input-group">
            <FiLock className="auth-input-icon" />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="auth-input"
            />
            <button
              type="button"
              className="auth-toggle-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>

          <button type="submit" className="auth-submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="auth-footer">
          <p>Don't have an account? <Link to="/register">Sign Up</Link></p>
        </div>

        <div className="auth-demo">
          <p className="demo-title">Demo Credentials:</p>
          <div className="demo-creds">
            <button type="button" onClick={() => { setEmail('admin@smtbms.com'); setPassword('admin123'); }}>Admin</button>
            <button type="button" onClick={() => { setEmail('hr@smtbms.com'); setPassword('hr123456'); }}>HR</button>
            <button type="button" onClick={() => { setEmail('manager@smtbms.com'); setPassword('manager123'); }}>Manager</button>
            <button type="button" onClick={() => { setEmail('sales@smtbms.com'); setPassword('sales123'); }}>Sales</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
