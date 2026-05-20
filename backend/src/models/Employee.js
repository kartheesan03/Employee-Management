const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Employee = sequelize.define('Employee', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
  },
  employee_id: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
  },
  department: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  designation: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  date_of_joining: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  date_of_birth: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  gender: {
    type: DataTypes.ENUM('male', 'female', 'other'),
    allowNull: true,
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  emergency_contact: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  salary: {
    type: DataTypes.DECIMAL(12, 2),
    defaultValue: 0,
  },
  bank_account: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  employment_type: {
    type: DataTypes.ENUM('full_time', 'part_time', 'contract', 'intern'),
    defaultValue: 'full_time',
  },
  status: {
    type: DataTypes.ENUM('active', 'on_leave', 'terminated', 'resigned'),
    defaultValue: 'active',
  },
}, {
  tableName: 'employees',
});

module.exports = Employee;
