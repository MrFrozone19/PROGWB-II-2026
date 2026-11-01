const mongoose = require('mongoose');
const { Schema } = mongoose;
const validarReferencia = require('./validarReferencia');

const PedidoSchema = new Schema({
  compradorId: { type: Schema.Types.ObjectId, ref: 'Empresa', required: true, validate: validarReferencia('Empresa') },
  distribuidorId: { type: Schema.Types.ObjectId, ref: 'Empresa', required: true, validate: validarReferencia('Empresa') },
  estado: {
    type: String,
    required: true,
    default: 'pendiente',
    enum: ['pendiente', 'aceptado', 'en_preparacion', 'en_camino', 'entregado', 'cancelado']
  },
  subtotal: { type: Number, required: true, min: 0, default: 0 },
  comisionPct: { type: Number, required: true, min: 0, max: 100, default: 5 },
  comisionMonto: { type: Number, required: true, min: 0, default: 0 },
  total: { type: Number, required: true, min: 0, default: 0 },
  fechaEstimada: { type: Date, required: false },
  }, {
  collection: 'pedidos', 
  timestamps: { createdAt: 'fechaCreacion', updatedAt: 'fechaActualizacion' }
});

module.exports = mongoose.model('Pedido', PedidoSchema);