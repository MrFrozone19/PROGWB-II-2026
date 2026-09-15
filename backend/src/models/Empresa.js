const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Empresa = sequelize.define('Empresa', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  razonSocial: { type: DataTypes.STRING(150), allowNull: false },
  rfc: { type: DataTypes.STRING(13), allowNull: false, unique: true },
  tipo: {
    type: DataTypes.STRING(20),
    allowNull: false,
    validate: { isIn: [['comprador', 'distribuidor', 'ambos', 'plataforma']] },
  },
  giro: { type: DataTypes.STRING(120), allowNull: false },
  calle: { type: DataTypes.STRING(180), allowNull: false },
  colonia: { type: DataTypes.STRING(120), allowNull: false },
  codigoPostal: { type: DataTypes.STRING(5), allowNull: false, validate: { is: /^\d{5}$/ } },
  municipio: { type: DataTypes.STRING(100), allowNull: false },
  estadoVerificacion: {
    type: DataTypes.STRING(20),
    allowNull: false,
    defaultValue: 'pendiente',
    validate: { isIn: [['pendiente', 'verificada', 'rechazada']] },
  },
}, {
  tableName: 'empresas',
});

module.exports = Empresa;
