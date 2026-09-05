# Club Name — IIT Bhilai

> A website introducing **[Club Name]** to someone who has never heard of it.  
> Built for the **HelloWorld Hackathon** by OpenLake, IIT Bhilai.

**Live site:** [TODO: add hosted URL]  
**Repository:** [github.com/HasNetwork/HelloWorld](https://github.com/HasNetwork/HelloWorld)

---

## What is this?

A single-page club website designed to tell a first-year everything they need to know — what the club does, who's in it, what they've done, and how to join. The design uses a warm, cultural aesthetic with liquid glass effects, floating embers, scroll-driven animations, and a dark/light theme toggle.

All content is data-driven from a single JSON file (`data/club.json`), making it easy to adapt for any club.

## About the Club

**[Club Name]** — *[tagline]*

[Brief description of the club — to be filled in with real content.]

## How to run locally

1. Clone the repo:
   ```bash
   git clone https://github.com/HasNetwork/HelloWorld.git
   cd HelloWorld
   ```

2. Start any local server (no build step needed):
   ```bash
   python -m http.server 3000
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

That's it — no dependencies to install, no build tools, no `npm install`.

## Tech stack

- **HTML, CSS, JavaScript** — no frameworks, no build step
- **GSAP + ScrollTrigger** (via CDN) — scroll-driven animations
- **Google Fonts** — Playfair Display (headings), DM Sans (body)
- Data loaded from `data/club.json` at runtime

## Project structure

```
├── index.html          — Main single-page site
├── form.html           — Redirect page for the membership form
├── css/
│   ├── variables.css   — Design tokens (colours, spacing, glass)
│   ├── base.css        — Reset, typography, layout
│   ├── glass.css       — Liquid glass effects, cursor glow
│   ├── sections.css    — Per-section styling
│   └── animations.css  — Keyframes, scroll-reveal classes
├── js/
│   ├── app.js          — Data loader + section renderers
│   ├── glass.js        — Cursor glow, card tilt, nav scroll, theme toggle
│   ├── animations.js   — GSAP ScrollTrigger orchestration
│   └── particles.js    — Floating embers canvas (hero background)
├── data/
│   └── club.json       — All club content (swap for any club)
└── assets/             — Images and media
```

## Credits

| What | Source |
|------|--------|
| Animations | [GSAP](https://gsap.com/) + ScrollTrigger (CDN) |
| Fonts | [Playfair Display](https://fonts.google.com/specimen/Playfair+Display), [DM Sans](https://fonts.google.com/specimen/DM+Sans) via Google Fonts |
| Icons | Hand-coded SVG (Feather icon style) |
| AI assistance | Claude (Anthropic) — used for code generation, design system, and content scaffolding |

## Team

- **Harsh Jain** — [TODO: add partner if duo]
- Built during the HelloWorld 24-hour hackathon, September 2026
