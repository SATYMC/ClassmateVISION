// script.js
// Lightweight JS for interactive effects: particles, timeline reveal, year insert.
// All code uses vanilla JS to keep the site production-ready and dependency-free.

/* ---------- Particle system for subtle motion ---------- */
(function() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let width = canvas.width = innerWidth;
  let height = canvas.height = innerHeight;
  const particles = [];
  const COUNT = Math.floor(Math.min(width, height) / 30);

  // Create particles with random positions and velocities
  function initParticles() {
    particles.length = 0;
    for (let i = 0; i < COUNT; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: 0.8 + Math.random() * 2.4,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.3,
        hue: 170 + Math.random() * 120
      });
    }
  }

  function resize() {
    width = canvas.width = innerWidth;
    height = canvas.height = innerHeight;
    initParticles();
  }

  window.addEventListener('resize', resize);

  function step() {
    ctx.clearRect(0,0,width,height);
    for (let p of particles) {
      p.x += p.vx;
      p.y += p.vy;

      // wrap
      if (p.x < -20) p.x = width + 20;
      if (p.x > width + 20) p.x = -20;
      if (p.y < -20) p.y = height + 20;
      if (p.y > height + 20) p.y = -20;

      // draw soft circle
      const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 14);
      g.addColorStop(0, `hsla(${p.hue},72%,60%,0.12)`);
      g.addColorStop(0.4, `hsla(${p.hue},72%,55%,0.06)`);
      g.addColorStop(1, `rgba(7,17,34,0)`);
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * 14, 0, Math.PI * 2);
      ctx.fill();
    }
    requestAnimationFrame(step);
  }

  // initialize
  resize();
  step();
})();

/* ---------- Intersection Observer: animate timeline items into view ---------- */
(function(){
  const items = document.querySelectorAll('.timeline-item');
  if ('IntersectionObserver' in window && items.length){
    const obs = new IntersectionObserver((entries) => {
      for (let e of entries){
        if (e.isIntersecting){
          e.target.classList.add('visible');
          obs.unobserve(e.target);
        }
      }
    }, {threshold:0.2});
    items.forEach(i => obs.observe(i));
  } else {
    // Fallback: show all if no observer
    items.forEach(i => i.classList.add('visible'));
  }
})();

/* ---------- Smooth anchor scroll for internal links ---------- */
(function(){
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click', function(e){
      const target = document.querySelector(this.getAttribute('href'));
      if (target){
        e.preventDefault();
        target.scrollIntoView({behavior:'smooth', block:'start'});
      }
    });
  });
})();

/* ---------- Insert current year in footer ---------- */
(function(){
  const year = new Date().getFullYear();
  const el = document.getElementById('year');
  if (el) el.textContent = year;
})();

/* ---------- Accessibility: prefer-reduced-motion respect ---------- */
(function(){
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (mq && mq.matches){
    // If user prefers reduced motion, remove animation-heavy classes or transitions
    document.documentElement.style.scrollBehavior = 'auto';
    // stop canvas animation by replacing with minimal static background
    const can = document.getElementById('particle-canvas');
    if (can){ can.style.display = 'none'; }
    const bg = document.querySelector('.bg-animated');
    if (bg){ bg.style.animation = 'none'; }
  }
})();