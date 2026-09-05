/**
 * Floating embers / firefly canvas for the hero section.
 * Warm, organic feel — no connections, soft glow, gentle drift.
 */
const Particles = (() => {
  let canvas, ctx, particles, mouse, animId, isActive, time;

  const COLORS = [
    { r: 212, g: 168, b: 83 },
    { r: 194, g: 84,  b: 77 },
    { r: 255, g: 220, b: 160 },
    { r: 122, g: 41,  b: 72 },
    { r: 240, g: 200, b: 140 },
  ];

  const CONFIG = {
    count: 50,
    maxRadius: 3,
    minRadius: 1,
    speed: 0.15,
    mouseRadius: 180,
    glowSize: 12,
  };

  function init(canvasEl) {
    canvas = canvasEl;
    ctx = canvas.getContext('2d');
    particles = [];
    mouse = { x: -1000, y: -1000 };
    isActive = true;
    time = 0;

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
      const color = COLORS[Math.floor(Math.random() * COLORS.length)];
      particles.push({
        x: Math.random() * rect.width,
        y: Math.random() * rect.height,
        vx: (Math.random() - 0.5) * CONFIG.speed,
        vy: (Math.random() - 0.5) * CONFIG.speed - 0.1,
        r: CONFIG.minRadius + Math.random() * (CONFIG.maxRadius - CONFIG.minRadius),
        color: color,
        alpha: 0.15 + Math.random() * 0.35,
        phase: Math.random() * Math.PI * 2,
        drift: 0.3 + Math.random() * 0.5,
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
    time += 0.008;

    ctx.clearRect(0, 0, w, h);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      p.x += p.vx + Math.sin(time + p.phase) * p.drift * 0.3;
      p.y += p.vy + Math.cos(time * 0.7 + p.phase) * p.drift * 0.15;

      if (p.x < -20) p.x = w + 20;
      if (p.x > w + 20) p.x = -20;
      if (p.y < -20) p.y = h + 20;
      if (p.y > h + 20) p.y = -20;

      const dx = p.x - mouse.x;
      const dy = p.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < CONFIG.mouseRadius) {
        const force = (CONFIG.mouseRadius - dist) / CONFIG.mouseRadius;
        p.x += dx * force * 0.015;
        p.y += dy * force * 0.015;
      }

      const flicker = 0.6 + 0.4 * Math.sin(time * 2 + p.phase);
      const alpha = p.alpha * flicker;
      const { r, g, b } = p.color;

      const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r + CONFIG.glowSize);
      glow.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${alpha})`);
      glow.addColorStop(0.4, `rgba(${r}, ${g}, ${b}, ${alpha * 0.3})`);
      glow.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r + CONFIG.glowSize, 0, Math.PI * 2);
      ctx.fillStyle = glow;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * 0.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${Math.min(alpha * 1.5, 0.9)})`;
      ctx.fill();
    }

    animId = requestAnimationFrame(animate);
  }

  function setColor(rgb) {}

  function destroy() {
    cancelAnimationFrame(animId);
  }

  return { init, setColor, destroy };
})();
