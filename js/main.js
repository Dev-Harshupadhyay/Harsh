/* ============ THEME TOGGLE (persisted) ============ */
(function () {
  const root = document.documentElement;
  const toggle = document.getElementById('themeToggle');
  const stored = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  root.setAttribute('data-theme', stored || (prefersDark ? 'dark' : 'light'));

  toggle.addEventListener('click', () => {
    const current = root.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  });
})();

/* ============ MOBILE NAV ============ */
(function () {
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.querySelector('.nav-links');

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

/* ============ SCROLL REVEAL ============ */
(function () {
  const els = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  els.forEach(el => observer.observe(el));
})();

/* ============ WELCOME NOTICE (on page load) ============ */
(function () {
  const notice = document.getElementById('welcomeNotice');
  const closeBtn = document.getElementById('noticeClose');
  let hideTimer = null;

  function hideNotice() {
    notice.classList.remove('show');
    clearTimeout(hideTimer);
  }

  window.addEventListener('load', () => {
    setTimeout(() => notice.classList.add('show'), 300);
    hideTimer = setTimeout(hideNotice, 4000);
  });

  closeBtn.addEventListener('click', hideNotice);
})();

/* ============ COOL BUTTON: magnetic pull + ripple ============ */
/* Applies to every .project-link automatically — new projects added later
   with the same class in index.html get this effect with zero extra JS/CSS. */
(function () {
  const PULL = 0.3;

  document.querySelectorAll('.project-link').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const relX = e.clientX - rect.left;
      const relY = e.clientY - rect.top;
      const offsetX = (relX - rect.width / 2) * PULL;
      const offsetY = (relY - rect.height / 2) * PULL;
      btn.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate(0, 0)';
    });

    btn.addEventListener('click', (e) => {
      const rect = btn.getBoundingClientRect();
      const ripple = document.createElement('span');
      const size = Math.max(rect.width, rect.height);
      ripple.className = 'ripple';
      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
      ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
      btn.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });
})();

/* ============ TOAST ON LIVE-DEMO LINKS ============ */
(function () {
  const toast = document.getElementById('toast');
  let hideTimer = null;

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(hideTimer);
    hideTimer = setTimeout(() => toast.classList.remove('show'), 4000);
  }

  // Links keep their normal href/target behavior (button still works as a real link);
  // this just layers a toast notification on top of the click.
  document.querySelectorAll('[data-toast]').forEach(link => {
    link.addEventListener('click', () => {
      showToast(link.dataset.toast);
    });
  });
})();
