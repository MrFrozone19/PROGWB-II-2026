const mongoose = require('mongoose');
const { Producto } = require('../models');

const camposProducto = ['distribuidorId', 'sku', 'nombre', 'descripcion', 'categoria', 'precio', 'unidadMedida', 'activo'];

const autorizarProductos = async (req, res, next) => {
  try {
    const rolesPermitidos = ['distribuidor', 'administrador'];
    if (!req.usuario || !rolesPermitidos.includes(req.usuario.rol)) {
      return res.status(403).json({ mensaje: 'No tienes permisos para administrar productos.' });
    }

    if (!['POST', 'PUT', 'DELETE'].includes(req.method)) {
      return res.status(405).json({ mensaje: 'Método no permitido para administrar productos.' });
    }

    if (req.method === 'POST' || req.method === 'PUT') {
      if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) {
        return res.status(400).json({ mensaje: 'El cuerpo de la solicitud debe ser un objeto JSON.' });
      }
      if (Object.keys(req.body).some((campo) => !camposProducto.includes(campo))) {
        return res.status(400).json({ mensaje: 'Se han recibido campos no permitidos en la solicitud.' });
      }
    }

    if (req.method === 'POST') {
      const { distribuidorId } = req.body;
      if (typeof distribuidorId !== 'string' || !mongoose.isValidObjectId(distribuidorId)) {
        return res.status(400).json({ mensaje: 'El distribuidorId debe ser un ID válido de MongoDB.' });
      }
      if (req.usuario.rol === 'distribuidor' && String(req.usuario.empresaId).toLowerCase() !== distribuidorId.toLowerCase()) {
        return res.status(403).json({ mensaje: 'No puedes crear productos para otra empresa.' });
      }
      return next();
    }

    if (typeof req.params.id !== 'string' || !mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ mensaje: 'El ID del producto no es válido.' });
    }
    if (req.method === 'PUT' && Object.hasOwn(req.body, 'distribuidorId')) {
      return res.status(400).json({ mensaje: 'No se puede cambiar el distribuidor de un producto.' });
    }

    const producto = await Producto.findById(req.params.id).select('distribuidorId');
    if (!producto) {
      return res.status(404).json({ mensaje: 'Producto no encontrado.' });
    }
    if (req.usuario.rol === 'distribuidor' && String(producto.distribuidorId) !== String(req.usuario.empresaId)) {
      return res.status(403).json({ mensaje: 'No puedes administrar productos de otra empresa.' });
    }
    return next();
  } catch (error) {
    return next(error);
  }
};

module.exports = autorizarProductos;