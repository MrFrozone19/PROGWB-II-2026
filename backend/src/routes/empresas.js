const express = require('express');
const { Empresa, Usuario } = require('../models');
const enviarCorreo = require('../services/correo');
const { autenticar, autorizarRoles } = require('../middleware/auth');
const router = express.Router();
router.use(autenticar);

router.get('/', async (req, res, next) => {
  try {
    const filtro = req.usuario.rol === 'administrador' ? {} : { estadoVerificacion: 'verificada' };
    const empresas = await Empresa.find(filtro).sort({ fechaCreacion: -1 });
    res.json(empresas);
  } catch (e) { next(e); }
});
router.get('/mi-perfil', async (req, res, next) => {
  try {
    const empresa = await Empresa.findById(req.usuario.empresaId);
    if (!empresa) return res.status(404).json({ mensaje: 'Empresa no encontrada.' });
    res.json(empresa);
  } catch (e) { next(e); }
});
router.put('/mi-perfil', async (req, res, next) => {
  try {
    const campos = ['giro','calle','colonia','codigoPostal','municipio','latitud','longitud','descripcionPublica','tiempoEntrega','pedidoMinimo','formasPago','recoleccion','telefonoContacto'];
    if (Object.keys(req.body).some(k => !campos.includes(k))) return res.status(400).json({ mensaje: 'Se enviaron campos que no pueden modificarse.' });
    const empresa = await Empresa.findById(req.usuario.empresaId);
    if (!empresa) return res.status(404).json({ mensaje: 'Empresa no encontrada.' });
    Object.assign(empresa, req.body);
    await empresa.save();
    res.json(empresa);
  } catch (e) { next(e); }
});
router.get('/:id', async (req, res, next) => {
  try {
    const empresa = await Empresa.findById(req.params.id);
    if (!empresa || (req.usuario.rol !== 'administrador' && empresa.estadoVerificacion !== 'verificada')) return res.status(404).json({ mensaje: 'Empresa no encontrada.' });
    res.json(empresa);
  } catch (e) { next(e); }
});
router.put('/:id/verificar', autorizarRoles('administrador'), async (req, res, next) => {
  try {
    const { estado, motivo } = req.body;
    if (!['verificada', 'rechazada'].includes(estado)) return res.status(400).json({ mensaje: 'Estado inválido.' });
    if (estado === 'rechazada' && (!String(motivo || '').trim() || String(motivo).length > 255)) return res.status(400).json({ mensaje: 'Indica un motivo de rechazo de hasta 255 caracteres.' });
    const empresa = await Empresa.findById(req.params.id);
    if (!empresa) return res.status(404).json({ mensaje: 'Empresa no encontrada.' });
    if (empresa.tipo === 'plataforma') return res.status(403).json({ mensaje: 'La empresa de la plataforma no puede modificarse aquí.' });
    empresa.estadoVerificacion = estado;
    empresa.motivoRechazo = estado === 'rechazada' ? motivo.trim() : '';
    empresa.verificadoPor = req.usuario._id;
    empresa.fechaVerificacion = new Date();
    await empresa.save();
    let avisoCorreo = false;
    if (estado === 'rechazada') {
      const usuario = await Usuario.findOne({ empresaId: empresa._id });
      if (usuario) try { avisoCorreo = await enviarCorreo(usuario.correo, 'Registro de Enlace B2B rechazado', `Tu empresa ${empresa.razonSocial} no fue aprobada. Motivo: ${empresa.motivoRechazo}`); } catch(e) { console.error(e.message); }
    }
    res.json({ mensaje: `Empresa ${estado}.`, empresa, avisoCorreo });
  } catch (e) { next(e); }
});
module.exports = router;
