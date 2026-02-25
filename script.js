/* ═══════════════════════════════════════════════════════════════
   CURSOR SPOTLIGHT
═══════════════════════════════════════════════════════════════ */
const spotlight = document.getElementById('spotlight');
document.addEventListener('mousemove', (e) => {
  spotlight.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
});

/* ═══════════════════════════════════════════════════════════════
   PARTICLE CANVAS
═══════════════════════════════════════════════════════════════ */
(function initParticles() {
  const canvas = document.getElementById('particles');
  const ctx    = canvas.getContext('2d');
  let W, H, particles, mouse = { x: -9999, y: -9999 };
  const COUNT = 80, MAX_DIST = 130, MOUSE_DIST = 100;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function Particle() {
    this.reset = function() {
      this.x  = Math.random() * W;
      this.y  = Math.random() * H;
      this.vx = (Math.random() - .5) * .45;
      this.vy = (Math.random() - .5) * .45;
      this.r  = Math.random() * 1.8 + .6;
      this.alpha = Math.random() * .5 + .2;
    };
    this.reset();
  }

  function init() {
    resize();
    particles = Array.from({ length: COUNT }, () => new Particle());
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // move
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;

      // mouse repel
      const dx = p.x - mouse.x, dy = p.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < MOUSE_DIST) {
        const force = (MOUSE_DIST - dist) / MOUSE_DIST * .8;
        p.x += (dx / dist) * force * 2;
        p.y += (dy / dist) * force * 2;
      }
    });

    // lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MAX_DIST) {
          const opacity = (1 - dist / MAX_DIST) * .18;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(0, 212, 255, ${opacity})`;
          ctx.lineWidth = .6;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    // dots
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 212, 255, ${p.alpha})`;
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }

  const heroSection = document.getElementById('hero');
  heroSection.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });
  heroSection.addEventListener('mouseleave', () => { mouse.x = -9999; mouse.y = -9999; });

  window.addEventListener('resize', () => { resize(); });

  init();
  draw();
})();

/* ═══════════════════════════════════════════════════════════════
   TYPEWRITER
═══════════════════════════════════════════════════════════════ */
(function initTypewriter() {
  const el = document.getElementById('typewriter');
  const phrases = [
    'Cloud Engineer',
    'Security Engineer',
    'DevSecOps Architect',
    'AI Infrastructure Engineer',
    'Multi-Cloud Specialist',
  ];
  let pi = 0, ci = 0, deleting = false;
  const SPEED_TYPE = 70, SPEED_DEL = 35, PAUSE = 1800;

  function tick() {
    const phrase = phrases[pi];
    if (!deleting) {
      el.textContent = phrase.slice(0, ++ci);
      if (ci === phrase.length) {
        deleting = true;
        setTimeout(tick, PAUSE);
        return;
      }
      setTimeout(tick, SPEED_TYPE);
    } else {
      el.textContent = phrase.slice(0, --ci);
      if (ci === 0) {
        deleting = false;
        pi = (pi + 1) % phrases.length;
        setTimeout(tick, 400);
        return;
      }
      setTimeout(tick, SPEED_DEL);
    }
  }
  setTimeout(tick, 600);
})();

/* ═══════════════════════════════════════════════════════════════
   COUNTER ANIMATION
═══════════════════════════════════════════════════════════════ */
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 1600;
  const start = performance.now();
  function step(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // easeOutCubic
    const ease = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(ease * target);
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target;
  }
  requestAnimationFrame(step);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !entry.target.dataset.counted) {
      entry.target.dataset.counted = '1';
      animateCounter(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.counter').forEach(el => counterObserver.observe(el));

/* ═══════════════════════════════════════════════════════════════
   REVEAL ON SCROLL
═══════════════════════════════════════════════════════════════ */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // stagger siblings
      const siblings = entry.target.parentElement.querySelectorAll('.reveal');
      siblings.forEach((el, idx) => {
        if (!el.classList.contains('visible')) {
          const base = parseInt(el.style.getPropertyValue('--delay')) || 0;
          setTimeout(() => el.classList.add('visible'), base + idx * 40);
        }
      });
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ═══════════════════════════════════════════════════════════════
   ACTIVE NAV ON SCROLL
═══════════════════════════════════════════════════════════════ */
const sections = document.querySelectorAll('main section[id]');
const navLinks  = document.querySelectorAll('.nav-link');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.classList.toggle('active',
          link.getAttribute('href') === '#' + entry.target.id);
      });
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(s => sectionObserver.observe(s));

/* ═══════════════════════════════════════════════════════════════
   MOBILE NAV
═══════════════════════════════════════════════════════════════ */
const toggle  = document.getElementById('navToggle');
const navUl   = document.getElementById('navLinks');

toggle.addEventListener('click', () => {
  const open = navUl.classList.toggle('open');
  toggle.setAttribute('aria-expanded', open);
});

navUl.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => navUl.classList.remove('open'));
});

/* ═══════════════════════════════════════════════════════════════
   SKILL CARD SHIMMER ON HOVER (tilt effect)
═══════════════════════════════════════════════════════════════ */
document.querySelectorAll('.skill-card, .cert-card, .stat-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width  - .5) * 10;
    const y = ((e.clientY - rect.top)  / rect.height - .5) * 10;
    card.style.transform = `perspective(600px) rotateX(${-y}deg) rotateY(${x}deg) translateY(-3px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});
