/**
 * Particle constellation canvas for the hero section.
 * Lightweight: uses requestAnimationFrame, pauses when offscreen.
 */
const Particles = (() => {
  let canvas, ctx, particles, mouse, animId, isActive;
  const CONFIG = {
    count: 80,
    maxRadius: 2,
    minRadius: 0.5,
    speed: 0.3,
    connectionDistance: 120,
    mouseRadius: 150,
    color: '255, 255, 255',
    lineAlpha: 0.06,
    particleAlpha: 0.4,
  };

  function init(canvasEl) {
    canvas = canvasEl;
    ctx = canvas.getContext('2d');
    particles = [];
    mouse = { x: -1000, y: -1000 };
    isActive = true;

    resize();
    createParticles();
    bindEvents();
    animate();
  }

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';
    ctx.scale(dpr, dpr);
  }

  function createParticles() {
    const rect = canvas.parentElement.getBoundingClientRect();
    particles = [];
    for (let i = 0; i < CONFIG.count; i++) {
      particles.push({
        x: Math.random() * rect.width,
        y: Math.random() * rect.height,
        vx: (Math.random() - 0.5) * CONFIG.speed,
        vy: (Math.random() - 0.5) * CONFIG.speed,
        r: CONFIG.minRadius + Math.random() * (CONFIG.maxRadius - CONFIG.minRadius),
        alpha: 0.1 + Math.random() * CONFIG.particleAlpha,
      });
    }
  }

  function bindEvents() {
    window.addEventListener('resize', () => { resize(); createParticles(); });

    canvas.parentElement.addEventListener('mousemove', (e) => {
      const rect = canvas.parentElement.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });

    canvas.parentElement.addEventListener('mouseleave', () => {
      mouse.x = -1000;
      mouse.y = -1000;
    });

    const observer = new IntersectionObserver(
      ([entry]) => { isActive = entry.isIntersecting; },
      { threshold: 0.1 }
    );
    observer.observe(canvas.parentElement);
  }

  function animate() {
    if (!isActive) { animId = requestAnimationFrame(animate); return; }

    const rect = canvas.parentElement.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;

    ctx.clearRect(0, 0, w, h);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;

      // Mouse repulsion
      const dx = p.x - mouse.x;
      const dy = p.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < CONFIG.mouseRadius) {
        const force = (CONFIG.mouseRadius - dist) / CONFIG.mouseRadius;
        p.x += dx * force * 0.02;
        p.y += dy * force * 0.02;
      }

      // Draw particle
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${CONFIG.color}, ${p.alpha})`;
      ctx.fill();

      // Connections
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const cdx = p.x - p2.x;
        const cdy = p.y - p2.y;
        const cdist = Math.sqrt(cdx * cdx + cdy * cdy);

        if (cdist < CONFIG.connectionDistance) {
          const alpha = (1 - cdist / CONFIG.connectionDistance) * CONFIG.lineAlpha;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(${CONFIG.color}, ${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    animId = requestAnimationFrame(animate);
  }

  function setColor(rgb) {
    CONFIG.color = rgb;
  }

  function destroy() {
    cancelAnimationFrame(animId);
  }

  return { init, setColor, destroy };
})();
