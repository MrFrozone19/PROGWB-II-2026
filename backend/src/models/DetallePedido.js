const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const DetallePedido = sequelize.define('DetallePedido', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  pedidoId: { type: DataTypes.INTEGER, allowNull: false, field: 'pedido_id' },
  productoId: { type: DataTypes.INTEGER, allowNull: false, field: 'producto_id' },
  cantidad: { type: DataTypes.INTEGER, allowNull: false, validate: { min: 1 } },
  precioUnitario: { type: DataTypes.DECIMAL(12, 2), allowNull: false, field: 'precio_unitario', validate: { min: 0 } },
  subtotal: { type: DataTypes.DECIMAL(12, 2), allowNull: false, validate: { min: 0 } },
}, {
  tableName: 'detalles_pedido',
});

module.exports = DetallePedido;
