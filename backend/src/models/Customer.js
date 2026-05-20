const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Customer = sequelize.define('Customer', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  company_name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  contact_name: {
    type: DataTypes.STRING(200),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: true,
    validate: { isEmail: true },
  },
  phone: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  industry: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  source: {
    type: DataTypes.ENUM('website', 'referral', 'social_media', 'cold_call', 'exhibition', 'other'),
    defaultValue: 'other',
  },
  customer_type: {
    type: DataTypes.ENUM('lead', 'prospect', 'customer', 'churned'),
    defaultValue: 'lead',
  },
  total_revenue: {
    type: DataTypes.DECIMAL(14, 2),
    defaultValue: 0,
  },
  assigned_to: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive'),
    defaultValue: 'active',
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'customers',
});

module.exports = Customer;
