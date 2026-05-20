const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const MaterialMovement = sequelize.define('MaterialMovement', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  material_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  movement_type: {
    type: DataTypes.ENUM('inbound', 'outbound', 'transfer', 'adjustment'),
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  from_location: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  to_location: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  reference_number: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  performed_by: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: 'material_movements',
});

module.exports = MaterialMovement;
