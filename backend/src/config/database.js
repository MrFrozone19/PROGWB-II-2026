const path = require('path');
const { Sequelize } = require('sequelize');

const almacenamiento = process.env.DB_STORAGE
  ? path.resolve(__dirname, '../../', process.env.DB_STORAGE)
  : path.resolve(__dirname, '../../data/enlace-b2b.sqlite');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: almacenamiento,
  logging: false,
  define: { underscored: true },
});

module.exports = sequelize;
