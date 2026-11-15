PRAGMA foreign_keys = ON;
CREATE TABLE IF NOT EXISTS empresas (
  id INTEGER PRIMARY KEY,
  razon_social TEXT NOT NULL,
  rfc TEXT NOT NULL UNIQUE,
  tipo TEXT NOT NULL CHECK(tipo IN ('comprador','distribuidor','ambos','plataforma')),
  giro TEXT NOT NULL,
  calle TEXT NOT NULL,
  colonia TEXT NOT NULL,
  codigo_postal TEXT NOT NULL,
  municipio TEXT NOT NULL,
  latitud REAL,
  longitud REAL,
  estado_verificacion TEXT NOT NULL DEFAULT 'pendiente',
  motivo_rechazo TEXT DEFAULT '',
  descripcion_publica TEXT DEFAULT '',
  tiempo_entrega TEXT,
  pedido_minimo INTEGER DEFAULT 1,
  recoleccion INTEGER DEFAULT 0,
  fecha_verificacion TEXT,
  fecha_creacion TEXT NOT NULL,
  fecha_actualizacion TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS usuarios (
  id INTEGER PRIMARY KEY,
  empresa_id INTEGER NOT NULL REFERENCES empresas(id),
  nombre TEXT NOT NULL,
  correo TEXT UNIQUE NOT NULL,
  telefono TEXT,
  password_hash TEXT NOT NULL,
  rol TEXT NOT NULL CHECK(rol IN ('comprador','distribuidor','administrador')),
  activo INTEGER NOT NULL DEFAULT 1,
  reset_token_hash TEXT,
  reset_vence TEXT,
  fecha_creacion TEXT NOT NULL,
  fecha_actualizacion TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS productos (
  id INTEGER PRIMARY KEY,
  distribuidor_id INTEGER NOT NULL REFERENCES empresas(id),
  sku TEXT NOT NULL,
  nombre TEXT NOT NULL,
  descripcion TEXT NOT NULL,
  categoria TEXT NOT NULL,
  marca TEXT,
  foto_url TEXT,
  precio NUMERIC NOT NULL,
  unidad_medida TEXT NOT NULL,
  activo INTEGER NOT NULL DEFAULT 1,
  fecha_creacion TEXT NOT NULL,
  fecha_actualizacion TEXT NOT NULL,
  UNIQUE(distribuidor_id,sku)
);
CREATE TABLE IF NOT EXISTS inventarios (
  id INTEGER PRIMARY KEY,
  producto_id INTEGER NOT NULL UNIQUE REFERENCES productos(id),
  existencias INTEGER NOT NULL CHECK(existencias>=0),
  stock_minimo INTEGER NOT NULL CHECK(stock_minimo>=0),
  fecha_creacion TEXT NOT NULL,
  fecha_actualizacion TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS pedidos (
  id INTEGER PRIMARY KEY,
  comprador_id INTEGER NOT NULL REFERENCES empresas(id),
  distribuidor_id INTEGER NOT NULL REFERENCES empresas(id),
  estado TEXT NOT NULL DEFAULT 'pendiente',
  subtotal NUMERIC NOT NULL DEFAULT 0,
  total NUMERIC NOT NULL DEFAULT 0,
  comision_pct REAL NOT NULL DEFAULT 5,
  comision_monto NUMERIC NOT NULL DEFAULT 0,
  direccion_entrega TEXT,
  referencia_entrega TEXT,
  metodo_pago TEXT,
  fecha_estimada TEXT,
  nota_entrega TEXT,
  motivo_rechazo TEXT,
  fecha_creacion TEXT NOT NULL,
  fecha_actualizacion TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS detalles_pedido (
  id INTEGER PRIMARY KEY,
  pedido_id INTEGER NOT NULL REFERENCES pedidos(id),
  producto_id INTEGER NOT NULL REFERENCES productos(id),
  cantidad INTEGER NOT NULL CHECK(cantidad>0),
  precio_unitario NUMERIC NOT NULL,
  subtotal NUMERIC NOT NULL
);
CREATE TABLE IF NOT EXISTS historial_estados (
  id INTEGER PRIMARY KEY,
  pedido_id INTEGER NOT NULL REFERENCES pedidos(id),
  estado TEXT NOT NULL,
  fecha TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS transacciones (
  id INTEGER PRIMARY KEY,
  pedido_id INTEGER NOT NULL UNIQUE REFERENCES pedidos(id),
  tipo TEXT NOT NULL,
  monto NUMERIC NOT NULL,
  estado TEXT NOT NULL,
  referencia TEXT,
  fecha_creacion TEXT NOT NULL,
  fecha_actualizacion TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS configuraciones (
  id INTEGER PRIMARY KEY,
  clave TEXT NOT NULL UNIQUE,
  valor TEXT NOT NULL,
  descripcion TEXT,
  fecha_creacion TEXT NOT NULL,
  fecha_actualizacion TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS historial_comisiones (
  id INTEGER PRIMARY KEY,
  clave TEXT NOT NULL,
  porcentaje REAL NOT NULL CHECK(porcentaje>=2 AND porcentaje<=10),
  vigente_desde TEXT NOT NULL,
  usuario_id INTEGER NOT NULL REFERENCES usuarios(id),
  fecha_creacion TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS notificaciones (
  id INTEGER PRIMARY KEY,
  empresa_id INTEGER NOT NULL REFERENCES empresas(id),
  pedido_id INTEGER REFERENCES pedidos(id),
  mensaje TEXT NOT NULL,
  leida INTEGER NOT NULL DEFAULT 0,
  fecha_creacion TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS calificaciones (
  id INTEGER PRIMARY KEY,
  pedido_id INTEGER NOT NULL UNIQUE REFERENCES pedidos(id),
  comprador_id INTEGER NOT NULL REFERENCES empresas(id),
  distribuidor_id INTEGER NOT NULL REFERENCES empresas(id),
  puntuacion INTEGER NOT NULL CHECK(puntuacion BETWEEN 1 AND 5),
  comentario TEXT,
  fecha_creacion TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_pedidos_comprador ON pedidos(comprador_id,fecha_creacion);
CREATE INDEX IF NOT EXISTS idx_pedidos_distribuidor ON pedidos(distribuidor_id,estado);
CREATE INDEX IF NOT EXISTS idx_productos_categoria ON productos(categoria,activo);
CREATE INDEX IF NOT EXISTS idx_notificaciones_empresa ON notificaciones(empresa_id,leida);
