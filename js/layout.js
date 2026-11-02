(() => {
  const rutas = {
    comprador: [
      { texto: 'Inicio', archivo: '03-busqueda-principal.html', icono: 'home' },
      { texto: 'Buscar productos', archivo: '04-resultados-busqueda.html', icono: 'search' },
      { texto: 'Mi carrito', archivo: '06-carrito.html', icono: 'cart', contador: true },
      { texto: 'Seguimiento de pedidos', archivo: '08-seguimiento-pedido.html', icono: 'truck' },
      { texto: 'Historial de compras', archivo: '09-historial-compras.html', icono: 'history' },
      { texto: 'Mi empresa', archivo: '10-perfil-empresa.html', icono: 'building' }
    ],
    distribuidor: [
      { texto: 'Panel principal', archivo: '11-panel-distribuidor.html', icono: 'home' },
      { texto: 'Mi catálogo', archivo: '12-catalogo-productos.html', icono: 'grid' },
      { texto: 'Inventario', archivo: '13-inventario.html', icono: 'package' },
      { texto: 'Pedidos recibidos', archivo: '14-pedidos-recibidos.html', icono: 'clipboard' },
      { texto: 'Entregas', archivo: '15-estatus-entrega.html', icono: 'truck' },
      { texto: 'Ventas y comisiones', archivo: '16-ventas-comisiones.html', icono: 'chart' },
      { texto: 'Mi empresa', archivo: '17-perfil-distribuidor.html', icono: 'building' }
    ],
    administrador: [
      { texto: 'Empresas por verificar', archivo: '18-empresas-por-verificar.html', icono: 'users' },
      { texto: 'Comisiones', archivo: '19-configuracion-comision.html', icono: 'settings' },
      { texto: 'Transacciones', archivo: '20-supervision-transacciones.html', icono: 'clipboard' },
      { texto: 'Reportes', archivo: '21-reportes.html', icono: 'chart' }
    ]
  };

  const iconos = {
    home: '<path d="m3 10 9-7 9 7"/><path d="M5 9v11h14V9"/><path d="M9 20v-6h6v6"/>',
    search: '<circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 5 5"/>',
    cart: '<path d="M3 4h2l2.2 11.2a2 2 0 0 0 2 1.6h8.6a2 2 0 0 0 1.9-1.4L22 9H7"/><circle cx="10" cy="21" r="1"/><circle cx="18" cy="21" r="1"/>',
    truck: '<path d="M3 6h12v11H3z"/><path d="M15 10h4l3 3v4h-7z"/><circle cx="7.5" cy="19" r="1.8"/><circle cx="18.5" cy="19" r="1.8"/>',
    history: '<path d="M3 12a9 9 0 1 0 2.6-6.4L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l3 2"/>',
    building: '<rect x="4" y="3" width="16" height="18" rx="1"/><path d="M8 7h2M14 7h2M8 11h2M14 11h2M8 15h2M14 15h2M10 21v-3h4v3"/>',
    grid: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
    package: '<path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="M3 8v9l9 5 9-5V8"/><path d="M12 13v9"/><path d="m7.5 5.5 9 5"/>',
    clipboard: '<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4.5h6a1.5 1.5 0 0 0-1.5-1.5h-3A1.5 1.5 0 0 0 9 4.5Z"/><path d="M8 10h8M8 14h8M8 18h5"/>',
    chart: '<path d="M3 3v18h18"/><path d="m7 14 4-4 3 2 6-7"/>',
    users: '<circle cx="9" cy="8" r="3"/><path d="M3 20c0-3 2.7-5 6-5s6 2 6 5"/><path d="M17 5a3 3 0 0 1 0 6M18 15c2 .5 3 2 3 4"/>',
    settings: '<circle cx="12" cy="12" r="3"/><path d="m19.4 15 .1.1 1.4 1.1-1.4 2.4-1.7-.7a8 8 0 0 1-1.5.9l-.3 1.8h-2.8l-.3-1.8a8 8 0 0 1-1.5-.9l-1.7.7-1.4-2.4 1.4-1.1a7 7 0 0 1 0-1.8L6.3 12l1.4-2.4 1.7.7a8 8 0 0 1 1.5-.9l.3-1.8H14l.3 1.8a8 8 0 0 1 1.5.9l1.7-.7 1.4 2.4-1.4 1.1a7 7 0 0 1-.1 1.9Z"/>',
    user: '<circle cx="12" cy="8" r="3.5"/><path d="M4 21c.5-4 3.5-6 8-6s7.5 2 8 6"/>',
    pin: '<path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/>',
    menu: '<path d="M3 6h18M3 12h18M3 18h18"/>',
    logout: '<path d="M10 17l5-5-5-5M15 12H3"/><path d="M12 3h7a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-7"/>',
    help: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.6 2.6 0 1 1 4.4 1.9c-1.2 1-1.9 1.4-1.9 3"/><path d="M12 17.5h.01"/>',
    shield: '<path d="M12 3l8 4v5c0 4.5-3 7.8-8 9-5-1.2-8-4.5-8-9V7l8-4Z"/><path d="m8.5 12 2.2 2.2 4.8-5"/>' ,
    tag: '<path d="M20 13 13 20 3 10V3h7l10 10Z"/><circle cx="7.5" cy="7.5" r="1"/>'
  };

  const icono = (nombre, clase = '') => `<svg class="ui-icon ${clase}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${iconos[nombre] || iconos.grid}</svg>`;
  const escapar = (valor) => String(valor || '').replace(/[&<>"']/g, (caracter) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[caracter]);

  function obtenerSesion() {
    try {
      return typeof sesionVigente === 'function' ? sesionVigente() : JSON.parse(localStorage.getItem('enlaceB2B.sesion'));
    } catch {
      return null;
    }
  }

  function enlaceMenu(item, archivoActual) {
    const activo = item.archivo === archivoActual ? ' activo' : '';
    const contador = item.contador ? '<span class="sidebar-count" data-cart-count>3</span>' : '';
    return `<a class="sidebar-link${activo}" href="${item.archivo}">${icono(item.icono)}<span>${item.texto}</span>${contador}</a>`;
  }

  function crearEstructura() {
    const rol = document.documentElement.dataset.rol;
    if (!['comprador', 'distribuidor', 'administrador'].includes(rol)) return;

    const cuerpo = document.body;
    const sesion = obtenerSesion() || {};
    const archivoActual = location.pathname.split('/').pop();
    const menu = rutas[rol];
    const nombre = sesion.nombre || sesion.empresa || 'Usuario';
    const empresa = sesion.empresa || 'Cuenta de empresa';
    const iniciales = nombre.split(/\s+/).slice(0, 2).map((parte) => parte[0] || '').join('').toUpperCase();
    const destinoInicio = menu[0].archivo;
    const titulo = (document.title.split('—')[1] || 'Panel').trim();
    const rolTexto = rol === 'comprador' ? 'Cuenta compradora' : rol === 'distribuidor' ? 'Cuenta distribuidora' : 'Administración';

    const encabezadoAnterior = cuerpo.querySelector(':scope > header');
    const navegacionAnterior = cuerpo.querySelector(':scope > nav.nav');
    if (encabezadoAnterior) encabezadoAnterior.remove();
    if (navegacionAnterior) navegacionAnterior.remove();

    const contenido = document.createElement('div');
    contenido.className = 'store-content';
    const elementos = Array.from(cuerpo.children);
    elementos.forEach((elemento) => {
      if (elemento !== contenido) contenido.appendChild(elemento);
    });

    const categorias = rol === 'comprador' ? `
      <div class="sidebar-section">
        <div class="sidebar-section-title">Comprar por categoría</div>
        <a class="sidebar-category" href="04-resultados-busqueda.html">${icono('package')}<span>Rodamientos y bandas</span></a>
        <a class="sidebar-category" href="04-resultados-busqueda.html">${icono('settings')}<span>Herramientas</span></a>
        <a class="sidebar-category" href="04-resultados-busqueda.html">${icono('shield')}<span>Seguridad industrial</span></a>
        <a class="sidebar-category" href="04-resultados-busqueda.html">${icono('tag')}<span>Aceros y metales</span></a>
        <a class="sidebar-category" href="04-resultados-busqueda.html">${icono('grid')}<span>Material eléctrico</span></a>
      </div>` : '';

    const navRapida = rol === 'comprador'
      ? `<a href="03-busqueda-principal.html">Inicio</a><a href="04-resultados-busqueda.html">Todos los productos</a><a href="09-historial-compras.html">Compras recientes</a><a href="08-seguimiento-pedido.html">Seguimiento</a><a href="10-perfil-empresa.html">Mi empresa</a>`
      : rol === 'distribuidor'
        ? `<a href="11-panel-distribuidor.html">Resumen</a><a href="12-catalogo-productos.html">Catálogo</a><a href="13-inventario.html">Inventario</a><a href="14-pedidos-recibidos.html">Pedidos</a><a href="16-ventas-comisiones.html">Ventas</a>`
        : `<a href="18-empresas-por-verificar.html">Solicitudes</a><a href="19-configuracion-comision.html">Comisiones</a><a href="20-supervision-transacciones.html">Transacciones</a><a href="21-reportes.html">Reportes</a>`;

    const accesoPrincipal = rol === 'comprador' ? '04-resultados-busqueda.html' : rol === 'distribuidor' ? '14-pedidos-recibidos.html' : '18-empresas-por-verificar.html';
    const destinoBusqueda = rol === 'comprador' ? '04-resultados-busqueda.html' : rol === 'distribuidor' ? '12-catalogo-productos.html' : '20-supervision-transacciones.html';
    const textoAcceso = rol === 'comprador' ? 'Pedidos' : rol === 'distribuidor' ? 'Pedidos nuevos' : 'Solicitudes';
    const placeholder = rol === 'comprador' ? 'Buscar rodamientos, herramientas, materiales...' : rol === 'distribuidor' ? 'Buscar en catálogo y pedidos...' : 'Buscar empresas o transacciones...';

    const shell = document.createElement('div');
    shell.className = `store-shell store-role-${rol}`;
    shell.innerHTML = `
      <div class="store-overlay" data-close-sidebar></div>
      <aside class="store-sidebar" aria-label="Navegación principal">
        <div class="sidebar-brand">
          <a href="${destinoInicio}" class="brand-mark" aria-label="Enlace B2B Local"><span>E</span></a>
          <a href="${destinoInicio}" class="brand-name"><strong>ENLACE</strong><small>B2B LOCAL</small></a>
          <button class="sidebar-close" type="button" aria-label="Cerrar menú" data-close-sidebar>${icono('menu')}</button>
        </div>
        <div class="sidebar-profile">
          <div class="profile-avatar">${escapar(iniciales)}</div>
          <div class="profile-info"><strong>${escapar(nombre)}</strong><span>${escapar(rolTexto)}</span></div>
        </div>
        <div class="sidebar-section">
          <div class="sidebar-section-title">MENÚ PRINCIPAL</div>
          <nav class="sidebar-nav">${menu.map((item) => enlaceMenu(item, archivoActual)).join('')}</nav>
        </div>
        ${categorias}
        <div class="sidebar-bottom">
          <a class="sidebar-help" href="${rol === 'comprador' ? '10-perfil-empresa.html' : rol === 'distribuidor' ? '17-perfil-distribuidor.html' : '21-reportes.html'}">${icono('help')}<span>Centro de ayuda</span></a>
          <button class="sidebar-logout" type="button" data-cerrar-sesion>${icono('logout')}<span>Cerrar sesión</span></button>
        </div>
      </aside>
      <div class="store-main">
        <header class="store-topbar">
          <button class="mobile-menu" type="button" aria-label="Abrir menú" data-open-sidebar>${icono('menu')}</button>
          <a class="mobile-brand" href="${destinoInicio}"><span class="brand-mark"><span>E</span></span><strong>ENLACE</strong></a>
          <div class="delivery-block">${icono('pin')}<div><span>${rol === 'comprador' ? 'Entrega en Monterrey, N.L.' : 'Operación metropolitana'}</span><strong>${rol === 'comprador' ? 'Actualizar ubicación' : escapar(empresa)}</strong></div></div>
          <form class="store-search" role="search">
            <select aria-label="Categoría"><option>Todos</option><option>Rodamientos</option><option>Herramientas</option><option>Seguridad</option><option>Materiales</option></select>
            <input type="search" name="q" placeholder="${placeholder}" aria-label="Buscar">
            <button type="submit" aria-label="Buscar">${icono('search')}</button>
          </form>
          <div class="top-actions">
            <a class="top-account" href="${rol === 'comprador' ? '10-perfil-empresa.html' : rol === 'distribuidor' ? '17-perfil-distribuidor.html' : '18-empresas-por-verificar.html'}">
              ${icono('user')}<span><small>Hola, ${escapar(nombre.split(/\s+/)[0])}</small><strong>Cuenta y perfil</strong></span>
            </a>
            <a class="top-orders" href="${accesoPrincipal}"><span><small>${textoAcceso}</small><strong>${rol === 'comprador' ? 'y compras' : 'por atender'}</strong></span></a>
            ${rol === 'comprador' ? `<a class="top-cart" href="06-carrito.html" aria-label="Abrir carrito">${icono('cart')}<span class="cart-label">Carrito</span><b class="cart-badge" data-cart-count>3</b></a>` : `<a class="top-cart top-work" href="${accesoPrincipal}">${icono('clipboard')}<span class="cart-label">Actividad</span></a>`}
          </div>
        </header>
        <nav class="store-quick-nav">${navRapida}</nav>
        <div class="store-pagebar"><div><span>ENLACE B2B LOCAL</span><strong>${escapar(titulo)}</strong></div><div class="pagebar-company">${icono('building')}<span>${escapar(empresa)}</span></div></div>
        <div class="store-content-wrap"></div>
      </div>`;

    shell.querySelector('.store-content-wrap').appendChild(contenido);
    cuerpo.classList.add('store-app');
    cuerpo.appendChild(shell);

    const formulario = shell.querySelector('.store-search');
    formulario.addEventListener('submit', (evento) => {
      evento.preventDefault();
      const texto = formulario.querySelector('input[name="q"]').value.trim();
      location.href = `${destinoBusqueda}${texto ? `?q=${encodeURIComponent(texto)}` : ''}`;
    });

    shell.querySelector('[data-open-sidebar]').addEventListener('click', () => cuerpo.classList.add('sidebar-visible'));
    shell.querySelectorAll('[data-close-sidebar]').forEach((boton) => boton.addEventListener('click', () => cuerpo.classList.remove('sidebar-visible')));
    actualizarContadorCarrito();
  }

  function obtenerCarrito() {
    try {
      const guardado = localStorage.getItem('enlaceB2B.carrito');
      if (guardado) return JSON.parse(guardado);
    } catch {}
    return [
      { id: 'RG-6205-2RS', nombre: 'Rodamiento 6205-2RS sellado', precio: 185, cantidad: 40 },
      { id: 'RG-UCP205', nombre: 'Chumacera UCP-205', precio: 310, cantidad: 6 },
      { id: 'ST-GC-REF', nombre: 'Guantes de carnaza reforzados', precio: 96, cantidad: 300 }
    ];
  }

  function guardarCarrito(carrito) {
    try {
      localStorage.setItem('enlaceB2B.carrito', JSON.stringify(carrito));
    } catch {}
  }

  function actualizarContadorCarrito() {
    const carrito = obtenerCarrito();
    const total = carrito.length;
    document.querySelectorAll('[data-cart-count]').forEach((elemento) => {
      elemento.textContent = total;
      elemento.setAttribute('aria-label', `${total} productos en el carrito`);
    });
  }

  function agregarAlCarrito(boton) {
    const nombre = boton.dataset.productName || 'Producto industrial';
    const id = boton.dataset.productId || nombre.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const precio = Number(boton.dataset.productPrice || 0);
    const carrito = obtenerCarrito();
    const existente = carrito.find((producto) => producto.id === id);
    if (existente) existente.cantidad += 1;
    else carrito.push({ id, nombre, precio, cantidad: 1 });
    guardarCarrito(carrito);
    actualizarContadorCarrito();
    mostrarMensaje(`${nombre} se agregó al carrito.`);
  }

  function mostrarMensaje(mensaje) {
    let aviso = document.querySelector('.market-toast');
    if (!aviso) {
      aviso = document.createElement('div');
      aviso.className = 'market-toast';
      aviso.setAttribute('role', 'status');
      document.body.appendChild(aviso);
    }
    aviso.textContent = mensaje;
    aviso.classList.add('visible');
    clearTimeout(aviso.timer);
    aviso.timer = setTimeout(() => aviso.classList.remove('visible'), 2600);
  }

  function imagenProducto(archivo, alt = '') {
    return `<img src="../img/productos/${archivo}" alt="${escapar(alt)}" loading="lazy">`;
  }

  function mejorarInicioComprador() {
    const buscador = document.querySelector('.buscador');
    if (buscador) buscador.remove();
    const main = document.querySelector('.store-content main');
    if (!main) return;

    const hero = document.createElement('section');
    hero.className = 'market-hero';
    hero.innerHTML = `
      <div class="hero-copy">
        <span class="hero-kicker">MARKETPLACE INDUSTRIAL</span>
        <h2>Todo lo que tu operación necesita, en un solo lugar.</h2>
        <p>Encuentra proveedores cercanos, compara existencias y abastece tu empresa sin perder tiempo.</p>
        <a href="04-resultados-busqueda.html" class="hero-button">Explorar productos ${icono('search')}</a>
        <div class="hero-proof"><span>Proveedores locales</span><span>Inventario disponible</span><span>Compras para empresas</span></div>
      </div>
      <div class="hero-art">
        <div class="hero-product hero-product-main">${imagenProducto('rodamiento.svg', 'Rodamiento industrial')}<span>Rodamientos</span></div>
        <div class="hero-product hero-product-small hero-product-top">${imagenProducto('herramienta.svg', 'Herramienta industrial')}</div>
        <div class="hero-product hero-product-small hero-product-bottom">${imagenProducto('casco.svg', 'Equipo de seguridad')}</div>
        <div class="hero-stamp"><strong>Compra</strong><span>local</span></div>
      </div>`;
    main.parentNode.insertBefore(hero, main);

    const categorias = main.querySelector('.iconos');
    if (categorias) {
      const titulo = categorias.previousElementSibling;
      if (titulo && titulo.tagName === 'H3') titulo.textContent = 'Compra por categoría';
      categorias.classList.add('market-categories');
    }

    if (!main.querySelector('.featured-products')) {
      const productos = document.createElement('section');
      productos.className = 'featured-products';
      productos.innerHTML = `
        <div class="section-heading"><div><span>SELECCIÓN PARA TU EMPRESA</span><h3>Productos destacados</h3></div><a href="04-resultados-busqueda.html">Ver catálogo completo</a></div>
        <div class="product-grid">
          ${tarjetaProducto('Rodamiento 6205-2RS sellado', 'Refacciones Industriales GM', '$185.00', 'A 2.4 km', 'rodamiento.svg', 'RG-6205-2RS', 185)}
          ${tarjetaProducto('Guantes de carnaza reforzados', 'Seguridad Total del Norte', '$96.00', 'A 4.8 km', 'guantes.svg', 'ST-GC-REF', 96)}
          ${tarjetaProducto('Llave ajustable industrial', 'Herramientas del Norte', '$248.00', 'A 3.6 km', 'herramienta.svg', 'HN-LLAVE-01', 248)}
          ${tarjetaProducto('Lubricante para maquinaria 1 L', 'Suministros Mecánicos MTY', '$132.00', 'A 5.1 km', 'lubricante.svg', 'SM-LUB-1L', 132)}
        </div>`;
      const recientes = main.querySelector('.recientes');
      if (recientes) main.insertBefore(productos, recientes);
      else main.appendChild(productos);
    }
  }

  function tarjetaProducto(nombre, proveedor, precio, distancia, imagen, id, valor) {
    return `<article class="market-product-card">
      <a class="product-image" href="05-detalle-producto.html">${imagenProducto(imagen, nombre)}<span class="product-tag">Disponible</span></a>
      <div class="product-card-body"><span class="product-category">INSUMO INDUSTRIAL</span>
        <a class="product-name" href="05-detalle-producto.html">${nombre}</a>
        <span class="product-seller">${proveedor}</span><span class="product-distance">${distancia}</span>
        <strong class="product-price">${precio}</strong>
        <button class="product-add" type="button" data-add-cart data-product-id="${id}" data-product-name="${nombre}" data-product-price="${valor}">Agregar al carrito</button>
      </div>
    </article>`;
  }

  function mejorarResultados() {
    const parametros = new URLSearchParams(location.search);
    const consulta = parametros.get('q');
    const barraAnterior = document.querySelector('.store-content > .barra');
    if (barraAnterior) barraAnterior.remove();
    const input = document.querySelector('.store-search input[name="q"]');
    if (input && consulta) input.value = consulta;
    const filas = document.querySelectorAll('.store-content .contenido > .fila');
    const imagenes = ['rodamiento.svg', 'rodamiento.svg', 'rodamiento.svg', 'rodamiento.svg', 'rodamiento.svg'];
    filas.forEach((fila, indice) => {
      fila.classList.add('market-result-row');
      const columna = fila.firstElementChild;
      if (columna && !columna.querySelector('.result-image')) {
        const titulo = columna.querySelector('h4 a, h4');
        const nombre = titulo ? titulo.textContent.trim() : 'Producto industrial';
        const imagen = document.createElement('a');
        imagen.className = 'result-image';
        imagen.href = '05-detalle-producto.html';
        imagen.innerHTML = imagenProducto(imagenes[indice] || 'rodamiento.svg', nombre);
        fila.insertBefore(imagen, columna);
      }
      const boton = fila.querySelector('.derecha button');
      if (boton) {
        const nombre = fila.querySelector('h4')?.textContent.trim() || 'Producto industrial';
        const precioTexto = fila.querySelector('.precio')?.textContent || '0';
        const precio = Number(precioTexto.replace(/[^\d.]/g, '')) || 0;
        boton.dataset.addCart = '';
        boton.dataset.productId = `resultado-${indice + 1}`;
        boton.dataset.productName = nombre;
        boton.dataset.productPrice = precio;
        boton.removeAttribute('data-aviso');
        boton.textContent = 'Agregar al carrito';
        boton.classList.add('product-add');
      }
    });
  }

  function mejorarDetalle() {
    const ficha = document.querySelector('.store-content .ficha');
    if (!ficha || ficha.querySelector('.detail-product-image')) return;
    const nombre = ficha.querySelector('h2')?.textContent.trim() || 'Producto industrial';
    const visual = document.createElement('div');
    visual.className = 'detail-product-image';
    visual.innerHTML = imagenProducto('rodamiento.svg', nombre);
    ficha.insertBefore(visual, ficha.firstChild);
    const boton = ficha.querySelector('.compra button');
    if (boton) {
      boton.dataset.addCart = '';
      boton.dataset.productId = 'RG-6205-2RS';
      boton.dataset.productName = nombre;
      boton.dataset.productPrice = '185';
      boton.removeAttribute('data-aviso');
      boton.textContent = 'Agregar al carrito';
    }
  }

  function mejorarTablas() {
    document.querySelectorAll('.store-content table').forEach((tabla) => tabla.classList.add('market-table'));
  }

  function iniciar() {
    crearEstructura();
    if (!document.body.classList.contains('store-app')) return;
    const archivo = location.pathname.split('/').pop();
    if (archivo === '03-busqueda-principal.html') mejorarInicioComprador();
    if (archivo === '04-resultados-busqueda.html') mejorarResultados();
    if (archivo === '05-detalle-producto.html') mejorarDetalle();
    mejorarTablas();

    document.addEventListener('click', (evento) => {
      const boton = evento.target.closest('[data-add-cart]');
      if (boton) {
        evento.preventDefault();
        agregarAlCarrito(boton);
      }
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar);
  else iniciar();
})();