/**
 * Main application — loads club data from JSON and renders all sections.
 */
const App = (() => {
  let data = null;

  async function init() {
    try {
      const response = await fetch('data/club.json');
      data = await response.json();
      render();
    } catch (err) {
      console.warn('Could not load club.json, using inline defaults.');
    }

    Particles.init(document.getElementById('heroCanvas'));
    Glass.init();

    requestAnimationFrame(() => {
      Animations.init();
    });
  }

  function render() {
    if (!data) return;

    // ── Page title ───────────────────────────────
    document.title = `${data.name} — IIT Bhilai`;
    document.getElementById('page-title')?.remove();

    // ── Accent colour override ───────────────────
    if (data.accentColor) {
      document.documentElement.style.setProperty('--accent', data.accentColor);
      const rgb = hexToRgb(data.accentColor);
      if (rgb) {
        document.documentElement.style.setProperty('--accent-glow', `rgba(${rgb}, 0.35)`);
        document.documentElement.style.setProperty('--accent-subtle', `rgba(${rgb}, 0.08)`);
      }
    }

    // ── Nav brand ────────────────────────────────
    setText('navBrand', data.name);

    // ── Hero ─────────────────────────────────────
    setText('heroClubName', data.name);
    setText('heroTagline', data.tagline || data.description);

    // ── About ────────────────────────────────────
    if (data.about) {
      setText('aboutTitle', data.about.title);
      setText('aboutDescription', data.about.description);
      renderAbout(data.about.highlights);
    }

    // ── Interactive ──────────────────────────────
    if (data.interactive) {
      setText('interactiveTitle', data.interactive.title);
      setText('interactiveDescription', data.interactive.description);
    }

    // ── Events ───────────────────────────────────
    renderEvents(data.events);

    // ── Team ─────────────────────────────────────
    renderTeam(data.team);

    // ── Join ─────────────────────────────────────
    if (data.join) {
      setText('joinTitle', data.join.title);
      setText('joinDescription', data.join.description);
      const joinCta = document.getElementById('joinCta');
      if (joinCta && data.join.cta) joinCta.textContent = data.join.cta;
      renderJoinLinks(data.join.links);
    }

    // ── Footer ───────────────────────────────────
    if (data.footer) {
      const footerEl = document.getElementById('footerText');
      if (footerEl) footerEl.textContent = `Made with care at ${data.footer.college} · ${data.footer.year}`;
    }
  }

  // ═══ Section renderers ═══════════════════════════

  const ICONS = {
    rocket: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>',
    users: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
    zap: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',
    code: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>',
    star: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
    heart: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>',
    globe: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>',
    default: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/></svg>',
  };

  const SOCIAL_ICONS = {
    email: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>',
    instagram: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>',
    linkedin: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>',
    github: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>',
    discord: '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/></svg>',
    website: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>',
  };

  function renderAbout(highlights) {
    const grid = document.getElementById('aboutGrid');
    if (!grid || !highlights) return;
    grid.innerHTML = '';

    highlights.forEach((item) => {
      const card = document.createElement('div');
      card.className = 'about-card glass-card glass-card-tilt';
      card.innerHTML = `
        <div class="card-icon">${ICONS[item.icon] || ICONS.default}</div>
        <div class="card-content">
          <h3>${esc(item.title)}</h3>
          <p>${esc(item.description)}</p>
        </div>
      `;
      grid.appendChild(card);
    });
  }

  function renderEvents(events) {
    const scroll = document.getElementById('eventsScroll');
    if (!scroll || !events) return;
    scroll.innerHTML = '';

    events.forEach((ev) => {
      const card = document.createElement('div');
      card.className = 'event-card glass-card';
      const dateStr = ev.date ? new Date(ev.date).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' }) : '';
      const imgContent = ev.image
        ? `<img src="${esc(ev.image)}" alt="${esc(ev.title)}" loading="lazy">`
        : `<span>📸</span>`;

      card.innerHTML = `
        <div class="event-image">${imgContent}</div>
        <div class="event-body">
          ${ev.tag ? `<span class="event-tag">${esc(ev.tag)}</span>` : ''}
          ${dateStr ? `<span class="event-date">${dateStr}</span>` : ''}
          <h3>${esc(ev.title)}</h3>
          <p>${esc(ev.description)}</p>
        </div>
      `;
      scroll.appendChild(card);
    });
  }

  function renderTeam(team) {
    const grid = document.getElementById('teamGrid');
    if (!grid || !team) return;
    grid.innerHTML = '';

    team.forEach((member) => {
      const card = document.createElement('div');
      card.className = 'team-card glass-card glass-card-tilt';
      const initials = member.name.split(' ').map(n => n[0]).join('').slice(0, 2);
      const avatarContent = member.image
        ? `<img src="${esc(member.image)}" alt="${esc(member.name)}" loading="lazy">`
        : initials;

      card.innerHTML = `
        <div class="avatar">${avatarContent}</div>
        <div class="card-content">
          <h4>${esc(member.name)}</h4>
          <p class="role">${esc(member.role)}</p>
          <p class="quote">"${esc(member.quote)}"</p>
        </div>
      `;
      grid.appendChild(card);
    });
  }

  function renderJoinLinks(links) {
    const container = document.getElementById('joinLinks');
    if (!container || !links) return;
    container.innerHTML = '';

    Object.entries(links).forEach(([key, value]) => {
      if (!value) return;
      const a = document.createElement('a');
      a.href = key === 'email' ? `mailto:${value}` : value;
      a.target = key === 'email' ? '_self' : '_blank';
      a.rel = 'noopener noreferrer';
      a.innerHTML = `${SOCIAL_ICONS[key] || SOCIAL_ICONS.website}<span>${capitalize(key)}</span>`;
      container.appendChild(a);
    });
  }

  // ═══ Utilities ═══════════════════════════════════

  function setText(id, text) {
    const el = document.getElementById(id);
    if (el && text) el.textContent = text;
  }

  function esc(str) {
    const div = document.createElement('div');
    div.textContent = str || '';
    return div.innerHTML;
  }

  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
      : null;
  }

  // ═══ Boot ════════════════════════════════════════
  document.addEventListener('DOMContentLoaded', init);

  return { init };
})();
