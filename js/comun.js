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
  const sesion = typeof sesionVigente === 'function' ? sesionVigente() : null;
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


function prepararContextoVisual() {
  const html = document.documentElement;
  const body = document.body;
  const rol = html.dataset.rol || 'publico';
  body.classList.add(`rol-${rol}`);

  const archivo = location.pathname.split('/').pop() || '';
  const coincidencia = archivo.match(/^(\d{2})-/);
  if (coincidencia) {
    body.classList.add(`pantalla-${coincidencia[1]}`);
  }
}

function obtenerSvgIcono(nombre) {
  const iconos = {
    'tornillería': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 4h6"/><path d="M10 7h4"/><path d="M12 7v11"/><path d="M9 11l6 6"/><path d="M15 11l-6 6"/></svg>',
    'lubricantes': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3c3.5 4.2 5.5 7 5.5 10a5.5 5.5 0 1 1-11 0c0-3 2-5.8 5.5-10Z"/></svg>',
    'herramienta': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14.5 5a4 4 0 0 0 4.8 4.8l-8.6 8.6a2 2 0 1 1-2.8-2.8l8.6-8.6A4 4 0 0 0 14.5 5Z"/></svg>',
    'material eléctrico': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M13 2 5 14h6l-1 8 8-12h-6l1-8Z"/></svg>',
    'seguridad industrial': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3l7 3v5c0 4.2-2.5 7.9-7 10-4.5-2.1-7-5.8-7-10V6l7-3Z"/></svg>'
  };

  return iconos[nombre.toLowerCase()] || '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="4" width="16" height="16" rx="4"/></svg>';
}

function prepararIconos() {
  document.querySelectorAll('.icono').forEach((icono) => {
    const figura = icono.querySelector('.fig');
    const nombre = icono.querySelector('.nom');
    if (!figura || !nombre) return;

    figura.innerHTML = obtenerSvgIcono(nombre.textContent.trim());
    figura.setAttribute('aria-hidden', 'true');
  });

  const iconoConfirmacion = document.querySelector('.confirmacion .icono');
  if (iconoConfirmacion) {
    iconoConfirmacion.innerHTML = '<svg viewBox="0 0 24 24" width="52" height="52" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="m8.5 12.2 2.2 2.2 4.8-5"/></svg>';
    iconoConfirmacion.style.display = 'grid';
    iconoConfirmacion.style.placeItems = 'center';
    iconoConfirmacion.style.color = 'var(--success)';
  }
}

prepararContextoVisual();
prepararEncabezado();
prepararClics();
prepararIconos();
