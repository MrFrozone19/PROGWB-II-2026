const mongoose = require('mongoose');

function validarReferencia(nombreModelo) {
  return {
    validator: async (valor) => {
      const encontrado = await mongoose.model(nombreModelo).exists({ _id: valor });
      return encontrado !== null;
    },
    message: `El registro indicado no existe en ${nombreModelo}.`,
  };
}

module.exports = validarReferencia;