import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  FiHome, FiPackage, FiUsers, FiShoppingCart, FiUserCheck,
  FiBarChart2, FiSettings, FiLogOut, FiChevronLeft, FiChevronRight,
  FiBox, FiTruck, FiDollarSign, FiClipboard
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import './Layout.css';

const Sidebar = ({ collapsed, onToggle }) => {
  const { user, logout } = useAuth();

  const menuItems = [
    { path: '/', icon: FiHome, label: 'Dashboard', roles: ['admin', 'hr', 'manager', 'employee', 'sales'] },
    { path: '/materials', icon: FiPackage, label: 'Materials', roles: ['admin', 'manager', 'employee'] },
    { path: '/materials/movements', icon: FiTruck, label: 'Movements', roles: ['admin', 'manager', 'employee'] },
    { path: '/hrms/employees', icon: FiUsers, label: 'Employees', roles: ['admin', 'hr', 'manager'] },
    { path: '/hrms/attendance', icon: FiClipboard, label: 'Attendance', roles: ['admin', 'hr', 'manager'] },
    { path: '/hrms/leaves', icon: FiUserCheck, label: 'Leave Mgmt', roles: ['admin', 'hr', 'manager', 'employee'] },
    { path: '/erp/vendors', icon: FiShoppingCart, label: 'Vendors', roles: ['admin', 'manager'] },
    { path: '/erp/purchase-orders', icon: FiDollarSign, label: 'Purchase Orders', roles: ['admin', 'manager'] },
    { path: '/crm/customers', icon: FiBox, label: 'Customers', roles: ['admin', 'manager', 'sales'] },
    { path: '/crm/leads', icon: FiBarChart2, label: 'Sales Pipeline', roles: ['admin', 'manager', 'sales'] },
    { path: '/settings', icon: FiSettings, label: 'Settings', roles: ['admin'] },
  ];

  const filteredMenu = menuItems.filter(item => item.roles.includes(user?.role));

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <FiBox className="logo-icon" />
          {!collapsed && <span className="logo-text">SMTBMS</span>}
        </div>
        <button className="sidebar-toggle" onClick={onToggle}>
          {collapsed ? <FiChevronRight /> : <FiChevronLeft />}
        </button>
      </div>

      <nav className="sidebar-nav">
        {filteredMenu.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            title={collapsed ? item.label : ''}
          >
            <item.icon className="nav-icon" />
            {!collapsed && <span className="nav-label">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="user-info">
          <div className="user-avatar">
            {user?.first_name?.[0]}{user?.last_name?.[0]}
          </div>
          {!collapsed && (
            <div className="user-details">
              <span className="user-name">{user?.first_name} {user?.last_name}</span>
              <span className="user-role">{user?.role}</span>
            </div>
          )}
        </div>
        <button className="logout-btn" onClick={logout} title="Logout">
          <FiLogOut />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
