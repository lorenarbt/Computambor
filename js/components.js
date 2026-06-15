/**
 * PLAYWISE — components.js
 * Injeta header (partials/header.html) e footer (partials/footer.html)
 * em cada página via fetch. Fallback inline para file://.
 */
(function () {

  function getCurrentPage() {
    return document.body.getAttribute('data-page') || '';
  }

  function markActiveLink(currentPage) {
    // sbrc e oficinas são subpáginas de registros
    const activeHref = ['sbrc.html','oficinas.html'].includes(currentPage)
      ? 'registros.html'
      : currentPage;

    document.querySelectorAll('.navbar__links a').forEach(a => {
      a.classList.remove('active');
      if (a.getAttribute('href') === activeHref) a.classList.add('active');
    });
  }

  async function loadPartial(elementId, partialPath, fallbackFn) {
    const target = document.getElementById(elementId);
    if (!target) return;
    try {
      const res = await fetch(partialPath);
      if (res.ok) { target.innerHTML = await res.text(); return; }
    } catch (e) { /* file:// fallback */ }
    target.innerHTML = fallbackFn();
  }

  function navbarHTML() {
    return `
<nav class="navbar" aria-label="Navegação principal">
  <a href="index.html" class="navbar__logo" aria-label="Playwise - início">PLAYWISE</a>
  <ul class="navbar__links" id="nav-links" role="list">
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

  function footerHTML() {
    return `
<footer class="footer">
  <div class="container">
    <div class="footer__inner">
      <div>
        <div class="footer__logo">PLAYWISE</div>
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
      © 2025 PLAYWISE — Educação criativa e divertida. Todos os direitos reservados.
    </p>
  </div>
</footer>`;
  }

  document.addEventListener('DOMContentLoaded', async () => {
    const page = getCurrentPage();
    await loadPartial('pw-navbar', 'partials/header.html', navbarHTML);
    await loadPartial('pw-footer', 'partials/footer.html', footerHTML);
    markActiveLink(page);
  });

})();
