const configuracion = require('../models/Configuracion');

async function validarConfiguracion(req, res, next) {
  if (req.method !== 'POST' && req.method !== 'PUT') {
    return next();
  }
  const camposPermitidos = ['clave', 'valor', 'descripcion'];

  if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) {
    return res.status(400).json({ mensaje: 'El cuerpo de la solicitud debe ser un objeto JSON.' });
  }

  const camposRecibidos = Object.keys(req.body);
  const hayCamposInvalidos = camposRecibidos.some(campo => !camposPermitidos.includes(campo));
  if (hayCamposInvalidos) {
    return res.status(400).json({ mensaje: 'Se han recibido campos no permitidos en la solicitud.' });
  }

  let clave = req.body.clave;
  let valor = req.body.valor;

  if (req.method === 'PUT') {
    try {
        const registro = await configuracion.findById(req.params.id);
        if (!registro) {
            return res.status(404).json({ mensaje: 'Registro de configuración no encontrado.' });
        }
        if (clave === undefined) {
            clave = registro.clave;
        }
        if (valor === undefined) {
            valor = registro.valor;
        }
    } catch (error) {
        return next(error);
    }
  }

  if (clave === 'comision_porcentaje') {
    const porcentaje = Number(valor);
    if (isNaN(porcentaje) || porcentaje < 2 || porcentaje > 10) {
      return res.status(400).json({ mensaje: 'El valor de comision_porcentaje debe ser un número entre 2 y 10.' });
    }
  }
  next();
}

module.exports = validarConfiguracion;