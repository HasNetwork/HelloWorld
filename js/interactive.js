/**
 * Photo gallery with lightbox — shows past events, BTS, performances.
 */
const Interactive = (() => {
  let images = [];
  let currentIndex = 0;
  let lightbox = null;

  function build(container, galleryData) {
    container.innerHTML = '';
    container.classList.add('photo-gallery');
    images = galleryData.images || [];

    const grid = document.createElement('div');
    grid.className = 'gallery-grid';

    images.forEach((img, i) => {
      const item = document.createElement('button');
      item.className = 'gallery-item';
      item.setAttribute('aria-label', img.caption || `Photo ${i + 1}`);
      item.innerHTML = `
        <img src="${img.src}" alt="${img.caption || ''}" loading="lazy">
        <div class="gallery-overlay">
          <span>${img.caption || ''}</span>
        </div>
      `;
      item.addEventListener('click', () => openLightbox(i));
      grid.appendChild(item);
    });

    container.appendChild(grid);
    buildLightbox();
    document.addEventListener('keydown', onKey);
  }

  function buildLightbox() {
    lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.setAttribute('role', 'dialog');
    lightbox.setAttribute('aria-modal', 'true');
    lightbox.hidden = true;

    lightbox.innerHTML = `
      <button class="lightbox-close" aria-label="Close">&times;</button>
      <button class="lightbox-prev" aria-label="Previous">&#8249;</button>
      <button class="lightbox-next" aria-label="Next">&#8250;</button>
      <div class="lightbox-content">
        <img class="lightbox-img" src="" alt="">
        <p class="lightbox-caption"></p>
      </div>
    `;

    lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
    lightbox.querySelector('.lightbox-prev').addEventListener('click', () => navigate(-1));
    lightbox.querySelector('.lightbox-next').addEventListener('click', () => navigate(1));
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    document.body.appendChild(lightbox);
  }

  function openLightbox(index) {
    currentIndex = index;
    updateLightbox();
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.hidden = true;
    document.body.style.overflow = '';
  }

  function navigate(dir) {
    currentIndex = (currentIndex + dir + images.length) % images.length;
    updateLightbox();
  }

  function updateLightbox() {
    const img = images[currentIndex];
    const el = lightbox.querySelector('.lightbox-img');
    const cap = lightbox.querySelector('.lightbox-caption');
    el.src = img.src;
    el.alt = img.caption || '';
    cap.textContent = img.caption || '';
  }

  function onKey(e) {
    if (lightbox.hidden) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') navigate(-1);
    if (e.key === 'ArrowRight') navigate(1);
  }

  function init(container, galleryData) {
    if (!container || !galleryData) return;
    build(container, galleryData);
  }

  return { init };
})();
