const express = require('express');
const { Transaccion, Pedido } = require('../models');
const { autenticar, autorizarRoles } = require('../middleware/auth');
const router = express.Router();
router.use(autenticar, autorizarRoles('administrador'));
router.get('/', async (req, res, next) => {
  try {
    const registros = await Transaccion.find().populate('pedidoId').sort({ fechaCreacion: -1 });
    res.json(registros);
  } catch (e) { next(e); }
});
router.get('/:id', async (req, res, next) => {
  try {
    const registro = await Transaccion.findById(req.params.id).populate('pedidoId');
    if (!registro) return res.status(404).json({ mensaje: 'Transacción no encontrada.' });
    res.json(registro);
  } catch (e) { next(e); }
});
module.exports = router;
