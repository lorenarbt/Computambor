/**
 * PLAYWISE — main.js
 * Componentes JS reutilizáveis: navbar mobile, accordion, lesson links
 */

/* ============================================
   NAVBAR MOBILE TOGGLE
   ============================================ */
function initNavbar() {
  const toggle = document.querySelector('.navbar__toggle');
  const links  = document.querySelector('.navbar__links');
  if (!toggle || !links) return;

  toggle.addEventListener('click', () => {
    const isOpen = links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', isOpen);
    // Animação das barras
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

  // Fechar ao clicar em link
  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      links.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ============================================
   ACCORDION DE MÓDULOS
   ============================================ */
function initModuleAccordion() {
  document.querySelectorAll('.module__header').forEach(header => {
    header.addEventListener('click', () => {
      const module = header.closest('.module');
      const wasActive = module.classList.contains('active');

      // Fecha todos
      document.querySelectorAll('.module').forEach(m => m.classList.remove('active'));

      // Abre o clicado, exceto se já estava aberto
      if (!wasActive) {
        module.classList.add('active');
      }
    });
  });
}

/* ============================================
   LINKS DE AULAS (Google Drive)
   ============================================ */
function initLessonLinks() {
  document.querySelectorAll('.lesson-item[data-link]').forEach(item => {
    item.addEventListener('click', (e) => {
      e.stopPropagation();
      const link = item.getAttribute('data-link');

      if (link && !link.includes('SEU_LINK_AQUI') && link !== '#') {
        window.open(link, '_blank', 'noopener,noreferrer');
      } else {
        showToast('Configure o link real do Google Drive neste item.');
      }
    });

    // Acessibilidade: teclado
    item.setAttribute('role', 'button');
    item.setAttribute('tabindex', '0');
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        item.click();
      }
    });
  });
}

/* ============================================
   TOAST (feedback não-intrusivo)
   ============================================ */
function showToast(msg) {
  const existing = document.querySelector('.pw-toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'pw-toast';
  toast.textContent = msg;
  Object.assign(toast.style, {
    position:     'fixed',
    bottom:       '24px',
    left:         '50%',
    transform:    'translateX(-50%)',
    background:   '#1E2A3E',
    color:        '#fff',
    padding:      '12px 24px',
    borderRadius: '9999px',
    fontSize:     '0.875rem',
    fontWeight:   '600',
    boxShadow:    '0 4px 20px rgba(0,0,0,0.2)',
    zIndex:       '9999',
    opacity:      '0',
    transition:   'opacity 0.2s ease',
  });

  document.body.appendChild(toast);
  requestAnimationFrame(() => { toast.style.opacity = '1'; });
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 200);
  }, 3000);
}

/* ============================================
   INICIALIZAÇÃO
   ============================================ */
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initModuleAccordion();
  initLessonLinks();
});

/* ============================================
   CARROSSEL GENÉRICO
   Funciona para qualquer .carousel na página
   ============================================ */
function initCarousels() {
  document.querySelectorAll('.carousel').forEach(carousel => {
    const track  = carousel.querySelector('.carousel__track');
    const slides = carousel.querySelectorAll('.carousel__slide');
    const btnPrev = carousel.querySelector('.carousel__btn--prev');
    const btnNext = carousel.querySelector('.carousel__btn--next');
    const dotsContainer = carousel.querySelector('.carousel__dots');

    if (!track || slides.length === 0) return;

    let current = 0;
    let autoTimer = null;
    const total = slides.length;

    // Cria dots
    if (dotsContainer) {
      slides.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.className = 'carousel__dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('aria-label', `Slide ${i + 1}`);
        dot.addEventListener('click', () => goTo(i));
        dotsContainer.appendChild(dot);
      });
    }

    function updateDots() {
      if (!dotsContainer) return;
      dotsContainer.querySelectorAll('.carousel__dot').forEach((d, i) => {
        d.classList.toggle('active', i === current);
      });
    }

    function goTo(index) {
      current = (index + total) % total;
      track.style.transform = `translateX(-${current * 100}%)`;
      updateDots();
    }

    function next() { goTo(current + 1); }
    function prev() { goTo(current - 1); }

    if (btnNext) btnNext.addEventListener('click', () => { next(); resetAuto(); });
    if (btnPrev) btnPrev.addEventListener('click', () => { prev(); resetAuto(); });

    // Touch swipe
    let touchStartX = 0;
    carousel.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    carousel.addEventListener('touchend', e => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) { diff > 0 ? next() : prev(); resetAuto(); }
    });

    // Teclado
    carousel.setAttribute('tabindex', '0');
    carousel.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight') { next(); resetAuto(); }
      if (e.key === 'ArrowLeft')  { prev(); resetAuto(); }
    });

    // Auto-play
    const interval = parseInt(carousel.getAttribute('data-interval') || '4500');
    function startAuto() { autoTimer = setInterval(next, interval); }
    function resetAuto() { clearInterval(autoTimer); startAuto(); }

    startAuto();
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initCarousels();
});
