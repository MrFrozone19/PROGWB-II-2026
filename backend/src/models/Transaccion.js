const mongoose = require('mongoose');
const { Schema } = mongoose;
const validarReferencia = require('./validarReferencia');

const TransaccionSchema = new Schema({
  pedidoId: { type: Schema.Types.ObjectId, ref: 'Pedido', required: true, validate: validarReferencia('Pedido') },
  tipo: { type: String, required: true, maxlength: 30, default: 'venta' },
  monto: { type: Number, required: true, min: 0 },
  estado: {
    type: String,
    required: true,
    default: 'pendiente',
    enum: ['pendiente', 'aprobada', 'rechazada', 'reembolsada']
  },
  referencia: { type: String, maxlength: 80 },
  }, {
  collection: 'transacciones',
  timestamps: { createdAt: 'fechaCreacion', updatedAt: 'fechaActualizacion' }
});

module.exports = mongoose.model('Transaccion', TransaccionSchema);