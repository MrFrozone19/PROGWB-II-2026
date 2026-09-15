const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Usuario = sequelize.define('Usuario', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  empresaId: { type: DataTypes.INTEGER, allowNull: false, field: 'empresa_id' },
  nombre: { type: DataTypes.STRING(120), allowNull: false },
  correo: { type: DataTypes.STRING(160), allowNull: false, unique: true, validate: { isEmail: true } },
  telefono: { type: DataTypes.STRING(10), allowNull: false, validate: { is: /^\d{10}$/ } },
  passwordHash: { type: DataTypes.STRING(255), allowNull: false, field: 'password_hash' },
  rol: {
    type: DataTypes.STRING(20),
    allowNull: false,
    validate: { isIn: [['comprador', 'distribuidor', 'administrador']] },
  },
  activo: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
}, {
  tableName: 'usuarios',
});

module.exports = Usuario;
