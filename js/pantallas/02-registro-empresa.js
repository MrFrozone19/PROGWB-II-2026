const formularioRegistro = document.getElementById('formulario-registro');
const campoCodigoPostal = document.getElementById('codigo-postal');
const campoMunicipio = document.getElementById('municipio');
const mensajeCobertura = document.getElementById('mensaje-cobertura');
const botonRegistrar = formularioRegistro.querySelector('button[type="submit"]');

const valorDe = (id) => document.getElementById(id).value.trim();

function actualizarCobertura() {
  const codigoPostal = campoCodigoPostal.value.trim();
  campoMunicipio.value = '';
  campoCodigoPostal.classList.remove('ok');
  mensajeCobertura.hidden = codigoPostal.length < 5;
  if (mensajeCobertura.hidden) return;

  const municipio = buscarMunicipioPorCodigoPostal(codigoPostal);
  if (municipio) {
    campoMunicipio.value = `${municipio.nombre}, N.L.`;
    campoCodigoPostal.classList.add('ok');
    mensajeCobertura.className = 'msg-ok';
    mensajeCobertura.textContent = `Dentro del área de cobertura: ${municipio.nombre}, N.L.`;
  } else {
    mensajeCobertura.className = 'msg-error';
    mensajeCobertura.textContent = 'Este código postal está fuera del área metropolitana. Solo pueden registrarse empresas dentro de la zona.';
  }
}

function validarRegistro() {
  const errores = [];
  const exigir = (id, mensaje) => {
    if (!valorDe(id)) errores.push([id, mensaje]);
  };

  exigir('razon-social', 'Escribe la razón social de la empresa.');
  if (!esRfcValido(valorDe('rfc'))) errores.push(['rfc', 'El RFC debe tener 12 o 13 caracteres, por ejemplo ADN180423K21.']);
  exigir('tipo-empresa', 'Elige si la empresa compra, vende o ambas.');
  exigir('giro', 'Escribe el giro industrial de la empresa.');
  exigir('calle', 'Escribe la calle y el número.');
  exigir('colonia', 'Escribe la colonia.');

  const codigoPostal = valorDe('codigo-postal');
  if (!buscarMunicipioPorCodigoPostal(codigoPostal)) {
    errores.push(['codigo-postal', codigoPostal.length === 5 ? '' : 'Escribe un código postal de 5 dígitos.']);
  }

  exigir('nombre-responsable', 'Escribe el nombre de la persona responsable.');
  if (!esTelefonoValido(valorDe('telefono'))) errores.push(['telefono', 'Escribe un teléfono de 10 dígitos.']);
  if (!esCorreoValido(valorDe('correo'))) errores.push(['correo', 'Escribe un correo válido, por ejemplo compras@empresa.mx.']);

  const contrasena = document.getElementById('contrasena').value;
  const confirmacion = document.getElementById('confirmar-contrasena').value;
  if (contrasena.length < 8) {
    errores.push(['contrasena', 'La contraseña debe tener al menos 8 caracteres.']);
  } else if (contrasena !== confirmacion) {
    errores.push(['confirmar-contrasena', 'Las contraseñas no coinciden.']);
  }

  return errores;
}

function datosRegistro() {
  return {
    razonSocial: valorDe('razon-social'),
    rfc: valorDe('rfc').toUpperCase(),
    tipoEmpresa: valorDe('tipo-empresa'),
    giro: valorDe('giro'),
    calle: valorDe('calle'),
    colonia: valorDe('colonia'),
    codigoPostal: valorDe('codigo-postal'),
    municipio: valorDe('municipio').replace(', N.L.', ''),
    nombreResponsable: valorDe('nombre-responsable'),
    telefono: valorDe('telefono').replace(/\s/g, ''),
    correo: valorDe('correo').toLowerCase(),
    contrasena: document.getElementById('contrasena').value,
  };
}

campoCodigoPostal.addEventListener('input', actualizarCobertura);

formularioRegistro.addEventListener('submit', async (evento) => {
  evento.preventDefault();
  limpiarErrores(formularioRegistro);

  const errores = validarRegistro();
  if (errores.length > 0) {
    errores.forEach(([id, mensaje]) => marcarError(document.getElementById(id), mensaje));
    document.getElementById(errores[0][0]).focus();
    mostrarAviso('Revisa los campos marcados en rojo.', 'error');
    return;
  }

  botonRegistrar.disabled = true;
  botonRegistrar.textContent = 'Registrando...';

  try {
    if (usarBackendLocal()) {
      await solicitarApi('/auth/registro', {
        method: 'POST',
        body: JSON.stringify(datosRegistro()),
      });
    }
    formularioRegistro.hidden = true;
    document.getElementById('registro-recibido').hidden = false;
  } catch (error) {
    mostrarAviso(error.message || 'No fue posible registrar la empresa.', 'error');
  } finally {
    botonRegistrar.disabled = false;
    botonRegistrar.textContent = 'Registrar empresa';
  }
});
