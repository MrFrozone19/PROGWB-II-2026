require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const mongoose = require('mongoose');
const dbURI = process.env.MONGODB_URI;

mongoose.connect(dbURI)
.then(() => console.log('Conectado a MongoDB'))
.catch((error) => {
    console.error('Error de conexion a MongoDB:', error.message);
});

const db = mongoose.connection;

process.on('SIGINT', function() {
  mongoose.disconnect();
});

db.on('disconnected', () => console.log('Desconectado de MongoDB'));