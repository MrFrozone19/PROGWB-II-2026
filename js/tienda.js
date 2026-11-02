function mostrarMensajeTienda(mensaje, tipo = 'exito') {
  if (typeof mostrarAviso === 'function') {
    mostrarAviso(mensaje, tipo);
  }
}

function filtrarResultados() {
  const campo = document.querySelector('body.pantalla-04 .barra input');
  const filas = document.querySelectorAll('body.pantalla-04 .contenido > .fila');
  if (!campo || filas.length === 0) return;

  const termino = campo.value.trim().toLowerCase();
  let visibles = 0;

  filas.forEach((fila) => {
    const coincide = fila.textContent.toLowerCase().includes(termino);
    fila.hidden = !coincide;
    if (coincide) visibles += 1;
  });

  const resumen = document.querySelector('body.pantalla-04 .resumen p');
  if (resumen) {
    resumen.textContent = `${visibles} resultados para "${campo.value.trim() || 'todos los productos'}" en un radio de 15 km`;
  }

  if (visibles === 0) {
    mostrarMensajeTienda('No se encontraron productos con ese nombre.', 'error');
  }
}

function prepararBuscadorResultados() {
  const campo = document.querySelector('body.pantalla-04 .barra input');
  const boton = document.querySelector('body.pantalla-04 .barra button');
  if (!campo || !boton) return;

  boton.addEventListener('click', (evento) => {
    evento.preventDefault();
    filtrarResultados();
  });

  campo.addEventListener('keydown', (evento) => {
    if (evento.key === 'Enter') {
      evento.preventDefault();
      filtrarResultados();
    }
  });
}

function prepararAjustesInventario() {
  document.querySelectorAll('body.pantalla-13 .ajuste').forEach((ajuste) => {
    const campo = ajuste.querySelector('input');
    const botones = ajuste.querySelectorAll('button');
    if (!campo || botones.length < 2) return;

    botones[0].addEventListener('click', () => {
      campo.value = Math.max(0, Number(campo.value || 0) - 1);
      campo.dispatchEvent(new Event('change', { bubbles: true }));
    });

    botones[1].addEventListener('click', () => {
      campo.value = Number(campo.value || 0) + 1;
      campo.dispatchEvent(new Event('change', { bubbles: true }));
    });

    campo.addEventListener('change', () => {
      const fila = campo.closest('tr');
      if (!fila) return;
      const actual = Number(fila.querySelector('.alerta-bajo, .alerta-medio')?.textContent || 0);
      const delta = Number(campo.value || 0) - actual;
      const etiqueta = ajuste.querySelector('.delta');
      if (etiqueta) {
        etiqueta.textContent = `${delta > 0 ? '+' : ''}${delta}`;
        etiqueta.hidden = delta === 0;
      }
      fila.classList.toggle('editada', delta !== 0);
    });
  });

}

function prepararCarrito() {
  if (!document.body.classList.contains('pantalla-06')) return;

  const contenedor = document.querySelector('.izq');
  const resumen = document.querySelector('.der');
  if (!contenedor || !resumen) return;

  function actualizarTotales() {
    let productos = 0;
    let distribuidores = 0;
    let total = 0;

    contenedor.querySelectorAll('.grupo').forEach((grupo) => {
      const filas = [...grupo.querySelectorAll('table tr')].filter((fila) => fila.querySelector('td'));
      let subtotal = 0;

      filas.forEach((fila) => {
        const celdas = fila.querySelectorAll('td');
        if (celdas.length < 5) return;
        const cantidad = celdas[1].querySelector('input');
        const unidades = Math.max(1, Number(cantidad?.value || 1));
        const precio = Number(celdas[2].textContent.replace(/[^\d.]/g, '')) || 0;
        const importe = unidades * precio;
        if (cantidad) cantidad.value = unidades;
        celdas[3].textContent = importe.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });
        subtotal += importe;
        productos += 1;
      });

      const importeGrupo = grupo.querySelector('.subtotal strong');
      if (importeGrupo) {
        importeGrupo.textContent = subtotal.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });
      }

      if (filas.length > 0) distribuidores += 1;
      total += subtotal;
    });

    const lineas = resumen.querySelectorAll('.linea');
    if (lineas[0]) lineas[0].lastElementChild.textContent = String(productos);
    if (lineas[1]) lineas[1].lastElementChild.textContent = String(distribuidores);
    if (lineas[2]) lineas[2].lastElementChild.textContent = String(distribuidores);
    if (lineas[3]) lineas[3].lastElementChild.textContent = total.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });

    const totalElemento = resumen.querySelector('.total span:last-child');
    if (totalElemento) totalElemento.textContent = total.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });

    const enlaceCarrito = document.querySelector('.nav a[href="06-carrito.html"]');
    if (enlaceCarrito) enlaceCarrito.textContent = `Mi carrito (${productos})`;
  }

  contenedor.addEventListener('input', (evento) => {
    if (evento.target.matches('input[type="number"]')) actualizarTotales();
  });

  contenedor.addEventListener('click', (evento) => {
    const quitar = evento.target.closest('.quitar');
    if (!quitar) return;
    evento.preventDefault();
    const fila = quitar.closest('tr');
    if (fila) fila.remove();
    contenedor.querySelectorAll('.grupo').forEach((grupo) => {
      const filas = grupo.querySelectorAll('table tr td');
      if (filas.length === 0) grupo.remove();
    });
    actualizarTotales();
    mostrarMensajeTienda('Producto eliminado del carrito.');
  });

  const vaciar = document.querySelector('.vaciar');
  if (vaciar) {
    vaciar.addEventListener('click', () => {
      contenedor.querySelectorAll('.grupo').forEach((grupo) => {
        grupo.querySelectorAll('table tr').forEach((fila) => {
          if (fila.querySelector('td')) fila.remove();
        });
        const subtotal = grupo.querySelector('.subtotal strong');
        if (subtotal) subtotal.textContent = '$0.00';
      });
      actualizarTotales();
      mostrarMensajeTienda('El carrito quedó vacío.');
    });
  }

  actualizarTotales();
}

function prepararCantidadProducto() {
  if (!document.body.classList.contains('pantalla-05')) return;

  const campo = document.querySelector('.compra input[type="number"]');
  const boton = document.querySelector('.compra .btn');
  const error = document.querySelector('.ficha .msg-error');
  const existencia = document.querySelector('.existencia-disponible');
  if (!campo || !boton || !error || !existencia) return;

  function validarCantidad() {
    const maximo = Number((existencia.textContent.match(/\d+/) || [0])[0]);
    const cantidad = Number(campo.value || 0);
    const invalida = cantidad < 1 || cantidad > maximo;
    error.hidden = !invalida;
    boton.disabled = invalida;
    if (invalida) {
      error.textContent = `La cantidad debe estar entre 1 y ${maximo} piezas.`;
    }
  }

  campo.addEventListener('input', validarCantidad);
  validarCantidad();
}

function prepararBotonesDeMuestra() {
  document.querySelectorAll('button:not([data-ir]):not([data-aviso]):not([type="submit"])').forEach((boton) => {
    if (boton.classList.contains('ajuste')) return;
    const texto = boton.textContent.trim().toLowerCase();
    if (!texto) return;

    if (texto.includes('aprobar')) {
      boton.addEventListener('click', () => mostrarMensajeTienda('La aprobación se muestra como demostración. Falta conectar esta acción al backend.'));
    } else if (texto.includes('rechazar')) {
      boton.addEventListener('click', () => mostrarMensajeTienda('El rechazo se muestra como demostración. Falta conectar esta acción al backend.'));
    } else if (texto.includes('guardar')) {
      boton.addEventListener('click', () => mostrarMensajeTienda('Los cambios se muestran como demostración. Falta conectar esta acción al backend.'));
    } else if (texto.includes('filtrar') || texto.includes('generar reporte') || texto.includes('exportar')) {
      boton.addEventListener('click', () => mostrarMensajeTienda('Esta opción utiliza datos de demostración en esta versión.'));
    } else if (texto.includes('actualizar estatus') || texto.includes('aceptar pedido')) {
      boton.addEventListener('click', () => mostrarMensajeTienda('Esta operación requiere conexión con el backend.'));
    }
  });
}

prepararBuscadorResultados();
prepararAjustesInventario();
prepararCarrito();
prepararCantidadProducto();
prepararBotonesDeMuestra();
