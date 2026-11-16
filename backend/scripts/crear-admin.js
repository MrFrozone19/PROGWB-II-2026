require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { Empresa, Usuario } = require('../src/models');
const correo = String(process.env.ADMIN_CORREO || '').trim().toLowerCase();
const clave = String(process.env.ADMIN_PASSWORD || '');
if (!process.env.MONGODB_URI || !correo.match(/^[^@]+@[^@]+\.[^@]+$/) || clave.length < 12) {
  console.error('Configura MONGODB_URI, ADMIN_CORREO y ADMIN_PASSWORD (mínimo 12 caracteres).');
  process.exit(1);
}
(async()=>{
  await mongoose.connect(process.env.MONGODB_URI);
  let empresa = await Empresa.findOne({ rfc: 'EBO230101ABC' });
  if (!empresa) empresa = await Empresa.create({ razonSocial:'Administración Enlace B2B',rfc:'EBO230101ABC',tipo:'plataforma',giro:'Servicios digitales',calle:'Domicilio administrativo',colonia:'Centro',codigoPostal:'64000',municipio:'Monterrey',estadoVerificacion:'verificada' });
  if (await Usuario.exists({correo})) throw Error('Ya existe un usuario con ese correo. No se modificó nada.');
  await Usuario.create({empresaId:empresa._id,nombre:'Administrador',correo,telefono:'8112345678',rol:'administrador',activo:true,passwordHash:await bcrypt.hash(clave,12)});
  console.log('Cuenta de administrador creada. Borra las variables ADMIN_CORREO y ADMIN_PASSWORD del entorno si ya no las necesitas.');
})().catch(e=>{console.error(e.message);process.exitCode=1}).finally(()=>mongoose.disconnect());
