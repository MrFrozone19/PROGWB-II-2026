const path = require('path');
const express = require('express');
const cors = require('cors');
const crearRouterCrud = require('./routes/crud');
const empresasRouter = require('./routes/empresas');
const inventariosRouter = require('./routes/inventarios');
const transaccionesRouter = require('./routes/transacciones');
const comisionesRouter = require('./routes/comisiones');
const notificacionesRouter = require('./routes/notificaciones');
const calificacionesRouter = require('./routes/calificaciones');
const authRouter = require('./routes/auth');
const usuariosRouter = require('./routes/usuarios');
const reportesRouter = require('./routes/reportes');
const pedidosRouter = require('./routes/pedidos');
const busquedaRouter = require('./routes/busqueda');
const productosRouter = require('./routes/productos');
const manejarErrores = require('./middleware/errores');
const { autenticar, autorizarRoles } = require('./middleware/auth');
const validarConfiguracion = require('./middleware/validarConfiguracion');
const autorizarProductos = require('./middleware/autorizarProductos');
const {
  Empresa,
  Usuario,
  Producto,
  Inventario,
  Pedido,
  Transaccion,
  Configuracion
} = require('./models');

const app = express();

app.use(cors());
app.use(express.json({ limit: '1mb' }));

app.get('/api/salud', (req, res) => {
  res.json({ servicio: 'Enlace B2B Local', estado: 'ok', fecha: new Date().toISOString() });
});

app.use('/api/auth', authRouter);
app.use('/api/empresas', empresasRouter);
app.post('/api/productos', autenticar, autorizarProductos);
app.use('/api/usuarios', usuariosRouter);
app.use('/api/productos', productosRouter);
app.use('/api/productos', crearRouterCrud(Producto));
app.use('/api/inventarios', inventariosRouter);
app.use('/api/pedidos', pedidosRouter);
app.use('/api/transacciones', transaccionesRouter);
app.use('/api/configuraciones', autenticar, autorizarRoles('administrador'));
app.post('/api/configuraciones', validarConfiguracion);
app.put('/api/configuraciones/:id', validarConfiguracion);
app.use('/api/configuraciones', crearRouterCrud(Configuracion));
app.use('/api/reportes', reportesRouter);
app.use('/api/comisiones', comisionesRouter);
app.use('/api/notificaciones', notificacionesRouter);
app.use('/api/calificaciones', calificacionesRouter);
app.use('/api/busqueda', busquedaRouter);

const raizFrontend = path.resolve(__dirname, '../..');
app.use('/pantallas', express.static(path.join(raizFrontend, 'pantallas')));
app.use('/css', express.static(path.join(raizFrontend, 'css')));
app.use('/assets', express.static(path.join(raizFrontend, 'assets')));
app.use('/js', express.static(path.join(raizFrontend, 'js')));
app.get(['/', '/index.html'], (req, res) => res.sendFile(path.join(raizFrontend, 'index.html')));

app.use((req, res) => {
  if (req.path.startsWith('/api/')) return res.status(404).json({ mensaje: 'Ruta de API no encontrada.' });
  return res.status(404).send('Recurso no encontrado.');
});

app.use(manejarErrores);

module.exports = app;
