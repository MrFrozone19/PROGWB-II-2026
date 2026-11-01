require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const mongoose = require('mongoose');
const dbURI = process.env.MONGODB_URI;
const { registrarEvento } = require('../services/logger');

async function conectarDB() {
  try {
    await mongoose.connect(dbURI);
    registrarEvento('info', 'conexion_mongodb', { mensaje: 'Conectado a MongoDB' });
  } catch (error) {
    registrarEvento('error', 'conexion_mongodb', { mensaje: 'Error de conexion a MongoDB', error: error.message });
    throw error;
  }
}

const db = mongoose.connection;

process.on('SIGINT', function() {
  mongoose.disconnect();
});

db.on('disconnected', () => { 
  try {
    registrarEvento('info', 'conexion_mongodb', { mensaje: 'Desconectado de MongoDB' });
  } catch (error) {
    registrarEvento('error', 'conexion_mongodb', { mensaje: 'Error al registrar desconexion de MongoDB', error: error.message });
    throw error;
  }
});

module.exports = conectarDB;