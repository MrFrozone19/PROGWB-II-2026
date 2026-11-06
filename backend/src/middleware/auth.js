const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Usuario = require('../models/Usuario');
const Empresa = require('../models/Empresa');

async function autenticar(req, res, next) {
  const encabezado = req.headers.authorization || '';
  const [tipo, token] = encabezado.split(' ');
  if (tipo !== 'Bearer' || !token) {
    return res.status(401).json({ mensaje: 'Token de autorización requerido.' });
  }

  try {
    req.usuario = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return res.status(401).json({ mensaje: 'Token inválido o vencido.' });
  }
  if (typeof req.usuario?.id !== 'string' || !mongoose.isValidObjectId(req.usuario.id)) {
    return res.status(401).json({ mensaje: 'Token inválido o vencido.' });
  }
  try {
    const usuario = await Usuario.findById(req.usuario.id).select('-passwordHash');
    if (!usuario) {
      return res.status(401).json({ mensaje: 'Usuario no encontrado.' });
    }
    if (!usuario.activo) {
      return res.status(401).json({ mensaje: 'Usuario inactivo. Contacta al administrador.' });
    }
    const empresa = await Empresa.findById(usuario.empresaId).select('estadoVerificacion');
    if (!empresa) {
      return res.status(401).json({ mensaje: 'Empresa del usuario no encontrada.' });
    }
    if (empresa.estadoVerificacion !== 'verificada') {
      return res.status(403).json({ mensaje: 'La empresa no está verificada. Contacta al administrador.' });
    }
    req.usuario = usuario;
  } catch (error) {
    return next(error);
  }
  return next();
}

function autorizarRoles(...roles) {
  return (req, res, next) => {
    if (!req.usuario || !roles.includes(req.usuario.rol)) {
      return res.status(403).json({ mensaje: 'No tienes permisos para realizar esta acción.' });
    }
    return next();
  };
}

module.exports = { autenticar, autorizarRoles };
