/**
 * Interactive improv prompt generator — drama exercises for Drishya.
 */
const Interactive = (() => {
  const SCENARIOS = [
    'A crowded train station at midnight',
    'A courtroom where everyone is lying',
    'A haunted hostel room during exams',
    'A wedding where nobody wants to be there',
    'An elevator stuck between floors',
    'A coffee shop that only serves one drink',
    'A museum after closing hours',
    'A funeral where the dead person walks in',
    'A job interview for a position that doesn\'t exist',
    'The last day of college',
    'A classroom where the teacher is the student',
    'A park bench at 3 AM',
    'A kitchen during a cooking disaster',
    'A library where people can only whisper secrets',
    'A police station run by the criminals',
    'A hospital where the doctors are patients',
  ];

  const CHARACTERS = [
    'A paranoid detective',
    'A ghost who doesn\'t know they\'re dead',
    'An overenthusiastic tour guide',
    'A time traveller from 1947',
    'A villain who keeps apologizing',
    'A professor who forgot their subject',
    'A street vendor with a secret',
    'An AI who thinks it\'s human',
    'A politician on truth serum',
    'A child pretending to be an adult',
    'A mime who accidentally speaks',
    'A narrator who keeps getting the story wrong',
    'A sleepwalker in a boardroom',
    'A celebrity in disguise',
    'A retired superhero',
    'An alien experiencing earth for the first time',
  ];

  const EMOTIONS = [
    'Desperate joy',
    'Quiet rage',
    'Nervous excitement',
    'Melancholic nostalgia',
    'Barely contained panic',
    'Suspicious curiosity',
    'Reluctant admiration',
    'Overwhelming guilt',
    'Manic confidence',
    'Tender grief',
    'Stubborn denial',
    'Bewildered awe',
    'Cold determination',
    'Fading hope',
    'Reckless abandon',
    'Cautious wonder',
  ];

  const CONSTRAINTS = [
    'No dialogue — body language only',
    'Every sentence must be a question',
    'Perform in slow motion',
    'Characters can only speak in rhymes',
    'One character is invisible to the others',
    'The scene plays in reverse chronology',
    'Characters must swap roles mid-scene',
    'Everything said is a lie',
    'No character can say "no"',
    'Each line must start with the last word of the previous line',
    'One character speaks only in song',
    'The scene must end in exactly 60 seconds',
    'Characters are aware they\'re in a play',
    'No one can use their hands',
    'Every emotion is the opposite of what\'s felt',
    'One character narrates everything the others do',
  ];

  let currentPrompt = {};
  let isSpinning = false;

  function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function generate() {
    return {
      scenario: pick(SCENARIOS),
      character: pick(CHARACTERS),
      emotion: pick(EMOTIONS),
      constraint: pick(CONSTRAINTS),
    };
  }

  function build(container) {
    container.innerHTML = '';
    container.classList.add('improv-machine');

    const intro = document.createElement('p');
    intro.className = 'improv-intro';
    intro.textContent = 'Generate a random scene prompt for your next improv exercise.';
    container.appendChild(intro);

    const grid = document.createElement('div');
    grid.className = 'improv-grid';

    const cards = ['scenario', 'character', 'emotion', 'constraint'];
    const labels = {
      scenario: { icon: '🎭', title: 'Scene' },
      character: { icon: '🎪', title: 'Character' },
      emotion: { icon: '💫', title: 'Emotion' },
      constraint: { icon: '⚡', title: 'Twist' },
    };

    cards.forEach(key => {
      const card = document.createElement('div');
      card.className = 'improv-card glass-card';
      card.id = `improv-${key}`;
      card.innerHTML = `
        <div class="improv-card-icon">${labels[key].icon}</div>
        <div class="improv-card-label">${labels[key].title}</div>
        <div class="improv-card-value">—</div>
      `;
      grid.appendChild(card);
    });

    container.appendChild(grid);

    const actions = document.createElement('div');
    actions.className = 'improv-actions';

    const genBtn = document.createElement('button');
    genBtn.className = 'btn-primary improv-generate';
    genBtn.innerHTML = `
      Generate Scene
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/>
        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
      </svg>
    `;
    genBtn.addEventListener('click', () => animateGenerate());
    actions.appendChild(genBtn);

    const lockHint = document.createElement('p');
    lockHint.className = 'improv-hint';
    lockHint.textContent = 'Click any card to lock it, then regenerate the rest.';
    actions.appendChild(lockHint);

    container.appendChild(actions);

    // Card locking
    grid.querySelectorAll('.improv-card').forEach(card => {
      card.addEventListener('click', () => {
        if (isSpinning) return;
        card.classList.toggle('locked');
      });
    });
  }

  function animateGenerate() {
    if (isSpinning) return;
    isSpinning = true;

    const keys = ['scenario', 'character', 'emotion', 'constraint'];
    const lists = { scenario: SCENARIOS, character: CHARACTERS, emotion: EMOTIONS, constraint: CONSTRAINTS };

    keys.forEach((key, i) => {
      const card = document.getElementById(`improv-${key}`);
      if (!card || card.classList.contains('locked')) return;

      const valueEl = card.querySelector('.improv-card-value');
      card.classList.add('spinning');

      let ticks = 0;
      const maxTicks = 8 + i * 3;
      const interval = setInterval(() => {
        valueEl.textContent = pick(lists[key]);
        ticks++;
        if (ticks >= maxTicks) {
          clearInterval(interval);
          const final = pick(lists[key]);
          valueEl.textContent = final;
          currentPrompt[key] = final;
          card.classList.remove('spinning');
          card.classList.add('revealed');
          setTimeout(() => card.classList.remove('revealed'), 600);
          if (i === keys.length - 1) isSpinning = false;
        }
      }, 60);
    });

    // If all locked, unlock spinning immediately
    const anyUnlocked = keys.some(k => {
      const c = document.getElementById(`improv-${k}`);
      return c && !c.classList.contains('locked');
    });
    if (!anyUnlocked) isSpinning = false;
  }

  function init(container) {
    if (!container) return;
    build(container);
  }

  return { init };
})();
