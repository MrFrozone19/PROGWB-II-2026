const mongoose = require('mongoose');
const { Schema } = mongoose;

const DetallePedidoSchema = new Schema({
  pedidoId: { type: Schema.Types.ObjectId, ref: 'Pedido', required: true },
  productoId: { type: Schema.Types.ObjectId, ref: 'Producto', required: true },
  cantidad: { type: Number, required: true, min: 1, validate: {validator: Number.isInteger, message: '{VALUE} no es un numero entero valido'}},
  precioUnitario: { type: Number, required: true, min: 0 },
  subtotal: { type: Number, required: true, min: 0 },
  }, {
  collection: 'detalles_pedido',
  timestamps: { createdAt: 'fechaCreacion', updatedAt: 'fechaActualizacion' }
});

module.exports = mongoose.model('DetallePedido', DetallePedidoSchema);