const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Vendor = sequelize.define('Vendor', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(255),
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
  contact_person: {
    type: DataTypes.STRING(200),
    allowNull: true,
  },
  category: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  rating: {
    type: DataTypes.DECIMAL(3, 2),
    defaultValue: 0,
    validate: { min: 0, max: 5 },
  },
  payment_terms: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive', 'blacklisted'),
    defaultValue: 'active',
  },
}, {
  tableName: 'vendors',
});

module.exports = Vendor;
