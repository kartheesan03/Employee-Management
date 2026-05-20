const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PurchaseOrder = sequelize.define('PurchaseOrder', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  order_number: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
  },
  vendor_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  order_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  expected_delivery: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  total_amount: {
    type: DataTypes.DECIMAL(12, 2),
    defaultValue: 0,
  },
  tax_amount: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
  },
  discount_amount: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
  },
  net_amount: {
    type: DataTypes.DECIMAL(12, 2),
    defaultValue: 0,
  },
  status: {
    type: DataTypes.ENUM('draft', 'pending', 'approved', 'ordered', 'received', 'cancelled'),
    defaultValue: 'draft',
  },
  payment_status: {
    type: DataTypes.ENUM('unpaid', 'partial', 'paid'),
    defaultValue: 'unpaid',
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  created_by: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: 'purchase_orders',
});

module.exports = PurchaseOrder;
