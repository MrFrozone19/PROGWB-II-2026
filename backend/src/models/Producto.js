const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Producto = sequelize.define('Producto', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  distribuidorId: { type: DataTypes.INTEGER, allowNull: false, field: 'distribuidor_id' },
  sku: { type: DataTypes.STRING(50), allowNull: false },
  nombre: { type: DataTypes.STRING(140), allowNull: false },
  descripcion: { type: DataTypes.TEXT, allowNull: false },
  categoria: { type: DataTypes.STRING(80), allowNull: false },
  precio: { type: DataTypes.DECIMAL(12, 2), allowNull: false, validate: { min: 0 } },
  unidadMedida: { type: DataTypes.STRING(30), allowNull: false, field: 'unidad_medida' },
  activo: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
}, {
  tableName: 'productos',
  indexes: [{ unique: true, fields: ['distribuidor_id', 'sku'] }],
});

module.exports = Producto;
