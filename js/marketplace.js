(() => {
  const body = document.body;
  const root = document.documentElement;
  const role = root.dataset.rol || '';
  const file = location.pathname.split('/').pop() || '';
  const themeKey = 'enlaceB2B.tema';
  const cartKey = 'enlaceB2B.carrito.marketplace';
  const extraCatalogKey = 'enlaceB2B.catalogo.local';
  const inventoryKey = 'enlaceB2B.inventario.local';

  const defaultCart = [
    { id: 'RG-6205-2RS', sku: 'RG-6205-2RS', name: 'Rodamiento 6205-2RS sellado', supplier: 'Refacciones Industriales GM', distance: 'A 2.4 km — Guadalupe', price: 185, quantity: 40, available: 60, unit: 'pieza' },
    { id: 'RG-UCP205', sku: 'RG-UCP205', name: 'Chumacera UCP-205', supplier: 'Refacciones Industriales GM', distance: 'A 2.4 km — Guadalupe', price: 310, quantity: 6, available: 6, unit: 'pieza' },
    { id: 'ST-GC-REF', sku: 'ST-GC-REF', name: 'Guantes de carnaza reforzados', supplier: 'Seguridad Total del Norte', distance: 'A 4.8 km — Apodaca', price: 96, quantity: 300, available: 240, unit: 'par' }
  ];

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
        ${role === 'comprador' ? `<a class="market-cart-link" href="06-carrito.html">${icon('cart')}<span>Carrito</span><span class="market-cart-count" data-cart-count>3</span></a>` : ''}
        <button class="market-theme-button" type="button" data-theme-toggle></button>
      </div>`;

    const linkMarkup = config.links.map(([href, label, iconName]) => {
      const active = file === href ? ' active' : '';
      const count = href === '06-carrito.html' ? '<span class="market-sidebar-count" data-cart-count>3</span>' : '';
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

  function categoryFor(name) {
    const value = String(name || '').toLowerCase();
    if (value.includes('rodamiento') || value.includes('chumacera')) return 'Rodamientos';
    if (value.includes('banda') || value.includes('polea')) return 'Bandas y poleas';
    if (value.includes('grasa') || value.includes('lubricante')) return 'Lubricantes';
    if (value.includes('retén') || value.includes('reten') || value.includes('sello')) return 'Retenes y sellos';
    return 'Otros';
  }

  function initHome() {
    if (file !== '03-busqueda-principal.html') return;
    const content = document.querySelector('.market-content');
    const oldSearch = content.querySelector('.buscador');
    if (oldSearch) {
      const intro = document.createElement('section');
      intro.className = 'market-home-intro';
      intro.innerHTML = `
        <div><h2>Encuentra suministros para tu empresa</h2><p>Consulta productos, distribuidores y disponibilidad en el área metropolitana.</p></div>
        <a href="04-resultados-busqueda.html">Ver catálogo completo</a>`;
      oldSearch.replaceWith(intro);
    }

    const oldCategories = content.querySelector('.iconos');
    if (oldCategories) {
      const previousHeading = oldCategories.previousElementSibling;
      if (previousHeading?.tagName === 'H3') previousHeading.remove();
      const section = document.createElement('section');
      section.innerHTML = '<h3>Categorías de productos</h3>';
      const grid = document.createElement('div');
      grid.className = 'market-home-categories';
      ['Rodamientos', 'Bandas y poleas', 'Lubricantes', 'Retenes y sellos'].forEach((label) => {
        const link = document.createElement('a');
        link.className = 'market-category';
        link.href = `04-resultados-busqueda.html?categoria=${encodeURIComponent(label)}`;
        link.textContent = label;
        grid.appendChild(link);
      });
      section.appendChild(grid);
      oldCategories.replaceWith(section);
    }

    const table = content.querySelector('.recientes table');
    if (table) {
      table.querySelectorAll('tr').forEach((row, index) => {
        const name = row.querySelector('.nom')?.textContent.trim();
        const supplierText = row.querySelector('.prov')?.textContent || '';
        const supplier = supplierText.split('·')[0].trim();
        const distance = row.querySelector('.dist')?.textContent.trim() || '';
        const price = parseMoney(row.querySelector('.precio')?.textContent);
        const button = row.querySelector('button');
        if (!name || !button) return;
        const id = `recent-${index}`;
        window.__marketProducts = window.__marketProducts || {};
        window.__marketProducts[id] = { id: `${name}|${supplier}`, name, supplier, distance, price, available: null, unit: 'pieza' };
        button.removeAttribute('data-ir');
        button.removeAttribute('data-aviso');
        button.dataset.marketAdd = 'true';
        button.dataset.productId = id;
        button.textContent = 'Volver a pedir';
      });
    }
  }

  function initResults() {
    if (file !== '04-resultados-busqueda.html') return;
    const content = document.querySelector('.market-content');
    const oldSearch = content.querySelector(':scope > .barra');
    const initialQuery = oldSearch?.querySelector('input')?.value || '';
    oldSearch?.remove();

    const layout = content.querySelector('.cuerpo');
    const aside = layout?.querySelector('aside');
    const results = layout?.querySelector('.contenido');
    if (!layout || !aside || !results) return;

    const categoryOptions = ['Rodamientos', 'Bandas y poleas', 'Lubricantes', 'Retenes y sellos'];
    const products = [...results.querySelectorAll('.fila')].map((row, index) => {
      const name = row.querySelector('h4 a')?.textContent.trim() || '';
      const supplier = row.querySelector('.prov')?.textContent.trim() || '';
      const distanceText = row.querySelector('.dist')?.textContent.trim() || '';
      const price = parseMoney(row.querySelector('.precio')?.textContent);
      const stockText = row.querySelector('.exist')?.textContent.trim() || '';
      const available = /sin existencia|agotado/i.test(stockText) ? 0 : parseNumber(stockText);
      return {
        id: `result-${index}`,
        name,
        supplier,
        distance: distanceText,
        distanceValue: parseNumber(distanceText),
        price,
        available: available === null ? null : available,
        stockText,
        category: categoryFor(name),
        href: row.querySelector('h4 a')?.getAttribute('href') || '05-detalle-producto.html'
      };
    }).filter((product) => product.name);

    window.__marketProducts = window.__marketProducts || {};
    products.forEach((product) => { window.__marketProducts[product.id] = product; });

    const distanceOptions = ['Hasta 5 km', 'Hasta 15 km', 'Hasta 30 km', 'Toda la zona metropolitana'];
    aside.className = 'market-filter-panel';
    aside.innerHTML = `
      <h3>Filtrar resultados</h3>
      <form id="market-filter-form">
        <div class="market-filter-group">
          <strong>Categoría</strong>
          ${categoryOptions.map((category) => `<label class="market-filter-option"><input type="checkbox" name="category" value="${escapeHtml(category)}"> ${escapeHtml(category)}</label>`).join('')}
        </div>
        <div class="market-filter-group">
          <strong>Distancia máxima</strong>
          <select id="market-distance">
            ${distanceOptions.map((option, index) => `<option value="${[5,15,30,1000][index]}" ${index === 1 ? 'selected' : ''}>${option}</option>`).join('')}
          </select>
        </div>
        <div class="market-filter-group">
          <strong>Precio (MXN)</strong>
          <div class="market-price-range">
            <label>Mínimo<input id="market-price-min" type="number" min="0" value="0"></label>
            <label>Máximo<input id="market-price-max" type="number" min="0" value="500"></label>
          </div>
        </div>
        <div class="market-filter-group">
          <strong>Disponibilidad</strong>
          <label class="market-filter-option"><input id="market-in-stock" type="checkbox"> Solo con existencia</label>
        </div>
        <div class="market-filter-actions">
          <button type="submit">Aplicar filtros</button>
          <button type="button" class="sec" id="market-clear-filters">Limpiar</button>
        </div>
      </form>`;

    results.innerHTML = `
      <div class="market-results-toolbar">
        <span class="market-results-count" id="market-results-count"></span>
        <div class="market-results-tools">
          <select id="market-sort" aria-label="Ordenar productos">
            <option value="relevance">Ordenar: relevancia</option>
            <option value="price-asc">Precio: menor a mayor</option>
            <option value="price-desc">Precio: mayor a menor</option>
            <option value="distance">Distancia: menor a mayor</option>
            <option value="stock">Existencia: mayor a menor</option>
          </select>
          <div class="market-view-toggle">
            <button type="button" class="active" data-view="grid" aria-label="Vista de cuadrícula">▦</button>
            <button type="button" data-view="list" aria-label="Vista de lista">☷</button>
          </div>
        </div>
      </div>
      <div class="market-applied-filters" id="market-applied-filters"></div>
      <div class="market-product-grid" id="market-product-results"></div>
      <div class="market-empty" id="market-empty" hidden>No hay productos que coincidan con los filtros seleccionados.</div>
      <div class="market-compare-tray" id="market-compare-tray" hidden>
        <span id="market-compare-label">Productos seleccionados para comparar</span>
        <div><button type="button" class="sec" id="market-clear-compare">Quitar selección</button> <button type="button" id="market-open-compare">Comparar productos</button></div>
      </div>
      <dialog class="market-dialog" id="market-compare-dialog">
        <div class="market-dialog-head"><h3>Comparación de productos</h3><button type="button" class="sec" id="market-close-compare">Cerrar</button></div>
        <div class="market-dialog-body" id="market-compare-content"></div>
      </dialog>`;

    layout.classList.add('market-results-layout');

    const params = new URLSearchParams(location.search);
    const query = (params.get('q') || initialQuery || '').trim().toLowerCase();
    const categoryParam = params.get('categoria');
    const searchInput = document.querySelector('#market-search-form input[name="q"]');
    if (searchInput) searchInput.value = params.get('q') || initialQuery;

    const form = aside.querySelector('#market-filter-form');
    const list = results.querySelector('#market-product-results');
    const count = results.querySelector('#market-results-count');
    const empty = results.querySelector('#market-empty');
    const applied = results.querySelector('#market-applied-filters');
    const compareTray = results.querySelector('#market-compare-tray');
    const compareLabel = results.querySelector('#market-compare-label');
    const compareDialog = results.querySelector('#market-compare-dialog');
    const compareContent = results.querySelector('#market-compare-content');
    const selectedForCompare = new Set();

    if (categoryParam) {
      form.querySelectorAll('input[name="category"]').forEach((input) => {
        input.checked = input.value.toLowerCase() === categoryParam.toLowerCase();
      });
    }

    function getVisibleProducts() {
      const selectedCategories = [...form.querySelectorAll('input[name="category"]:checked')].map((input) => input.value);
      const min = Number(form.querySelector('#market-price-min').value) || 0;
      const maxValue = form.querySelector('#market-price-max').value;
      const max = maxValue === '' ? Infinity : Number(maxValue);
      const distance = Number(form.querySelector('#market-distance').value) || Infinity;
      const inStock = form.querySelector('#market-in-stock').checked;
      const text = (searchInput?.value || query).trim().toLowerCase();

      let filtered = products.filter((product) => {
        const textMatch = !text || `${product.name} ${product.supplier}`.toLowerCase().includes(text);
        const categoryMatch = !selectedCategories.length || selectedCategories.includes(product.category);
        const priceMatch = product.price >= min && product.price <= max;
        const distanceMatch = product.distanceValue === null || product.distanceValue <= distance;
        const stockMatch = !inStock || (product.available !== null && product.available > 0);
        return textMatch && categoryMatch && priceMatch && distanceMatch && stockMatch;
      });

      const sort = results.querySelector('#market-sort').value;
      if (sort === 'price-asc') filtered.sort((a, b) => a.price - b.price);
      if (sort === 'price-desc') filtered.sort((a, b) => b.price - a.price);
      if (sort === 'distance') filtered.sort((a, b) => (a.distanceValue ?? Infinity) - (b.distanceValue ?? Infinity));
      if (sort === 'stock') filtered.sort((a, b) => (b.available ?? -1) - (a.available ?? -1));
      return filtered;
    }

    function renderAppliedFilters() {
      const tags = [];
      form.querySelectorAll('input[name="category"]:checked').forEach((input) => tags.push(input.value));
      const min = form.querySelector('#market-price-min').value;
      const max = form.querySelector('#market-price-max').value;
      if (min && Number(min) > 0) tags.push(`Desde $${min}`);
      if (max && Number(max) < 500) tags.push(`Hasta $${max}`);
      if (form.querySelector('#market-in-stock').checked) tags.push('Con existencia');
      const distance = Number(form.querySelector('#market-distance').value);
      if (distance < 1000) tags.push(`Hasta ${distance} km`);
      applied.innerHTML = tags.map((tag) => `<span class="market-filter-chip">${escapeHtml(tag)}</span>`).join('');
    }

    function render() {
      const filtered = getVisibleProducts();
      count.textContent = `${filtered.length} de ${products.length} productos`;
      list.innerHTML = filtered.map((product) => {
        const stock = product.available === 0
          ? 'Sin existencia'
          : product.available === null
            ? 'Disponibilidad no especificada'
            : `${product.available} piezas disponibles`;
        return `
          <article class="market-product-card" data-product-id="${product.id}">
            <div class="market-product-media" aria-hidden="true"></div>
            <div class="market-product-info">
              <h3 class="market-product-name"><a href="${escapeHtml(product.href)}">${escapeHtml(product.name)}</a></h3>
              <p class="market-product-supplier">${escapeHtml(product.supplier)}</p>
              <p class="market-product-distance">${escapeHtml(product.distance)}</p>
            </div>
            <div class="market-product-purchase">
              <p class="market-product-price">${money(product.price)}</p>
              <p class="market-product-stock ${product.available === 0 ? 'out' : ''}">${escapeHtml(stock)}</p>
              <div class="market-product-buy">
                <input type="number" min="1" ${product.available !== null ? `max="${product.available}"` : ''} value="1" aria-label="Cantidad de ${escapeHtml(product.name)}" data-product-quantity="${product.id}">
                <button type="button" data-market-add data-product-id="${product.id}" ${product.available === 0 ? 'disabled' : ''}>Agregar</button>
              </div>
              <label class="market-product-compare"><input type="checkbox" data-compare-product="${product.id}"> Comparar</label>
            </div>
          </article>`;
      }).join('');
      empty.hidden = filtered.length > 0;
      renderAppliedFilters();
      updateCompareTray();
    }

    function updateCompareTray() {
      const amount = selectedForCompare.size;
      compareTray.hidden = amount === 0;
      compareLabel.textContent = `${amount} producto${amount === 1 ? '' : 's'} seleccionado${amount === 1 ? '' : 's'}`;
      results.querySelector('#market-open-compare').disabled = amount < 2;
    }

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      render();
    });

    form.querySelector('#market-clear-filters').addEventListener('click', () => {
      form.reset();
      render();
    });

    results.querySelector('#market-sort').addEventListener('change', render);

    results.querySelectorAll('[data-view]').forEach((button) => {
      button.addEventListener('click', () => {
        results.querySelectorAll('[data-view]').forEach((item) => item.classList.toggle('active', item === button));
        list.classList.toggle('market-product-list', button.dataset.view === 'list');
        list.classList.toggle('market-product-grid', button.dataset.view === 'grid');
      });
    });

    list.addEventListener('change', (event) => {
      const checkbox = event.target.closest('[data-compare-product]');
      if (!checkbox) return;
      const product = products.find((item) => item.id === checkbox.dataset.compareProduct);
      if (!product) return;
      if (checkbox.checked) selectedForCompare.add(product.id);
      else selectedForCompare.delete(product.id);
      updateCompareTray();
    });

    results.querySelector('#market-clear-compare').addEventListener('click', () => {
      selectedForCompare.clear();
      list.querySelectorAll('[data-compare-product]').forEach((input) => { input.checked = false; });
      updateCompareTray();
    });

    results.querySelector('#market-open-compare').addEventListener('click', () => {
      const chosen = products.filter((product) => selectedForCompare.has(product.id));
      if (chosen.length < 2) return;
      compareContent.innerHTML = `
        <table>
          <thead><tr><th>Dato</th>${chosen.map((product) => `<th>${escapeHtml(product.name)}</th>`).join('')}</tr></thead>
          <tbody>
            <tr><th>Distribuidor</th>${chosen.map((product) => `<td>${escapeHtml(product.supplier)}</td>`).join('')}</tr>
            <tr><th>Precio</th>${chosen.map((product) => `<td>${money(product.price)}</td>`).join('')}</tr>
            <tr><th>Disponibilidad</th>${chosen.map((product) => `<td>${escapeHtml(product.stockText || 'No especificada')}</td>`).join('')}</tr>
            <tr><th>Distancia</th>${chosen.map((product) => `<td>${escapeHtml(product.distance)}</td>`).join('')}</tr>
          </tbody>
        </table>
        <p class="market-status-note">La comparación muestra únicamente los datos disponibles en los resultados actuales. No se agregan especificaciones que no estén registradas.</p>`;
      compareDialog.showModal();
    });

    results.querySelector('#market-close-compare').addEventListener('click', () => compareDialog.close());

    render();
  }

  function initProductDetail() {
    if (file !== '05-detalle-producto.html') return;
    const ficha = document.querySelector('.market-content .ficha');
    if (!ficha) return;

    const name = ficha.querySelector('h2')?.textContent.trim() || '';
    const skuText = ficha.querySelector('.clave')?.textContent || '';
    const sku = skuText.match(/Clave del distribuidor:\s*([^·]+)/i)?.[1]?.trim() || '';
    const price = parseMoney(ficha.querySelector('.precio-grande')?.textContent);
    const stock = parseNumber(ficha.querySelector('.existencia-disponible')?.textContent);
    const supplier = document.querySelector('.market-content .distribuidor-nombre')?.textContent.trim() || '';
    const distance = document.querySelector('.market-content .lateral .dist')?.textContent.trim() || '';
    const minimum = parseNumber(document.querySelector('.market-content .cond')?.textContent.match(/Pedido mínimo:\s*(\d+)/i)?.[1]) || 1;
    const quantity = ficha.querySelector('input[type="number"]');
    const error = ficha.querySelector('.msg-error');
    const button = ficha.querySelector('.compra button');

    if (quantity) {
      quantity.min = String(minimum);
      if (stock !== null) quantity.max = String(stock);
      if (Number(quantity.value) < minimum || (stock !== null && Number(quantity.value) > stock)) quantity.value = String(minimum);
    }
    if (error) error.hidden = true;

    const media = document.createElement('div');
    media.className = 'market-detail-media';
    media.setAttribute('aria-hidden', 'true');
    ficha.insertBefore(media, ficha.firstChild);

    const id = sku || `${name}|${supplier}`;
    window.__marketProducts = window.__marketProducts || {};
    window.__marketProducts.detail = {
      id,
      sku,
      name,
      supplier,
      distance,
      price,
      available: stock,
      minOrder: minimum,
      unit: 'pieza'
    };

    if (button) {
      button.removeAttribute('data-aviso');
      button.dataset.marketAdd = 'true';
      button.dataset.productId = 'detail';
      button.textContent = 'Agregar al carrito';
    }

    if (quantity) {
      quantity.addEventListener('input', () => {
        const value = Number(quantity.value);
        const invalid = value < minimum || (stock !== null && value > stock);
        if (error) {
          error.hidden = !invalid;
          error.textContent = value < minimum
            ? `El pedido mínimo es de ${minimum} piezas.`
            : `La existencia disponible es de ${stock} piezas.`;
        }
      });
    }
  }

  function initCart() {
    if (file !== '06-carrito.html') return;
    const main = document.querySelector('.market-content main');
    const left = main?.querySelector('.izq');
    const right = main?.querySelector('.der');
    if (!main || !left || !right) return;

    function render() {
      const cart = getCart();
      const groups = new Map();
      cart.forEach((item) => {
        const key = item.supplier || 'Distribuidor no especificado';
        if (!groups.has(key)) groups.set(key, []);
        groups.get(key).push(item);
      });

      let total = 0;
      let invalid = false;
      left.innerHTML = '';

      if (!cart.length) {
        left.innerHTML = '<div class="market-empty">Tu carrito está vacío. Regresa al catálogo para agregar productos.</div>';
      }

      groups.forEach((items, supplier) => {
        const group = document.createElement('section');
        group.className = 'market-cart-group';
        const distance = items.find((item) => item.distance)?.distance || '';
        const rows = items.map((item) => {
          const quantity = Number(item.quantity) || 1;
          const lineTotal = Number(item.price) * quantity;
          total += lineTotal;
          const hasAvailable = item.available !== null && item.available !== undefined && item.available !== '';
          const over = hasAvailable && quantity > Number(item.available);
          if (over) invalid = true;
          return `
            <tr>
              <td><strong>${escapeHtml(item.name)}</strong>${item.sku ? `<div class="clave">${escapeHtml(item.sku)}</div>` : ''}</td>
              <td><input type="number" min="1" ${item.available !== null && item.available !== undefined && item.available !== '' ? `max="${Number(item.available)}"` : ''} value="${quantity}" data-cart-quantity="${escapeHtml(item.id)}" aria-label="Cantidad de ${escapeHtml(item.name)}"></td>
              <td>${money(item.price)}</td>
              <td class="imp">${money(lineTotal)}</td>
              <td><button type="button" class="sec" data-cart-remove="${escapeHtml(item.id)}">Quitar</button></td>
            </tr>
            ${over ? `<tr><td colspan="5"><div class="market-cart-warning">La cantidad solicitada supera la existencia disponible de ${Number(item.available)} unidades. Ajusta la cantidad antes de continuar.</div></td></tr>` : ''}`;
        }).join('');
        const subtotal = items.reduce((sum, item) => sum + Number(item.price) * Number(item.quantity), 0);
        group.innerHTML = `
          <div class="market-cart-group-head"><strong>${escapeHtml(supplier)}</strong><span>${escapeHtml(distance)}</span></div>
          <table class="market-cart-table">
            <thead><tr><th>Producto</th><th>Cantidad</th><th>Precio unitario</th><th>Importe</th><th></th></tr></thead>
            <tbody>${rows}</tbody>
          </table>
          <div class="subtotal">Subtotal del distribuidor: <strong>${money(subtotal)}</strong></div>`;
        left.appendChild(group);
      });

      const suppliers = groups.size;
      right.className = 'der market-cart-summary';
      right.innerHTML = `
        <h3>Resumen del pedido</h3>
        <div class="linea"><span>Productos</span><strong>${cart.length}</strong></div>
        <div class="linea"><span>Distribuidores</span><strong>${suppliers}</strong></div>
        <div class="linea"><span>Pedidos a generar</span><strong>${suppliers}</strong></div>
        <div class="linea"><span>Subtotal</span><strong>${money(total)}</strong></div>
        <div class="total"><span>Total</span><span>${money(total)}</span></div>
        <button type="button" data-ir="07-confirmacion-pedido.html" ${!cart.length || invalid ? 'disabled' : ''}>Continuar con el pedido</button>
        <button type="button" class="sec" data-ir="03-busqueda-principal.html">Seguir buscando</button>
        <button type="button" class="vaciar" data-clear-cart>Vaciar carrito</button>
        ${invalid ? '<p class="market-cart-warning">Hay cantidades que superan la existencia disponible.</p>' : ''}
        <p class="market-cart-note">Carrito de demostración: los cambios se guardan en este navegador y no se envían al backend.</p>`;
      updateCartCount();
    }

    left.addEventListener('change', (event) => {
      const input = event.target.closest('[data-cart-quantity]');
      if (!input) return;
      const cart = getCart();
      const item = cart.find((entry) => entry.id === input.dataset.cartQuantity);
      if (!item) return;
      item.quantity = Math.max(1, Number(input.value) || 1);
      saveCart(cart);
      render();
    });

    left.addEventListener('click', (event) => {
      const button = event.target.closest('[data-cart-remove]');
      if (!button) return;
      const cart = getCart().filter((item) => item.id !== button.dataset.cartRemove);
      saveCart(cart);
      render();
    });

    right.addEventListener('click', (event) => {
      const clear = event.target.closest('[data-clear-cart]');
      if (!clear) return;
      if (!window.confirm('¿Vaciar todos los productos del carrito?')) return;
      saveCart([]);
      render();
      notice('El carrito está vacío.');
    });

    render();
  }

  function initCatalog() {
    if (file !== '12-catalogo-productos.html') return;
    const main = document.querySelector('.market-content main');
    const toolbar = main?.querySelector('.barra');
    const table = main?.querySelector('table');
    if (!main || !toolbar || !table) return;

    const search = toolbar.querySelector('input');
    const selects = toolbar.querySelectorAll('select');
    const category = selects[0];
    const state = selects[1];
    const filterButton = toolbar.querySelector('button');
    const tbodyRows = () => [...table.querySelectorAll('tr')].filter((row) => row.querySelectorAll('td').length);

    const sortLabel = document.createElement('label');
    sortLabel.textContent = 'Ordenar';
    const sort = document.createElement('select');
    sort.innerHTML = '<option value="original">Orden original</option><option value="name">Nombre A-Z</option><option value="price-up">Precio menor a mayor</option><option value="price-down">Precio mayor a menor</option><option value="stock">Existencia mayor a menor</option>';
    sortLabel.appendChild(sort);
    toolbar.appendChild(sortLabel);

    const query = new URLSearchParams(location.search).get('q');
    if (query && search) search.value = query;

    function filterRows() {
      const text = (search?.value || '').trim().toLowerCase();
      const categoryValue = category?.value || 'Todas';
      const stateValue = state?.value || 'Todos';
      const rows = tbodyRows();
      rows.forEach((row) => {
        const cells = row.querySelectorAll('td');
        const rowText = row.textContent.toLowerCase();
        const categoryText = cells[1]?.textContent.trim() || '';
        const statusText = cells[5]?.textContent.trim() || '';
        const match = (!text || rowText.includes(text))
          && (categoryValue === 'Todas' || categoryText === categoryValue)
          && (stateValue === 'Todos' || statusText === stateValue);
        row.hidden = !match;
      });

      const visible = rows.filter((row) => !row.hidden);
      const mode = sort.value;
      visible.sort((a, b) => {
        const ac = a.querySelectorAll('td');
        const bc = b.querySelectorAll('td');
        if (mode === 'name') return (ac[0]?.textContent || '').localeCompare(bc[0]?.textContent || '', 'es');
        if (mode === 'price-up') return parseMoney(ac[3]?.textContent) - parseMoney(bc[3]?.textContent);
        if (mode === 'price-down') return parseMoney(bc[3]?.textContent) - parseMoney(ac[3]?.textContent);
        if (mode === 'stock') return (parseNumber(bc[4]?.textContent) || 0) - (parseNumber(ac[4]?.textContent) || 0);
        return 0;
      });
      visible.forEach((row) => table.tBodies[0]?.appendChild(row));
      const summary = main.querySelector('.pie-tabla span:first-child');
      if (summary) summary.textContent = `Mostrando ${visible.length} productos de la lista disponible`;
    }

    filterButton?.addEventListener('click', filterRows);
    search?.addEventListener('input', filterRows);
    category?.addEventListener('change', filterRows);
    state?.addEventListener('change', filterRows);
    sort.addEventListener('change', filterRows);
    filterRows();

    main.querySelectorAll('.acc a').forEach((link) => {
      link.addEventListener('click', (event) => {
        event.preventDefault();
        const row = link.closest('tr');
        if (!row) return;
        const action = link.textContent.trim().toLowerCase();
        if (action === 'ocultar' || action === 'mostrar') {
          const badge = row.querySelector('.badge');
          if (badge) {
            const hidden = action === 'ocultar';
            badge.textContent = hidden ? 'Oculto' : 'Activo';
            badge.className = hidden ? 'badge b-oculto' : 'badge b-act';
          }
          link.textContent = action === 'ocultar' ? 'Mostrar' : 'Ocultar';
          notice('Estado actualizado solo en esta vista de demostración. No se modificó MongoDB.');
        } else if (action === 'eliminar') {
          if (window.confirm('¿Quitar este producto de la vista local?')) {
            row.remove();
            filterRows();
            notice('Producto retirado de la vista local.');
          }
        } else if (action === 'editar') {
          const priceCell = row.querySelectorAll('td')[3];
          const next = window.prompt('Nuevo precio en MXN:', String(parseMoney(priceCell?.textContent)));
          if (next !== null && Number.isFinite(Number(next)) && Number(next) >= 0 && priceCell) {
            priceCell.textContent = money(Number(next));
            notice('Precio actualizado solo en esta vista de demostración.');
            filterRows();
          }
        }
      });
    });

    const addButton = main.querySelector('.nuevo');
    if (addButton) {
      const dialog = document.createElement('dialog');
      dialog.className = 'market-dialog';
      dialog.innerHTML = `
        <form id="market-new-product-form">
          <div class="market-dialog-head"><h3>Agregar producto al catálogo local</h3><button type="button" class="sec" data-close-dialog>Cerrar</button></div>
          <div class="market-dialog-body">
            <label>Nombre<input name="name" required maxlength="140"></label>
            <label>SKU<input name="sku" required maxlength="50"></label>
            <label>Categoría<select name="category"><option>Rodamientos</option><option>Bandas y poleas</option><option>Lubricantes</option><option>Retenes y sellos</option></select></label>
            <label>Unidad de venta<input name="unit" required value="Pieza"></label>
            <label>Precio (MXN)<input name="price" type="number" min="0" step="0.01" required></label>
            <label>Existencia<input name="stock" type="number" min="0" step="1" required></label>
          </div>
          <div class="market-dialog-foot"><button type="submit">Agregar a la vista</button></div>
        </form>`;
      document.body.appendChild(dialog);
      addButton.addEventListener('click', () => dialog.showModal());
      dialog.querySelector('[data-close-dialog]').addEventListener('click', () => dialog.close());
      dialog.querySelector('form').addEventListener('submit', (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        const data = new FormData(form);
        const name = String(data.get('name')).trim();
        const sku = String(data.get('sku')).trim();
        const categoryValue = String(data.get('category'));
        const unit = String(data.get('unit')).trim();
        const price = Number(data.get('price'));
        const stock = Number(data.get('stock'));
        if (!name || !sku || !unit || !Number.isFinite(price) || !Number.isFinite(stock)) return;
        const row = document.createElement('tr');
        row.innerHTML = `
          <td><div class="nom">${escapeHtml(name)}</div><div class="clave">${escapeHtml(sku)}</div></td>
          <td>${escapeHtml(categoryValue)}</td><td>${escapeHtml(unit)}</td><td class="imp">${money(price)}</td><td class="imp">${stock}</td>
          <td><span class="badge ${stock > 0 ? 'b-act' : 'b-ago'}">${stock > 0 ? 'Activo' : 'Agotado'}</span></td>
          <td class="acc"><a href="#">Editar</a><a href="#">Ocultar</a><a href="#" class="del">Eliminar</a></td>`;
        table.tBodies[0]?.appendChild(row);
        form.reset();
        dialog.close();
        filterRows();
        notice('Producto agregado a la vista local. No se guardó en MongoDB.');
      });
    }
  }

  function initInventory() {
    if (file !== '13-inventario.html') return;
    const main = document.querySelector('.market-content main');
    if (!main) return;
    const rows = [...main.querySelectorAll('table tr')].filter((row) => row.querySelector('.cambiada') || row.querySelector('.ajuste input'));
    rows.forEach((row) => {
      const input = row.querySelector('.ajuste input');
      if (!input) return;
      input.dataset.initialValue = input.value;
      row.querySelectorAll('.ajuste button').forEach((button) => {
        button.addEventListener('click', () => {
          const delta = button.textContent.trim() === '+' ? 1 : -1;
          input.value = String(Math.max(0, (Number(input.value) || 0) + delta));
          input.dispatchEvent(new Event('input', { bubbles: true }));
        });
      });
      input.addEventListener('input', () => {
        const current = parseNumber(row.querySelector('td.alerta-bajo, td.alerta-medio, td.num')?.textContent) || 0;
        const delta = Number(input.value) - current;
        const deltaNode = row.querySelector('.delta');
        if (deltaNode) deltaNode.textContent = `${delta >= 0 ? '+' : ''}${delta}`;
        row.classList.toggle('editada', delta !== 0);
      });
    });

    const save = main.querySelector('.pie-acciones .principal');
    const discard = main.querySelector('.pie-acciones .sec');
    save?.addEventListener('click', () => {
      const values = rows.map((row) => ({
        sku: row.querySelector('.clave')?.textContent.trim() || '',
        quantity: Number(row.querySelector('.ajuste input')?.value) || 0
      }));
      safeStorageSet(inventoryKey, JSON.stringify(values));
      notice('Cambios guardados en este navegador. No se enviaron al backend.');
    });
    discard?.addEventListener('click', () => {
      rows.forEach((row) => {
        const input = row.querySelector('.ajuste input');
        if (input) {
          input.value = input.dataset.initialValue || input.value;
          input.dispatchEvent(new Event('input', { bubbles: true }));
        }
      });
      notice('Se descartaron los cambios locales.');
    });
  }

  function initTableFilters() {
    const main = document.querySelector('.market-content main');
    if (!main) return;

    if (file === '18-empresas-por-verificar.html' || file === '20-supervision-transacciones.html') {
      const filterButton = [...main.querySelectorAll('button')].find((button) => button.textContent.trim() === 'Filtrar');
      const search = main.querySelector('input[type="search"], input[type="text"]');
      const selects = [...main.querySelectorAll('select')];
      const table = main.querySelector('table');
      if (filterButton && table) {
        const run = () => {
          const query = (search?.value || '').toLowerCase().trim();
          const rows = [...table.querySelectorAll('tr')].filter((row) => row.querySelectorAll('td').length);
          rows.forEach((row) => {
            const textMatch = !query || row.textContent.toLowerCase().includes(query);
            const selectMatch = selects.every((select) => {
              const value = select.value;
              return !value || /todos|todas/i.test(value) || row.textContent.toLowerCase().includes(value.toLowerCase());
            });
            row.hidden = !(textMatch && selectMatch);
          });
        };
        filterButton.addEventListener('click', run);
        search?.addEventListener('input', run);
      }
    }
  }

  function downloadTable(button) {
    const main = button.closest('main') || document.querySelector('.market-content main');
    const table = main?.querySelector('table');
    if (!table) {
      notice('No hay una tabla disponible para exportar.', 'error');
      return;
    }
    const rows = [...table.querySelectorAll('tr')].filter((row) => !row.hidden);
    const csv = rows.map((row) => [...row.children].map((cell) => `"${cell.textContent.trim().replace(/"/g, '""')}"`).join(',')).join('\r\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'enlace-b2b-reporte.csv';
    link.click();
    URL.revokeObjectURL(url);
  }

  function initGenericActions() {
    document.addEventListener('click', (event) => {
      const addButton = event.target.closest('[data-market-add]');
      if (addButton) {
        event.preventDefault();
        const id = addButton.dataset.productId;
        const product = window.__marketProducts?.[id];
        if (!product) {
          notice('No se encontró la información del producto.', 'error');
          return;
        }
        const quantityInput = document.querySelector(`[data-product-quantity="${CSS.escape(id)}"]`)
          || addButton.closest('.market-product-card')?.querySelector('input[type="number"]')
          || addButton.closest('.compra')?.querySelector('input[type="number"]');
        const quantity = quantityInput ? Number(quantityInput.value) : 1;
        addProduct(product, quantity);
        return;
      }

      const clear = event.target.closest('[data-clear-cart]');
      if (clear) return;

      const exportButton = event.target.closest('.exportar, button');
      if (exportButton && /exportar|descargar comprobante/i.test(exportButton.textContent.trim())) {
        event.preventDefault();
        downloadTable(exportButton);
        return;
      }

      const button = event.target.closest('button');
      if (!button) return;
      const label = button.textContent.trim().toLowerCase();
      if (['generar pedido', 'cancelar pedido', 'aceptar pedido', 'aceptar con cantidades ajustadas', 'rechazar', 'aprobar empresa', 'rechazar solicitud', 'actualizar estatus', 'cambiar contraseña'].includes(label)) {
        event.preventDefault();
        event.stopPropagation();
        notice('Esta operación requiere conexión con el backend. No se modificaron pedidos ni registros.', 'error');
        return;
      }

      if (['guardar cambios', 'guardar configuración', 'guardar'].includes(label)) {
        const form = button.closest('form') || document.querySelector('.market-content main form');
        if (form) {
          const values = [...form.querySelectorAll('input, select, textarea')].map((field) => ({
            name: field.name || field.id,
            value: field.value
          }));
          safeStorageSet(`enlaceB2B.form.${file}`, JSON.stringify(values));
          notice('Datos guardados solo en este navegador. No se actualizaron en el servidor.');
        } else {
          notice('Esta pantalla no contiene un formulario para guardar.', 'error');
        }
        return;
      }

      if (button.dataset.ir || button.dataset.aviso || button.dataset.marketAdd || button.dataset.clearCart || button.type === 'submit') return;
      if (['filtrar', 'aplicar', 'limpiar'].includes(label)) return;
      if (label === 'vaciar carrito') return;
      if (label === 'descartar') {
        notice('No hay cambios enviados al servidor para descartar.');
        return;
      }
      if (label === 'generar reporte' || label === 'exportar todo') {
        event.preventDefault();
        downloadTable(button);
        return;
      }
    }, true);
  }

  function init() {
    initTheme();

    if (roleRoutes[role]) {
      buildShell();
      initHome();
      initResults();
      initProductDetail();
      initCart();
      initCatalog();
      initInventory();
      initTableFilters();
      initGenericActions();
      updateCartCount();
    } else {
      body.classList.add('market-public');
      addPublicThemeButton();
    }
  }

  init();
})();
