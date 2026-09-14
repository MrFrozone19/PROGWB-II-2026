/* Comportamiento compartido por todas las pantallas:
   encabezado, cierre de sesión, navegación con data-ir y avisos breves. */

const DURACION_AVISO_MS = 3000;

function mostrarAviso(mensaje, tipo = 'exito') {
  let aviso = document.querySelector('.aviso-flotante');
  if (!aviso) {
    aviso = document.createElement('div');
    aviso.className = 'aviso-flotante';
    aviso.setAttribute('role', 'status');
    document.body.appendChild(aviso);
  }

  aviso.textContent = mensaje;
  aviso.classList.toggle('error', tipo === 'error');
  aviso.classList.add('visible');

  clearTimeout(aviso.temporizador);
  aviso.temporizador = setTimeout(() => aviso.classList.remove('visible'), DURACION_AVISO_MS);
}

function prepararEncabezado() {
  const sesion = sesionVigente();
  if (!sesion) return;

  const titulo = document.querySelector('header h1');
  if (titulo) {
    titulo.classList.add('enlace-inicio');
    titulo.title = 'Ir a la pantalla principal';
    titulo.addEventListener('click', () => {
      location.href = pantallaInicioDe(sesion.rol);
    });
  }

  const nombreEmpresa = document.querySelector('header .empresa');
  if (nombreEmpresa && nombreEmpresa.firstChild) {
    nombreEmpresa.firstChild.textContent = sesion.empresa;
  }
}

/* Un solo manejador para toda la página:
   - [data-cerrar-sesion] termina la sesión.
   - [data-ir="pantalla.html"] navega a esa pantalla.
   - [data-aviso="texto"] muestra un aviso breve sin salir de la pantalla. */
function prepararClics() {
  document.addEventListener('click', (evento) => {
    const cerrar = evento.target.closest('[data-cerrar-sesion]');
    if (cerrar) {
      evento.preventDefault();
      cerrarSesion();
      return;
    }

    const destino = evento.target.closest('[data-ir]');
    if (destino && !destino.disabled) {
      location.href = destino.dataset.ir;
      return;
    }

    const conAviso = evento.target.closest('[data-aviso]');
    if (conAviso && !conAviso.disabled) {
      mostrarAviso(conAviso.dataset.aviso);
    }
  });
}

prepararEncabezado();
prepararClics();
