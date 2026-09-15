const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Pedido = sequelize.define('Pedido', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  compradorId: { type: DataTypes.INTEGER, allowNull: false, field: 'comprador_id' },
  distribuidorId: { type: DataTypes.INTEGER, allowNull: false, field: 'distribuidor_id' },
  estado: {
    type: DataTypes.STRING(25),
    allowNull: false,
    defaultValue: 'pendiente',
    validate: { isIn: [['pendiente', 'aceptado', 'en_preparacion', 'en_camino', 'entregado', 'cancelado']] },
  },
  subtotal: { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0, validate: { min: 0 } },
  comisionPct: { type: DataTypes.DECIMAL(5, 2), allowNull: false, defaultValue: 5, field: 'comision_pct', validate: { min: 0, max: 100 } },
  comisionMonto: { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0, field: 'comision_monto', validate: { min: 0 } },
  total: { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0, validate: { min: 0 } },
  fechaEstimada: { type: DataTypes.DATE, allowNull: true, field: 'fecha_estimada' },
}, {
  tableName: 'pedidos',
});

module.exports = Pedido;
