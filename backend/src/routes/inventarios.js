const express = require('express');
const mongoose = require('mongoose');
const { Inventario, Producto } = require('../models');
const { autenticar, autorizarRoles } = require('../middleware/auth');
const router = express.Router();
router.use(autenticar);

async function verificarProducto(req, id) {
  if (!mongoose.isValidObjectId(id)) return null;
  const producto = await Producto.findById(id);
  if (!producto) return null;
  if (req.usuario.rol !== 'administrador' && String(producto.distribuidorId) !== String(req.usuario.empresaId)) return null;
  return producto;
}
router.get('/', async (req, res, next) => {
  try {
    if (req.usuario.rol === 'comprador') return res.status(403).json({ mensaje: 'No tienes permisos para consultar inventarios.' });
    let ids;
    if (req.usuario.rol === 'distribuidor') {
      ids = (await Producto.find({ distribuidorId: req.usuario.empresaId }).select('_id')).map(p => p._id);
    }
    res.json(await Inventario.find(ids ? { productoId: { $in: ids } } : {}).populate('productoId', 'nombre sku categoria unidadMedida distribuidorId activo precio'));
  } catch (e) { next(e); }
});
router.get('/:id', async (req, res, next) => {
  try {
    const registro = await Inventario.findById(req.params.id);
    if (!registro || !(await verificarProducto(req, registro.productoId))) return res.status(404).json({ mensaje: 'Inventario no encontrado.' });
    res.json(registro);
  } catch (e) { next(e); }
});
router.post('/', autorizarRoles('distribuidor','administrador'), async (req, res, next) => {
  try {
    if (!(await verificarProducto(req, req.body.productoId))) return res.status(403).json({ mensaje: 'El producto no pertenece a tu empresa.' });
    const inventario = await Inventario.create({ productoId: req.body.productoId, existencias: req.body.existencias, stockMinimo: req.body.stockMinimo });
    res.status(201).json(inventario);
  } catch (e) { next(e); }
});
router.put('/:id', autorizarRoles('distribuidor','administrador'), async (req, res, next) => {
  try {
    if (Object.keys(req.body).some(k => !['existencias','stockMinimo','fechaActualizacion'].includes(k))) return res.status(400).json({ mensaje: 'No puedes cambiar el producto vinculado al inventario.' });
    const actual = await Inventario.findById(req.params.id);
    if (!actual || !(await verificarProducto(req, actual.productoId))) return res.status(404).json({ mensaje: 'Inventario no encontrado.' });
    const datos = {};
    if (req.body.existencias !== undefined) datos.existencias = req.body.existencias;
    if (req.body.stockMinimo !== undefined) datos.stockMinimo = req.body.stockMinimo;
    if (Object.keys(datos).length === 0) return res.status(400).json({ mensaje: 'No se indicaron cantidades a guardar.' });
    const filtro = { _id: actual._id };
    if (req.body.fechaActualizacion) {
      const version = new Date(req.body.fechaActualizacion);
      if (isNaN(version.getTime())) return res.status(400).json({ mensaje: 'Fecha de actualización inválida.' });
      filtro.fechaActualizacion = version;
    }
    const actualizado = await Inventario.findOneAndUpdate(filtro, { $set: datos }, { returnDocument: 'after', runValidators: true });
    if (!actualizado) return res.status(409).json({ mensaje: 'El inventario cambió desde que abriste la pantalla. Recarga antes de guardar.' });
    res.json(actualizado);
  } catch (e) { next(e); }
});
router.delete('/:id', autorizarRoles('administrador'), async (req, res, next) => {
  try {
    const actual = await Inventario.findById(req.params.id);
    if (!actual) return res.status(404).json({ mensaje: 'Inventario no encontrado.' });
    await actual.deleteOne(); res.status(204).end();
  } catch (e) { next(e); }
});
module.exports = router;
