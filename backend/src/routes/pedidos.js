const mongoose = require('mongoose');
const { Empresa, Producto, Configuracion, Pedido, DetallePedido, Inventario } = require('../models');
const express = require('express');
const { autenticar } = require('../middleware/auth');
const { registrarEvento } = require('../services/logger');

const router = express.Router();

router.use(autenticar);

router.get('/', async (req, res, next) => {
  try {
    let filtro = {};
    if (req.usuario.rol === 'comprador') {
      filtro.compradorId = req.usuario.empresaId;
    } else if (req.usuario.rol === 'distribuidor') {
      filtro.distribuidorId = req.usuario.empresaId;
    } else if (req.usuario.rol !== 'administrador') {
      return res.status(403).json({ mensaje: 'El usuario no tiene el rol adecuado para ver pedidos.' });
    }
    const pedidos = await Pedido.find(filtro).sort({ fechaCreacion: -1 });
    res.json(pedidos);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ mensaje: 'ID de pedido inválido.' });
    }
    const pedido = await Pedido.findById(req.params.id);
    if (!pedido) {
      return res.status(404).json({ mensaje: 'Pedido no encontrado.' });
    }
    if (req.usuario.rol === 'comprador' && !pedido.compradorId.equals(req.usuario.empresaId)) {
      return res.status(403).json({ mensaje: 'El usuario no tiene permiso para ver este pedido.' });
    }
    if (req.usuario.rol === 'distribuidor' && !pedido.distribuidorId.equals(req.usuario.empresaId)) {
      return res.status(403).json({ mensaje: 'El usuario no tiene permiso para ver este pedido.' });
    }
    if (req.usuario.rol !== 'administrador' && req.usuario.rol !== 'comprador' && req.usuario.rol !== 'distribuidor') {
      return res.status(403).json({ mensaje: 'El usuario no tiene el rol adecuado para ver pedidos.' });
    }
    const detallesPedido = await DetallePedido.find({ pedidoId: pedido._id });
    return res.json({ pedido, detalles: detallesPedido });
  } catch (error) {
    next(error);
  }
});

router.post('/confirmar', async (req, res, next) => {
  try {
    if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) {
        return res.status(400).json({ mensaje: 'El cuerpo de la solicitud debe ser un objeto JSON.' });
    }
    const { compradorId, distribuidorId, productos } = req.body;
    if (!compradorId || !distribuidorId) {
        return res.status(400).json({ mensaje: 'Faltan campos obligatorios.' });
    }
    if ( typeof compradorId !== 'string' || typeof distribuidorId !== 'string' ) {
        return res.status(400).json({ mensaje: 'Los campos compradorId y distribuidorId deben ser cadenas de texto.' });
    }
    if (!mongoose.isValidObjectId(compradorId) || !mongoose.isValidObjectId(distribuidorId)) {
        return res.status(400).json({ mensaje: 'Los campos compradorId y distribuidorId deben ser IDs válidos de MongoDB.' });
    }
    if (process.env.MODO_REVISION !== 'true') {
        if (req.usuario.rol !== 'comprador') {
            return res.status(403).json({ mensaje: 'El usuario no tiene el rol adecuado para realizar pedidos.' });
        }
        if (String(req.usuario.empresaId).toLowerCase() !== compradorId.toLowerCase()) {
            return res.status(403).json({ mensaje: 'El usuario no pertenece a la empresa compradora especificada.' });
        }
    }
    if (!Array.isArray(productos)) {
        return res.status(400).json({ mensaje: 'La lista de productos no es un arreglo.' });
    }
    if (productos.length === 0) {
        return res.status(400).json({ mensaje: 'La lista de productos está vacía.' });
    }
    const idsProductos = new Set();
    for (const producto of productos) {
        if (!producto || !producto.productoId || typeof producto.cantidad !== 'number' || producto.cantidad <= 0 ) {
            return res.status(400).json({ mensaje: 'Cada producto debe tener un productoId y una cantidad válida.' });
        }
        if (!Number.isInteger(producto.cantidad)) {
            return res.status(400).json({ mensaje: 'La cantidad de cada producto debe ser un número entero.' });
        }
        if (typeof producto.productoId !== 'string' || !mongoose.isValidObjectId(producto.productoId)) {
            return res.status(400).json({ mensaje: 'Cada producto debe tener un productoId válido.' });
        }
        const idProducto = producto.productoId.toLowerCase();
        if (idsProductos.has(idProducto)) {
            return res.status(400).json({ mensaje: 'No se permiten productos duplicados en la lista.' });
        }
        idsProductos.add(idProducto);
    }
    const comprador = await Empresa.findById(compradorId);
    if (!comprador) {
        return res.status(404).json({ mensaje: 'Comprador no encontrado.' });
    }
    const distribuidor = await Empresa.findById(distribuidorId);
    if (!distribuidor) {
        return res.status(404).json({ mensaje: 'Distribuidor no encontrado.' });
    }
    if (comprador.estadoVerificacion !== 'verificada' || distribuidor.estadoVerificacion !== 'verificada') {
        return res.status(403).json({ mensaje: 'Ambas empresas deben estar verificadas para realizar un pedido.' });
    }
    if (!['comprador', 'ambos'].includes(comprador.tipo)) {
        return res.status(403).json({ mensaje: 'La empresa compradora no tiene el tipo adecuado para realizar pedidos.' });
    }
    if (!['distribuidor', 'ambos'].includes(distribuidor.tipo)) {
        return res.status(403).json({ mensaje: 'La empresa distribuidora no tiene el tipo adecuado para recibir pedidos.' });
    }
    const productosEncontrados = [];
    let subtotal = 0;
    for (const producto of productos) {
        const productoEncontrado = await Producto.findById(producto.productoId);
        if (!productoEncontrado) {
            return res.status(404).json({ mensaje: 'Producto no encontrado.' });
        }
        if (productoEncontrado.distribuidorId.equals(distribuidorId) === false) {
            return res.status(400).json({ mensaje: 'El producto no pertenece al distribuidor especificado.' });
        }
        if (productoEncontrado.activo === false) {
            return res.status(400).json({ mensaje: 'El producto no está disponible.' });
        }
        productosEncontrados.push(productoEncontrado);
        subtotal += productoEncontrado.precio * producto.cantidad;
    }
    const configuracionComision = await Configuracion.findOne({ clave: 'comision_porcentaje' });
    const comisionPct = configuracionComision ? Number(configuracionComision.valor) : 5;
    if (!Number.isFinite(comisionPct) || comisionPct < 2 || comisionPct > 10) {
        return res.status(500).json({ mensaje: 'La comision debe ser un número entre 2 y 10.' });
    }
    const pedido = new Pedido({
        compradorId,
        distribuidorId,
        subtotal,
        comisionPct,
        historialEstados: [{ estado: 'pendiente' }],

        total: subtotal
    });
    const detalles = productos.map((producto, indice) => {
        const encontrado = productosEncontrados[indice];

        return new DetallePedido({
            pedidoId: pedido._id,
            productoId: encontrado._id,
            cantidad: producto.cantidad,
            precioUnitario: encontrado.precio,
            subtotal: encontrado.precio * producto.cantidad
        });
    });
    await pedido.validate();
    await pedido.save();
    try {
        for (const detalle of detalles) {
            await detalle.save();
        }
    } catch (error) {
        await DetallePedido.deleteMany({ pedidoId: pedido._id });
        await pedido.deleteOne();
        throw error;
    }
    return res.status(201).json({ pedido, detalles });

  } catch (error) {
    next(error);
  }
});

router.put('/:id/aceptar', async (req, res, next) => {
  try {
    if (mongoose.isValidObjectId(req.params.id) === false) {
      return res.status(400).json({ mensaje: 'ID de pedido inválido.' });
    }
    const pedido = await Pedido.findById(req.params.id);
    if (!pedido) {
      return res.status(404).json({ mensaje: 'Pedido no encontrado.' });
    }
    if (req.usuario.rol !== 'distribuidor') {
      return res.status(403).json({ mensaje: 'El usuario no tiene el rol adecuado para aceptar pedidos.' });
    }
    if (!pedido.distribuidorId.equals(req.usuario.empresaId)) {
      return res.status(403).json({ mensaje: 'El usuario no pertenece a la empresa distribuidora de este pedido.' });
    }
    if (pedido.estado !== 'pendiente') {
      return res.status(409).json({ mensaje: 'El pedido no está pendiente y no puede ser aceptado.' });
    }
    const detalles = await DetallePedido.find({ pedidoId: pedido._id });
    if (Array.isArray(detalles) === false || detalles.length === 0) {
      return res.status(409).json({ mensaje: 'El pedido no tiene detalles asociados.' });
    }
    for (const detalle of detalles) {
      const producto = await Producto.findById(detalle.productoId);
      if (!producto) {
        return res.status(404).json({ mensaje: 'Producto no encontrado.' });
      }
      if (producto.activo === false) {
        return res.status(409).json({ mensaje: 'El producto no está disponible.' });
      }
      const inventario = await Inventario.findOne({ productoId: detalle.productoId });
      if (!inventario) {
        return res.status(404).json({ mensaje: 'Inventario no encontrado para el producto.' });
      }
      if (inventario.existencias < detalle.cantidad) {
        return res.status(409).json({ mensaje: 'No hay existencias suficientes del producto.' });
      }
    }
    const pedidoReservado = await Pedido.findOneAndUpdate(
        { _id: pedido._id, estado: 'pendiente' },
        { $set: { estado: 'procesando_aceptacion' } },
        { returnDocument: 'after' }
    );
    if (!pedidoReservado) {
      return res.status(409).json({ mensaje: 'No se pudo reservar el pedido.' });
    }
    const descuentosRealizados = [];
    try {
        for (const detalle of detalles) {
        const inventarioActualizado = await Inventario.findOneAndUpdate(
    {
        productoId: detalle.productoId,
        existencias: { $gte: detalle.cantidad }
    },
    { $inc: { existencias: -detalle.cantidad } },
    { returnDocument: 'after' }
);
    if (!inventarioActualizado) {
        const errorInventario = new Error('No hay existencias suficientes del producto.');
        errorInventario.status = 409;
        throw errorInventario;
    }
    const descuento = {
        productoId: detalle.productoId,
        cantidad: detalle.cantidad,
    };
    descuentosRealizados.push(descuento);
           
    }
    const pedidoAceptado = await Pedido.findOneAndUpdate(
        { _id: pedido._id, estado: 'procesando_aceptacion' },
        { $set: { estado: 'aceptado' }, $push: { historialEstados: { estado: 'aceptado', fecha: new Date() } } },
        { returnDocument: 'after' }
    );
    if (!pedidoAceptado) {
        throw new Error('No se pudo actualizar el estado del pedido a aceptado.');
    }
    return res.status(200).json({ mensaje: 'Pedido aceptado exitosamente.', pedido: pedidoAceptado });
    } catch (error) {
        for (const descuento of descuentosRealizados) {
            const inventarioRevertido = await Inventario.findOneAndUpdate(
                { productoId: descuento.productoId },
                { $inc: { existencias: descuento.cantidad } }
            );
            if (!inventarioRevertido) {
                throw new Error('Error al revertir el inventario del producto.');
            }
        }
        const pedidoRevertido = await Pedido.findOneAndUpdate(
            { _id: pedido._id, estado: 'procesando_aceptacion' },
            { $set: { estado: 'pendiente' } }
        );
        if (!pedidoRevertido) {
            throw new Error('Error al revertir el estado del pedido.');
        }
        if (error.status === 409) {
            return res.status(409).json({ mensaje: error.message });
        }
        throw error;
    }
    
  } catch (error) {
    next(error);
  }
});

router.put('/:id/preparar', async (req, res, next) => {
  try {
    if (mongoose.isValidObjectId(req.params.id) === false) {
      return res.status(400).json({ mensaje: 'ID de pedido inválido.' });
    }
    const pedido = await Pedido.findById(req.params.id);
    if (!pedido) {
      return res.status(404).json({ mensaje: 'Pedido no encontrado.' });
    }
    if (req.usuario.rol !== 'distribuidor') {
      return res.status(403).json({ mensaje: 'El usuario no tiene el rol adecuado para preparar pedidos.' });
    }
    if (!pedido.distribuidorId.equals(req.usuario.empresaId)) {
      return res.status(403).json({ mensaje: 'El usuario no pertenece a la empresa distribuidora de este pedido.' });
    }
    if (pedido.estado !== 'aceptado') {
      return res.status(409).json({ mensaje: 'El pedido no está en estado aceptado.' });
    }
    const pedidoPreparado = await Pedido.findOneAndUpdate(
      { _id: pedido._id, estado: 'aceptado' },
      { $set: { estado: 'en_preparacion' }, $push: { historialEstados: { estado: 'en_preparacion', fecha: new Date() } } },
      { returnDocument: 'after' }
    );
    if (!pedidoPreparado) {
      return res.status(409).json({ mensaje: 'No se pudo actualizar el estado del pedido a en preparación.' });
    }
    return res.status(200).json({ mensaje: 'Pedido en preparación.', pedido: pedidoPreparado });
  } catch (error) {
    next(error);
  }
});

router.put('/:id/enviar', async (req, res, next) => {
  try {
    if (mongoose.isValidObjectId(req.params.id) === false) {
      return res.status(400).json({ mensaje: 'ID de pedido inválido.' });
    }
    const pedido = await Pedido.findById(req.params.id);
    if (!pedido) {
      return res.status(404).json({ mensaje: 'Pedido no encontrado.' });
    }
    if (req.usuario.rol !== 'distribuidor') {
      return res.status(403).json({ mensaje: 'El usuario no tiene el rol adecuado para enviar pedidos.' });
    }
    if (!pedido.distribuidorId.equals(req.usuario.empresaId)) {
      return res.status(403).json({ mensaje: 'El usuario no pertenece a la empresa distribuidora de este pedido.' });
    }
    if (pedido.estado !== 'en_preparacion') {
      return res.status(409).json({ mensaje: 'El pedido no está en estado en preparación.' });
    }
    const pedidoEnviado = await Pedido.findOneAndUpdate(
      { _id: pedido._id, estado: 'en_preparacion' },
      { $set: { estado: 'en_camino' }, $push: { historialEstados: { estado: 'en_camino', fecha: new Date() } } },
      { returnDocument: 'after' }
    );
    if (!pedidoEnviado) {
      return res.status(409).json({ mensaje: 'No se pudo actualizar el estado del pedido a en camino.' });
    }
    return res.status(200).json({ mensaje: 'Pedido enviado exitosamente.', pedido: pedidoEnviado });
  } catch (error) {
    next(error);
  }
});

router.put('/:id/entregar', async (req, res, next) => {
  try {
    if (mongoose.isValidObjectId(req.params.id) === false) {
      return res.status(400).json({ mensaje: 'ID de pedido inválido.' });
    }
    const pedido = await Pedido.findById(req.params.id);
    if (!pedido) {
      return res.status(404).json({ mensaje: 'Pedido no encontrado.' });
    }
    if (req.usuario.rol !== 'distribuidor') {
      return res.status(403).json({ mensaje: 'El usuario no tiene el rol adecuado para entregar pedidos.' });
    }
    if (!pedido.distribuidorId.equals(req.usuario.empresaId)) {
      return res.status(403).json({ mensaje: 'El usuario no pertenece a la empresa distribuidora de este pedido.' });
    }
    if (pedido.estado !== 'en_camino') {
      return res.status(409).json({ mensaje: 'El pedido no está en estado en camino.' });
    }
    const comisionMonto = (pedido.subtotal * pedido.comisionPct) / 100;
    
    const pedidoEntregado = await Pedido.findOneAndUpdate(
      { _id: pedido._id, estado: 'en_camino' },
      { $set: { estado: 'entregado', comisionMonto: comisionMonto }, $push: { historialEstados: { estado: 'entregado', fecha: new Date() } } },
      { returnDocument: 'after' }
    );
    if (!pedidoEntregado) {
      return res.status(409).json({ mensaje: 'No se pudo actualizar el estado del pedido a entregado.' });
    }
    return res.status(200).json({ mensaje: 'Pedido entregado exitosamente.', pedido: pedidoEntregado });
  } catch (error) {
    next(error);
  }
});

router.put('/:id/cancelar', async (req, res, next) => {
  try {
    if (mongoose.isValidObjectId(req.params.id) === false) {
      return res.status(400).json({ mensaje: 'ID de pedido inválido.' });
    }
    const pedido = await Pedido.findById(req.params.id);
    if (!pedido) {
      return res.status(404).json({ mensaje: 'Pedido no encontrado.' });
    }
    if (req.usuario.rol === 'comprador' && !pedido.compradorId.equals(req.usuario.empresaId)) {
      return res.status(403).json({ mensaje: 'El usuario no pertenece a la empresa compradora de este pedido.' });
    }
    if (req.usuario.rol === 'distribuidor' && !pedido.distribuidorId.equals(req.usuario.empresaId)) {
      return res.status(403).json({ mensaje: 'El usuario no pertenece a la empresa distribuidora de este pedido.' });
    }
    if (req.usuario.rol !== 'comprador' && req.usuario.rol !== 'distribuidor') {
      return res.status(403).json({ mensaje: 'El usuario no tiene el rol adecuado para cancelar pedidos.' });
    }
    if (!(['pendiente', 'aceptado', 'en_preparacion']).includes(pedido.estado)) {
        return res.status(409).json({ mensaje: 'El pedido no está en un estado que permita la cancelación.' });
    }
    if (pedido.estado === 'pendiente') {
        const pedidoCancelado = await Pedido.findOneAndUpdate(
            { _id: pedido._id, estado: 'pendiente' },
            { $set: { estado: 'cancelado' }, $push: { historialEstados: { estado: 'cancelado', fecha: new Date() } } },
            { returnDocument: 'after' }
        );
        if (!pedidoCancelado) {
            return res.status(409).json({ mensaje: 'No se pudo actualizar el estado del pedido a cancelado.' });
        }
        return res.status(200).json({ mensaje: 'Pedido cancelado exitosamente.', pedido: pedidoCancelado });
    }
    const detalles = await DetallePedido.find({ pedidoId: pedido._id });
    if (Array.isArray(detalles) === false || detalles.length === 0) {
        return res.status(409).json({ mensaje: 'El pedido no tiene detalles asociados.' });
    }
    const pedidoReservado = await Pedido.findOneAndUpdate(
        { _id: pedido._id, estado: pedido.estado },
        { $set: { estado: 'procesando_cancelacion' } },
        { returnDocument: 'after' }
    );
    if (!pedidoReservado) {
        return res.status(409).json({ mensaje: 'No se pudo actualizar el estado del pedido a procesando cancelación.' });
    }
    const devolucionesRealizadas = [];
    try {
        for (const detalle of detalles) {
            const inventarioActualizado = await Inventario.findOneAndUpdate(
                { productoId: detalle.productoId },
                { $inc: { existencias: detalle.cantidad } },
                { returnDocument: 'after' }
            );
            if (!inventarioActualizado) {
                throw new Error('Error al actualizar el inventario del producto.');
            }
            devolucionesRealizadas.push({
                productoId: detalle.productoId,
                cantidad: detalle.cantidad
            });
        }
        const pedidoCancelado = await Pedido.findOneAndUpdate(
            { _id: pedido._id, estado: 'procesando_cancelacion' },
            { $set: { estado: 'cancelado' }, $push: { historialEstados: { estado: 'cancelado', fecha: new Date() } } },
            { returnDocument: 'after' }
        );
        if (!pedidoCancelado) {
            throw new Error('No se pudo actualizar el estado del pedido a cancelado.');
        }
        return res.status(200).json({ mensaje: 'Pedido cancelado exitosamente.', pedido: pedidoCancelado });
    } catch (error) {
        registrarEvento('error', 'cancelacion_incompleta', { pedidoId: pedido._id, devoluciones: devolucionesRealizadas, error: error.message });
        throw error;
    }


  } catch (error) {
    next(error);
  }
});

router.put('/:id/rechazar', async (req, res, next) => {
  try {
    if (mongoose.isValidObjectId(req.params.id) === false) {
      return res.status(400).json({ mensaje: 'ID de pedido no válido.' });
    }
    const pedido = await Pedido.findById(req.params.id);
    if (!pedido) {
      return res.status(404).json({ mensaje: 'Pedido no encontrado.' });
    }
    if (req.usuario.rol !== 'distribuidor') {
      return res.status(403).json({ mensaje: 'El usuario no tiene el rol adecuado para rechazar pedidos.' });
    }
    if (req.usuario.rol === 'distribuidor' && !pedido.distribuidorId.equals(req.usuario.empresaId)) {
      return res.status(403).json({ mensaje: 'El usuario no pertenece a la empresa distribuidora de este pedido.' });
    }
    if (pedido.estado !== 'pendiente') {
      return res.status(409).json({ mensaje: 'Solo se pueden rechazar pedidos pendientes.' });
    }
    if (!req.body || typeof req.body.motivoRechazo !== 'string' || req.body.motivoRechazo.trim() === '') {
      return res.status(400).json({ mensaje: 'El motivo de rechazo es obligatorio.' });
    }
    const motivoRechazo = req.body.motivoRechazo.trim();
    if (motivoRechazo.length > 255) {
      return res.status(400).json({ mensaje: 'El motivo de rechazo no puede exceder los 255 caracteres.' });
    }
    const pedidoRechazado = await Pedido.findOneAndUpdate(
      { _id: pedido._id, estado: 'pendiente' },
      { $set: { estado: 'rechazado', motivoRechazo: motivoRechazo }, $push: { historialEstados: { estado: 'rechazado', fecha: new Date() } } },
      { returnDocument: 'after' }
    );
    if (!pedidoRechazado) {
      return res.status(409).json({ mensaje: 'No se pudo actualizar el estado del pedido a rechazado.' });
    }
    return res.status(200).json({ mensaje: 'Pedido rechazado exitosamente.', pedido: pedidoRechazado });
  } catch (error) {
    next(error);
  }
});

module.exports = router;