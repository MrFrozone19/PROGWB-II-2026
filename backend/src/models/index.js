const Empresa = require('./Empresa');
const Usuario = require('./Usuario');
const Producto = require('./Producto');
const Inventario = require('./Inventario');
const Pedido = require('./Pedido');
const DetallePedido = require('./DetallePedido');
const Transaccion = require('./Transaccion');
const Configuracion = require('./Configuracion');

Empresa.hasMany(Usuario, { foreignKey: 'empresaId', as: 'usuarios' });
Usuario.belongsTo(Empresa, { foreignKey: 'empresaId', as: 'empresa' });

Empresa.hasMany(Producto, { foreignKey: 'distribuidorId', as: 'productos' });
Producto.belongsTo(Empresa, { foreignKey: 'distribuidorId', as: 'distribuidor' });

Producto.hasOne(Inventario, { foreignKey: 'productoId', as: 'inventario', onDelete: 'CASCADE' });
Inventario.belongsTo(Producto, { foreignKey: 'productoId', as: 'producto' });

Empresa.hasMany(Pedido, { foreignKey: 'compradorId', as: 'pedidosComprados' });
Empresa.hasMany(Pedido, { foreignKey: 'distribuidorId', as: 'pedidosVendidos' });
Pedido.belongsTo(Empresa, { foreignKey: 'compradorId', as: 'comprador' });
Pedido.belongsTo(Empresa, { foreignKey: 'distribuidorId', as: 'distribuidor' });

Pedido.hasMany(DetallePedido, { foreignKey: 'pedidoId', as: 'detalles', onDelete: 'CASCADE' });
DetallePedido.belongsTo(Pedido, { foreignKey: 'pedidoId', as: 'pedido' });
Producto.hasMany(DetallePedido, { foreignKey: 'productoId', as: 'detallesPedido' });
DetallePedido.belongsTo(Producto, { foreignKey: 'productoId', as: 'producto' });

Pedido.hasMany(Transaccion, { foreignKey: 'pedidoId', as: 'transacciones', onDelete: 'CASCADE' });
Transaccion.belongsTo(Pedido, { foreignKey: 'pedidoId', as: 'pedido' });

module.exports = {
  Empresa,
  Usuario,
  Producto,
  Inventario,
  Pedido,
  DetallePedido,
  Transaccion,
  Configuracion,
};
