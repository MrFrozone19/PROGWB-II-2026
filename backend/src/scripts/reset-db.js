require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const sequelize = require('../config/database');
require('../models');
const sembrarDatos = require('../services/seed');

async function reiniciar() {
  await sequelize.sync({ force: true });
  await sembrarDatos();
  await sequelize.close();
  console.log('Base de datos reiniciada correctamente.');
}

reiniciar().catch((error) => {
  console.error(error);
  process.exit(1);
});
