/**
 * GSAP ScrollTrigger animations.
 * Falls back to IntersectionObserver if GSAP isn't loaded.
 */
const Animations = (() => {
  function init() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
      initGSAP();
    } else {
      initFallback();
    }
  }

  function initGSAP() {
    // ── Reveal-up elements ───────────────────────
    gsap.utils.toArray('.reveal-up').forEach((el, i) => {
      gsap.fromTo(el,
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
          delay: i % 3 * 0.1,
        }
      );
    });

    // ── Reveal-scale elements ────────────────────
    gsap.utils.toArray('.reveal-scale').forEach((el) => {
      gsap.fromTo(el,
        { opacity: 0, scale: 0.92 },
        {
          opacity: 1, scale: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );
    });

    // ── About cards stagger ──────────────────────
    const aboutCards = gsap.utils.toArray('#aboutGrid .glass-card');
    if (aboutCards.length) {
      gsap.fromTo(aboutCards,
        { opacity: 0, y: 50 },
        {
          opacity: 1, y: 0,
          duration: 0.7,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '#aboutGrid',
            start: 'top 80%',
          },
        }
      );
    }

    // ── Event cards slide in ─────────────────────
    const eventCards = gsap.utils.toArray('.event-card');
    if (eventCards.length) {
      gsap.fromTo(eventCards,
        { opacity: 0, x: 60 },
        {
          opacity: 1, x: 0,
          duration: 0.6,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '#eventsScroll',
            start: 'top 80%',
          },
        }
      );
    }

    // ── Team cards stagger ───────────────────────
    const teamCards = gsap.utils.toArray('.team-card');
    if (teamCards.length) {
      gsap.fromTo(teamCards,
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '#teamGrid',
            start: 'top 80%',
          },
        }
      );
    }

    // ── Join card ────────────────────────────────
    const joinCard = document.querySelector('.join-card');
    if (joinCard) {
      gsap.fromTo(joinCard,
        { opacity: 0, scale: 0.9 },
        {
          opacity: 1, scale: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: joinCard,
            start: 'top 85%',
          },
        }
      );
    }
  }

  // ── Fallback: IntersectionObserver ─────────────
  function initFallback() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    document.querySelectorAll('.reveal-up, .reveal-scale, .reveal-left, .reveal-right').forEach((el) => {
      observer.observe(el);
    });
  }

  return { init };
})();
