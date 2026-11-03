(() => {
  const claveTema = 'enlaceB2B.tema';
  const iconos = {
    luna: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.8 14.1A8.5 8.5 0 0 1 9.9 3.2 8.7 8.7 0 1 0 20.8 14.1Z"/></svg>',
    sol: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.65 17.65l1.42 1.42M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.65 6.35l1.42-1.42"/></svg>'
  };

  function leerTema() {
    try {
      return localStorage.getItem(claveTema) === 'dark' ? 'dark' : 'light';
    } catch {
      return 'light';
    }
  }

  function aplicarTema(tema) {
    document.documentElement.dataset.theme = tema;
    document.documentElement.style.colorScheme = tema;
    try {
      localStorage.setItem(claveTema, tema);
    } catch {}
  }

  function actualizarBotones() {
    const oscuro = document.documentElement.dataset.theme === 'dark';
    document.querySelectorAll('[data-theme-toggle]').forEach((boton) => {
      boton.innerHTML = oscuro ? `${iconos.sol}<span>Claro</span>` : `${iconos.luna}<span>Oscuro</span>`;
      boton.setAttribute('aria-label', oscuro ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro');
      boton.setAttribute('title', oscuro ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro');
      boton.setAttribute('aria-pressed', String(oscuro));
    });
  }

  aplicarTema(leerTema());

  document.addEventListener('click', (evento) => {
    const boton = evento.target.closest('[data-theme-toggle]');
    if (!boton) return;
    aplicarTema(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark');
    actualizarBotones();
  });

  document.addEventListener('DOMContentLoaded', actualizarBotones);
})();
