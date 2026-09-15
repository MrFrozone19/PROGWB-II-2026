const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Inventario = sequelize.define('Inventario', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  productoId: { type: DataTypes.INTEGER, allowNull: false, unique: true, field: 'producto_id' },
  existencias: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0, validate: { min: 0 } },
  stockMinimo: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0, field: 'stock_minimo', validate: { min: 0 } },
}, {
  tableName: 'inventarios',
});

module.exports = Inventario;
