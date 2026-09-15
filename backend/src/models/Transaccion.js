const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Transaccion = sequelize.define('Transaccion', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  pedidoId: { type: DataTypes.INTEGER, allowNull: false, field: 'pedido_id' },
  tipo: { type: DataTypes.STRING(30), allowNull: false, defaultValue: 'venta' },
  monto: { type: DataTypes.DECIMAL(12, 2), allowNull: false, validate: { min: 0 } },
  estado: {
    type: DataTypes.STRING(20),
    allowNull: false,
    defaultValue: 'pendiente',
    validate: { isIn: [['pendiente', 'aprobada', 'rechazada', 'reembolsada']] },
  },
  referencia: { type: DataTypes.STRING(80), allowNull: true },
}, {
  tableName: 'transacciones',
});

module.exports = Transaccion;
