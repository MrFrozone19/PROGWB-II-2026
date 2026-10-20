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

  return res.status(500).json({ mensaje: 'Ocurrió un error interno en el servicio.' });
}

module.exports = manejarErrores;
