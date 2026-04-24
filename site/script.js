// Nav background on scroll
const nav = document.getElementById('nav');
const onScroll = () => {
  if (window.scrollY > 40) nav.classList.add('scrolled');
  else nav.classList.remove('scrolled');
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// Scroll reveal
const revealTargets = document.querySelectorAll('.section-title, .about__text, .service, .post, .contact__item, .wechat__card, .hero__stats');
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
