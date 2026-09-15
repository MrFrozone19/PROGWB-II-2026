const bcrypt = require('bcryptjs');
const {
  Empresa,
  Usuario,
  Producto,
  Inventario,
  Pedido,
  DetallePedido,
  Transaccion,
  Configuracion,
} = require('../models');
const { registrarEvento } = require('./logger');

async function crearUsuarioDemo(empresa, datos) {
  const [usuario] = await Usuario.findOrCreate({
    where: { correo: datos.correo },
    defaults: {
      empresaId: empresa.id,
      nombre: datos.nombre,
      correo: datos.correo,
      telefono: datos.telefono,
      passwordHash: await bcrypt.hash('demo1234', 10),
      rol: datos.rol,
      activo: true,
    },
  });
  return usuario;
}

async function sembrarDatos() {
  registrarEvento('info', 'seed_inicio');

  const [comprador] = await Empresa.findOrCreate({
    where: { rfc: 'ADN180423K21' },
    defaults: {
      razonSocial: 'Aceros del Norte S.A. de C.V.',
      rfc: 'ADN180423K21',
      tipo: 'comprador',
      giro: 'Manufactura metalmecánica',
      calle: 'Av. Manuel L. Barragán 1250',
      colonia: 'Anáhuac',
      codigoPostal: '66450',
      municipio: 'San Nicolás de los Garza',
      estadoVerificacion: 'verificada',
    },
  });

  const [distribuidor] = await Empresa.findOrCreate({
    where: { rfc: 'RGM190614P73' },
    defaults: {
      razonSocial: 'Refacciones Industriales GM',
      rfc: 'RGM190614P73',
      tipo: 'distribuidor',
      giro: 'Distribución de refacciones industriales',
      calle: 'Av. Miguel Alemán 2140',
      colonia: 'La Fe',
      codigoPostal: '66477',
      municipio: 'San Nicolás de los Garza',
      estadoVerificacion: 'verificada',
    },
  });

  const [plataforma] = await Empresa.findOrCreate({
    where: { rfc: 'EBL260801A10' },
    defaults: {
      razonSocial: 'Operación de plataforma Enlace B2B',
      rfc: 'EBL260801A10',
      tipo: 'plataforma',
      giro: 'Servicios digitales',
      calle: 'Ciudad Universitaria s/n',
      colonia: 'Ciudad Universitaria',
      codigoPostal: '66455',
      municipio: 'San Nicolás de los Garza',
      estadoVerificacion: 'verificada',
    },
  });

  const [pendiente] = await Empresa.findOrCreate({
    where: { rfc: 'BVP200327T61' },
    defaults: {
      razonSocial: 'Bombas y Válvulas del Pacífico',
      rfc: 'BVP200327T61',
      tipo: 'distribuidor',
      giro: 'Bombas y válvulas industriales',
      calle: 'Av. Ruiz Cortines 4120',
      colonia: 'Mitras Norte',
      codigoPostal: '64320',
      municipio: 'Monterrey',
      estadoVerificacion: 'pendiente',
    },
  });

  await crearUsuarioDemo(comprador, {
    nombre: 'Alejandro Ramírez Garza',
    correo: 'compras@aceros-delnorte.mx',
    telefono: '8111111111',
    rol: 'comprador',
  });
  await crearUsuarioDemo(distribuidor, {
    nombre: 'Ing. Rubén Cavazos',
    correo: 'ventas@refacciones-gm.mx',
    telefono: '8122222222',
    rol: 'distribuidor',
  });
  await crearUsuarioDemo(plataforma, {
    nombre: 'Administrador de la plataforma',
    correo: 'admin@enlaceb2b.mx',
    telefono: '8133333333',
    rol: 'administrador',
  });
  await crearUsuarioDemo(pendiente, {
    nombre: 'Ing. Claudia Treviño Ramos',
    correo: 'ventas@bvpacifico.mx',
    telefono: '8144444444',
    rol: 'distribuidor',
  });

  const [producto] = await Producto.findOrCreate({
    where: { distribuidorId: distribuidor.id, sku: 'ROD-6205-2RS' },
    defaults: {
      distribuidorId: distribuidor.id,
      sku: 'ROD-6205-2RS',
      nombre: 'Rodamiento 6205 2RS',
      descripcion: 'Rodamiento rígido de bolas sellado para uso industrial.',
      categoria: 'Rodamientos',
      precio: 185.50,
      unidadMedida: 'pieza',
      activo: true,
    },
  });

  await Inventario.findOrCreate({
    where: { productoId: producto.id },
    defaults: { productoId: producto.id, existencias: 45, stockMinimo: 10 },
  });

  const [configuracion] = await Configuracion.findOrCreate({
    where: { clave: 'comision_porcentaje' },
    defaults: { clave: 'comision_porcentaje', valor: '5', descripcion: 'Porcentaje de comisión aplicado a las ventas concluidas.' },
  });

  const [pedido] = await Pedido.findOrCreate({
    where: { id: 1 },
    defaults: {
      compradorId: comprador.id,
      distribuidorId: distribuidor.id,
      estado: 'entregado',
      subtotal: 371,
      comisionPct: Number(configuracion.valor),
      comisionMonto: 18.55,
      total: 389.55,
      fechaEstimada: new Date(),
    },
  });

  await DetallePedido.findOrCreate({
    where: { pedidoId: pedido.id, productoId: producto.id },
    defaults: { pedidoId: pedido.id, productoId: producto.id, cantidad: 2, precioUnitario: 185.50, subtotal: 371 },
  });

  await Transaccion.findOrCreate({
    where: { pedidoId: pedido.id, referencia: 'DEMO-0001' },
    defaults: { pedidoId: pedido.id, tipo: 'venta', monto: 389.55, estado: 'aprobada', referencia: 'DEMO-0001' },
  });

  registrarEvento('info', 'seed_fin');
}

module.exports = sembrarDatos;
