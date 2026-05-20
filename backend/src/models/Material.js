const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Material = sequelize.define('Material', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  sku: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
  },
  category: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  quantity: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  unit: {
    type: DataTypes.STRING(50),
    defaultValue: 'pieces',
  },
  unit_price: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
  },
  reorder_level: {
    type: DataTypes.INTEGER,
    defaultValue: 10,
  },
  location: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  supplier_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('in_stock', 'low_stock', 'out_of_stock'),
    defaultValue: 'in_stock',
  },
  barcode: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
}, {
  tableName: 'materials',
  hooks: {
    beforeSave: (material) => {
      if (material.quantity <= 0) {
        material.status = 'out_of_stock';
      } else if (material.quantity <= material.reorder_level) {
        material.status = 'low_stock';
      } else {
        material.status = 'in_stock';
      }
    },
  },
});

module.exports = Material;
