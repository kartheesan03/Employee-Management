import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import './Layout.css';

const Layout = ({ children, title = 'Dashboard' }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className={`layout ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <div className="main-content">
        <Header
          onMenuToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          title={title}
        />
        <main className="page-content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
