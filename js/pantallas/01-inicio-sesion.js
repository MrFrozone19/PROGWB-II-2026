/* Pantalla 01 — Inicio de sesión. */

const formularioLogin = document.getElementById('formulario-login');
const campoCorreo = document.getElementById('correo');
const campoContrasena = document.getElementById('contrasena');
const botonVerContrasena = document.getElementById('ver-contrasena');
const mensajeError = document.getElementById('mensaje-error');
const avisoPendiente = document.getElementById('aviso-pendiente');
const mensajeRecuperacion = document.getElementById('mensaje-recuperacion');

// Si ya hay una sesión abierta, no tiene caso volver a pedir credenciales.
const sesionAbierta = sesionVigente();
if (sesionAbierta) {
  location.replace(pantallaInicioDe(sesionAbierta.rol));
}

function ocultarMensajes() {
  mensajeError.hidden = true;
  avisoPendiente.hidden = true;
  mensajeRecuperacion.hidden = true;
  campoCorreo.classList.remove('campo-error');
  campoContrasena.classList.remove('campo-error');
}

function mostrarError(mensaje, campo) {
  mensajeError.textContent = mensaje;
  mensajeError.hidden = false;
  if (campo) {
    campo.classList.add('campo-error');
    campo.focus();
  }
}

formularioLogin.addEventListener('submit', (evento) => {
  evento.preventDefault();
  ocultarMensajes();

  if (!esCorreoValido(campoCorreo.value)) {
    mostrarError('Escribe un correo válido, por ejemplo compras@empresa.mx.', campoCorreo);
    return;
  }
  if (!campoContrasena.value) {
    mostrarError('Escribe tu contraseña.', campoContrasena);
    return;
  }

  const resultado = iniciarSesion(campoCorreo.value, campoContrasena.value);
  if (resultado.exito) {
    location.href = resultado.destino;
  } else if (resultado.motivo === 'pendiente') {
    avisoPendiente.hidden = false;
  } else {
    // No se indica cuál de los dos datos falló.
    mostrarError('Correo o contraseña incorrectos.');
  }
});

botonVerContrasena.addEventListener('click', () => {
  const mostrar = campoContrasena.type === 'password';
  campoContrasena.type = mostrar ? 'text' : 'password';
  botonVerContrasena.textContent = mostrar ? 'Ocultar' : 'Mostrar';
});

document.getElementById('olvide-contrasena').addEventListener('click', (evento) => {
  evento.preventDefault();
  ocultarMensajes();
  mensajeRecuperacion.hidden = false;
});

document.querySelectorAll('.demo [data-correo]').forEach((fila) => {
  fila.addEventListener('click', () => {
    campoCorreo.value = fila.dataset.correo;
    campoContrasena.value = CONTRASENA_DEMO;
    ocultarMensajes();
  });
});
