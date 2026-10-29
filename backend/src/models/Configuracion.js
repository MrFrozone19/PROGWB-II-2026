const mongoose = require('mongoose');
const { Schema } = mongoose;

const ConfiguracionSchema = new Schema({
  clave: { type: String, required: true, unique: true, maxlength: 60 },
  valor: { type: String, required: true, maxlength: 200 },
  descripcion: { type: String, required: true, maxlength: 255 },
}, {
  collection: 'configuraciones',
  timestamps: { createdAt: 'fechaCreacion', updatedAt: 'fechaActualizacion' }
});


module.exports = mongoose.model('Configuracion', ConfiguracionSchema);