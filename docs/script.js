// ============================================================
// i18n · zh / en toggle
// ============================================================
(function () {
  const STORAGE_KEY = 'kangrui-lang';
  const ATTR_PREFIX = 'data-en-attr-';

  function camel(s) { return s.replace(/-([a-z])/g, (_, c) => c.toUpperCase()); }

  function snapshotZh() {
    document.querySelectorAll('[data-en]').forEach(el => {
      if (!el.hasAttribute('data-zh')) el.setAttribute('data-zh', el.innerHTML);
    });
    document.querySelectorAll('*').forEach(el => {
      Array.from(el.attributes)
        .filter(a => a.name.startsWith(ATTR_PREFIX))
        .forEach(a => {
          const target = a.name.slice(ATTR_PREFIX.length);
          const stash = 'data-zh-attr-' + target;
          if (!el.hasAttribute(stash)) {
            el.setAttribute(stash, el.getAttribute(target) || '');
          }
        });
    });
  }

  function applyLang(lang) {
    const isEn = lang === 'en';
    document.documentElement.lang = isEn ? 'en' : 'zh-CN';
    document.documentElement.setAttribute('data-lang', isEn ? 'en' : 'zh');

    document.querySelectorAll('[data-en]').forEach(el => {
      const en = el.getAttribute('data-en');
      const zh = el.getAttribute('data-zh');
      el.innerHTML = isEn ? en : zh;
    });

    document.querySelectorAll('*').forEach(el => {
      Array.from(el.attributes)
        .filter(a => a.name.startsWith(ATTR_PREFIX))
        .forEach(a => {
          const target = a.name.slice(ATTR_PREFIX.length);
          const zhAttr = el.getAttribute('data-zh-attr-' + target) || '';
          el.setAttribute(target, isEn ? a.value : zhAttr);
        });
    });

    document.querySelectorAll('.nav__lang').forEach(btn => {
      btn.textContent = isEn ? 'EN / 中' : '中 / EN';
      btn.setAttribute('aria-label', isEn ? 'Switch to Chinese' : 'Switch to English');
    });

    try { localStorage.setItem(STORAGE_KEY, isEn ? 'en' : 'zh'); } catch (e) {}
  }

  snapshotZh();
  let saved = 'zh';
  try { saved = localStorage.getItem(STORAGE_KEY) || 'zh'; } catch (e) {}
  applyLang(saved);

  document.addEventListener('click', e => {
    const btn = e.target.closest('.nav__lang');
    if (!btn) return;
    const cur = document.documentElement.getAttribute('data-lang') || 'zh';
    applyLang(cur === 'en' ? 'zh' : 'en');
  });
})();

// Nav background on scroll
const nav = document.getElementById('nav');
const onScroll = () => {
  if (!nav) return;
  if (window.scrollY > 40) nav.classList.add('scrolled');
  else nav.classList.remove('scrolled');
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// Hero video fade-in (only after first frame can play)
(function () {
  const v = document.querySelector('.hero__video');
  if (!v) return;
  const reveal = () => v.classList.add('is-ready');
  if (v.readyState >= 3) reveal();
  else v.addEventListener('canplay', reveal, { once: true });
  // safety fallback: reveal after 1.5s even if canplay didn't fire
  setTimeout(reveal, 1500);
})();

// Scroll reveal
const revealTargets = document.querySelectorAll('.section-title, .about__text, .service, .post, .contact__item, .wechat__card, .hero__stats, .news-card, .insight-card, .news-featured__inner, .editors-pick__head, .series__head, .channel-card, .channels__head, .visit__inner, .inquiry__intro, .inquiry__form, .lawyer-card, .team-stats__inner, .join-us__inner');
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
  const grid = document.getElementById('news-grid')
            || document.getElementById('insight-grid')
            || document.getElementById('team-list');
  if (!grid) return;

  const cards = Array.from(grid.querySelectorAll('.news-card, .insight-card, .lawyer-card'));
  const yearSelect = document.getElementById('year-select');
  const searchInput = document.getElementById('news-search')
                   || document.getElementById('insight-search')
                   || document.getElementById('team-search');
  const emptyEl = document.getElementById('news-empty')
              || document.getElementById('insight-empty')
              || document.getElementById('team-empty');
  const countEl = document.getElementById('team-result-count');
  const sortSelect = document.getElementById('team-sort');

  const state = { kind: 'all', area: 'all', year: 'all', role: 'all', q: '' };

  // Stagger the initial reveal animation a bit on cards
  cards.forEach((el, i) => { el.style.transitionDelay = (i % 6) * 0.06 + 's'; });

  // Team sort (A-Z / Z-A by pinyin)
  if (sortSelect) {
    sortSelect.addEventListener('change', () => { sortTeam(sortSelect.value); });
  }
  function sortTeam(by) {
    if (by === 'default') return; // leave DOM order
    document.querySelectorAll('.team-grid').forEach(g => {
      const items = Array.from(g.children).filter(el => el.matches('.lawyer-card'));
      const pinyin = el => ((el.dataset.name || '').split(/\s+/).pop() || '').toLowerCase();
      items.sort((a, b) => {
        const cmp = pinyin(a).localeCompare(pinyin(b));
        return by === 'name-desc' ? -cmp : cmp;
      });
      items.forEach(i => g.appendChild(i));
    });
  }

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
    if (state.area !== 'all' && card.dataset.area && !card.dataset.area.split(/\s+/).includes(state.area)) return false;
    if (state.year !== 'all' && card.dataset.year !== state.year) return false;
    if (state.role !== 'all' && card.dataset.role !== state.role) return false;
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
    if (countEl) countEl.textContent = visible;

    // Hide group titles whose grid has no visible cards left
    document.querySelectorAll('.team__group-title').forEach(title => {
      let next = title.nextElementSibling;
      while (next && !next.classList.contains('team-grid')) next = next.nextElementSibling;
      if (!next) return;
      const anyVisible = Array.from(next.querySelectorAll('.lawyer-card'))
        .some(c => c.style.display !== 'none');
      title.style.display = anyVisible ? '' : 'none';
    });
    /* TODO: replace with WP REST API
       fetch('/wp-json/wp/v2/posts?categories=18&search=' + encodeURIComponent(state.q) + ...)
       .then(r => r.json()).then(render);
    */
  }
})();
