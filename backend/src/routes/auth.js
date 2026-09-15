const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sequelize = require('../config/database');
const { Empresa, Usuario } = require('../models');
const { autenticar } = require('../middleware/auth');
const { registrarEvento } = require('../services/logger');

const router = express.Router();

router.post('/login', async (req, res, next) => {
  try {
    const correo = String(req.body.correo || '').trim().toLowerCase();
    const contrasena = String(req.body.contrasena || '');
    registrarEvento('info', 'login_inicio', { correo });

    const usuario = await Usuario.findOne({
      where: { correo },
      include: [{ model: Empresa, as: 'empresa' }],
    });

    if (!usuario || !usuario.activo || !(await bcrypt.compare(contrasena, usuario.passwordHash))) {
      registrarEvento('info', 'login_rechazado', { correo });
      return res.status(401).json({ mensaje: 'Correo o contraseña incorrectos.', motivo: 'credenciales' });
    }

    if (usuario.empresa.estadoVerificacion !== 'verificada') {
      registrarEvento('info', 'login_pendiente', { correo, empresaId: usuario.empresaId });
      return res.status(403).json({ mensaje: 'La empresa está en proceso de verificación.', motivo: 'pendiente' });
    }

    const token = jwt.sign(
      { id: usuario.id, empresaId: usuario.empresaId, rol: usuario.rol },
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
        empresa: usuario.empresa.razonSocial,
        empresaId: usuario.empresaId,
        rol: usuario.rol,
      },
    });
  } catch (error) {
    return next(error);
  }
});

router.post('/registro', async (req, res, next) => {
  const transaccion = await sequelize.transaction();
  try {
    const datos = req.body;
    const campos = ['razonSocial', 'rfc', 'tipoEmpresa', 'giro', 'calle', 'colonia', 'codigoPostal', 'municipio', 'nombreResponsable', 'telefono', 'correo', 'contrasena'];
    const faltantes = campos.filter((campo) => !String(datos[campo] || '').trim());
    if (faltantes.length > 0) {
      await transaccion.rollback();
      return res.status(400).json({ mensaje: 'Faltan campos obligatorios.', campos: faltantes });
    }
    if (!/^[A-ZÑ&]{3,4}\d{6}[A-Z\d]{3}$/.test(String(datos.rfc).trim().toUpperCase())) {
      await transaccion.rollback();
      return res.status(400).json({ mensaje: 'El RFC no tiene un formato válido.' });
    }
    if (!/^\d{5}$/.test(String(datos.codigoPostal).trim())) {
      await transaccion.rollback();
      return res.status(400).json({ mensaje: 'El código postal debe tener 5 dígitos.' });
    }
    if (!/^\d{10}$/.test(String(datos.telefono).replace(/\s/g, ''))) {
      await transaccion.rollback();
      return res.status(400).json({ mensaje: 'El teléfono debe tener 10 dígitos.' });
    }
    if (String(datos.contrasena).length < 8) {
      await transaccion.rollback();
      return res.status(400).json({ mensaje: 'La contraseña debe tener al menos 8 caracteres.' });
    }
    const rol = datos.tipoEmpresa === 'distribuidor' ? 'distribuidor' : 'comprador';
    const empresa = await Empresa.create({
      razonSocial: datos.razonSocial,
      rfc: String(datos.rfc || '').trim().toUpperCase(),
      tipo: datos.tipoEmpresa,
      giro: datos.giro,
      calle: datos.calle,
      colonia: datos.colonia,
      codigoPostal: datos.codigoPostal,
      municipio: datos.municipio,
      estadoVerificacion: 'pendiente',
    }, { transaction: transaccion });

    const passwordHash = await bcrypt.hash(String(datos.contrasena || ''), 10);
    const usuario = await Usuario.create({
      empresaId: empresa.id,
      nombre: datos.nombreResponsable,
      correo: String(datos.correo || '').trim().toLowerCase(),
      telefono: String(datos.telefono || '').replace(/\s/g, ''),
      passwordHash,
      rol,
      activo: true,
    }, { transaction: transaccion });

    await transaccion.commit();
    registrarEvento('info', 'registro_empresa', { empresaId: empresa.id, usuarioId: usuario.id });
    return res.status(201).json({
      mensaje: 'Registro recibido. La empresa quedó pendiente de verificación.',
      empresaId: empresa.id,
      usuarioId: usuario.id,
    });
  } catch (error) {
    await transaccion.rollback();
    return next(error);
  }
});

router.get('/perfil', autenticar, async (req, res, next) => {
  try {
    const usuario = await Usuario.findByPk(req.usuario.id, {
      attributes: { exclude: ['passwordHash'] },
      include: [{ model: Empresa, as: 'empresa' }],
    });
    if (!usuario) return res.status(404).json({ mensaje: 'Usuario no encontrado.' });
    return res.json(usuario);
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
