const sequelize = require('../config/database');
const User = require('./User');
const Material = require('./Material');
const MaterialMovement = require('./MaterialMovement');
const Employee = require('./Employee');
const Attendance = require('./Attendance');
const LeaveRequest = require('./LeaveRequest');
const Vendor = require('./Vendor');
const PurchaseOrder = require('./PurchaseOrder');
const Customer = require('./Customer');
const Lead = require('./Lead');

// User - Employee
User.hasOne(Employee, { foreignKey: 'user_id', as: 'employee' });
Employee.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Material - MaterialMovement
Material.hasMany(MaterialMovement, { foreignKey: 'material_id', as: 'movements' });
MaterialMovement.belongsTo(Material, { foreignKey: 'material_id', as: 'material' });

// User - MaterialMovement
User.hasMany(MaterialMovement, { foreignKey: 'performed_by', as: 'materialMovements' });
MaterialMovement.belongsTo(User, { foreignKey: 'performed_by', as: 'performedBy' });

// Employee - Attendance
Employee.hasMany(Attendance, { foreignKey: 'employee_id', as: 'attendanceRecords' });
Attendance.belongsTo(Employee, { foreignKey: 'employee_id', as: 'employee' });

// Employee - LeaveRequest
Employee.hasMany(LeaveRequest, { foreignKey: 'employee_id', as: 'leaveRequests' });
LeaveRequest.belongsTo(Employee, { foreignKey: 'employee_id', as: 'employee' });

// Vendor - PurchaseOrder
Vendor.hasMany(PurchaseOrder, { foreignKey: 'vendor_id', as: 'purchaseOrders' });
PurchaseOrder.belongsTo(Vendor, { foreignKey: 'vendor_id', as: 'vendor' });

// User - PurchaseOrder
User.hasMany(PurchaseOrder, { foreignKey: 'created_by', as: 'purchaseOrders' });
PurchaseOrder.belongsTo(User, { foreignKey: 'created_by', as: 'createdBy' });

// Vendor - Material
Vendor.hasMany(Material, { foreignKey: 'supplier_id', as: 'materials' });
Material.belongsTo(Vendor, { foreignKey: 'supplier_id', as: 'supplier' });

// Customer - Lead
Customer.hasMany(Lead, { foreignKey: 'customer_id', as: 'leads' });
Lead.belongsTo(Customer, { foreignKey: 'customer_id', as: 'customer' });

// User - Customer (assigned)
User.hasMany(Customer, { foreignKey: 'assigned_to', as: 'assignedCustomers' });
Customer.belongsTo(User, { foreignKey: 'assigned_to', as: 'assignedUser' });

// User - Lead (assigned)
User.hasMany(Lead, { foreignKey: 'assigned_to', as: 'assignedLeads' });
Lead.belongsTo(User, { foreignKey: 'assigned_to', as: 'assignedUser' });

module.exports = {
  sequelize,
  User,
  Material,
  MaterialMovement,
  Employee,
  Attendance,
  LeaveRequest,
  Vendor,
  PurchaseOrder,
  Customer,
  Lead,
};
