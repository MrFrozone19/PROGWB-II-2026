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

router.get('/', autenticar, async (req, res, next) => {
  try {
    const filtro = req.usuario.rol === 'distribuidor' ? { distribuidorId: req.usuario.empresaId } : req.usuario.rol === 'comprador' ? { activo: true } : {};
    const productos = await Producto.find(filtro).populate('distribuidorId', 'razonSocial estadoVerificacion municipio tiempoEntrega pedidoMinimo formasPago recoleccion descripcionPublica');
    const visibles = req.usuario.rol === 'comprador' ? productos.filter(p => p.distribuidorId?.estadoVerificacion === 'verificada') : productos;
    const inventarios = await Inventario.find({ productoId: { $in: visibles.map(p => p._id) } });
    const mapa = new Map(inventarios.map(i => [String(i.productoId),i]));
    res.json(visibles.map(producto => ({ ...producto.toObject(), existencias: mapa.get(String(producto._id))?.existencias ?? 0, stockMinimo: mapa.get(String(producto._id))?.stockMinimo ?? 0, inventarioId: mapa.get(String(producto._id))?._id ?? null, fechaInventario: mapa.get(String(producto._id))?.fechaActualizacion ?? null })));
  } catch (e) { next(e); }
});
router.get('/:id', autenticar, async (req, res, next) => {
  try {
    const producto = await Producto.findById(req.params.id).populate('distribuidorId', 'razonSocial estadoVerificacion municipio tiempoEntrega pedidoMinimo formasPago recoleccion descripcionPublica');
    if (!producto || (req.usuario.rol === 'comprador' && (!producto.activo || producto.distribuidorId?.estadoVerificacion !== 'verificada')) || (req.usuario.rol === 'distribuidor' && String(producto.distribuidorId?._id) !== String(req.usuario.empresaId))) return res.status(404).json({ mensaje: 'Producto no encontrado.' });
    const inv = await Inventario.findOne({ productoId: producto._id });
    res.json({ ...producto.toObject(), existencias: inv?.existencias ?? 0, stockMinimo: inv?.stockMinimo ?? 0 });
  } catch(e) { next(e); }
});
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
