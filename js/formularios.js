/* Validaciones y mensajes de error reutilizables en los formularios. */

const PATRON_CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PATRON_RFC = /^[A-ZÑ&]{3,4}\d{6}[A-Z\d]{3}$/;
const PATRON_TELEFONO = /^\d{10}$/;
const PATRON_CODIGO_POSTAL = /^\d{5}$/;

function esCorreoValido(texto) {
  return PATRON_CORREO.test(texto.trim());
}

function esRfcValido(texto) {
  return PATRON_RFC.test(texto.trim().toUpperCase());
}

function esTelefonoValido(texto) {
  return PATRON_TELEFONO.test(texto.replace(/\s/g, ''));
}

function buscarMunicipioPorCodigoPostal(codigoPostal) {
  if (!PATRON_CODIGO_POSTAL.test(codigoPostal)) return null;
  const numero = Number(codigoPostal);
  return MUNICIPIOS_COBERTURA.find((m) => numero >= m.cpDesde && numero <= m.cpHasta) || null;
}

/* Marca el campo en rojo y escribe el mensaje justo debajo de él.
   Sin mensaje, solo marca el campo. */
function marcarError(campo, mensaje) {
  campo.classList.add('campo-error');
  if (!mensaje) return;

  const etiqueta = campo.closest('label') || campo;
  let texto = etiqueta.nextElementSibling;
  if (!texto || !texto.hasAttribute('data-error-generado')) {
    texto = document.createElement('p');
    texto.className = 'msg-error';
    texto.setAttribute('data-error-generado', '');
    etiqueta.after(texto);
  }
  texto.textContent = mensaje;
}

function limpiarErrores(formulario) {
  formulario.querySelectorAll('.campo-error').forEach((campo) => campo.classList.remove('campo-error'));
  formulario.querySelectorAll('[data-error-generado]').forEach((texto) => texto.remove());
}
