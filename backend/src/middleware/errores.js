const mongoose = require('mongoose');
const { registrarEvento } = require('../services/logger');

function manejarErrores(error, req, res, next) {
  registrarEvento('error', 'excepcion', {
    metodo: req.method,
    ruta: req.originalUrl,
    mensaje: error.message,
    stack: error.stack,
  });

  if (error instanceof mongoose.Error.ValidationError) {
    return res.status(400).json({
      mensaje: 'Los datos enviados no son válidos.',
      errores: Object.values(error.errors).map((e) => e.message),
    });
  }

  if (error instanceof mongoose.Error.CastError) {
    return res.status(400).json({ mensaje: 'El formato del ID no es válido.' });
  }

  if (error.name === 'MongoServerError' && error.code === 11000) {
    const camposDuplicados = Object.keys(error.keyValue);
    return res.status(409).json({
      mensaje: 'Los siguientes campos deben ser únicos y ya existen en la base de datos.',
      campos: camposDuplicados,
    });
  }

  if (error.type === 'entity.parse.failed') {
    return res.status(400).json({ mensaje: 'El cuerpo de la solicitud no es un JSON válido.' });
  }

  return res.status(500).json({ mensaje: 'Ocurrió un error interno en el servicio.' });
}

module.exports = manejarErrores;
