require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

const conectarDB = require('./config/database');

const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
require('./models');
const app = require('./app');
const sembrarDatos = require('./services/seed');
const { registrarEvento } = require('./services/logger');

const puerto = Number(process.env.PORT || 3000);

if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = 'desarrollo-local-enlace-b2b-2026';
}

async function iniciar() {
  try {
    fs.mkdirSync(path.resolve(__dirname, '../data'), { recursive: true });
    registrarEvento('info', 'servidor_inicio');
    await conectarDB();
    await sembrarDatos();
    const servidor = app.listen(puerto, () => {
      registrarEvento('info', 'servidor_listo', { puerto });
      console.log(`Enlace B2B Local disponible en http://localhost:${puerto}`);
    });

    const cerrar = async (senal) => {
      registrarEvento('info', 'servidor_cierre_inicio', { senal });
      servidor.close(async () => {
        await mongoose.disconnect();
        registrarEvento('info', 'servidor_cierre_fin', { senal });
        process.exit(0);
      });
    };

    process.on('SIGINT', () => cerrar('SIGINT'));
    process.on('SIGTERM', () => cerrar('SIGTERM'));
  } catch (error) {
    registrarEvento('error', 'servidor_error_inicio', { mensaje: error.message, stack: error.stack });
    console.error(error);
    process.exit(1);
  }
}

iniciar();
