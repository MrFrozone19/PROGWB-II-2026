const express = require('express');
const { Configuracion } = require('../models');
const HistorialComision = require('../models/HistorialComision');
const { autenticar, autorizarRoles } = require('../middleware/auth');
const router = express.Router();
router.use(autenticar, autorizarRoles('administrador'));
router.get('/', async (req, res, next) => {
  try {
    const configuraciones = await Configuracion.find({ clave: /^comision_/ }).sort({ clave: 1 });
    const historial = await HistorialComision.find().populate('usuarioId', 'nombre').sort({ fechaCreacion: -1 }).limit(100);
    res.json({ configuraciones, historial });
  } catch (e) { next(e); }
});
router.put('/', async (req, res, next) => {
  try {
    const { tipo, categoria, distribuidorId, porcentaje, vigenteDesde } = req.body;
    const pct = Number(porcentaje);
    if (!Number.isFinite(pct) || pct < 2 || pct > 10) return res.status(400).json({ mensaje: 'La comisión debe estar entre 2 y 10 %.' });
    if (!['general','categoria','distribuidor'].includes(tipo)) return res.status(400).json({ mensaje: 'Tipo de comisión inválido.' });
    if (tipo === 'categoria' && !String(categoria || '').trim()) return res.status(400).json({ mensaje: 'Indica la categoría.' });
    if (tipo === 'distribuidor' && !/^[a-f\d]{24}$/i.test(String(distribuidorId || ''))) return res.status(400).json({ mensaje: 'Selecciona un distribuidor.' });
    const fecha = vigenteDesde ? new Date(vigenteDesde) : new Date();
    if (isNaN(fecha.getTime())) return res.status(400).json({ mensaje: 'Fecha inválida.' });
    const clave = tipo === 'general' ? 'comision_porcentaje' : tipo === 'categoria' ? `comision_categoria_${categoria.trim()}` : `comision_distribuidor_${distribuidorId}`;
    await Configuracion.findOneAndUpdate({ clave }, { valor: String(pct), descripcion: JSON.stringify({ tipo, vigenteDesde: fecha.toISOString() }) }, { upsert: true, returnDocument: 'after', runValidators: true });
    await HistorialComision.create({ clave, porcentaje: pct, vigenteDesde: fecha, usuarioId: req.usuario._id });
    res.json({ mensaje: 'Comisión guardada.', clave, porcentaje: pct });
  } catch (e) { next(e); }
});
module.exports = router;
