const express = require('express');
const { autenticar } = require('../middleware/auth');
const { Pedido, Inventario, DetallePedido, Empresa } = require('../models');

const router = express.Router();
router.use(autenticar);

router.get('/ventas-por-distribuidor', async (req, res, next) => {
  try {
    const filtro = { estado: 'entregado' };
    if (req.query.desde) {
      const fechaDesde = new Date(req.query.desde);
      if (isNaN(fechaDesde.getTime())) {
        return res.status(400).json({ error: 'Formato de fecha inválido para "desde".' });
      }
      filtro.fechaCreacion = { $gte: fechaDesde };
    }

    if (req.query.hasta) {
      const fechaHasta = new Date(req.query.hasta);
      if (isNaN(fechaHasta.getTime())) {
        return res.status(400).json({ error: 'Formato de fecha inválido para "hasta".' });
      }
      fechaHasta.setUTCHours(23, 59, 59, 999); // Ajusta la fecha hasta el final del día
      filtro.fechaCreacion = filtro.fechaCreacion || {};
      filtro.fechaCreacion.$lte = fechaHasta;
    }

    if (req.query.desde && req.query.hasta) {
      if (filtro.fechaCreacion.$gte > filtro.fechaCreacion.$lte) {
        return res.status(400).json({ error: 'La fecha "desde" no puede ser mayor que la fecha "hasta".' });
      }
    }

    const pedidos = await Pedido.find(filtro).populate('distribuidorId', 'razonSocial');

    const acumulado = new Map();
    pedidos.forEach((pedido) => {
      const clave = pedido.distribuidorId.id;
      const actual = acumulado.get(clave) || { distribuidorId: clave, distribuidor: pedido.distribuidorId.razonSocial, pedidos: 0, ventas: 0 };
      actual.pedidos += 1;
      actual.ventas += Number(pedido.total);
      acumulado.set(clave, actual);
    });
    res.json([...acumulado.values()]);
  } catch (error) {
    next(error);
  }
});

router.get('/compras-por-comprador', async (req, res, next) => {
  const filtro = { estado: { $ne: 'cancelado' } };
  if (req.query.desde) {
    const fechaDesde = new Date(req.query.desde);
    if (isNaN(fechaDesde.getTime())) {
      return res.status(400).json({ error: 'Formato de fecha inválido para "desde".' });
    }
    filtro.fechaCreacion = { $gte: fechaDesde };
  }
  if (req.query.hasta) {
    const fechaHasta = new Date(req.query.hasta);
    if (isNaN(fechaHasta.getTime())) {
      return res.status(400).json({ error: 'Formato de fecha inválido para "hasta".' });
    }
    fechaHasta.setUTCHours(23, 59, 59, 999); // Ajusta la fecha hasta el final del día
    filtro.fechaCreacion = filtro.fechaCreacion || {};
    filtro.fechaCreacion.$lte = fechaHasta;
  }
  if (req.query.desde && req.query.hasta) {
    if (filtro.fechaCreacion.$gte > filtro.fechaCreacion.$lte) {
      return res.status(400).json({ error: 'La fecha "desde" no puede ser mayor que la fecha "hasta".' });
    }
  }
  try {
    const pedidos = await Pedido.find(filtro).populate('compradorId', 'razonSocial');
    const acumulado = new Map();
    pedidos.forEach((pedido) => {
      const clave = pedido.compradorId.id;
      const actual = acumulado.get(clave) || { compradorId: clave, comprador: pedido.compradorId.razonSocial, pedidos: 0, compras: 0 };
      actual.pedidos += 1;
      actual.compras += Number(pedido.total);
      acumulado.set(clave, actual);
    });
    res.json([...acumulado.values()]);
  } catch (error) {
    next(error);
  }
});

router.get('/inventario-bajo', async (req, res, next) => {
  try {
    const registros = await Inventario.find({ $expr: { $lte: ['$existencias', '$stockMinimo'] } }).populate('productoId', 'sku nombre distribuidorId');
    res.json(registros);  
  } catch (error) {
    next(error);
  }
});

router.get('/comisiones', async (req, res, next) => {
  try {
    const filtro = { estado: 'entregado' };
    if (req.query.desde) {
      const fechaDesde = new Date(req.query.desde);
      if (isNaN(fechaDesde.getTime())) {
        return res.status(400).json({ error: 'Formato de fecha inválido para "desde".' });
      }
      filtro.fechaCreacion = { $gte: fechaDesde };
    }
    if (req.query.hasta) {
      const fechaHasta = new Date(req.query.hasta);
      if (isNaN(fechaHasta.getTime())) {
        return res.status(400).json({ error: 'Formato de fecha inválido para "hasta".' });
      }
      fechaHasta.setUTCHours(23, 59, 59, 999); // Ajusta la fecha hasta el final del día
      filtro.fechaCreacion = filtro.fechaCreacion || {};
      filtro.fechaCreacion.$lte = fechaHasta;
    }
    if (filtro.fechaCreacion && filtro.fechaCreacion.$gte && filtro.fechaCreacion.$lte) {
      if (filtro.fechaCreacion.$gte > filtro.fechaCreacion.$lte) {
        return res.status(400).json({ error: 'La fecha "desde" no puede ser mayor que la fecha "hasta".' });
      }
    }
    const pedidos = await Pedido.find(filtro).populate('distribuidorId', 'razonSocial');
    const total = pedidos.reduce((suma, pedido) => suma + Number(pedido.comisionMonto), 0);
    const acumulado = new Map();
    pedidos.forEach((pedido) => {
      const clave = pedido.distribuidorId.id;
      const actual = acumulado.get(clave) || { distribuidorId: clave, distribuidor: pedido.distribuidorId.razonSocial, comisionMonto: 0 };
      actual.comisionMonto += Number(pedido.comisionMonto);
      acumulado.set(clave, actual);
    });
    res.json({ pedidos: pedidos.length, comisionTotal: total, detalle: [...acumulado.values()] });
  } catch (error) {
    next(error);
  }
});

router.get('/detalle-pedido/productos-mas-solicitados', async (req, res, next) => {
  try {
    const filtro = { estado: 'entregado' };
    if (req.query.desde) {
      const fechaDesde = new Date(req.query.desde);
      if (isNaN(fechaDesde.getTime())) {
        return res.status(400).json({ error: 'Formato de fecha inválido para "desde".' });
      }
      filtro.fechaCreacion = { $gte: fechaDesde };
    }
    if (req.query.hasta) {
      const fechaHasta = new Date(req.query.hasta);
      if (isNaN(fechaHasta.getTime())) {
        return res.status(400).json({ error: 'Formato de fecha inválido para "hasta".' });
      }
      fechaHasta.setUTCHours(23, 59, 59, 999); // Ajusta la fecha hasta el final del día
      filtro.fechaCreacion = filtro.fechaCreacion || {};
      filtro.fechaCreacion.$lte = fechaHasta;
    }
    if (filtro.fechaCreacion && filtro.fechaCreacion.$gte && filtro.fechaCreacion.$lte) {
      if (filtro.fechaCreacion.$gte > filtro.fechaCreacion.$lte) {
        return res.status(400).json({ error: 'La fecha "desde" no puede ser mayor que la fecha "hasta".' });
      }
    }
    const pedidosEntregados = await Pedido.find(filtro).select('_id');
    const pedidoIds = pedidosEntregados.map(pedido => pedido._id);
    const detallePedidos = await DetallePedido.aggregate([
      {
        $match: {
          pedidoId: { $in: pedidoIds }
        }
      },
      {
        $group: {
          _id: '$productoId',
          cantidad: { $sum: '$cantidad' }
        }
      },
      {
        $lookup: {
          from: 'productos',
          localField: '_id',
          foreignField: '_id',
          as: 'producto'
        }
      },
      {
        $unwind: {
          path: '$producto',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          _id: 0,
          productoId: '$_id',
          nombre: { $ifNull: ['$producto.nombre', 'Producto no disponible'] },
          cantidad: 1
        }
      },
      {
        $sort: { cantidad: -1 }
      },
      {
        $limit: 10
      }
    ]);
    res.json(detallePedidos);
  } catch (error) {
    next(error);
  }
});

router.get('/empresas-activas', async (req, res, next) => {
  try {
    const filtro = { estado: 'entregado' };
    if (req.query.desde) {
      const fechaDesde = new Date(req.query.desde);
      if (isNaN(fechaDesde.getTime())) {
        return res.status(400).json({ error: 'Formato de fecha inválido para "desde".' });
      }
      filtro.fechaCreacion = { $gte: fechaDesde };
    }
    if (req.query.hasta) {
      const fechaHasta = new Date(req.query.hasta);
      if (isNaN(fechaHasta.getTime())) {
        return res.status(400).json({ error: 'Formato de fecha inválido para "hasta".' });
      }
      fechaHasta.setUTCHours(23, 59, 59, 999); // Ajusta la fecha hasta el final del día
      filtro.fechaCreacion = filtro.fechaCreacion || {};
      filtro.fechaCreacion.$lte = fechaHasta;
    }
    if (filtro.fechaCreacion && filtro.fechaCreacion.$gte && filtro.fechaCreacion.$lte) {
      if (filtro.fechaCreacion.$gte > filtro.fechaCreacion.$lte) {
        return res.status(400).json({ error: 'La fecha "desde" no puede ser mayor que la fecha "hasta".' });
      }
    }
    const empresas = await Pedido.aggregate([
      {
        $match: filtro
      },
      {
        $project: {
          participantes: [ { empresaId: '$compradorId', rol: 'comprador' }, { empresaId: '$distribuidorId', rol: 'distribuidor' } ]
        }
      },
      {
        $unwind: '$participantes'
      },
      {
        $group: {
          _id: { empresaId: '$participantes.empresaId', rol: '$participantes.rol' },
          cantidad: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'empresas',
          localField: '_id.empresaId',
          foreignField: '_id',
          as: 'empresa'
        }
      },
      {
        $unwind: {
          path: '$empresa',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $match: {
          'empresa.estadoVerificacion': 'verificada',
          'empresa.tipo': { $ne: 'plataforma' }
        }
      },
      {
        $project: {
          _id: 0,
          empresaId: '$_id.empresaId',
          rol: '$_id.rol',
          nombre: { $ifNull: ['$empresa.razonSocial', 'Empresa no disponible'] },
          cantidad: 1
        }
      },
      {
        $sort: { cantidad: -1 }
      }
    ]);
    const empresasRegistradas = await Empresa.find({estadoVerificacion: 'verificada', tipo: { $ne: 'plataforma' }}, '_id razonSocial tipo');
    const idsActivos = new Set(empresas.map(e => e.empresaId.toString()));
    empresasRegistradas.forEach(e => {
      if (!idsActivos.has(e._id.toString())) {
        empresas.push({
          empresaId: e._id,
          rol: e.tipo,
          nombre: e.razonSocial,
          cantidad: 0
        });
      }
    });
    res.json(empresas);
  } catch (error) {
    next(error);
  }
});

module.exports = router;