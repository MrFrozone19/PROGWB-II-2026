const mongoose = require('mongoose');
const { Schema } = mongoose;

const UsuarioSchema = new Schema({
  empresaId: { type: Schema.Types.ObjectId, ref: 'Empresa', required: true },
  nombre: { type: String, required: true, maxlength: 120 },
  correo: { type: String, required: true, unique: true, maxlength: 160, match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
  telefono: { type: String, required: true, maxlength: 10, match: /^\d{10}$/ },
  passwordHash: { type: String, required: true, maxlength: 255 },
  rol: { type: String, required: true, maxlength: 20, enum: ['comprador', 'distribuidor', 'administrador'] },
  activo: { type: Boolean, required: true, default: true },
  }, {
  collection: 'usuarios',
});

module.exports = mongoose.model('Usuario', UsuarioSchema);