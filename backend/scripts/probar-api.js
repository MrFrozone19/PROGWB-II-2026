require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const origen = (process.env.TEST_URL || 'http://localhost:3000').replace(/\/$/, '');
const correo = process.env.TEST_CORREO || 'compras@aceros-delnorte.mx';
const contrasena = process.env.TEST_PASSWORD || process.env.DEMO_PASSWORD || 'demo1234';
let token = '';
let fallos = 0;
async function consultar(ruta, metodo='GET', cuerpo) {
  const respuesta = await fetch(origen + '/api' + ruta, {
    method: metodo,
    headers: { ...(token ? {Authorization:'Bearer '+token}:{}), ...(cuerpo?{'Content-Type':'application/json'}:{}) },
    ...(cuerpo ? {body:JSON.stringify(cuerpo)} : {})
  });
  const json = await respuesta.json().catch(()=>null);
  if (!respuesta.ok) throw Error(`${respuesta.status}: ${json?.mensaje || 'Sin información'}`);
  return json;
}
async function paso(texto, ruta, revisar) {
  try {
    const dato = await consultar(ruta);
    if (revisar && !revisar(dato)) throw Error('La respuesta no tiene el formato esperado.');
    console.log('OK  ',texto);
    return dato;
  } catch (e) {
    fallos++;
    console.log('ERROR',texto,'-',e.message);
  }
}
(async()=>{
  await paso('Servidor', '/salud', d=>d?.estado==='ok');
  const login = await (async()=>{
    try {const d = await consultar('/auth/login','POST',{correo,contrasena}); console.log('OK   Inicio de sesión como',d.usuario.rol); return d;}catch(e){fallos++;console.log('ERROR Login:',e.message);return null}
  })();
  if (!login){process.exitCode=1;return}
  token = login.token;
  await paso('Perfil de sesión','/auth/perfil',d=>Boolean(d?._id));
  await paso('Productos','/productos',Array.isArray);
  await paso('Búsqueda','/busqueda/productos',d=>Array.isArray(d?.productos));
  await paso('Pedidos','/pedidos',Array.isArray);
  await paso('Notificaciones','/notificaciones',Array.isArray);
  if (login.usuario.rol === 'distribuidor') await paso('Inventario del distribuidor','/inventarios',Array.isArray);
  if (login.usuario.rol === 'administrador') {
    await paso('Empresas','/empresas',Array.isArray);
    await paso('Comisiones','/comisiones',d=>Array.isArray(d?.historial));
    await paso('Transacciones','/transacciones',Array.isArray);
    await paso('Reporte','/reportes/ventas-por-distribuidor',Array.isArray);
  }
  console.log('\n',fallos ? `Se detectaron ${fallos} errores.`:'Consultas de lectura completadas. Prueba también operaciones de escritura desde el navegador.');
  if (fallos) process.exitCode=1;
})().catch(e=>{console.error(e.message);process.exitCode=1});
