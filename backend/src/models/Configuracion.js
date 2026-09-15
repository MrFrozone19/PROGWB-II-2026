const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Configuracion = sequelize.define('Configuracion', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  clave: { type: DataTypes.STRING(60), allowNull: false, unique: true },
  valor: { type: DataTypes.STRING(200), allowNull: false },
  descripcion: { type: DataTypes.STRING(255), allowNull: false },
}, {
  tableName: 'configuraciones',
});

module.exports = Configuracion;
