/* ============================================================
   SITCON Camp 2026 – main.js
   ============================================================ */

/* ---- Starfield Canvas ---- */
(function initStarfield() {
  const canvas = document.getElementById('starCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let stars = [];
  let animId;

  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    buildStars();
  }

  function buildStars() {
    const count = Math.floor((canvas.width * canvas.height) / 6000);
    stars = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.4 + 0.3,
      speed: Math.random() * 0.25 + 0.05,
      opacity: Math.random() * 0.7 + 0.3,
      twinkleSpeed: Math.random() * 0.02 + 0.005,
      twinkleOffset: Math.random() * Math.PI * 2,
    }));
  }

  // Subtle shooting stars
  let shooters = [];
  function spawnShooter() {
    if (shooters.length > 3) return;
    shooters.push({
      x: Math.random() * canvas.width * 0.6,
      y: Math.random() * canvas.height * 0.4,
      vx: Math.random() * 4 + 3,
      vy: Math.random() * 2 + 1,
      life: 0,
      maxLife: Math.random() * 40 + 30,
      length: Math.random() * 80 + 60,
    });
  }

  let frame = 0;
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    frame++;
    if (frame % 240 === 0) spawnShooter();

    // Stars
    stars.forEach(s => {
      const tw = Math.sin(frame * s.twinkleSpeed + s.twinkleOffset) * 0.3 + 0.7;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(200, 220, 255, ${s.opacity * tw})`;
      ctx.fill();
      s.y += s.speed;
      if (s.y > canvas.height) { s.y = 0; s.x = Math.random() * canvas.width; }
    });

    // Shooting stars
    shooters = shooters.filter(sh => {
      const progress = sh.life / sh.maxLife;
      const alpha = Math.sin(progress * Math.PI) * 0.8;
      const grad = ctx.createLinearGradient(
        sh.x, sh.y,
        sh.x - sh.vx * (sh.length / sh.vx), sh.y - sh.vy * (sh.length / sh.vx)
      );
      grad.addColorStop(0, `rgba(0, 212, 255, ${alpha})`);
      grad.addColorStop(1, 'rgba(0, 212, 255, 0)');
      ctx.beginPath();
      ctx.moveTo(sh.x, sh.y);
      ctx.lineTo(sh.x - sh.vx * 20, sh.y - sh.vy * 20);
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.5;
      ctx.stroke();
      sh.x += sh.vx;
      sh.y += sh.vy;
      sh.life++;
      return sh.life < sh.maxLife;
    });

    animId = requestAnimationFrame(draw);
  }

  // Resize observer
  const ro = new ResizeObserver(() => { cancelAnimationFrame(animId); resize(); draw(); });
  ro.observe(canvas.parentElement);
  resize();
  draw();
})();


/* ---- Light / Dark mode toggle ---- */
(function initTheme() {
  const btn  = document.getElementById('themeToggle');
  const root = document.documentElement;

  // Restore saved preference, fall back to system preference
  const saved  = localStorage.getItem('sitcon-theme');
  const system = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  const initial = saved || system;
  if (initial === 'light') root.setAttribute('data-theme', 'light');

  if (!btn) return;
  btn.addEventListener('click', () => {
    const isLight = root.getAttribute('data-theme') === 'light';
    if (isLight) {
      root.removeAttribute('data-theme');
      localStorage.setItem('sitcon-theme', 'dark');
    } else {
      root.setAttribute('data-theme', 'light');
      localStorage.setItem('sitcon-theme', 'light');
    }
  });
})();


/* ---- Navbar scroll effect ---- */
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;
  function onScroll() {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();


/* ---- Mobile nav toggle ---- */
(function initMobileNav() {
  const toggle = document.getElementById('navToggle');
  const links  = document.getElementById('navLinks');
  if (!toggle || !links) return;

  toggle.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });

  // Close on link click
  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      links.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });

  // Close on outside click
  document.addEventListener('click', e => {
    if (!toggle.contains(e.target) && !links.contains(e.target)) {
      links.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
})();


/* ---- Scroll reveal (IntersectionObserver) ---- */
(function initReveal() {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  items.forEach((el, i) => {
    // Stagger siblings within same parent
    const siblings = [...el.parentElement.querySelectorAll('.reveal')];
    const idx = siblings.indexOf(el);
    if (idx > 0) {
      el.style.transitionDelay = `${idx * 0.07}s`;
    }
    observer.observe(el);
  });
})();


/* ---- Animated counters ---- */
(function initCounters() {
  const nums = document.querySelectorAll('.stat-num[data-count]');
  if (!nums.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.count, 10);
      const duration = target > 100 ? 1800 : 1000;
      const start = performance.now();

      function tick(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * target).toLocaleString();
        if (progress < 1) requestAnimationFrame(tick);
      }

      requestAnimationFrame(tick);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  nums.forEach(el => observer.observe(el));
})();


/* ============================================================
   Easter Eggs
   ============================================================ */

/* ---- 1. Console message ---- */
(function consoleEgg() {
  const style = {
    title:  'font-size:18px;font-weight:900;background:linear-gradient(90deg,#00d4ff,#f5c842,#a855f7);-webkit-background-clip:text;color:transparent;padding:4px 0',
    sub:    'color:#6b7db3;font-size:12px',
    accent: 'color:#00d4ff;font-weight:700',
    gold:   'color:#f5c842;font-weight:700',
    reset:  'color:inherit',
  };
  console.log('%cSITCON Camp 2026', style.title);
  console.log(
`%c
  ██████╗ █████╗ ███╗   ███╗██████╗      ██████╗ ██████╗ ██████╗  ██████╗
 ██╔════╝██╔══██╗████╗ ████║██╔══██╗    ╚════██╗██╔═████╗╚════██╗██╔════╝
 ██║     ███████║██╔████╔██║██████╔╝     █████╔╝██║██╔██║ █████╔╝███████╗
 ██║     ██╔══██║██║╚██╔╝██║██╔═══╝     ██╔═══╝ ████╔╝██║██╔═══╝ ██╔══██╗
 ╚██████╗██║  ██║██║ ╚═╝ ██║██║         ███████╗╚██████╔╝███████╗╚██████╔╝
  ╚═════╝╚═╝  ╚═╝╚═╝     ╚═╝╚═╝         ╚══════╝ ╚═════╝ ╚══════╝ ╚═════╝
`, style.sub);
  console.log('%c  ✦ 第十屆 · 十週年 · 7/8–7/12 · 國立陽明交通大學 ✦', style.gold);
  console.log(' ');
  console.log('%c嘿，你在看 console 😏', style.accent);
  console.log('%c我們資訊組正在招募工程師，有興趣一起搞這個網站嗎？', style.reset);
  console.log('%c👉 https://i.sitcon.org/camp-recruit', style.accent);
  console.log(' ');
})();


/* ---- 2. Toast utility ---- */
function showToast(msg, duration = 3000) {
  const existing = document.getElementById('egg-toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.id = 'egg-toast';
  toast.textContent = msg;
  document.body.appendChild(toast);

  // Force reflow then animate in
  requestAnimationFrame(() => {
    requestAnimationFrame(() => toast.classList.add('show'));
  });

  setTimeout(() => {
    toast.classList.remove('show');
    toast.addEventListener('transitionend', () => toast.remove(), { once: true });
  }, duration);
}


/* ---- 3. Confetti burst ---- */
function launchConfetti() {
  const colors = ['#00d4ff', '#a855f7', '#f5c842', '#10f0a0', '#ff8c42', '#f43f5e'];
  const count  = 120;

  for (let i = 0; i < count; i++) {
    const el = document.createElement('div');
    el.className = 'confetti-piece';
    el.style.cssText = `
      left: ${Math.random() * 100}vw;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      width: ${Math.random() * 8 + 5}px;
      height: ${Math.random() * 8 + 5}px;
      border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
      animation-duration: ${Math.random() * 1.5 + 1.5}s;
      animation-delay: ${Math.random() * 0.6}s;
    `;
    document.body.appendChild(el);
    el.addEventListener('animationend', () => el.remove(), { once: true });
  }
}


/* ---- 4. Konami Code → 十週年爆炸 ---- */
(function konamiEgg() {
  const CODE = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
  let pos = 0;

  document.addEventListener('keydown', e => {
    if (e.key === CODE[pos]) {
      pos++;
      if (pos === CODE.length) {
        pos = 0;
        launchConfetti();
        showToast('🎊 隱藏彩蛋解鎖！十週年快樂！');
      }
    } else {
      pos = e.key === CODE[0] ? 1 : 0;
    }
  });
})();


/* ---- 5. Logo 點十下 → 第十屆彩蛋 ---- */
(function logoEgg() {
  const logo = document.querySelector('.nav-logo');
  if (!logo) return;

  let clicks = 0;
  let timer;

  logo.addEventListener('click', e => {
    e.preventDefault();
    clicks++;
    clearTimeout(timer);
    timer = setTimeout(() => { clicks = 0; }, 2000);

    if (clicks === 10) {
      clicks = 0;
      launchConfetti();
      showToast('🎂 你點了十下！第十屆，謝謝你的陪伴。');
    } else if (clicks >= 3) {
      // Subtle hint — logo wiggles
      logo.classList.remove('logo-wiggle');
      void logo.offsetWidth; // reflow
      logo.classList.add('logo-wiggle');
    }
  });
})();


/* ---- Active nav link on scroll ---- */
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(a => a.classList.remove('active'));
        const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => observer.observe(s));
})();
