(() => {
  const body = document.body;
  const root = document.documentElement;
  const role = root.dataset.rol || '';
  const file = location.pathname.split('/').pop() || '';
  const themeKey = 'enlaceB2B.tema';
  const cartKey = 'enlaceB2B.carrito.marketplace';
  const extraCatalogKey = 'enlaceB2B.catalogo.local';
  const inventoryKey = 'enlaceB2B.inventario.local';

  const defaultCart = [];

  const roleRoutes = {
    comprador: {
      home: '03-busqueda-principal.html',
      search: '04-resultados-busqueda.html',
      account: '10-perfil-empresa.html',
      orders: '08-seguimiento-pedido.html',
      links: [
        ['03-busqueda-principal.html', 'Inicio', 'home'],
        ['04-resultados-busqueda.html', 'Buscar productos', 'search'],
        ['06-carrito.html', 'Mi carrito', 'cart'],
        ['08-seguimiento-pedido.html', 'Seguimiento de pedidos', 'truck'],
        ['09-historial-compras.html', 'Historial de compras', 'history'],
        ['10-perfil-empresa.html', 'Mi empresa', 'building']
      ],
      categories: ['Rodamientos', 'Bandas y poleas', 'Lubricantes', 'Retenes y sellos']
    },
    distribuidor: {
      home: '11-panel-distribuidor.html',
      search: '12-catalogo-productos.html',
      account: '17-perfil-distribuidor.html',
      orders: '14-pedidos-recibidos.html',
      links: [
        ['11-panel-distribuidor.html', 'Panel principal', 'home'],
        ['12-catalogo-productos.html', 'Mi catálogo', 'box'],
        ['13-inventario.html', 'Inventario', 'layers'],
        ['14-pedidos-recibidos.html', 'Pedidos recibidos', 'clipboard'],
        ['15-estatus-entrega.html', 'Entregas', 'truck'],
        ['16-ventas-comisiones.html', 'Ventas y comisiones', 'chart'],
        ['17-perfil-distribuidor.html', 'Mi empresa', 'building']
      ],
      categories: []
    },
    administrador: {
      home: '18-empresas-por-verificar.html',
      search: '18-empresas-por-verificar.html',
      account: '18-empresas-por-verificar.html',
      orders: '20-supervision-transacciones.html',
      links: [
        ['18-empresas-por-verificar.html', 'Empresas por verificar', 'building'],
        ['19-configuracion-comision.html', 'Configuración de comisión', 'settings'],
        ['20-supervision-transacciones.html', 'Transacciones', 'clipboard'],
        ['21-reportes.html', 'Reportes', 'chart']
      ],
      categories: []
    }
  };

  const iconPaths = {
    home: '<path d="m3 10 9-7 9 7"/><path d="M5 9v11h14V9"/><path d="M9 20v-6h6v6"/>',
    search: '<circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 5 5"/>',
    cart: '<path d="M3 4h2l2.2 11.2a2 2 0 0 0 2 1.6h8.7a2 2 0 0 0 1.9-1.4L22 9H7"/><circle cx="10" cy="21" r="1"/><circle cx="18" cy="21" r="1"/>',
    truck: '<path d="M2 6h12v11H2z"/><path d="M14 10h4l4 4v3h-8z"/><circle cx="7" cy="19" r="2"/><circle cx="18" cy="19" r="2"/>',
    history: '<path d="M3 12a9 9 0 1 0 2.6-6.4L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l3 2"/>',
    building: '<rect x="4" y="3" width="16" height="18" rx="1"/><path d="M8 7h2M14 7h2M8 11h2M14 11h2M8 15h2M14 15h2M10 21v-3h4v3"/>',
    box: '<path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="M3 8v9l9 5 9-5V8"/><path d="M12 13v9"/>',
    layers: '<path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="m3 12 9 5 9-5"/><path d="m3 16 9 5 9-5"/>',
    clipboard: '<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4V2h6v2M8 9h8M8 13h8M8 17h5"/>',
    chart: '<path d="M3 3v18h18"/><path d="m7 14 4-4 3 3 6-7"/>',
    settings: '<circle cx="12" cy="12" r="3"/><path d="m19.4 15 .1.1 1.4 1.1-1.4 2.4-1.7-.6a8 8 0 0 1-1.7 1l-.3 1.8h-2.8l-.3-1.8a8 8 0 0 1-1.7-1l-1.7.6-1.4-2.4 1.4-1.1a7 7 0 0 1 0-2l-1.4-1.1 1.4-2.4 1.7.6a8 8 0 0 1 1.7-1l.3-1.8h2.8l.3 1.8a8 8 0 0 1 1.7 1l1.7-.6 1.4 2.4-1.4 1.1a7 7 0 0 1 0 2Z"/>',
    menu: '<path d="M3 6h18M3 12h18M3 18h18"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    moon: '<path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5 8.5 8.5 0 1 0 20.5 14.5Z"/>',
    logout: '<path d="M10 17l5-5-5-5M15 12H3"/><path d="M12 3h7a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-7"/>'
  };

  function icon(name) {
    return `<svg viewBox="0 0 24 24" aria-hidden="true">${iconPaths[name] || iconPaths.box}</svg>`;
  }

  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, (char) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    })[char]);
  }

  function money(value) {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 2
    }).format(Number(value) || 0);
  }

  function parseMoney(value) {
    return Number(String(value || '').replace(/[^0-9.-]/g, '')) || 0;
  }

  function parseNumber(value) {
    const match = String(value || '').replace(/,/g, '').match(/-?\d+(?:\.\d+)?/);
    return match ? Number(match[0]) : null;
  }

  function notice(message, type = 'exito') {
    if (typeof window.mostrarAviso === 'function') {
      window.mostrarAviso(message, type);
    } else {
      window.alert(message);
    }
  }

  function safeStorageGet(key) {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  }

  function safeStorageSet(key, value) {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch {
      return false;
    }
  }

  function getCart() {
    const raw = safeStorageGet(cartKey);
    if (raw === null) return defaultCart.map((item) => ({ ...item }));
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  function saveCart(cart) {
    safeStorageSet(cartKey, JSON.stringify(cart));
    updateCartCount();
  }

  function updateCartCount() {
    const count = getCart().length;
    document.querySelectorAll('[data-cart-count]').forEach((node) => {
      node.textContent = String(count);
      node.hidden = count === 0;
    });
  }

  function addProduct(product, quantity = 1) {
    const qty = Math.max(1, Number(quantity) || 1);
    const min = Number(product.minOrder) || 1;
    const stock = product.available !== null && product.available !== undefined && product.available !== ''
      ? Number(product.available)
      : null;

    if (qty < min) {
      notice(`La cantidad mínima de compra es ${min} ${product.unit || 'unidades'}.`, 'error');
      return false;
    }

    if (stock !== null && stock <= 0) {
      notice('Este producto aparece sin existencia.', 'error');
      return false;
    }

    const cart = getCart();
    const id = product.id || product.sku || `${product.name}|${product.supplier}`;
    const current = cart.find((item) => item.id === id || (product.sku && item.sku === product.sku));
    if (current) {
      const nextQuantity = Number(current.quantity || 0) + qty;
      const limit = current.available !== null && current.available !== undefined && current.available !== '' ? Number(current.available) : stock;
      if (limit !== null && nextQuantity > limit) {
        notice(`La existencia disponible es de ${limit} unidades.`, 'error');
        return false;
      }
      current.quantity = nextQuantity;
    } else {
      if (stock !== null && qty > stock) {
        notice(`La existencia disponible es de ${stock} unidades.`, 'error');
        return false;
      }
      cart.push({
        id,
        sku: product.sku || '',
        name: product.name,
        supplier: product.supplier || 'Distribuidor no especificado',
        distance: product.distance || '',
        price: Number(product.price) || 0,
        quantity: qty,
        available: stock,
        unit: product.unit || 'pieza'
      });
    }

    saveCart(cart);
    notice('Producto agregado al carrito de esta demostración.');
    return true;
  }

  function applyTheme(theme) {
    const selected = theme === 'oscuro' ? 'oscuro' : 'claro';
    root.dataset.tema = selected;
    safeStorageSet(themeKey, selected);
    document.querySelectorAll('[data-theme-toggle]').forEach((button) => {
      const dark = selected === 'oscuro';
      button.innerHTML = `${icon(dark ? 'sun' : 'moon')}<span class="market-theme-label">${dark ? 'Modo claro' : 'Modo oscuro'}</span>`;
      button.setAttribute('aria-label', dark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro');
      button.title = dark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro';
    });
  }

  function initTheme() {
    const saved = safeStorageGet(themeKey) || 'claro';
    applyTheme(saved);
    document.addEventListener('click', (event) => {
      const toggle = event.target.closest('[data-theme-toggle]');
      if (!toggle) return;
      applyTheme(root.dataset.tema === 'oscuro' ? 'claro' : 'oscuro');
    });
  }

  function addPublicThemeButton() {
    const header = document.querySelector('body > header');
    if (!header || header.querySelector('[data-theme-toggle]')) return;
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'market-theme-button';
    button.dataset.themeToggle = 'true';
    header.appendChild(button);
    applyTheme(safeStorageGet(themeKey) || 'claro');
  }

  function getInitials(name) {
    return String(name || 'Empresa').split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase();
  }

  function buildShell() {
    if (!roleRoutes[role] || body.classList.contains('marketplace-app')) return;

    const config = roleRoutes[role];
    const oldHeader = body.querySelector(':scope > header');
    const oldNav = body.querySelector(':scope > nav');
    const oldSearch = body.querySelector(':scope > .barra');
    const initialSearch = oldSearch?.querySelector('input')?.value || '';
    const session = typeof window.leerSesion === 'function' ? window.leerSesion() : null;
    const company = session?.empresa || oldHeader?.querySelector('.empresa')?.textContent?.trim().split('\n')[0] || 'Empresa registrada';
    const person = session?.nombre || 'Usuario';
    const firstName = person.split(/\s+/)[0];
    const accountPath = config.account;
    const ordersPath = config.orders;
    const searchValue = new URLSearchParams(location.search).get('q') || initialSearch;

    const header = document.createElement('header');
    header.className = 'market-header';
    header.innerHTML = `
      <div class="market-header-inner">
        <button class="market-menu-toggle" type="button" data-menu-toggle aria-label="Abrir navegación">${icon('menu')}</button>
        <a class="market-brand" href="${config.home}">
          <span class="market-brand-mark">E</span>
          <span class="market-brand-name">ENLACE<small>B2B LOCAL</small></span>
        </a>
        <div class="market-delivery">Entrega en Monterrey, N.L.<strong>Consultar cobertura</strong></div>
        <form class="market-search" id="market-search-form">
          <select name="categoria" aria-label="Categoría">
            <option value="">Todas las categorías</option>
            <option>Rodamientos</option>
            <option>Bandas y poleas</option>
            <option>Lubricantes</option>
            <option>Retenes y sellos</option>
          </select>
          <input type="search" name="q" placeholder="Buscar productos o descripciones" value="${escapeHtml(searchValue)}" aria-label="Buscar productos">
          <button type="submit" aria-label="Buscar">${icon('search')}</button>
        </form>
        <a class="market-header-action account-action" href="${accountPath}">${icon('user')}<span><small>Hola, ${escapeHtml(firstName)}</small><strong>Cuenta y perfil</strong></span></a>
        <a class="market-header-action" href="${ordersPath}">${icon('clipboard')}<span><small>Consultar</small><strong>Pedidos</strong></span></a>
        ${role === 'comprador' ? `<a class="market-cart-link" href="06-carrito.html">${icon('cart')}<span>Carrito</span><span class="market-cart-count" data-cart-count>0</span></a>` : ''}
        <button class="market-theme-button" type="button" data-theme-toggle></button>
      </div>`;

    const linkMarkup = config.links.map(([href, label, iconName]) => {
      const active = file === href ? ' active' : '';
      const count = href === '06-carrito.html' ? '<span class="market-sidebar-count" data-cart-count>0</span>' : '';
      return `<a class="market-sidebar-link${active}" href="${href}">${icon(iconName)}<span>${label}</span>${count}</a>`;
    }).join('');

    const categoryMarkup = config.categories.length ? `
      <div class="market-sidebar-heading">Categorías</div>
      <div class="market-sidebar-nav">
        ${config.categories.map((category) => `<a class="market-sidebar-link" href="04-resultados-busqueda.html?categoria=${encodeURIComponent(category)}">${icon('box')}<span>${escapeHtml(category)}</span></a>`).join('')}
      </div>` : '';

    const sidebar = document.createElement('aside');
    sidebar.className = 'market-sidebar';
    sidebar.innerHTML = `
      <div class="market-sidebar-user">
        <span class="market-user-initials">${escapeHtml(getInitials(person))}</span>
        <span><strong>${escapeHtml(person)}</strong><small>${escapeHtml(company)}</small></span>
      </div>
      <div class="market-sidebar-heading">Menú principal</div>
      <nav class="market-sidebar-nav" aria-label="Navegación principal">${linkMarkup}</nav>
      ${categoryMarkup}
      ${session?.tipoEmpresa === 'ambos' ? '<div class="market-sidebar-nav"><button type="button" class="market-sidebar-link" data-cambiar-rol>Cambiar modo comprador / distribuidor</button></div>' : ''}
      <div class="market-sidebar-footer">
        <a class="market-sidebar-link" href="01-inicio-sesion.html" data-cerrar-sesion>${icon('logout')}<span>Cerrar sesión</span></a>
      </div>`;

    const content = document.createElement('div');
    content.className = 'market-content';
    [...body.children].forEach((node) => {
      if (node !== oldHeader && node !== oldNav) content.appendChild(node);
    });

    const shell = document.createElement('div');
    shell.className = 'market-shell';
    shell.append(sidebar, content);

    const overlay = document.createElement('button');
    overlay.type = 'button';
    overlay.className = 'market-overlay';
    overlay.setAttribute('aria-label', 'Cerrar menú');

    body.replaceChildren(header, shell, overlay);
    body.classList.add('marketplace-app');
    applyTheme(safeStorageGet(themeKey) || 'claro');

    const searchForm = header.querySelector('#market-search-form');
    searchForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const query = searchForm.elements.q.value.trim();
      const category = searchForm.elements.categoria.value;
      const params = new URLSearchParams();
      if (query) params.set('q', query);
      if (category) params.set('categoria', category);
      const target = config.search + (params.toString() ? `?${params.toString()}` : '');
      location.href = target;
    });

    const closeMenu = () => body.classList.remove('market-sidebar-open');
    header.querySelector('[data-menu-toggle]').addEventListener('click', () => body.classList.toggle('market-sidebar-open'));
    overlay.addEventListener('click', closeMenu);
    sidebar.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));

    updateCartCount();
  }

  function init() {
    initTheme();

    if (roleRoutes[role]) {
      buildShell();
    } else {
      body.classList.add('market-public');
      addPublicThemeButton();
    }
  }

  init();
})();
