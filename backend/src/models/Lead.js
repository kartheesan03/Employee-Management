const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Lead = sequelize.define('Lead', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  customer_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  value: {
    type: DataTypes.DECIMAL(14, 2),
    defaultValue: 0,
  },
  stage: {
    type: DataTypes.ENUM('new', 'contacted', 'qualified', 'proposal', 'negotiation', 'closed_won', 'closed_lost'),
    defaultValue: 'new',
  },
  probability: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: { min: 0, max: 100 },
  },
  expected_close_date: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  assigned_to: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  source: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive', 'converted'),
    defaultValue: 'active',
  },
}, {
  tableName: 'leads',
});

module.exports = Lead;
