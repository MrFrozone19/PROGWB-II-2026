const express = require('express');
const { Producto, Inventario, DetallePedido } = require('../models');
const { autenticar } = require('../middleware/auth');
const autorizarProductos = require('../middleware/autorizarProductos');

const router = express.Router();

function filtroProducto(req) {
  const filtro = { _id: req.params.id };
  if (req.usuario.rol === 'distribuidor') {
    filtro.distribuidorId = req.usuario.empresaId;
  }
  return filtro;
}

router.put('/:id', autenticar, autorizarProductos, async (req, res, next) => {
  try {
    const producto = await Producto.findOneAndUpdate(filtroProducto(req), req.body, {
      returnDocument: 'after',
      runValidators: true,
    });
    if (!producto) return res.status(404).json({ mensaje: 'Producto no encontrado.' });
    return res.json(producto);
  } catch (error) {
    return next(error);
  }
});

router.delete('/:id', autenticar, autorizarProductos, async (req, res, next) => {
  try {
    const [inventario, detalle] = await Promise.all([
      Inventario.exists({ productoId: req.params.id }),
      DetallePedido.exists({ productoId: req.params.id }),
    ]);
    if (inventario || detalle) {
      return res.status(409).json({ mensaje: 'No se puede eliminar un producto vinculado a inventario o pedidos. Puedes desactivarlo.' });
    }
    const producto = await Producto.findOneAndDelete(filtroProducto(req));
    if (!producto) return res.status(404).json({ mensaje: 'Producto no encontrado.' });
    return res.status(204).end();
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
