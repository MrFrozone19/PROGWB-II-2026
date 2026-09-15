const base = process.env.API_URL || 'http://localhost:3000/api';

async function ejecutar() {
  const respuestaLogin = await fetch(`${base}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ correo: 'compras@aceros-delnorte.mx', contrasena: 'demo1234' }),
  });
  if (!respuestaLogin.ok) throw new Error('No fue posible iniciar sesión con la cuenta de prueba.');
  const login = await respuestaLogin.json();

  const salud = await fetch(`${base}/salud`, {
    headers: { Authorization: `Bearer ${login.token}` },
  });
  if (!salud.ok) throw new Error('El servicio de salud no respondió correctamente.');

  const empresas = await fetch(`${base}/empresas`, {
    headers: { Authorization: `Bearer ${login.token}` },
  });
  if (!empresas.ok) throw new Error('No fue posible consultar el Back End con autorización.');

  const datos = await empresas.json();
  console.log(`Prueba completada. Empresas consultadas: ${datos.length}`);
}

ejecutar().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
