const { Configuracion } = require('../models');
async function calcularComision(productos, distribuidorId) {
  const configuraciones = await Configuracion.find({ clave: /^comision_/ });
  const porClave = new Map(configuraciones.map(c => [c.clave, c]));
  const vigente = (clave) => {
    const c = porClave.get(clave);
    if (!c) return null;
    try { const meta = JSON.parse(c.descripcion); if (meta.vigenteDesde && new Date(meta.vigenteDesde) > new Date()) return null; } catch {}
    const valor = Number(c.valor);
    return valor >= 2 && valor <= 10 ? valor : null;
  };
  const especial = vigente(`comision_distribuidor_${distribuidorId}`);
  if (especial !== null) return especial;
  const general = vigente('comision_porcentaje') ?? 5;
  let suma = 0, subtotal = 0;
  for (const item of productos) {
    const valor = item.producto.precio * item.cantidad;
    const tasa = vigente(`comision_categoria_${item.producto.categoria}`) ?? general;
    suma += valor * tasa;
    subtotal += valor;
  }
  return subtotal ? Math.round((suma / subtotal) * 10000) / 10000 : general;
}
module.exports = calcularComision;
