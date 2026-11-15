const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const enviarCorreo = require('../services/correo');
const { Empresa, Usuario } = require('../models');
const { autenticar } = require('../middleware/auth');
const { registrarEvento } = require('../services/logger');

const router = express.Router();

router.post('/login', async (req, res, next) => {
  try {
    const correo = String(req.body.correo || '').trim().toLowerCase();
    const contrasena = String(req.body.contrasena || '');
    registrarEvento('info', 'login_inicio', { correo });

    const usuario = await Usuario.findOne({correo}).populate('empresaId');

    if (!usuario || !usuario.activo || !(await bcrypt.compare(contrasena, usuario.passwordHash))) {
      registrarEvento('info', 'login_rechazado', { correo });
      return res.status(401).json({ mensaje: 'Correo o contraseña incorrectos.', motivo: 'credenciales' });
    }

    if (!usuario.empresaId) {
      registrarEvento('info', 'login_rechazado', { correo });
      return res.status(403).json({ mensaje: 'El usuario no está asociado a ninguna empresa.', motivo: 'sin_empresa' });
    }

    if (usuario.empresaId.estadoVerificacion !== 'verificada') {
      registrarEvento('info', 'login_pendiente', { correo, empresaId: usuario.empresaId._id });
      return res.status(403).json({ mensaje: usuario.empresaId.estadoVerificacion === 'rechazada' ? `Empresa rechazada: ${usuario.empresaId.motivoRechazo || 'Contacta al administrador.'}` : 'La empresa está en proceso de verificación.', motivo: usuario.empresaId.estadoVerificacion === 'rechazada' ? 'rechazada' : 'pendiente' });
    }

    const token = jwt.sign(
      { id: usuario.id, empresaId: usuario.empresaId._id, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRA || '30m' },
    );

    registrarEvento('info', 'login_exitoso', { usuarioId: usuario.id, rol: usuario.rol });
    return res.json({
      token,
      usuario: {
        id: usuario.id,
        correo: usuario.correo,
        nombre: usuario.nombre,
        empresa: usuario.empresaId.razonSocial,
        empresaId: usuario.empresaId._id,
        rol: usuario.rol,
        tipoEmpresa: usuario.empresaId.tipo,
      },
    });
  } catch (error) {
    return next(error);
  }
});

router.post('/registro', async (req, res, next) => {
  try {
    const datos = req.body;
    const campos = ['razonSocial', 'rfc', 'tipoEmpresa', 'giro', 'calle', 'colonia', 'codigoPostal', 'municipio', 'nombreResponsable', 'telefono', 'correo', 'contrasena'];
    const faltantes = campos.filter((campo) => !String(datos[campo] || '').trim());
    if (faltantes.length > 0) {
      return res.status(400).json({ mensaje: 'Faltan campos obligatorios.', campos: faltantes });
    }
    if (!/^[A-ZÑ&]{3,4}\d{6}[A-Z\d]{3}$/.test(String(datos.rfc).trim().toUpperCase())) {
      return res.status(400).json({ mensaje: 'El RFC no tiene un formato válido.' });
    }
    if (!/^\d{5}$/.test(String(datos.codigoPostal).trim())) {
      return res.status(400).json({ mensaje: 'El código postal debe tener 5 dígitos.' });
    }
    if (!/^\d{10}$/.test(String(datos.telefono).replace(/\s/g, ''))) {
      return res.status(400).json({ mensaje: 'El teléfono debe tener 10 dígitos.' });
    }
    if (String(datos.contrasena).length < 8) {
      return res.status(400).json({ mensaje: 'La contraseña debe tener al menos 8 caracteres.' });
    }
    const rol = datos.tipoEmpresa === 'distribuidor' ? 'distribuidor' : 'comprador';
    const hayLatitud = datos.latitud !== undefined && datos.latitud !== null;
    const hayLongitud = datos.longitud !== undefined && datos.longitud !== null;
    if (hayLatitud !== hayLongitud) {
      return res.status(400).json({ mensaje: 'Si se proporciona latitud, también debe proporcionarse longitud, y viceversa.' });
    }
    const empresa = await Empresa.create({
      latitud: datos.latitud,
      longitud: datos.longitud,
      razonSocial: datos.razonSocial,
      rfc: String(datos.rfc || '').trim().toUpperCase(),
      tipo: datos.tipoEmpresa,
      giro: datos.giro,
      calle: datos.calle,
      colonia: datos.colonia,
      codigoPostal: datos.codigoPostal,
      municipio: datos.municipio,
      estadoVerificacion: 'pendiente',
    });

    const passwordHash = await bcrypt.hash(String(datos.contrasena || ''), 10);
    let usuario;
    try {
      usuario = await Usuario.create({
      empresaId: empresa.id,
      nombre: datos.nombreResponsable,
      correo: String(datos.correo || '').trim().toLowerCase(),
      telefono: String(datos.telefono || '').replace(/\s/g, ''),
      passwordHash,
      rol,
      activo: true,
    });
  } catch (error) {
        await empresa.deleteOne();
        throw error;
  }

    registrarEvento('info', 'registro_empresa', { empresaId: empresa.id, usuarioId: usuario.id });
    return res.status(201).json({
      mensaje: 'Registro recibido. La empresa quedó pendiente de verificación.',
      empresaId: empresa.id,
      usuarioId: usuario.id,
    });
  } catch (error) {
    return next(error);
  }
});

router.post('/cambiar-rol', autenticar, async (req, res, next) => {
  try {
    const empresa = await Empresa.findById(req.usuario.empresaId);
    const rol = req.body.rol;
    if (empresa?.tipo !== 'ambos' || !['comprador','distribuidor'].includes(rol)) return res.status(403).json({ mensaje: 'Esta cuenta no puede cambiar de rol.' });
    await Usuario.findByIdAndUpdate(req.usuario.id, { rol });
    const token = jwt.sign({ id: req.usuario.id, rol, empresaId: req.usuario.empresaId }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRA || '30m' });
    res.json({ rol, token });
  } catch(e) { next(e); }
});
router.put('/contrasena', autenticar, async (req, res, next) => {
  try {
    const actual = String(req.body.actual || ''), nueva = String(req.body.nueva || '');
    if (nueva.length < 8) return res.status(400).json({ mensaje: 'La contraseña nueva debe tener al menos 8 caracteres.' });
    const usuario = await Usuario.findById(req.usuario.id);
    if (!(await bcrypt.compare(actual, usuario.passwordHash))) return res.status(403).json({ mensaje: 'La contraseña actual no es correcta.' });
    usuario.passwordHash = await bcrypt.hash(nueva, 10);
    await usuario.save(); res.json({ mensaje: 'Contraseña cambiada.' });
  } catch(e) { next(e); }
});

router.post('/recuperar', async (req, res, next) => {
  try {
    if (!process.env.RESEND_API_KEY || !process.env.CORREO_REMITENTE || !process.env.APP_URL) return res.status(503).json({ mensaje: 'El correo todavía no está configurado. Contacta al administrador.' });
    const correo=String(req.body.correo||'').trim().toLowerCase();
    const usuario=await Usuario.findOne({correo}).select('+ultimaRecuperacion');
    if (usuario && (!usuario.ultimaRecuperacion || Date.now()-new Date(usuario.ultimaRecuperacion).getTime()>60000)) {
      const token=crypto.randomBytes(32).toString('hex');
      usuario.resetTokenHash=crypto.createHash('sha256').update(token).digest('hex');
      usuario.resetVence=new Date(Date.now()+30*60000);
      usuario.ultimaRecuperacion=new Date();
      await usuario.save();
      const url=process.env.APP_URL.replace(/\/$/,'')+`/pantallas/23-restablecer-contrasena.html?correo=${encodeURIComponent(correo)}&token=${token}`;
      await enviarCorreo(correo,'Restablecer contraseña Enlace B2B',`Abre este enlace para establecer una nueva contraseña. Vence en 30 minutos: ${url}`);
    }
    res.json({ mensaje: 'Si el correo está registrado, se enviará un enlace temporal.' });
  } catch(e) { next(e); }
});
router.post('/restablecer', async (req, res, next) => {
  try {
    const correo=String(req.body.correo||'').trim().toLowerCase(),token=String(req.body.token||''),nueva=String(req.body.nueva||'');
    if (!/^[0-9a-f]{64}$/.test(token)||nueva.length<8) return res.status(400).json({ mensaje: 'Token o contraseña no válidos.' });
    const usuario=await Usuario.findOne({correo}).select('+resetTokenHash +resetVence');
    const hash=crypto.createHash('sha256').update(token).digest('hex');
    if (!usuario || usuario.resetTokenHash!==hash || !usuario.resetVence || usuario.resetVence<Date.now()) return res.status(400).json({ mensaje: 'El enlace no es válido o venció.' });
    usuario.passwordHash=await bcrypt.hash(nueva,10);
    usuario.resetTokenHash=undefined;usuario.resetVence=undefined;
    await usuario.save();
    res.json({ mensaje: 'Contraseña actualizada. Ya puedes iniciar sesión.' });
  } catch(e) { next(e); }
});

router.get('/perfil', autenticar, async (req, res, next) => {
  try {
    const usuario = await Usuario.findById(req.usuario.id).select({ passwordHash: 0 }).populate('empresaId');

    if (!usuario) return res.status(404).json({ mensaje: 'Usuario no encontrado.' });
    return res.json(usuario);
  } catch (error) {
    return next(error);
  }
});

module.exports = router;