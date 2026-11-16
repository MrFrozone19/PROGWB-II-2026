const mongoose = require('mongoose');
const { Schema } = mongoose;
const esquema = new Schema({
  clave: { type: String, required: true },
  porcentaje: { type: Number, required: true, min: 2, max: 10 },
  vigenteDesde: { type: Date, default: Date.now },
  usuarioId: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true }
}, { collection: 'historial_comisiones', timestamps: { createdAt: 'fechaCreacion', updatedAt: false } });
module.exports = mongoose.model('HistorialComision', esquema);
