const express = require('express');
const mongoose = require('mongoose');
const { Pedido } = require('../models');
const Calificacion = require('../models/Calificacion');
const { autenticar, autorizarRoles } = require('../middleware/auth');
const router = express.Router();
router.use(autenticar);
router.get('/distribuidor/:id', async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ mensaje: 'ID inválido.' });
    const lista = await Calificacion.find({ distribuidorId: req.params.id });
    const promedio = lista.length ? Math.round(10*lista.reduce((s,r)=>s+r.puntuacion,0)/lista.length)/10 : null;
    res.json({ promedio, total: lista.length, opiniones: lista.slice(-20).map(r=>({ puntuacion:r.puntuacion, comentario:r.comentario })) });
  } catch(e) { next(e); }
});
router.post('/', autorizarRoles('comprador'), async (req, res, next) => {
  try {
    const puntuacion=Number(req.body.puntuacion),comentario=String(req.body.comentario||'');
    if (!Number.isInteger(puntuacion)||puntuacion<1||puntuacion>5||comentario.length>300) return res.status(400).json({ mensaje: 'Calificación de 1 a 5 y comentario máximo de 300 caracteres.' });
    const pedido=await Pedido.findById(req.body.pedidoId);
    if (!pedido || String(pedido.compradorId)!==String(req.usuario.empresaId)) return res.status(404).json({ mensaje: 'Pedido no encontrado.' });
    if (pedido.estado!=='entregado') return res.status(409).json({ mensaje: 'Solo puedes calificar pedidos entregados.' });
    const calificacion=await Calificacion.create({ pedidoId:pedido._id, compradorId:pedido.compradorId, distribuidorId:pedido.distribuidorId, puntuacion, comentario });
    res.status(201).json(calificacion);
  } catch(e) { next(e); }
});
module.exports=router;
