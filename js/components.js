/**
 * COMPUTAMBOR — components.js
 * Responsabilidades:
 *  1. Injetar navbar e footer (fetch com fallback inline)
 *  2. Marcar link ativo
 *  3. Inicializar hamburguer mobile (vive aqui pois depende da injeção)
 */
(function () {

  /* ── Página atual ─────────────────────────────── */
  function getCurrentPage() {
    return document.body.getAttribute('data-page') || '';
  }

  /* ── Link ativo (sbrc/oficinas herdam "registros") */
  function markActiveLink(currentPage) {
    const activeHref = ['sbrc.html', 'oficinas.html'].includes(currentPage)
      ? 'registros.html'
      : currentPage;
    document.querySelectorAll('.navbar__links a').forEach(a => {
      a.classList.remove('active');
      if (a.getAttribute('href') === activeHref) a.classList.add('active');
    });
  }

  /* ── Hamburguer ───────────────────────────────── */
  function initHamburguer() {
    const toggle = document.querySelector('.navbar__toggle');
    const links  = document.querySelector('.navbar__links');
    if (!toggle || !links) return;

    toggle.addEventListener('click', () => {
      const isOpen = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(isOpen));

      const bars = toggle.querySelectorAll('span');
      if (isOpen) {
        bars[0].style.transform = 'translateY(7px) rotate(45deg)';
        bars[1].style.opacity   = '0';
        bars[2].style.transform = 'translateY(-7px) rotate(-45deg)';
      } else {
        bars[0].style.transform = '';
        bars[1].style.opacity   = '';
        bars[2].style.transform = '';
      }
    });

    links.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        links.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        const bars = toggle.querySelectorAll('span');
        bars[0].style.transform = '';
        bars[1].style.opacity   = '';
        bars[2].style.transform = '';
      });
    });
  }

  /* ── Carrega partial (fetch → fallback inline) ── */
  async function loadPartial(elementId, partialPath, fallbackFn) {
    const target = document.getElementById(elementId);
    if (!target) return;
    try {
      const res = await fetch(partialPath);
      if (res.ok) {
        target.innerHTML = await res.text();
        return;
      }
    } catch (_) { /* file:// → usa fallback */ }
    target.innerHTML = fallbackFn();
  }

  /* ── HTML inline da navbar ────────────────────── */
  function navbarHTML() {
    return `
<nav class="navbar" aria-label="Navegação principal">
  <a href="index.html" class="navbar__logo" aria-label="COMPUTAMBOR - início">COMPUTAMBOR</a>
  <ul class="navbar__links" role="list">
    <li><a href="index.html">Home</a></li>
    <li><a href="sobrenos.html">Sobre nós</a></li>
    <li><a href="registros.html">Registros</a></li>
    <li><a href="atividades.html">Atividades</a></li>
    <li><a href="contatenos.html">Contate-nos</a></li>
  </ul>
  <button class="navbar__toggle" aria-label="Abrir menu" aria-expanded="false">
    <span></span><span></span><span></span>
  </button>
</nav>`;
  }

  /* ── HTML inline do footer ────────────────────── */
  function footerHTML() {
    return `
<footer class="footer">
  <div class="container">
    <div class="footer__inner">
      <div>
        <div class="footer__logo">COMPUTAMBOR</div>
        <p class="footer__tagline">Transformando educação em aventura para mentes curiosas.</p>
      </div>
      <div>
        <p class="footer__col-title">Links rápidos</p>
        <ul class="footer__links">
          <li><a href="index.html">Home</a></li>
          <li><a href="sobrenos.html">Sobre nós</a></li>
          <li><a href="atividades.html">Atividades</a></li>
          <li><a href="registros.html">Registros</a></li>
          <li><a href="contatenos.html">Contate-nos</a></li>
        </ul>
      </div>
      <div>
        <p class="footer__col-title">Redes sociais</p>
        <div class="footer__socials">
          <a href="#" aria-label="Instagram"><i class="fab fa-instagram"></i></a>
          <a href="#" aria-label="Facebook"><i class="fab fa-facebook"></i></a>
          <a href="#" aria-label="YouTube"><i class="fab fa-youtube"></i></a>
        </div>
      </div>
    </div>
    <p class="footer__copyright">
      © 2025 COMPUTAMBOR — Educação criativa e divertida. Todos os direitos reservados.
    </p>
  </div>
</footer>`;
  }

  /* ── Boot ─────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', async () => {
    const page = getCurrentPage();

    await loadPartial('pw-navbar', 'partials/header.html', navbarHTML);
    await loadPartial('pw-footer', 'partials/footer.html', footerHTML);

    // Roda APÓS o HTML da navbar estar no DOM
    markActiveLink(page);
    initHamburguer();
  });

})();
