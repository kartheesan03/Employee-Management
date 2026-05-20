const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Attendance = sequelize.define('Attendance', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  employee_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  check_in: {
    type: DataTypes.TIME,
    allowNull: true,
  },
  check_out: {
    type: DataTypes.TIME,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('present', 'absent', 'half_day', 'late', 'on_leave'),
    defaultValue: 'present',
  },
  work_hours: {
    type: DataTypes.DECIMAL(4, 2),
    allowNull: true,
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'attendance',
});

module.exports = Attendance;
