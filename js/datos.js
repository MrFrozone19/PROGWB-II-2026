/* Datos de ejemplo del prototipo (primer avance).
   Sustituyen temporalmente la información que en la versión final
   entregará el backend. */

const CONTRASENA_DEMO = 'demo1234';

const USUARIOS_DEMO = [
  {
    correo: 'compras@aceros-delnorte.mx',
    contrasena: CONTRASENA_DEMO,
    nombre: 'Alejandro Ramírez Garza',
    empresa: 'Aceros del Norte S.A. de C.V.',
    rol: 'comprador',
    estadoEmpresa: 'verificada',
  },
  {
    correo: 'ventas@refacciones-gm.mx',
    contrasena: CONTRASENA_DEMO,
    nombre: 'Ing. Rubén Cavazos',
    empresa: 'Refacciones Industriales GM',
    rol: 'distribuidor',
    estadoEmpresa: 'verificada',
  },
  {
    correo: 'admin@enlaceb2b.mx',
    contrasena: CONTRASENA_DEMO,
    nombre: 'Administrador de la plataforma',
    empresa: 'Operación de plataforma',
    rol: 'administrador',
    estadoEmpresa: 'verificada',
  },
  {
    correo: 'ventas@bvpacifico.mx',
    contrasena: CONTRASENA_DEMO,
    nombre: 'Ing. Claudia Treviño Ramos',
    empresa: 'Bombas y Válvulas del Pacífico',
    rol: 'distribuidor',
    estadoEmpresa: 'pendiente',
  },
];

/* Municipios del área metropolitana de Monterrey con rangos de código
   postal aproximados. En la versión final los configura el administrador. */
const MUNICIPIOS_COBERTURA = [
  { nombre: 'Monterrey', cpDesde: 64000, cpHasta: 64999 },
  { nombre: 'García', cpDesde: 66000, cpHasta: 66049 },
  { nombre: 'General Escobedo', cpDesde: 66050, cpHasta: 66099 },
  { nombre: 'Santa Catarina', cpDesde: 66100, cpHasta: 66199 },
  { nombre: 'San Pedro Garza García', cpDesde: 66200, cpHasta: 66299 },
  { nombre: 'San Nicolás de los Garza', cpDesde: 66400, cpHasta: 66499 },
  { nombre: 'Apodaca', cpDesde: 66600, cpHasta: 66649 },
  { nombre: 'Guadalupe', cpDesde: 67100, cpHasta: 67199 },
  { nombre: 'Juárez', cpDesde: 67250, cpHasta: 67299 },
];
