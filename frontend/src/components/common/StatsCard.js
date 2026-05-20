import React from 'react';
import './Common.css';

const StatsCard = ({ title, value, icon: Icon, trend, trendValue, color = 'primary' }) => {
  return (
    <div className={`stats-card stats-card-${color}`}>
      <div className="stats-card-content">
        <span className="stats-label">{title}</span>
        <h3 className="stats-value">{value}</h3>
        {trend && (
          <span className={`stats-trend ${trend}`}>
            {trend === 'up' ? '↑' : '↓'} {trendValue}
          </span>
        )}
      </div>
      {Icon && (
        <div className={`stats-icon stats-icon-${color}`}>
          <Icon />
        </div>
      )}
    </div>
  );
};

export default StatsCard;
