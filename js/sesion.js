/* Sesión simulada del prototipo.
   Guarda al usuario en localStorage para poder navegar entre pantallas
   sin backend. En la versión final este control lo hará el token del login. */

const CLAVE_SESION = 'enlaceB2B.sesion';
const MINUTOS_MAXIMOS_INACTIVIDAD = 30;
const PANTALLA_INICIO_SESION = '01-inicio-sesion.html';

const PANTALLA_INICIO_POR_ROL = {
  comprador: '03-busqueda-principal.html',
  distribuidor: '11-panel-distribuidor.html',
  administrador: '18-empresas-por-verificar.html',
};

function pantallaInicioDe(rol) {
  return PANTALLA_INICIO_POR_ROL[rol] || PANTALLA_INICIO_SESION;
}

function leerSesion() {
  try {
    return JSON.parse(localStorage.getItem(CLAVE_SESION));
  } catch {
    return null;
  }
}

function guardarSesion(sesion) {
  try {
    localStorage.setItem(CLAVE_SESION, JSON.stringify(sesion));
  } catch {
    // El navegador no permite guardar datos (por ejemplo, modo privado estricto).
  }
}

function borrarSesion() {
  try {
    localStorage.removeItem(CLAVE_SESION);
  } catch {
    // Nada que borrar si el almacenamiento no está disponible.
  }
}

function sesionVigente() {
  const sesion = leerSesion();
  if (!sesion) return null;

  const minutosInactivo = (Date.now() - sesion.ultimaActividad) / 60000;
  if (minutosInactivo > MINUTOS_MAXIMOS_INACTIVIDAD) {
    borrarSesion();
    return null;
  }
  return sesion;
}

function iniciarSesion(correo, contrasena) {
  const correoNormalizado = correo.trim().toLowerCase();
  const usuario = USUARIOS_DEMO.find((u) => u.correo === correoNormalizado);

  if (!usuario || usuario.contrasena !== contrasena) {
    return { exito: false, motivo: 'credenciales' };
  }
  if (usuario.estadoEmpresa !== 'verificada') {
    return { exito: false, motivo: 'pendiente' };
  }

  guardarSesion({
    correo: usuario.correo,
    nombre: usuario.nombre,
    empresa: usuario.empresa,
    rol: usuario.rol,
    ultimaActividad: Date.now(),
  });
  return { exito: true, destino: pantallaInicioDe(usuario.rol) };
}

function cerrarSesion() {
  borrarSesion();
  location.href = PANTALLA_INICIO_SESION;
}

function registrarActividad() {
  const sesion = leerSesion();
  if (!sesion) return;
  sesion.ultimaActividad = Date.now();
  guardarSesion(sesion);
}

/* Cada pantalla interna declara su rol en <html data-rol="...">.
   Sin sesión se regresa al login; con otro rol se envía a su propio inicio. */
function protegerPantalla() {
  const rolRequerido = document.documentElement.dataset.rol;
  if (!rolRequerido) return;

  const sesion = sesionVigente();
  if (!sesion) {
    location.replace(PANTALLA_INICIO_SESION);
    return;
  }
  if (sesion.rol !== rolRequerido) {
    location.replace(pantallaInicioDe(sesion.rol));
    return;
  }

  registrarActividad();
  document.addEventListener('click', registrarActividad);
  document.addEventListener('keydown', registrarActividad);
  setInterval(() => {
    if (!sesionVigente()) location.replace(PANTALLA_INICIO_SESION);
  }, 60000);
}

protegerPantalla();
