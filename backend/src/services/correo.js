async function enviarCorreo(destino, asunto, cuerpo) {
  const token = process.env.RESEND_API_KEY;
  const remitente = process.env.CORREO_REMITENTE;
  if (!token || !remitente) return false;
  const respuesta = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: remitente, to: [destino], subject: asunto, text: cuerpo })
  });
  if (!respuesta.ok) throw Error('El servicio de correo no pudo entregar el mensaje.');
  return true;
}
module.exports = enviarCorreo;
