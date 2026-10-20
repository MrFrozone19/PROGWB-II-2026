const mongoose = require('mongoose');
const { Schema } = mongoose;

const InventarioSchema = new Schema({
  productoId: { type: Schema.Types.ObjectId, ref: 'Producto', required: true, unique: true },
  existencias: { type: Number, required: true, min: 0, default: 0, validate: {validator: Number.isInteger, message: '{VALUE} no es un numero entero valido'}},
  stockMinimo: { type: Number, required: true, min: 0, default: 0, validate: {validator: Number.isInteger, message: '{VALUE} no es un numero entero valido'}},
  }, {
  collection: 'inventarios',
});

module.exports = mongoose.model('Inventario', InventarioSchema);