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
    return null;
  }
  return sesion;
}

function borrarSesion() {
  try {
    localStorage.removeItem(CLAVE_SESION);
  } catch {
    return null;
  }
  return null;
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

function iniciarSesionDemo(correo, contrasena) {
  const correoNormalizado = correo.trim().toLowerCase();
  const usuario = USUARIOS_DEMO.find((item) => item.correo === correoNormalizado);

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
    modo: 'demo',
  });
  return { exito: true, destino: pantallaInicioDe(usuario.rol) };
}

async function iniciarSesion(correo, contrasena) {
  if (!usarBackendLocal()) return iniciarSesionDemo(correo, contrasena);

  try {
    const respuesta = await solicitarApi('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ correo, contrasena }),
    });

    guardarSesion({
      correo: respuesta.usuario.correo,
      nombre: respuesta.usuario.nombre,
      empresa: respuesta.usuario.empresa,
      empresaId: respuesta.usuario.empresaId,
      rol: respuesta.usuario.rol,
      token: respuesta.token,
      ultimaActividad: Date.now(),
      modo: 'backend',
    });

    return { exito: true, destino: pantallaInicioDe(respuesta.usuario.rol) };
  } catch (error) {
    if (error.datos?.motivo === 'pendiente') return { exito: false, motivo: 'pendiente' };
    if (error.estado === 401) return { exito: false, motivo: 'credenciales' };
    return { exito: false, motivo: 'servicio' };
  }
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

function protegerPantalla() {
  const rolRequerido = document.documentElement.dataset.rol;
  const requiereSesion = document.documentElement.dataset.requiereSesion === 'true';
  if (!rolRequerido && !requiereSesion) return;

  const sesion = sesionVigente();
  if (!sesion) {
    location.replace(PANTALLA_INICIO_SESION);
    return;
  }

  if (rolRequerido && sesion.rol !== rolRequerido) {
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
