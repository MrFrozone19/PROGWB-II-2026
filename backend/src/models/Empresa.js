const mongoose = require('mongoose');
const { Schema } = mongoose;

const EmpresaSchema = new Schema({
  razonSocial: { type: String, required: true, maxlength: 150 },
  rfc: { type: String, required: true, unique: true, maxlength: 13, },
  tipo: { type: String, required: true, enum: ['comprador', 'distribuidor', 'ambos', 'plataforma']},
  giro: { type: String, required: true, maxlength: 120},
  calle: { type: String, required: true, maxlength: 180},
  colonia: { type: String, required: true, maxlength: 120},
  codigoPostal: { type: String, required: true, maxlength: 5, match: /^\d{5}$/},
  municipio: { type: String, required: true, maxlength: 100},
  latitud: { type: Number, required: false, min: -90, max: 90 },
  longitud: { type: Number, required: false, min: -180, max: 180 },
  motivoRechazo: { type: String, maxlength: 255, default: '' },
  fechaVerificacion: Date,
  verificadoPor: { type: Schema.Types.ObjectId, ref: 'Usuario' },
  descripcionPublica: { type: String, maxlength: 400, default: '' },
  tiempoEntrega: { type: String, maxlength: 80, default: 'Por confirmar' },
  pedidoMinimo: { type: Number, min: 1, default: 1 },
  formasPago: [{ type: String, enum: ['transferencia', 'contra_entrega'] }],
  recoleccion: { type: Boolean, default: false },
  telefonoContacto: { type: String, maxlength: 10 },
  estadoVerificacion: {
    type: String,
    required: true,
    enum: ['pendiente', 'verificada', 'rechazada'],
    default: 'pendiente',
  },
}, {
  collection: 'empresas',
  timestamps: { createdAt: 'fechaCreacion', updatedAt: 'fechaActualizacion' }
});

module.exports = mongoose.model('Empresa', EmpresaSchema);