const mongoose = require('mongoose');
const { Schema } = mongoose;

const ProductoSchema = new Schema({
  distribuidorId: { type: Schema.Types.ObjectId, ref: 'Empresa', required: true },
  sku : { type: String, required: true, maxlength: 50 },
  nombre: { type: String, required: true, maxlength: 140 },
  descripcion: { type: String, required: true, maxlength: 255 },
  categoria: { type: String, required: true, maxlength: 80 },
  precio: { type: Number, required: true, min: 0 },
  unidadMedida: { type: String, required: true, maxlength: 30 },
  activo: { type: Boolean, required: true, default: true },
  }, {
  collection: 'productos',
});

ProductoSchema.index({ distribuidorId: 1, sku: 1 }, { unique: true });

module.exports = mongoose.model('Producto', ProductoSchema);