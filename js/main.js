// Pesta Rakyat 2026 — interaksi ringan
document.documentElement.classList.add('js');

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ---------- Muncul saat di-scroll ----------
const revealEls = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window && !reduceMotion) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  revealEls.forEach((el) => io.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add('is-visible'));
}

// ---------- Parallax awan di hero ----------
const hero = document.querySelector('.hero');
const clouds = hero ? hero.querySelectorAll('.float') : [];

if (clouds.length && !reduceMotion) {
  let ticking = false;

  const update = () => {
    const scrolled = Math.min(window.scrollY, hero.offsetHeight);
    clouds.forEach((cloud, i) => {
      const speed = i % 2 ? 0.12 : 0.2;
      cloud.style.setProperty('--py', `${scrolled * speed}px`);
    });
    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  }, { passive: true });
}

// ---------- Menu drawer ----------
const menuBtn = document.querySelector('.menu-btn');
const drawer = document.getElementById('menu-drawer');
const backdrop = document.querySelector('.drawer-backdrop');
const closeBtn = drawer ? drawer.querySelector('.drawer__close') : null;

const openMenu = () => {
  backdrop.hidden = false;
  requestAnimationFrame(() => backdrop.classList.add('is-open'));
  drawer.classList.add('is-open');
  drawer.setAttribute('aria-hidden', 'false');
  menuBtn.setAttribute('aria-expanded', 'true');
  document.body.classList.add('menu-open');
  closeBtn.focus();
};

const closeMenu = ({ returnFocus = true } = {}) => {
  backdrop.classList.remove('is-open');
  drawer.classList.remove('is-open');
  drawer.setAttribute('aria-hidden', 'true');
  menuBtn.setAttribute('aria-expanded', 'false');
  document.body.classList.remove('menu-open');
  setTimeout(() => { backdrop.hidden = true; }, 300);
  if (returnFocus) menuBtn.focus();
};

if (menuBtn && drawer) {
  menuBtn.addEventListener('click', openMenu);
  closeBtn.addEventListener('click', () => closeMenu());
  backdrop.addEventListener('click', () => closeMenu());

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('is-open')) closeMenu();
  });

  // klik link menu: tutup drawer lalu scroll ke konten tujuan
  drawer.querySelectorAll('.drawer__list a').forEach((link) => {
    link.addEventListener('click', () => closeMenu({ returnFocus: false }));
  });
}

// ---------- Loader: awan membelah saat halaman selesai dimuat ----------
const loader = document.querySelector('.loader');

if (loader) {
  const MIN_SHOW = 1200; // ms, supaya animasi sempat terlihat walau loading cepat
  let opened = false;

  const openLoader = () => {
    if (opened) return;
    opened = true;
    const wait = Math.max(0, MIN_SHOW - performance.now());

    setTimeout(() => {
      loader.classList.add('is-open');
      document.documentElement.classList.remove('is-loading');
      setTimeout(() => loader.remove(), reduceMotion ? 0 : 2200);
    }, wait);
  };

  if (document.readyState === 'complete') openLoader();
  else window.addEventListener('load', openLoader, { once: true });

  // jaga-jaga kalau ada gambar yang lama sekali dimuat
  setTimeout(openLoader, 8000);
}
