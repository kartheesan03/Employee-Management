import React from 'react';
import { FiBell, FiSearch, FiMenu } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import './Layout.css';

const Header = ({ onMenuToggle, title }) => {
  const { user } = useAuth();

  return (
    <header className="header">
      <div className="header-left">
        <button className="menu-toggle" onClick={onMenuToggle}>
          <FiMenu />
        </button>
        <h1 className="page-title">{title}</h1>
      </div>

      <div className="header-center">
        <div className="search-bar">
          <FiSearch className="search-icon" />
          <input type="text" placeholder="Search..." className="search-input" />
        </div>
      </div>

      <div className="header-right">
        <button className="header-btn notification-btn">
          <FiBell />
          <span className="notification-badge">3</span>
        </button>
        <div className="header-user">
          <div className="header-avatar">
            {user?.first_name?.[0]}{user?.last_name?.[0]}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
