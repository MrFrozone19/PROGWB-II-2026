const express = require('express');
const { Producto, Inventario, Empresa } = require('../models');
const { autenticar, autorizarRoles } = require('../middleware/auth');
const router = express.Router();
router.use(autenticar);
const distancia = (a, b, c, d) => {
  const rad = x => x * Math.PI / 180;
  const v = Math.sin(rad((c-a)/2))**2 + Math.cos(rad(a))*Math.cos(rad(c))*Math.sin(rad((d-b)/2))**2;
  return Math.round(12742 * Math.asin(Math.min(1, Math.sqrt(v))) * 10) / 10;
};
router.get('/productos', async (req, res, next) => {
  try {
    const { q = '', categoria = '', precioMin, precioMax, radioKm, orden = 'cercania', soloStock } = req.query;
    if (typeof q !== 'string' || typeof categoria !== 'string') return res.status(400).json({ mensaje: 'Filtros inválidos.' });
    for (const valor of [precioMin, precioMax, radioKm]) if (valor !== undefined && (!Number.isFinite(Number(valor)) || Number(valor) < 0)) return res.status(400).json({ mensaje: 'Los filtros numéricos deben ser positivos.' });
    if (precioMin !== undefined && precioMax !== undefined && Number(precioMin) > Number(precioMax)) return res.status(400).json({ mensaje: 'El precio mínimo no puede superar al máximo.' });
    const filtro = { activo: true };
    if (q.trim()) { const texto = q.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); filtro.$or = [{ nombre: { $regex: texto, $options: 'i' } }, { descripcion: { $regex: texto, $options: 'i' } }, { sku: { $regex: texto, $options: 'i' } }]; }
    if (categoria.trim()) filtro.categoria = categoria.trim();
    if (precioMin !== undefined) filtro.precio = { ...filtro.precio, $gte: Number(precioMin) };
    if (precioMax !== undefined) filtro.precio = { ...filtro.precio, $lte: Number(precioMax) };
    const comprador = await Empresa.findById(req.usuario.empresaId);
    const ubicacion = comprador && Number.isFinite(comprador.latitud) && Number.isFinite(comprador.longitud);
    const productos = await Producto.find(filtro).populate('distribuidorId', 'razonSocial municipio estadoVerificacion latitud longitud tiempoEntrega pedidoMinimo formasPago recoleccion descripcionPublica');
    const validos = productos.filter(p => p.distribuidorId?.estadoVerificacion === 'verificada');
    const inventarios = await Inventario.find({ productoId: { $in: validos.map(p => p._id) } });
    const mapa = new Map(inventarios.map(i => [String(i.productoId), i]));
    let resultados = validos.map(p => {
      const inv = mapa.get(String(p._id)); const dist = ubicacion && Number.isFinite(p.distribuidorId.latitud) && Number.isFinite(p.distribuidorId.longitud) ? distancia(comprador.latitud, comprador.longitud, p.distribuidorId.latitud, p.distribuidorId.longitud) : null;
      return { ...p.toObject(), existencias: inv?.existencias ?? 0, distanciaKm: dist };
    });
    if (radioKm !== undefined) resultados = resultados.filter(p => p.distanciaKm !== null && p.distanciaKm <= Number(radioKm));
    if (soloStock === 'true') resultados = resultados.filter(p => p.existencias > 0);
    resultados.sort((a,b) => {
      if (orden === 'precio') return a.precio-b.precio;
      if (orden === 'existencias') return b.existencias-a.existencias;
      return (a.distanciaKm ?? 1e7)-(b.distanciaKm ?? 1e7) || (b.existencias>0)-(a.existencias>0);
    });
    res.json({ productos: resultados, ubicacionConfigurada: Boolean(ubicacion) });
  } catch (e) { next(e); }
});
router.get('/sugerencias', async (req, res, next) => {
  try {
    const q = String(req.query.q || '').trim();
    if (q.length < 2) return res.json([]);
    const rx = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const productos = await Producto.find({ activo: true, nombre: { $regex: rx, $options: 'i' } }).limit(8).populate('distribuidorId','estadoVerificacion');
    res.json(productos.filter(p=>p.distribuidorId?.estadoVerificacion === 'verificada').map(p=>({id:p.id,nombre:p.nombre})));
  } catch(e) { next(e); }
});
module.exports = router;
