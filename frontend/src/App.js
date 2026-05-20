import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider, useAuth } from './context/AuthContext';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Materials from './pages/Materials';
import MaterialMovements from './pages/MaterialMovements';
import Employees from './pages/Employees';
import Attendance from './pages/Attendance';
import LeaveManagement from './pages/LeaveManagement';
import Vendors from './pages/Vendors';
import PurchaseOrders from './pages/PurchaseOrders';
import Customers from './pages/Customers';
import SalesPipeline from './pages/SalesPipeline';
import Settings from './pages/Settings';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading...</div>;
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null;
  return isAuthenticated ? <Navigate to="/" /> : children;
};

const AppRoutes = () => (
  <Routes>
    <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
    <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
    <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
    <Route path="/materials" element={<PrivateRoute><Materials /></PrivateRoute>} />
    <Route path="/materials/movements" element={<PrivateRoute><MaterialMovements /></PrivateRoute>} />
    <Route path="/hrms/employees" element={<PrivateRoute><Employees /></PrivateRoute>} />
    <Route path="/hrms/attendance" element={<PrivateRoute><Attendance /></PrivateRoute>} />
    <Route path="/hrms/leaves" element={<PrivateRoute><LeaveManagement /></PrivateRoute>} />
    <Route path="/erp/vendors" element={<PrivateRoute><Vendors /></PrivateRoute>} />
    <Route path="/erp/purchase-orders" element={<PrivateRoute><PurchaseOrders /></PrivateRoute>} />
    <Route path="/crm/customers" element={<PrivateRoute><Customers /></PrivateRoute>} />
    <Route path="/crm/leads" element={<PrivateRoute><SalesPipeline /></PrivateRoute>} />
    <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
    <Route path="*" element={<Navigate to="/" />} />
  </Routes>
);

const App = () => (
  <AuthProvider>
    <Router>
      <AppRoutes />
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick pauseOnHover />
    </Router>
  </AuthProvider>
);

export default App;
