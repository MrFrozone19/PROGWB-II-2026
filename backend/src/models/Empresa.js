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
  estadoVerificacion: {
    type: String,
    required: true,
    enum: ['pendiente', 'verificada', 'rechazada'],
    default: 'pendiente',
  },
}, {
  collection: 'empresas',
});

module.exports = mongoose.model('Empresa', EmpresaSchema);