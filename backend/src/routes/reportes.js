const express = require('express');
const { Op, col } = require('sequelize');
const { autenticar } = require('../middleware/auth');
const { Pedido, Empresa, Inventario, Producto } = require('../models');

const router = express.Router();
router.use(autenticar);

router.get('/ventas-por-distribuidor', async (req, res, next) => {
  try {
    const pedidos = await Pedido.findAll({
      where: { estado: 'entregado' },
      include: [{ model: Empresa, as: 'distribuidor', attributes: ['id', 'razonSocial'] }],
    });
    const acumulado = new Map();
    pedidos.forEach((pedido) => {
      const clave = pedido.distribuidorId;
      const actual = acumulado.get(clave) || { distribuidorId: clave, distribuidor: pedido.distribuidor.razonSocial, pedidos: 0, ventas: 0 };
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
  try {
    const pedidos = await Pedido.findAll({
      where: { estado: { [Op.ne]: 'cancelado' } },
      include: [{ model: Empresa, as: 'comprador', attributes: ['id', 'razonSocial'] }],
    });
    const acumulado = new Map();
    pedidos.forEach((pedido) => {
      const clave = pedido.compradorId;
      const actual = acumulado.get(clave) || { compradorId: clave, comprador: pedido.comprador.razonSocial, pedidos: 0, compras: 0 };
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
    const registros = await Inventario.findAll({
      where: { existencias: { [Op.lte]: col('stock_minimo') } },
      include: [{ model: Producto, as: 'producto', attributes: ['id', 'sku', 'nombre', 'distribuidorId'] }],
    });
    res.json(registros);
  } catch (error) {
    next(error);
  }
});

router.get('/comisiones', async (req, res, next) => {
  try {
    const pedidos = await Pedido.findAll({
      where: { estado: 'entregado' },
      include: [{ model: Empresa, as: 'distribuidor', attributes: ['id', 'razonSocial'] }],
    });
    const total = pedidos.reduce((suma, pedido) => suma + Number(pedido.comisionMonto), 0);
    res.json({ pedidos: pedidos.length, comisionTotal: total, detalle: pedidos });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
