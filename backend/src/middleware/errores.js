const { ValidationError, UniqueConstraintError, ForeignKeyConstraintError } = require('sequelize');
const { registrarEvento } = require('../services/logger');

function manejarErrores(error, req, res, next) {
  registrarEvento('error', 'excepcion', {
    metodo: req.method,
    ruta: req.originalUrl,
    mensaje: error.message,
    stack: error.stack,
  });

  if (error instanceof ValidationError || error instanceof UniqueConstraintError) {
    return res.status(400).json({
      mensaje: 'Los datos enviados no son válidos.',
      errores: error.errors.map((item) => item.message),
    });
  }

  if (error instanceof ForeignKeyConstraintError) {
    return res.status(409).json({ mensaje: 'La operación viola una relación de la base de datos.' });
  }

  return res.status(500).json({ mensaje: 'Ocurrió un error interno en el servicio.' });
}

module.exports = manejarErrores;
