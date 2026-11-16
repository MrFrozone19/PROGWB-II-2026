const mongoose = require('mongoose');
const { Schema } = mongoose;
const esquema = new Schema({
  pedidoId: { type: Schema.Types.ObjectId, ref: 'Pedido', required: true, unique: true },
  compradorId: { type: Schema.Types.ObjectId, ref: 'Empresa', required: true },
  distribuidorId: { type: Schema.Types.ObjectId, ref: 'Empresa', required: true },
  puntuacion: { type: Number, required: true, min: 1, max: 5 },
  comentario: { type: String, maxlength: 300, default: '' }
}, { collection: 'calificaciones', timestamps: { createdAt: 'fechaCreacion', updatedAt: 'fechaActualizacion' } });
module.exports = mongoose.model('Calificacion', esquema);
