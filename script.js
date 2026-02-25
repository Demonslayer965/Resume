/* ── Active nav link on scroll ─────────────────────────────────── */
const sections  = document.querySelectorAll('main section[id]');
const navLinks  = document.querySelectorAll('.nav-link');

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navLinks.forEach((link) => {
          link.classList.toggle(
            'active',
            link.getAttribute('href') === '#' + entry.target.id
          );
        });
      }
    });
  },
  { rootMargin: '-40% 0px -55% 0px' }
);

sections.forEach((s) => sectionObserver.observe(s));

/* ── Reveal on scroll ──────────────────────────────────────────── */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // stagger siblings inside the same parent
        const siblings = entry.target.parentElement.querySelectorAll('.reveal');
        siblings.forEach((el, idx) => {
          if (!el.classList.contains('visible')) {
            setTimeout(() => el.classList.add('visible'), idx * 60);
          }
        });
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1 }
);

document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

/* ── Mobile nav toggle ─────────────────────────────────────────── */
const toggle   = document.querySelector('.nav-toggle');
const navUl    = document.querySelector('.nav-links');
const dlBtn    = document.querySelector('.btn-download');

toggle.addEventListener('click', () => {
  const open = navUl.classList.toggle('open');
  if (dlBtn) dlBtn.style.display = open ? 'block' : '';
  toggle.setAttribute('aria-expanded', open);
});

// close mobile menu when a link is clicked
navUl.querySelectorAll('a').forEach((a) => {
  a.addEventListener('click', () => {
    navUl.classList.remove('open');
    if (dlBtn) dlBtn.style.display = '';
  });
});
