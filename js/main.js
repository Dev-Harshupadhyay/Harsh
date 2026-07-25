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
