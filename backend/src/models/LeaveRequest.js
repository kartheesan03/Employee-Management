const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const LeaveRequest = sequelize.define('LeaveRequest', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  employee_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  leave_type: {
    type: DataTypes.ENUM('casual', 'sick', 'annual', 'maternity', 'paternity', 'unpaid'),
    allowNull: false,
  },
  start_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  end_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  reason: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected', 'cancelled'),
    defaultValue: 'pending',
  },
  approved_by: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  comments: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'leave_requests',
});

module.exports = LeaveRequest;
