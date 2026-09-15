const express = require('express');
const { autenticar } = require('../middleware/auth');

function crearRouterCrud(Modelo) {
  const router = express.Router();

  router.use(autenticar);

  router.get('/', async (req, res, next) => {
    try {
      const registros = await Modelo.findAll({ order: [['id', 'ASC']] });
      res.json(registros);
    } catch (error) {
      next(error);
    }
  });

  router.get('/:id', async (req, res, next) => {
    try {
      const registro = await Modelo.findByPk(req.params.id);
      if (!registro) return res.status(404).json({ mensaje: 'Registro no encontrado.' });
      return res.json(registro);
    } catch (error) {
      return next(error);
    }
  });

  router.post('/', async (req, res, next) => {
    try {
      const registro = await Modelo.create(req.body);
      res.status(201).json(registro);
    } catch (error) {
      next(error);
    }
  });

  router.put('/:id', async (req, res, next) => {
    try {
      const registro = await Modelo.findByPk(req.params.id);
      if (!registro) return res.status(404).json({ mensaje: 'Registro no encontrado.' });
      await registro.update(req.body);
      return res.json(registro);
    } catch (error) {
      return next(error);
    }
  });

  router.delete('/:id', async (req, res, next) => {
    try {
      const registro = await Modelo.findByPk(req.params.id);
      if (!registro) return res.status(404).json({ mensaje: 'Registro no encontrado.' });
      await registro.destroy();
      return res.status(204).end();
    } catch (error) {
      return next(error);
    }
  });

  return router;
}

module.exports = crearRouterCrud;
