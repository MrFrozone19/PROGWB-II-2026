const API_BASE = '/api';

function usarBackendLocal() {
  return location.hostname === 'localhost' || location.hostname === '127.0.0.1';
}

async function solicitarApi(ruta, opciones = {}) {
  const encabezados = { ...(opciones.headers || {}) };
  if (opciones.body && !encabezados['Content-Type']) encabezados['Content-Type'] = 'application/json';

  const sesion = typeof leerSesion === 'function' ? leerSesion() : null;
  if (sesion && sesion.token && !encabezados.Authorization) {
    encabezados.Authorization = `Bearer ${sesion.token}`;
  }

  const respuesta = await fetch(`${API_BASE}${ruta}`, { ...opciones, headers: encabezados });
  const tipo = respuesta.headers.get('content-type') || '';
  const datos = tipo.includes('application/json') ? await respuesta.json() : null;

  if (!respuesta.ok) {
    const error = new Error(datos?.mensaje || `Error HTTP ${respuesta.status}`);
    error.estado = respuesta.status;
    error.datos = datos;
    throw error;
  }

  return datos;
}
