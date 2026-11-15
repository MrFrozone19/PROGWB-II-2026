const mongoose = require('mongoose');
const { Schema } = mongoose;
const esquema = new Schema({
  empresaId: { type: Schema.Types.ObjectId, ref: 'Empresa', required: true, index: true },
  pedidoId: { type: Schema.Types.ObjectId, ref: 'Pedido' },
  mensaje: { type: String, required: true, maxlength: 250 },
  leida: { type: Boolean, default: false }
}, { collection: 'notificaciones', timestamps: { createdAt: 'fechaCreacion', updatedAt: 'fechaActualizacion' } });
module.exports = mongoose.model('Notificacion', esquema);
