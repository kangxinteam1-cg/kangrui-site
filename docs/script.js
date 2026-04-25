// Nav background on scroll
const nav = document.getElementById('nav');
const onScroll = () => {
  if (!nav) return;
  if (window.scrollY > 40) nav.classList.add('scrolled');
  else nav.classList.remove('scrolled');
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// Scroll reveal
const revealTargets = document.querySelectorAll('.section-title, .about__text, .service, .post, .contact__item, .wechat__card, .hero__stats, .news-card, .insight-card, .news-featured__inner, .editors-pick__head, .series__head, .channel-card, .channels__head, .visit__inner, .inquiry__intro, .inquiry__form');
revealTargets.forEach(el => el.classList.add('reveal'));
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.15 });
revealTargets.forEach(el => io.observe(el));

// Stagger service cards
document.querySelectorAll('.service').forEach((el, i) => {
  el.style.transitionDelay = (i * 0.08) + 's';
});
document.querySelectorAll('.post').forEach((el, i) => {
  el.style.transitionDelay = (i * 0.1) + 's';
});

// Count-up stats
const statNums = document.querySelectorAll('.stat__num');
const animateCount = (el) => {
  const text = el.textContent.trim();
  const suffix = el.dataset.suffix || '';
  const target = parseFloat(text);
  if (isNaN(target)) return;
  const isDecimal = text.includes('.');
  const decimals = isDecimal ? (text.split('.')[1].length) : 0;
  const duration = 1600;
  const start = performance.now();
  const tick = (now) => {
    const p = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    const cur = target * eased;
    el.textContent = cur.toFixed(decimals) + suffix;
    if (p < 1) requestAnimationFrame(tick);
    else el.textContent = target.toFixed(decimals) + suffix;
  };
  requestAnimationFrame(tick);
};
const statIO = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      animateCount(e.target);
      statIO.unobserve(e.target);
    }
  });
}, { threshold: 0.6 });
statNums.forEach(el => statIO.observe(el));

// ============================================================
// News & Insights · filter / search
// ============================================================
(function () {
  const grid = document.getElementById('news-grid') || document.getElementById('insight-grid');
  if (!grid) return;

  const cards = Array.from(grid.children).filter(el => el.matches('.news-card, .insight-card'));
  const yearSelect = document.getElementById('year-select');
  const searchInput = document.getElementById('news-search') || document.getElementById('insight-search');
  const emptyEl = document.getElementById('news-empty') || document.getElementById('insight-empty');

  const state = { kind: 'all', area: 'all', year: 'all', q: '' };

  // Stagger the initial reveal animation a bit on cards
  cards.forEach((el, i) => { el.style.transitionDelay = (i % 6) * 0.06 + 's'; });

  // Chip groups (single-select per group)
  document.querySelectorAll('.filter-bar__group').forEach(group => {
    const key = group.dataset.filter;
    group.addEventListener('click', e => {
      const chip = e.target.closest('.chip--filter');
      if (!chip) return;
      group.querySelectorAll('.chip--filter').forEach(c => c.classList.remove('is-active'));
      chip.classList.add('is-active');
      state[key] = chip.dataset.value;
      apply();
    });
  });

  if (yearSelect) yearSelect.addEventListener('change', () => { state.year = yearSelect.value; apply(); });

  let searchTimer;
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      clearTimeout(searchTimer);
      searchTimer = setTimeout(() => {
        state.q = searchInput.value.trim().toLowerCase();
        apply();
      }, 220);
    });
  }

  function matches(card) {
    if (state.kind !== 'all' && card.dataset.kind !== state.kind) return false;
    if (state.area !== 'all' && card.dataset.area !== state.area) return false;
    if (state.year !== 'all' && card.dataset.year !== state.year) return false;
    if (state.q) {
      const text = card.textContent.toLowerCase();
      if (!text.includes(state.q)) return false;
    }
    return true;
  }

  function apply() {
    let visible = 0;
    cards.forEach(card => {
      const ok = matches(card);
      card.style.display = ok ? '' : 'none';
      if (ok) visible++;
    });
    if (emptyEl) emptyEl.classList.toggle('is-visible', visible === 0);
    /* TODO: replace with WP REST API
       fetch('/wp-json/wp/v2/posts?categories=18&search=' + encodeURIComponent(state.q) + ...)
       .then(r => r.json()).then(render);
    */
  }
})();
