require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { Empresa, Usuario, Producto, Inventario, Configuracion } = require('../src/models');

if (process.env.NODE_ENV === 'production') {
  console.error('La carga de demostración no se permite en producción.');
  process.exit(1);
}
if (!process.env.MONGODB_URI || !process.env.JWT_SECRET) {
  console.error('Configura MONGODB_URI y JWT_SECRET en backend/.env');
  process.exit(1);
}
const clave = process.env.DEMO_PASSWORD || 'demo1234';
const empresas = [
  { razonSocial:'Operación Enlace B2B',rfc:'EBO230101ABC',tipo:'plataforma',giro:'Marketplace',calle:'Av. Fundidora 1',colonia:'Obrera',codigoPostal:'64010',municipio:'Monterrey',latitud:25.678,longitud:-100.291,estadoVerificacion:'verificada' },
  { razonSocial:'Aceros del Norte S.A. de C.V.',rfc:'ADN180423K21',tipo:'comprador',giro:'Manufactura industrial',calle:'Av. Manuel L. Barragán 1250',colonia:'Anáhuac',codigoPostal:'66450',municipio:'San Nicolás de los Garza',latitud:25.750,longitud:-100.293,estadoVerificacion:'verificada' },
  { razonSocial:'Refacciones Industriales GM',rfc:'RIG180422ABC',tipo:'distribuidor',giro:'Rodamientos',calle:'Av. Miguel Alemán 3400',colonia:'Industrial',codigoPostal:'67110',municipio:'Guadalupe',latitud:25.675,longitud:-100.228,estadoVerificacion:'verificada',tiempoEntrega:'Mismo día',formasPago:['transferencia','contra_entrega'] },
  { razonSocial:'Seguridad Total del Norte',rfc:'STN180422ABC',tipo:'distribuidor',giro:'Seguridad industrial',calle:'Av. Concordia 200',colonia:'Centro',codigoPostal:'66600',municipio:'Apodaca',latitud:25.776,longitud:-100.182,estadoVerificacion:'verificada',tiempoEntrega:'24 horas',formasPago:['transferencia'] },
  { razonSocial:'Bombas y Válvulas del Pacífico',rfc:'BVP210715J43',tipo:'distribuidor',giro:'Bombas industriales',calle:'Av. Universidad 100',colonia:'Centro',codigoPostal:'66400',municipio:'San Nicolás de los Garza',estadoVerificacion:'pendiente' },
  { razonSocial:'Maquinados por Revisar',rfc:'MPR210715ABC',tipo:'distribuidor',giro:'Manufactura',calle:'Av. Ruiz Cortines 100',colonia:'Centro',codigoPostal:'64000',municipio:'Monterrey',estadoVerificacion:'rechazada',motivoRechazo:'Datos incompletos' }
];
const usuarios = [
  ['EBO230101ABC','admin@enlaceb2b.mx','Administrador','administrador'],
  ['ADN180423K21','compras@aceros-delnorte.mx','Alejandro Ramírez','comprador'],
  ['RIG180422ABC','ventas@refacciones-gm.mx','Rubén Cavazos','distribuidor'],
  ['STN180422ABC','ventas@seguridad-norte.mx','María Garza','distribuidor'],
  ['BVP210715J43','ventas@bvpacifico.mx','Claudia Ramos','distribuidor']
];
const articulos = [
  ['RIG180422ABC','RG-6205-2RS','Rodamiento 6205-2RS sellado','Rodamientos',185,60],
  ['RIG180422ABC','RG-UCP205','Chumacera UCP-205','Rodamientos',310,9],
  ['RIG180422ABC','RG-BV-A42','Banda en V A-42','Bandas y poleas',95,3],
  ['RIG180422ABC','RG-GRA-1K','Grasa para rodamiento 1 kg','Lubricantes',188,18],
  ['STN180422ABC','ST-GC-REF','Guantes de carnaza reforzados','Seguridad industrial',96,240],
  ['STN180422ABC','ST-LEN-PR','Lentes de seguridad','Seguridad industrial',60,0]
];
(async()=>{
  await mongoose.connect(process.env.MONGODB_URI);
  const mapa={};
  for(const empresa of empresas){
    let actual=await Empresa.findOne({rfc:empresa.rfc});
    if(!actual)actual=await Empresa.create(empresa);
    mapa[empresa.rfc]=actual;
  }
  for(const [rfc,correo,nombre,rol]of usuarios){
    if(await Usuario.exists({correo}))continue;
    await Usuario.create({empresaId:mapa[rfc]._id,correo,nombre,rol,telefono:'8112345678',passwordHash:await bcrypt.hash(clave,10)});
  }
  for(const [rfc,sku,nombre,categoria,precio,existencias]of articulos){
    const distribuidorId=mapa[rfc]._id;
    let producto=await Producto.findOne({distribuidorId,sku});
    if(!producto)producto=await Producto.create({distribuidorId,sku,nombre,categoria,precio,descripcion:nombre+' para uso industrial.',unidadMedida:'pieza',activo:true});
    await Inventario.updateOne({productoId:producto._id},{$setOnInsert:{existencias,stockMinimo:5}},{upsert:true});
  }
  await Configuracion.updateOne({clave:'comision_porcentaje'},{$setOnInsert:{valor:'5',descripcion:'Comisión general inicial'}},{upsert:true});
  console.log('Cuentas y productos de prueba preparados. Contraseña común: la definida en DEMO_PASSWORD o demo1234.');
})().catch(e=>{console.error(e.message);process.exitCode=1}).finally(()=>mongoose.disconnect());
