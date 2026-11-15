(() => {
  const numero = Number((location.pathname.split('/').pop() || '').slice(0, 2));
  if (!numero || numero < 3 || numero > 21) return;
  const sesion = leerSesion();
  if (!sesion || !sesion.token) { borrarSesion(); location.replace('01-inicio-sesion.html'); return; }
  const cambiar = document.querySelector('[data-cambiar-rol]');
  if (cambiar) cambiar.onclick = async () => {
    try {
      const rol = sesion.rol === 'comprador' ? 'distribuidor' : 'comprador';
      const respuesta = await solicitarApi('/auth/cambiar-rol', { method:'POST',body:JSON.stringify({rol}) });
      guardarSesion({...sesion,rol:respuesta.rol,token:respuesta.token,ultimaActividad:Date.now()});
      location.href = pantallaInicioDe(rol);
    } catch(e) { mostrarAviso(e.message,'error'); }
  };
  const anterior = document.querySelector('.market-content main');
  if (!anterior) return;
  anterior.innerHTML = '<div class="real" id="real"><p>Cargando datos del servidor...</p></div>';
  const area = document.getElementById('real');
  const $ = selector => area.querySelector(selector);
  const $$ = selector => [...area.querySelectorAll(selector)];
  const h = t => String(t ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const mx = n => (Number(n)||0).toLocaleString('es-MX',{style:'currency',currency:'MXN'});
  const fecha = f => f ? new Date(f).toLocaleString('es-MX',{dateStyle:'short',timeStyle:'short'}) : '—';
  const id = x => x?._id || x?.id || x || '';
  const nom = x => (x && typeof x === 'object') ? (x.razonSocial || x.nombre || '') : '';
  const estado = x => ({pendiente:'Pendiente',aceptado:'Aceptado',en_preparacion:'En preparación',en_camino:'En camino',entregado:'Entregado',cancelado:'Cancelado',rechazado:'Rechazado',procesando_aceptacion:'Procesando',procesando_cancelacion:'Procesando'})[x] || x;
  const aviso = (msg,tipo='exito') => mostrarAviso(msg,tipo);
  const panel = (titulo,contenido) => `<section class="real-panel"><h3>${h(titulo)}</h3>${contenido}</section>`;
  const vacio = msg => `<p class="real-muted">${h(msg || 'No hay información por mostrar.')}</p>`;
  const boton = (label,accion,ident='',clase='')=> `<button type="button" class="${clase}" data-accion="${h(accion)}" data-id="${h(ident)}">${h(label)}</button>`;
  const link = (texto,url) => `<a class="real-link subtle" href="${h(url)}">${h(texto)}</a>`;
  const tabla=(cab,filas)=>`<div class="real-table"><table><thead><tr>${cab.map(x=>`<th>${h(x)}</th>`).join('')}</tr></thead><tbody>${filas.join('')||`<tr><td colspan="${cab.length}">Sin registros</td></tr>`}</tbody></table></div>`;
  const fil = (...campos) => `<tr>${campos.map(c=>`<td>${c ?? ''}</td>`).join('')}</tr>`;
  const input=(campo,titulo,valor='',tipo='text',adicional='')=>`<label>${h(titulo)}<input type="${h(tipo)}" name="${h(campo)}" value="${h(valor)}" ${adicional}></label>`;
  const select=(campo,titulo,opciones,actual='') => `<label>${h(titulo)}<select name="${h(campo)}">${opciones.map(x=>{const [v,n]=Array.isArray(x)?x:[x,x];return `<option value="${h(v)}" ${String(v)===String(actual)?'selected':''}>${h(n)}</option>`}).join('')}</select></label>`;
  const formData = f => Object.fromEntries(new FormData(f).entries());
  const render = (titulo,html) => {area.innerHTML = `<h2>${h(titulo)}</h2>${html}`; contarCarrito();};
  const api = async(ruta,metodo='GET',data) => solicitarApi(ruta, {method:metodo,...(data === undefined?{}:{body:JSON.stringify(data)})});
  const tareas = async fn => {try {await fn();} catch(e){aviso(e.message || 'No se pudo completar la operación.','error');}};
  const confirmar = (texto) => window.confirm(texto);
  const codigo = n => `PED-${String(id(n)).slice(-7).toUpperCase()}`;
  const key = `enlaceB2B.carrito.${sesion.empresaId}`;
  const agrupar = (lista,campo) => lista.reduce((out,item)=>{(out[item[campo]] ||= []).push(item);return out},{});
  const carrito = () => {try {return JSON.parse(localStorage.getItem(key))||[]}catch{return []}};
  const guardarCarrito = items => {localStorage.setItem(key, JSON.stringify(items));contarCarrito();};
  function contarCarrito(){const n=carrito().length;document.querySelectorAll('[data-cart-count]').forEach(x=>{x.textContent=n;x.hidden=n===0})}
  function agregar(p,cantidad=1){
    const cantidadNueva=Number(cantidad),existencias=Number(p.existencias)||0;
    if (!Number.isInteger(cantidadNueva)||cantidadNueva<1) throw Error('Escribe una cantidad válida.');
    const lista=carrito(),actual=lista.find(x=>x.productoId===id(p));
    if(cantidadNueva+(actual?.cantidad||0)>existencias) throw Error('No hay suficientes existencias.');
    if(actual)actual.cantidad+=cantidadNueva;
    else lista.push({productoId:id(p),distribuidorId:id(p.distribuidorId),nombre:p.nombre,sku:p.sku,precio:p.precio,existencias,cantidad:cantidadNueva,distribuidor:nom(p.distribuidorId)});
    guardarCarrito(lista);aviso('Se agregó el producto al carrito.');
  }
  async function productos(){return await api('/productos')}
  async function pedidos(){return await api('/pedidos')}
  async function detallePedido(pedidoId){return await api('/pedidos/'+pedidoId)}
  async function listarAvisos(){
    const lista=await api('/notificaciones');
    const pendientes=lista.filter(a=>!a.leida);
    return pendientes.length?panel('Notificaciones', pendientes.slice(0,6).map(a=>`<div class="real-row"><span>${h(a.mensaje)} <small>${fecha(a.fechaCreacion)}</small></span>${boton('Marcar leído','leer',id(a),'subtle')}</div>`).join('')):'';
  }
  async function cabeceraAvisos(){const avisos=await listarAvisos();if(avisos){ const d=document.createElement('div');d.innerHTML=avisos;area.insertBefore(d,area.children[1]||null);d.addEventListener('click',e=>{const b=e.target.closest('[data-accion="leer"]');if(b)tareas(async()=>{await api('/notificaciones/'+b.dataset.id+'/leida','PUT');await iniciar()})})}}
  async function inicioComprador(){
    const prods=await api('/busqueda/productos');
    const otros=prods.productos.slice(0,12);
    render('Buscar productos industriales', panel('Catálogo disponible', `<p>Productos publicados por distribuidores verificados.</p><div class="real-grid">${otros.map(p=>`<div class="real-panel"><b>${h(p.nombre)}</b><p>${h(nom(p.distribuidorId))} · ${h(p.distribuidorId?.municipio)}</p><p class="price">${mx(p.precio)}</p><p>${p.existencias} disponibles${p.distanciaKm!=null?' · '+p.distanciaKm+' km':''}</p>${link('Ver producto','05-detalle-producto.html?id='+id(p))}</div>`).join('')||vacio('Todavía no hay productos. El distribuidor debe crear los primeros.')}</div>`)+panel('Encontrar por categoría', ['Rodamientos','Bandas y poleas','Lubricantes','Herramienta','Seguridad industrial','Aceros y metales'].map(c=>link(c,'04-resultados-busqueda.html?categoria='+encodeURIComponent(c))).join(' ')));
    await cabeceraAvisos();
  }
  async function busqueda(){
    const p=new URLSearchParams(location.search);
    const enviar=async()=>{
      const query=p.toString();const resultado=await api('/busqueda/productos'+(query?'?'+query:''));
      const lista=resultado.productos;
      const filas=lista.map(prod=>`<div class="real-panel real-product"><div><b>${h(prod.nombre)}</b><p>${h(nom(prod.distribuidorId))} — ${h(prod.distribuidorId?.municipio)} · ${prod.distanciaKm==null?'distancia no disponible':prod.distanciaKm+' km'}</p><p>${h(prod.categoria)} · ${prod.existencias>0?prod.existencias+' disponibles':'Agotado'} </p></div><div><p class="price">${mx(prod.precio)}</p>${link('Ver detalle','05-detalle-producto.html?id='+id(prod))} ${boton('Agregar','agregar',id(prod),'subtle')}</div></div>`);
      render('Resultados de búsqueda', panel('Filtros', `<form id="filtros">${input('q','Producto o clave',p.get('q')||'')}${input('categoria','Categoría',p.get('categoria')||'')}${input('precioMin','Precio mínimo',p.get('precioMin')||'','number','min="0" step="0.01"')}${input('precioMax','Precio máximo',p.get('precioMax')||'','number','min="0" step="0.01"')}${input('radioKm','Radio (km)',p.get('radioKm')||'','number','min="0"')}${select('orden','Ordenar por',[['cercania','Distancia'],['precio','Precio menor'],['existencias','Existencia mayor']],p.get('orden')||'cercania')}<label><span>Con existencias</span><input type="checkbox" name="soloStock" value="true" ${p.get('soloStock')==='true'?'checked':''}></label><button>Buscar</button></form>${!resultado.ubicacionConfigurada?'<p class="notice">Para ordenar por cercanía, registra tus coordenadas en Mi empresa. Puedes buscar sin distancia mientras tanto.</p>':''}`)+`<p>${lista.length} coincidencias.</p>${filas.join('')||panel('No hay coincidencias','Amplía el radio o modifica los filtros.')}`);
      $('#filtros').onsubmit=e=>{e.preventDefault();const d=new FormData(e.currentTarget),a=new URLSearchParams();for(const [k,v]of d)if(String(v).trim())a.set(k,v);location.href='04-resultados-busqueda.html?'+a.toString()};
      area.addEventListener('click',e=>{const b=e.target.closest('[data-accion="agregar"]');if(!b)return; tareas(async()=>agregar(lista.find(x=>id(x)===b.dataset.id)))} ,{once:false});
    };await enviar();
  }
  async function detalleProducto(){
    const productId=new URLSearchParams(location.search).get('id');
    if(!productId){render('Producto','Selecciona un artículo desde los resultados.');return;}
    const p=await api('/productos/'+encodeURIComponent(productId));
    render('Detalle del producto',panel(p.nombre,`<div class="real-grid"><div>${p.fotoUrl?`<img class="real-photo" src="${h(p.fotoUrl)}" alt="Foto del producto">`:''}<p>${h(p.descripcion)}</p><p>SKU: ${h(p.sku)} · Marca: ${h(p.marca||'No indicada')}</p><p>Categoría: ${h(p.categoria)} · Unidad: ${h(p.unidadMedida)}</p><p class="price">${mx(p.precio)}</p><p>Existencias: ${p.existencias}</p><form id="add">${input('cantidad','Cantidad',1,'number',`min="1" max="${p.existencias}" required`)}<button ${p.existencias===0?'disabled':''}>Agregar al carrito</button></form></div><div><h3>${h(nom(p.distribuidorId))}</h3><p>${h(p.distribuidorId?.descripcionPublica||'Sin descripción')}</p><p>Municipio: ${h(p.distribuidorId?.municipio)}</p><p>Entrega: ${h(p.distribuidorId?.tiempoEntrega||'Por confirmar')}</p><p>Formas de pago: ${h(p.distribuidorId?.formasPago?.join(', ')||'Por confirmar')}</p></div></div>`)+link('Regresar a búsqueda','04-resultados-busqueda.html'+location.search.replace(/id=[^&]+&?/,'').replace(/^\?$/,'')));
    $('#add').onsubmit=e=>{e.preventDefault();tareas(async()=>agregar(p,Number(e.currentTarget.elements.cantidad.value)))};
  }
  async function vistaCarrito(){
    const items=carrito(),ids=items.map(x=>x.productoId);
    const actuales=await productos();const mapa=new Map(actuales.map(x=>[id(x),x]));
    const enriquecidos=items.map(x=>({...x,actual:mapa.get(x.productoId)}));
    const grupos=agrupar(enriquecidos,'distribuidorId');
    const bloques=Object.values(grupos).map(grupo=> panel(grupo[0].distribuidor||'Distribuidor',tabla(['Producto','Precio actual','Stock','Cantidad','Subtotal',''],grupo.map(x=>fil(h(x.nombre),mx(x.actual?.precio??x.precio),x.actual?.existencias??'No disponible',`<input type="number" min="1" max="${x.actual?.existencias??0}" data-cantidad="${h(x.productoId)}" value="${x.cantidad}" style="width:90px">`,mx((x.actual?.precio??x.precio)*x.cantidad),boton('Quitar','quitar',x.productoId,'danger'))))));
    const total=enriquecidos.reduce((s,x)=>s+(x.actual?.precio??x.precio)*x.cantidad,0);
    render('Mi carrito',bloques.join('')+panel('Resumen',`<p>${items.length} productos de ${Object.keys(grupos).length} distribuidores.</p><h3>${mx(total)}</h3><p class="small">La comisión se descuenta al distribuidor, no se suma a tu compra.</p><div class="real-row">${link('Confirmar compra','07-confirmacion-pedido.html')}${boton('Vaciar carrito','vaciar','','danger')} ${link('Seguir buscando','04-resultados-busqueda.html')}</div>`));
    area.onchange=e=>{if(!e.target.matches('[data-cantidad]'))return;const item=items.find(x=>x.productoId===e.target.dataset.cantidad);const actual=mapa.get(item.productoId);const v=Number(e.target.value);if(!Number.isInteger(v)||v<1||v>(actual?.existencias??0)){aviso('Cantidad inválida o sin existencia suficiente.','error');e.target.value=item.cantidad;return}item.cantidad=v;guardarCarrito(items);vistaCarrito()};
    area.onclick=e=>{const b=e.target.closest('[data-accion]');if(!b)return;if(b.dataset.accion==='quitar'){guardarCarrito(items.filter(i=>i.productoId!==b.dataset.id));vistaCarrito()}if(b.dataset.accion==='vaciar'&&confirmar('¿Vaciar carrito?')){guardarCarrito([]);vistaCarrito()}};
  }
  async function confirmarCompra(){
    const items=carrito();if(!items.length){render('Confirmar pedido',vacio('Tu carrito está vacío.')+link('Ir al catálogo','04-resultados-busqueda.html'));return}
    const empresa=await api('/empresas/mi-perfil');const productosActuales=await productos();const mapa=new Map(productosActuales.map(p=>[id(p),p]));
    const grupos=agrupar(items,'distribuidorId');
    const incompletos=items.filter(i=>!mapa.get(i.productoId)||mapa.get(i.productoId).existencias<i.cantidad);
    render('Confirmar pedido',panel('Revisión de compra',`<p>Se generará un pedido por distribuidor (${Object.keys(grupos).length}).</p>${tabla(['Producto','Distribuidor','Cantidad','Precio actual','Importe'],items.map(i=>{let p=mapa.get(i.productoId);return fil(h(i.nombre),h(i.distribuidor),i.cantidad,mx(p?.precio||0),mx((p?.precio||0)*i.cantidad))}))}${incompletos.length?'<p class="error">Hay artículos sin disponibilidad; corrígelos en el carrito.</p>':''}`)+panel('Entrega y pago',`<form id="confirmar">${input('direccionEntrega','Dirección de entrega',`${empresa.calle}, ${empresa.colonia}, ${empresa.municipio}`,'text','required maxlength="300"')}${input('referenciaEntrega','Indicaciones para la entrega','','text','maxlength="300"')}${select('metodoPago','Forma de pago',[['transferencia','Transferencia'],['contra_entrega','Contra entrega']])}<button ${incompletos.length?'disabled':''}>Generar pedidos</button></form>`)+link('Modificar carrito','06-carrito.html'));
    $('#confirmar').onsubmit=e=>{e.preventDefault();if(!confirmar('¿Confirmar los pedidos?'))return;const b=e.target.querySelector('button');b.disabled=true;tareas(async()=>{
      const form=formData(e.target),confirmados=[];
      for(const [distribuidorId,grupo]of Object.entries(grupos)){
        try {const r=await api('/pedidos/confirmar','POST',{compradorId:sesion.empresaId,distribuidorId,productos:grupo.map(i=>({productoId:i.productoId,cantidad:i.cantidad})),...form});confirmados.push({grupo,pedido:r.pedido})}
        catch(error){guardarCarrito(carrito().filter(i=>!confirmados.some(c=>c.grupo.some(g=>g.productoId===i.productoId))));render('Compra parcialmente procesada',panel('Revisa el resultado',`<p>${confirmados.length} pedidos generados. La siguiente operación no se realizó: ${h(error.message)}</p>${confirmados.map(c=>`<p>${link(codigo(c.pedido),'08-seguimiento-pedido.html?id='+id(c.pedido))}</p>`).join('')}`));return}
      }
      guardarCarrito([]);render('Pedidos generados',panel('Compra registrada',`<p>Se guardaron ${confirmados.length} pedidos en la base de datos.</p>${confirmados.map(c=>`<p>${link(codigo(c.pedido),'08-seguimiento-pedido.html?id='+id(c.pedido))}</p>`).join('')}`));
    }).finally(()=>b.disabled=false)};
  }
  async function mostrarPedido(){
    const ordenes=await pedidos(),seleccion=new URLSearchParams(location.search).get('id');const activos=ordenes.filter(x=>!['entregado','cancelado','rechazado'].includes(x.estado));
    const marcado=seleccion||id(activos[0]);
    const lista=panel('Pedidos activos',tabla(['Folio','Distribuidor','Fecha','Total','Estado',''],activos.map(p=>fil(codigo(p),h(nom(p.distribuidorId)),fecha(p.fechaCreacion),mx(p.total),h(estado(p.estado)),link('Ver','08-seguimiento-pedido.html?id='+id(p))))));
    if(!marcado){render('Seguimiento de pedidos',lista+vacio('No hay pedidos activos.'));return}
    const r=await detallePedido(marcado),p=r.pedido;
    const detalles=tabla(['Producto','Cantidad','Precio','Importe'],r.detalles.map(d=>fil(h(d.productoId?.nombre||'Producto'),d.cantidad,mx(d.precioUnitario),mx(d.subtotal))));
    render('Seguimiento de pedidos',lista+panel(codigo(p),`<p><b>Distribuidor:</b> ${h(nom(p.distribuidorId))}</p><p><b>Estado:</b> ${h(estado(p.estado))} · Total: ${mx(p.total)}</p><p>Dirección: ${h(p.direccionEntrega||'No indicada')}</p><p>Referencias: ${h(p.referenciaEntrega||'Sin referencia')}</p><p>Entrega estimada: ${fecha(p.fechaEstimada)} · Nota: ${h(p.notaEntrega||'Sin nota')}</p><p>Motivo de rechazo: ${h(p.motivoRechazo||'No aplica')}</p>${detalles}<h3>Historial de estados</h3>${(p.historialEstados||[]).map(t=>`<p>● ${h(estado(t.estado))} — ${fecha(t.fecha)}</p>`).join('')}${p.estado==='pendiente'?boton('Cancelar pedido','cancelar',id(p),'danger'):''}`));
    area.onclick=e=>{const b=e.target.closest('[data-accion="cancelar"]');if(b&&confirmar('¿Cancelar este pedido pendiente?'))tareas(async()=>{await api('/pedidos/'+b.dataset.id+'/cancelar','PUT');aviso('Pedido cancelado.');await mostrarPedido()})};
  }
  async function historial(){
    const ordenes=(await pedidos()).filter(x=>['entregado','cancelado','rechazado'].includes(x.estado));
    render('Historial de compras',panel('Pedidos anteriores',tabla(['Folio','Distribuidor','Fecha','Importe','Estado',''],ordenes.map(p=>fil(codigo(p),h(nom(p.distribuidorId)),fecha(p.fechaCreacion),mx(p.total),h(estado(p.estado)),`${link('Detalle','08-seguimiento-pedido.html?id='+id(p))} ${boton('Volver a pedir','repetir',id(p))} ${p.estado==='entregado'?boton('Calificar','calificar',id(p)):''}`)))));
    area.onclick=e=>{const b=e.target.closest('[data-accion]');if(!b)return;
    if(b.dataset.accion==='calificar'){tareas(async()=>{const puntuacion=Number(prompt('Calificación de 1 a 5:'));if(!Number.isInteger(puntuacion)||puntuacion<1||puntuacion>5)return;const comentario=prompt('Comentario opcional:')||'';await api('/calificaciones','POST',{pedidoId:b.dataset.id,puntuacion,comentario});aviso('Calificación registrada.')});return;}
    if(b.dataset.accion!=='repetir')return;tareas(async()=>{
      const r=await detallePedido(b.dataset.id),prods=await productos(),mapa=new Map(prods.map(p=>[id(p),p]));let agregados=0;
      for(const d of r.detalles){const p=mapa.get(id(d.productoId));if(p&&p.existencias>=d.cantidad){try{agregar(p,d.cantidad);agregados++}catch{}}}
      aviso(`${agregados} productos agregados. Revisa los precios y existencias actuales.`);location.href='06-carrito.html';
    })};
  }
  async function perfil(distribuidor=false){
    const e=await api('/empresas/mi-perfil');
    render(distribuidor?'Perfil del distribuidor':'Perfil de empresa',panel('Datos de la empresa',`<p><b>Razón social:</b> ${h(e.razonSocial)} · RFC: ${h(e.rfc)}</p><p><b>Estado:</b> ${h(e.estadoVerificacion)}. Estos datos no se pueden cambiar aquí.</p><form id="perfil">${input('giro','Giro',e.giro,'text','required')}${input('calle','Calle y número',e.calle,'text','required')}${input('colonia','Colonia',e.colonia,'text','required')}${input('codigoPostal','Código postal',e.codigoPostal,'text','pattern="[0-9]{5}" required')}${input('municipio','Municipio',e.municipio,'text','required')}${input('latitud','Latitud (-90 a 90)',e.latitud??'','number','step="any" min="-90" max="90"')}${input('longitud','Longitud (-180 a 180)',e.longitud??'','number','step="any" min="-180" max="180"')}${distribuidor?`${input('descripcionPublica','Descripción',e.descripcionPublica||'')}${input('tiempoEntrega','Tiempo de entrega',e.tiempoEntrega||'')}${input('pedidoMinimo','Pedido mínimo',e.pedidoMinimo||1,'number','min="1"')}${input('telefonoContacto','Teléfono',e.telefonoContacto||'')}<label><span>Acepta transferencia</span><input type="checkbox" name="transferencia" ${e.formasPago?.includes('transferencia')?'checked':''}></label><label><span>Acepta contra entrega</span><input type="checkbox" name="contra_entrega" ${e.formasPago?.includes('contra_entrega')?'checked':''}></label><label><span>Recolección</span><input type="checkbox" name="recoleccion" ${e.recoleccion?'checked':''}></label>`:''}<button>Guardar cambios</button></form><h3>Cambiar mi contraseña</h3><form id="clave">${input('actual','Contraseña actual','','password','required')}${input('nueva','Nueva contraseña','','password','minlength="8" required')}<button>Cambiar contraseña</button></form><p class="small">Para la cercanía se requieren coordenadas. Se pueden obtener de un mapa de la ubicación de tu empresa y registrarlas aquí. No son obligatorias para comprar o vender.</p>`));
    $('#clave').onsubmit=ev=>{ev.preventDefault();tareas(async()=>{await api('/auth/contrasena','PUT',formData(ev.target));aviso('Contraseña cambiada correctamente.');ev.target.reset()})};
    $('#perfil').onsubmit=ev=>{ev.preventDefault();tareas(async()=>{
      let d=formData(ev.target);
      if((d.latitud&&!d.longitud)||(!d.latitud&&d.longitud))throw Error('Captura las dos coordenadas o deja las dos vacías.');
      d.latitud=d.latitud?Number(d.latitud):undefined;d.longitud=d.longitud?Number(d.longitud):undefined;
      if(distribuidor){d.formasPago=['transferencia','contra_entrega'].filter(x=>d[x]);d.recoleccion=Boolean(d.recoleccion);d.pedidoMinimo=Number(d.pedidoMinimo);delete d.transferencia;delete d.contra_entrega}
      await api('/empresas/mi-perfil','PUT',d);aviso('Perfil actualizado.');await perfil(distribuidor)
    })};
  }
  async function panelDistribuidor(){
    const [lista,inventario]=await Promise.all([pedidos(),api('/inventarios')]);
    const entregados=lista.filter(p=>p.estado==='entregado'),pendientes=lista.filter(p=>p.estado==='pendiente');
    const ventas=entregados.reduce((s,p)=>s+p.total,0),comision=entregados.reduce((s,p)=>s+p.comisionMonto,0);
    render('Panel del distribuidor',`<div class="real-grid">${[['Pedidos pendientes',pendientes.length],['Inventario bajo',inventario.filter(i=>i.existencias<=i.stockMinimo).length],['Ventas concluidas',mx(ventas)],['Comisiones',mx(comision)]].map(([t,v])=>panel(t,`<div class="real-stat">${v}</div>`)).join('')}</div>`+panel('Pedidos recientes',tabla(['Pedido','Comprador','Estado','Importe'],lista.slice(0,10).map(p=>fil(codigo(p),h(nom(p.compradorId)),h(estado(p.estado)),mx(p.total)))))+`<div class="real-row">${link('Administrar pedidos','14-pedidos-recibidos.html')}${link('Administrar inventario','13-inventario.html')}</div>`);
    await cabeceraAvisos();
  }
  async function catalogo(){
    const lista=await productos();
    const form=panel('Agregar o editar producto',`<form id="producto">${input('sku','Clave (SKU)','','text','required maxlength="50"')}${input('nombre','Nombre','','text','required maxlength="140"')}${input('descripcion','Descripción','','text','required maxlength="255"')}${input('categoria','Categoría','','text','required')}${input('marca','Marca')}${input('precio','Precio','','number','step="0.01" min="0" required')}${input('unidadMedida','Unidad','pieza','text','required')}${input('fotoUrl','URL de fotografía (opcional)')}${input('existencias','Existencia inicial',0,'number','min="0" required')}${input('stockMinimo','Stock mínimo',0,'number','min="0" required')}<button>Guardar producto</button><button type="reset" class="subtle">Limpiar</button></form><p class="small">Las imágenes se referencian por URL pública. No se suben archivos al servidor gratuito.</p>`);
    render('Mi catálogo',form+panel('Productos de mi empresa',tabla(['Producto','Categoría','Precio','Existencia','Estado','Acciones'],lista.map(p=>fil(`<b>${h(p.nombre)}</b><p class="small">${h(p.sku)}</p>`,h(p.categoria),mx(p.precio),p.existencias,h(p.activo?'Activo':'Oculto'),`${boton('Editar','editar',id(p),'subtle')} ${boton(p.activo?'Ocultar':'Mostrar','activo',id(p),'subtle')} ${boton('Eliminar','eliminar',id(p),'danger')}`)))));
    const formu=$('#producto');formu.onsubmit=e=>{e.preventDefault();const b=formu.querySelector('button');b.disabled=true;tareas(async()=>{
      const d=formData(formu);d.precio=Number(d.precio);d.existencias=Number(d.existencias);d.stockMinimo=Number(d.stockMinimo);
      const editId=formu.dataset.editar;let prod;
      if(editId){const {existencias,stockMinimo,...datos}=d;prod=await api('/productos/'+editId,'PUT',datos);const inv=(await api('/inventarios')).find(i=>id(i.productoId)===editId);if(inv)await api('/inventarios/'+id(inv),'PUT',{existencias,stockMinimo,fechaActualizacion:inv.fechaActualizacion});}
      else{const {existencias,stockMinimo,...datos}=d;prod=await api('/productos','POST',{...datos,distribuidorId:sesion.empresaId,activo:true});try{await api('/inventarios','POST',{productoId:id(prod),existencias,stockMinimo})}catch(error){await api('/productos/'+id(prod),'PUT',{activo:false});throw Error('Producto guardado pero falta crear inventario. Se dejó oculto: '+error.message)}}
      aviso('Producto guardado.');await catalogo();
    }).finally(()=>b.disabled=false)};
    area.onclick=e=>{const b=e.target.closest('[data-accion]');if(!b)return;const p=lista.find(x=>id(x)===b.dataset.id);if(!p)return;
      if(b.dataset.accion==='editar'){for(const name of ['sku','nombre','descripcion','categoria','marca','precio','unidadMedida','fotoUrl','existencias','stockMinimo'])if(formu.elements[name])formu.elements[name].value=p[name]??'';formu.dataset.editar=id(p);formu.querySelector('button').textContent='Actualizar producto';formu.scrollIntoView({behavior:'smooth'});}
      if(b.dataset.accion==='activo')tareas(async()=>{await api('/productos/'+id(p),'PUT',{activo:!p.activo});await catalogo()});
      if(b.dataset.accion==='eliminar'&&confirmar('¿Eliminar el producto? Si tiene inventario o pedidos, el servidor lo rechazará; mejor ocúltalo.'))tareas(async()=>{await api('/productos/'+id(p),'DELETE');await catalogo()});
    };
    formu.onreset=()=>{delete formu.dataset.editar;formu.querySelector('button').textContent='Guardar producto'};
  }
  async function inventario(){
    const inv=await api('/inventarios');
    const filas=inv.map(i=>fil(`<b>${h(i.productoId?.nombre||'Producto')}</b><p>${h(i.productoId?.sku)}</p>`,i.existencias,`<input type="number" min="0" step="1" value="${i.existencias}" data-stock="${id(i)}">`,`<input type="number" min="0" step="1" value="${i.stockMinimo}" data-min="${id(i)}">`,i.existencias<=i.stockMinimo?'<span class="error">Bajo</span>':'Disponible',fecha(i.fechaActualizacion),boton('Guardar','guardar-inv',id(i))));
    render('Inventario',panel('Existencias de mis productos',`<p>Se comprueba la fecha del último cambio para no sobrescribir ajustes nuevos.</p>${tabla(['Producto','Actual','Existencia nueva','Stock mínimo','Estado','Último cambio',''],filas)}`));
    area.onclick=e=>{const b=e.target.closest('[data-accion="guardar-inv"]');if(!b)return;const registro=inv.find(x=>id(x)===b.dataset.id),stock=Number($(`[data-stock="${b.dataset.id}"]`).value),min=Number($(`[data-min="${b.dataset.id}"]`).value);if(!Number.isInteger(stock)||!Number.isInteger(min)||stock<0||min<0){aviso('Las cantidades deben ser enteros positivos.','error');return}b.disabled=true;tareas(async()=>{await api('/inventarios/'+id(registro),'PUT',{existencias:stock,stockMinimo:min,fechaActualizacion:registro.fechaActualizacion});aviso('Inventario guardado.');await inventario()}).finally(()=>b.disabled=false)};
  }
  async function pedidosDistribuidor(soloEntregas=false){
    const list=(await pedidos()).filter(p=>!soloEntregas||['aceptado','en_preparacion','en_camino','entregado'].includes(p.estado));
    const tablaPedidos=tabla(['Pedido','Comprador','Fecha','Estado','Total','Acciones'],list.map(p=>fil(codigo(p),h(nom(p.compradorId)),fecha(p.fechaCreacion),h(estado(p.estado)),mx(p.total),`${boton('Detalle','detalle',id(p),'subtle')} ${p.estado==='pendiente'&&!soloEntregas?`${boton('Aceptar','aceptar',id(p))} ${boton('Rechazar','rechazar',id(p),'danger')}`:''}${p.estado==='aceptado'?boton('Preparar','preparar',id(p)):''}${p.estado==='en_preparacion'?boton('Enviar','enviar',id(p)):''}${p.estado==='en_camino'?boton('Entregar','entregar',id(p)):''}`)));
    render(soloEntregas?'Estatus de entrega':'Pedidos recibidos',panel('Pedidos reales del distribuidor',tablaPedidos)+`<section id="detalle-orden"></section>`);
    area.onclick=e=>{const b=e.target.closest('[data-accion]');if(!b)return;
      tareas(async()=>{
        if(b.dataset.accion==='detalle'){const r=await detallePedido(b.dataset.id);$('#detalle-orden').innerHTML=panel(codigo(r.pedido),`<p>Entrega: ${h(r.pedido.direccionEntrega)} · Referencias: ${h(r.pedido.referenciaEntrega)}</p><p>Nota: ${h(r.pedido.notaEntrega||'No definida')}</p>${tabla(['Artículo','Cantidad','Precio','Importe'],r.detalles.map(d=>fil(h(d.productoId?.nombre||'Artículo'),d.cantidad,mx(d.precioUnitario),mx(d.subtotal))))}<h3>Historial</h3>${r.pedido.historialEstados.map(t=>`<p>${estado(t.estado)} — ${fecha(t.fecha)}</p>`).join('')}`);return;}
        let accion=b.dataset.accion,payload;
        if(accion==='rechazar'){const motivo=prompt('Motivo de rechazo:');if(!motivo?.trim())return;payload={motivoRechazo:motivo};}
        else if(!confirmar(`¿${accion} el pedido ${codigo(b.dataset.id)}?`))return;
        await api('/pedidos/'+b.dataset.id+'/'+accion,'PUT',payload);
        aviso('Pedido actualizado.');await pedidosDistribuidor(soloEntregas);
      })
    };
    await cabeceraAvisos();
  }
  async function ventas(){
    const todos=await pedidos(), entregados=todos.filter(p=>p.estado==='entregado');
    const v=entregados.reduce((s,p)=>s+p.total,0),c=entregados.reduce((s,p)=>s+p.comisionMonto,0);
    render('Ventas y comisiones',`<div class="real-grid">${panel('Venta total',`<div class="real-stat">${mx(v)}</div>`)}${panel('Comisión retenida',`<div class="real-stat">${mx(c)}</div>`)}${panel('Importe neto',`<div class="real-stat">${mx(v-c)}</div>`)}${panel('Pedidos concluidos',`<div class="real-stat">${entregados.length}</div>`)}</div>`+panel('Detalle',`${input('desde','Desde','','date')}${input('hasta','Hasta','','date')}${boton('Aplicar fechas','filtrar')}${boton('Exportar CSV','csv')}<div id="ventas-tabla"></div>`));
    const filas=(datos)=>{const t=tabla(['Pedido','Fecha','Comprador','Importe','%','Comisión','Neto'],datos.map(p=>fil(codigo(p),fecha(p.fechaCreacion),h(nom(p.compradorId)),mx(p.total),p.comisionPct,mx(p.comisionMonto),mx(p.total-p.comisionMonto))));$('#ventas-tabla').innerHTML=t};filas(entregados);
    area.onclick=e=>{const b=e.target.closest('[data-accion]');if(!b)return;const desde=$('[name="desde"]').value,hasta=$('[name="hasta"]').value,datos=entregados.filter(p=>(!desde||p.fechaCreacion.slice(0,10)>=desde)&&(!hasta||p.fechaCreacion.slice(0,10)<=hasta));if(b.dataset.accion==='filtrar')filas(datos);if(b.dataset.accion==='csv')exportarCsv('ventas.csv',datos.map(p=>({pedido:codigo(p),fecha:p.fechaCreacion,comprador:nom(p.compradorId),importe:p.total,comisionPct:p.comisionPct,comision:p.comisionMonto})))};
  }
  async function empresasAdmin(){
    const list=await api('/empresas');const ver=()=>{
      const txt=$('[name="buscar"]').value.toLowerCase(),st=$('[name="estado"]').value;
      const filtradas=list.filter(e=>(e.razonSocial+' '+e.rfc).toLowerCase().includes(txt)&&(!st||e.estadoVerificacion===st));
      $('#empresas-tabla').innerHTML=tabla(['Empresa','RFC','Tipo','Estado','Registro','Acciones'],filtradas.map(e=>fil(`<b>${h(e.razonSocial)}</b>`,h(e.rfc),h(e.tipo),h(e.estadoVerificacion),fecha(e.fechaCreacion),`${boton('Ver','detalle',id(e),'subtle')} ${e.estadoVerificacion!=='verificada'?boton('Aprobar','aprobar',id(e)):''} ${e.estadoVerificacion!=='rechazada'?boton('Rechazar','rechazar',id(e),'danger'):''}`)));
    };
    render('Empresas por verificar',panel('Solicitudes',`${input('buscar','Buscar por nombre o RFC')}${select('estado','Estado',[['','Todas'],['pendiente','Pendientes'],['verificada','Aprobadas'],['rechazada','Rechazadas']])}<div id="empresas-tabla"></div><section id="detalle-empresa"></section>`));ver();
    $('[name="buscar"]').oninput=ver;$('[name="estado"]').onchange=ver;
    area.onclick=e=>{const b=e.target.closest('[data-accion]');if(!b)return;const emp=list.find(x=>id(x)===b.dataset.id);
      if(b.dataset.accion==='detalle'){$('#detalle-empresa').innerHTML=panel('Detalle: '+emp.razonSocial,`<p>RFC: ${h(emp.rfc)} · Giro: ${h(emp.giro)} · Tipo: ${h(emp.tipo)}</p><p>Dirección: ${h(emp.calle)}, ${h(emp.colonia)}, ${h(emp.municipio)}, C.P. ${h(emp.codigoPostal)}</p><p>Rechazo: ${h(emp.motivoRechazo||'No hay')}</p>`);return}
      tareas(async()=>{let motivo='';const estado=b.dataset.accion==='aprobar'?'verificada':'rechazada';if(estado==='rechazada'){motivo=prompt('Motivo de rechazo (obligatorio)')||'';if(!motivo.trim())return}else if(!confirmar('¿Aprobar esta empresa?'))return;await api('/empresas/'+id(emp)+'/verificar','PUT',{estado,motivo});aviso('Estado guardado en el servidor.');await empresasAdmin()});
    };
  }
  async function comisiones(){
    const [info,empresas]=await Promise.all([api('/comisiones'),api('/empresas')]);const cfg=info.configuraciones;
    const general=cfg.find(c=>c.clave==='comision_porcentaje');
    const opciones=empresas.filter(e=>['distribuidor','ambos'].includes(e.tipo)).map(e=>[id(e),e.razonSocial]);
    render('Configuración de comisiones',panel('Modificar porcentaje',`<form id="comi">${select('tipo','Regla',[['general','General'],['categoria','Por categoría'],['distribuidor','Por distribuidor']])}${input('categoria','Categoría (si aplica)')}${select('distribuidorId','Distribuidor',[['','Seleccione'],...opciones])}${input('porcentaje','Porcentaje',general?.valor||5,'number','step="0.01" min="2" max="10" required')}${input('vigenteDesde','Fecha de entrada en vigor',new Date().toISOString().slice(0,10),'date','required')}<button>Guardar comisión</button></form><p>Prioridad: distribuidor → categoría → general. Una comisión por categoría se pondera por el valor de cada producto del pedido.</p>`)+panel('Configuraciones actuales',tabla(['Clave','Porcentaje','Vigencia'],cfg.map(c=>fil(h(c.clave),`${h(c.valor)} %`,h(c.descripcion)))) )+panel('Historial de cambios',tabla(['Cambio','Porcentaje','Vigente desde','Usuario','Registrado'],info.historial.map(x=>fil(h(x.clave),x.porcentaje+' %',fecha(x.vigenteDesde),h(x.usuarioId?.nombre||'Usuario'),fecha(x.fechaCreacion))))));
    $('#comi').onsubmit=e=>{e.preventDefault();tareas(async()=>{const d=formData(e.target);d.porcentaje=Number(d.porcentaje);await api('/comisiones','PUT',d);aviso('Configuración guardada.');await comisiones()})};
  }
  async function supervisar(){
    const pedidosTodos=await pedidos(),trans=await api('/transacciones');const mapa=new Map(trans.map(t=>[id(t.pedidoId),t]));
    const pintar=()=>{const estadoF=$('[name="estado"]').value,q=$('[name="q"]').value.toLowerCase(),desde=$('[name="desde"]').value,hasta=$('[name="hasta"]').value;
      const registros=pedidosTodos.filter(p=>(!estadoF||p.estado===estadoF)&&(!desde||p.fechaCreacion.slice(0,10)>=desde)&&(!hasta||p.fechaCreacion.slice(0,10)<=hasta)&&(codigo(p)+' '+nom(p.compradorId)+' '+nom(p.distribuidorId)).toLowerCase().includes(q));
      $('#trans-tabla').innerHTML=tabla(['Pedido','Fecha','Comprador','Distribuidor','Importe','Comisión','Estado','Transacción'],registros.map(p=>fil(codigo(p),fecha(p.fechaCreacion),h(nom(p.compradorId)),h(nom(p.distribuidorId)),mx(p.total),mx(p.comisionMonto),h(estado(p.estado)),h(mapa.get(id(p))?.estado||'Sin registro'))));
      $('#trans-total').textContent=`${registros.length} pedidos · ${mx(registros.reduce((s,p)=>s+p.total,0))} · Comisiones: ${mx(registros.reduce((s,p)=>s+p.comisionMonto,0))}`;
    };
    render('Supervisión de transacciones',panel('Filtros de supervisión',`${input('q','Empresa o folio')}${input('desde','Desde','','date')}${input('hasta','Hasta','','date')}${select('estado','Estado',[['','Todos'],...['pendiente','aceptado','en_preparacion','en_camino','entregado','cancelado','rechazado'].map(x=>[x,estado(x)])])}<p id="trans-total"></p><div id="trans-tabla"></div>`));
    $$('input,select').forEach(i=>i.addEventListener('change',pintar));$('[name="q"]').addEventListener('input',pintar);pintar();
  }
  const reportes=[['ventas-por-distribuidor','Ventas por distribuidor'],['compras-por-comprador','Compras por comprador'],['inventario-bajo','Inventario bajo'],['comisiones','Comisiones'],['detalle-pedido/productos-mas-solicitados','Productos más solicitados'],['empresas-activas','Empresas activas']];
  async function reporteAdmin(){
    render('Reportes del sistema',panel('Fechas',`<form id="periodo">${input('desde','Desde','','date')}${input('hasta','Hasta','','date')}<button>Consultar reportes</button>${boton('Exportar informe CSV','csv')}</form>`)+'<div id="reportes-contenido"></div>');
    async function cargar(){let desde=$('[name="desde"]').value,hasta=$('[name="hasta"]').value;const params=new URLSearchParams();if(desde)params.set('desde',desde);if(hasta)params.set('hasta',hasta);const respuesta=await Promise.all(reportes.map(([ruta])=>api('/reportes/'+ruta+'?'+params.toString()).catch(e=>({error:e.message}))));const bloques=respuesta.map((datos,i)=>{if(datos.error)return panel(reportes[i][1],`<p class="error">${h(datos.error)}</p>`);const filas=Array.isArray(datos)?datos:datos.detalle||[datos];const cab=[...new Set(filas.flatMap(x=>Object.keys(x||{})))].filter(c=>!c.startsWith('_'));return panel(reportes[i][1],filas.length?tabla(cab,filas.slice(0,50).map(x=>fil(...cab.map(k=>h(typeof x[k]==='object'?JSON.stringify(x[k]):x[k]))))):vacio('Sin datos en este periodo.'))});$('#reportes-contenido').innerHTML=bloques.join('');window.ultimoReporte=respuesta};
    $('#periodo').onsubmit=e=>{e.preventDefault();tareas(cargar)};area.onclick=e=>{if(e.target.closest('[data-accion="csv"]')){const filas=[];reportes.forEach((r,i)=>{const datos=window.ultimoReporte?.[i];if(Array.isArray(datos))datos.forEach(row=>filas.push({reporte:r[1],...row}))});exportarCsv('reportes.csv',filas)}};await cargar();
  }
  function exportarCsv(nombre,datos){
    if(!datos.length){aviso('No hay registros para exportar.','error');return}
    const cab=[...new Set(datos.flatMap(x=>Object.keys(x)))],val=v=>'"'+String(v??'').replace(/"/g,'""')+'"',texto=[cab.map(val).join(','),...datos.map(x=>cab.map(c=>val(typeof x[c]==='object'?JSON.stringify(x[c]):x[c])).join(','))].join('\r\n');
    const url=URL.createObjectURL(new Blob(['\ufeff'+texto],{type:'text/csv;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download=nombre;a.click();URL.revokeObjectURL(url);
  }
  async function iniciar(){
    try {const funciones={3:inicioComprador,4:busqueda,5:detalleProducto,6:vistaCarrito,7:confirmarCompra,8:mostrarPedido,9:historial,10:()=>perfil(false),11:panelDistribuidor,12:catalogo,13:inventario,14:()=>pedidosDistribuidor(false),15:()=>pedidosDistribuidor(true),16:ventas,17:()=>perfil(true),18:empresasAdmin,19:comisiones,20:supervisar,21:reporteAdmin};await funciones[numero]()}catch(e){render('Error al cargar',panel('No se pudo obtener la información',`<p class="error">${h(e.message)}</p><p>Revisa la conexión con MongoDB y que tu usuario tenga permiso para esta página.</p>${boton('Reintentar','reintentar')}`));area.onclick=e=>{if(e.target.closest('[data-accion="reintentar"]')){area.innerHTML='<p>Cargando...</p>';iniciar()}}}
  }
  iniciar();
})();
