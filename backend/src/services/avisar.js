const Notificacion = require('../models/Notificacion');
async function avisar(empresaId, pedidoId, mensaje) {
  try { await Notificacion.create({ empresaId, pedidoId, mensaje }); }
  catch (error) { console.error('No se guardó una notificación:', error.message); }
}
module.exports = avisar;
