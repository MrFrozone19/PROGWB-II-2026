const express = require('express');
const Notificacion = require('../models/Notificacion');
const { autenticar } = require('../middleware/auth');
const router = express.Router();
router.use(autenticar);
router.get('/', async (req, res, next) => {
  try { res.json(await Notificacion.find({ empresaId: req.usuario.empresaId }).sort({ fechaCreacion: -1 }).limit(40)); }
  catch (e) { next(e); }
});
router.put('/:id/leida', async (req, res, next) => {
  try {
    const aviso = await Notificacion.findOneAndUpdate({ _id: req.params.id, empresaId: req.usuario.empresaId }, { leida: true }, { returnDocument: 'after' });
    if (!aviso) return res.status(404).json({ mensaje: 'Aviso no encontrado.' });
    res.json(aviso);
  } catch (e) { next(e); }
});
module.exports = router;
