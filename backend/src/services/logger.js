const fs = require('fs');
const path = require('path');

const rutaLogs = path.resolve(__dirname, '../../logs');
const archivoLog = path.join(rutaLogs, 'aplicacion.log');

function registrarEvento(nivel, evento, datos = {}) {
  fs.mkdirSync(rutaLogs, { recursive: true });
  const registro = JSON.stringify({
    fecha: new Date().toISOString(),
    nivel,
    evento,
    datos,
  });
  fs.appendFileSync(archivoLog, `${registro}\n`, 'utf8');
}

module.exports = { registrarEvento };
