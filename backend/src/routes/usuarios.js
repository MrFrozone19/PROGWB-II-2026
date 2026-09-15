const express = require('express');
const bcrypt = require('bcryptjs');
const { Usuario } = require('../models');
const { autenticar } = require('../middleware/auth');

const router = express.Router();
router.use(autenticar);

const atributosPublicos = { exclude: ['passwordHash'] };

router.get('/', async (req, res, next) => {
  try {
    const usuarios = await Usuario.findAll({ attributes: atributosPublicos, order: [['id', 'ASC']] });
    res.json(usuarios);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id, { attributes: atributosPublicos });
    if (!usuario) return res.status(404).json({ mensaje: 'Usuario no encontrado.' });
    return res.json(usuario);
  } catch (error) {
    return next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const contrasena = String(req.body.contrasena || '');
    if (contrasena.length < 8) return res.status(400).json({ mensaje: 'La contraseña debe tener al menos 8 caracteres.' });

    const usuario = await Usuario.create({
      empresaId: req.body.empresaId,
      nombre: req.body.nombre,
      correo: String(req.body.correo || '').trim().toLowerCase(),
      telefono: String(req.body.telefono || '').replace(/\s/g, ''),
      passwordHash: await bcrypt.hash(contrasena, 10),
      rol: req.body.rol,
      activo: req.body.activo !== false,
    });
    const respuesta = usuario.toJSON();
    delete respuesta.passwordHash;
    return res.status(201).json(respuesta);
  } catch (error) {
    return next(error);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id);
    if (!usuario) return res.status(404).json({ mensaje: 'Usuario no encontrado.' });

    const cambios = { ...req.body };
    delete cambios.passwordHash;
    if (cambios.correo) cambios.correo = String(cambios.correo).trim().toLowerCase();
    if (cambios.telefono) cambios.telefono = String(cambios.telefono).replace(/\s/g, '');
    if (cambios.contrasena) {
      if (String(cambios.contrasena).length < 8) return res.status(400).json({ mensaje: 'La contraseña debe tener al menos 8 caracteres.' });
      cambios.passwordHash = await bcrypt.hash(String(cambios.contrasena), 10);
      delete cambios.contrasena;
    }

    await usuario.update(cambios);
    const respuesta = usuario.toJSON();
    delete respuesta.passwordHash;
    return res.json(respuesta);
  } catch (error) {
    return next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id);
    if (!usuario) return res.status(404).json({ mensaje: 'Usuario no encontrado.' });
    await usuario.destroy();
    return res.status(204).end();
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
