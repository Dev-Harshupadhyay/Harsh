/* ============================================================
   PARTICLE CONSTELLATION BACKGROUND (mouse/touch reactive)
   ============================================================ */
(function () {
  const canvas = document.getElementById('particle-canvas');
  const ctx = canvas.getContext('2d');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let width, height, particles = [];
  const pointer = { x: null, y: null, active: false };

  function isMobile() { return window.innerWidth < 768; }

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  function initParticles() {
    const count = isMobile() ? 34 : 70;
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 1.6 + 0.6
    }));
  }

  const LINK_DIST = isMobile() ? 100 : 140;
  const POINTER_DIST = 160;

  function step() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      if (!prefersReducedMotion) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
      }

      // link to nearby particles
      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        const dx = p.x - q.x, dy = p.y - q.y;
        const dist = Math.hypot(dx, dy);
        if (dist < LINK_DIST) {
          ctx.strokeStyle = `rgba(0, 242, 254, ${0.14 * (1 - dist / LINK_DIST)})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.stroke();
        }
      }

      // link to pointer
      if (pointer.active) {
        const dx = p.x - pointer.x, dy = p.y - pointer.y;
        const dist = Math.hypot(dx, dy);
        if (dist < POINTER_DIST) {
          ctx.strokeStyle = `rgba(121, 40, 202, ${0.35 * (1 - dist / POINTER_DIST)})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(pointer.x, pointer.y);
          ctx.stroke();
        }
      }

      ctx.beginPath();
      ctx.fillStyle = 'rgba(238, 241, 248, 0.55)';
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }

    requestAnimationFrame(step);
  }

  resize();
  initParticles();
  step();

  window.addEventListener('resize', () => { resize(); initParticles(); });
  window.addEventListener('mousemove', (e) => {
    pointer.x = e.clientX; pointer.y = e.clientY; pointer.active = true;
  });
  window.addEventListener('mouseleave', () => { pointer.active = false; });
  window.addEventListener('touchmove', (e) => {
    if (e.touches[0]) {
      pointer.x = e.touches[0].clientX;
      pointer.y = e.touches[0].clientY;
      pointer.active = true;
    }
  }, { passive: true });
  window.addEventListener('touchend', () => { pointer.active = false; });
})();

/* ============================================================
   NAVBAR: scroll shadow + mobile toggle
   ============================================================ */
(function () {
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.querySelector('.nav-links');

  window.addEventListener('scroll', () => {
    navbar.style.background = window.scrollY > 30
      ? 'rgba(15, 23, 42, 0.85)'
      : 'rgba(15, 23, 42, 0.55)';
  });

  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    navToggle.classList.toggle('active');
  });

  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.classList.remove('active');
    });
  });
})();

/* ============================================================
   SCROLL REVEAL (Intersection Observer)
   ============================================================ */
(function () {
  const revealEls = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(el => observer.observe(el));
})();

/* ============================================================
   ANIMATED METRIC COUNTERS
   ============================================================ */
(function () {
  const counters = document.querySelectorAll('.metric-number');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.target, 10);
      const suffix = el.dataset.suffix || '';
      const duration = 1200;
      const start = performance.now();

      function tick(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * target) + suffix;
        if (progress < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
      observer.unobserve(el);
    });
  }, { threshold: 0.4 });
  counters.forEach(el => observer.observe(el));
})();

/* ============================================================
   3D PERSPECTIVE TILT — project cards (mouse + touch)
   ============================================================ */
(function () {
  const cards = document.querySelectorAll('.tilt-card');
  const MAX_TILT = 8;

  cards.forEach(card => {
    function handleMove(clientX, clientY) {
      const rect = card.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      const px = (x / rect.width) - 0.5;
      const py = (y / rect.height) - 0.5;

      card.style.transform =
        `perspective(1000px) rotateX(${(-py * MAX_TILT).toFixed(2)}deg) rotateY(${(px * MAX_TILT).toFixed(2)}deg) translateY(-4px)`;
    }

    function reset() {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
    }

    card.addEventListener('mousemove', (e) => handleMove(e.clientX, e.clientY));
    card.addEventListener('mouseleave', reset);
    card.addEventListener('touchmove', (e) => {
      if (e.touches[0]) handleMove(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });
    card.addEventListener('touchend', reset);
  });
})();

/* ============================================================
   MAGNETIC GLOW BUTTON — Cinenvood live demo CTA
   ============================================================ */
(function () {
  const magneticBtns = document.querySelectorAll('[data-magnetic]');
  const PULL = 0.35;

  magneticBtns.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const relX = e.clientX - rect.left;
      const relY = e.clientY - rect.top;
      const offsetX = (relX - rect.width / 2) * PULL;
      const offsetY = (relY - rect.height / 2) * PULL;

      btn.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
      btn.style.setProperty('--mx', `${(relX / rect.width) * 100}%`);
      btn.style.setProperty('--my', `${(relY / rect.height) * 100}%`);
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate(0, 0)';
    });
  });
})();

/* ============================================================
   CONTACT FORM — client-side mailto handoff (static site, no backend)
   ============================================================ */
(function () {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();

    const subject = encodeURIComponent(`Portfolio inquiry from ${name}`);
    const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
    window.location.href = `mailto:harsh48227@gmail.com?subject=${subject}&body=${body}`;
  });
})();
