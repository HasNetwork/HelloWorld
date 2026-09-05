/**
 * Interactive rhythm pad — Web Audio API percussion synthesizer.
 * No external audio files; every sound is generated in code.
 */
const Interactive = (() => {
  let audioCtx = null;
  let pads = [];
  let sequencerInterval = null;
  let currentStep = 0;
  let isPlaying = false;
  const STEPS = 16;
  const BPM = 120;
  const grid = {};

  const SOUNDS = [
    { name: 'Kick',    key: 'Q', color: '#c2544d', fn: playKick },
    { name: 'Snare',   key: 'W', color: '#d4a853', fn: playSnare },
    { name: 'Hi-Hat',  key: 'E', color: '#e8c97a', fn: playHiHat },
    { name: 'Clap',    key: 'R', color: '#7a2948', fn: playClap },
    { name: 'Tom',     key: 'A', color: '#a0522d', fn: playTom },
    { name: 'Rim',     key: 'S', color: '#cd8032', fn: playRim },
    { name: 'Shaker',  key: 'D', color: '#b8862d', fn: playShaker },
    { name: 'Bell',    key: 'F', color: '#d4a853', fn: playBell },
  ];

  function ensureCtx() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    return audioCtx;
  }

  // ═══ Synthesis functions ══════════════════════════

  function playKick() {
    const ctx = ensureCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(150, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
    gain.gain.setValueAtTime(1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
    osc.connect(gain).connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.5);
  }

  function playSnare() {
    const ctx = ensureCtx();
    const bufferSize = ctx.sampleRate * 0.2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.6, ctx.currentTime);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
    const filter = ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 1000;
    noise.connect(filter).connect(noiseGain).connect(ctx.destination);
    noise.start(ctx.currentTime);

    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(100, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
    oscGain.gain.setValueAtTime(0.7, ctx.currentTime);
    oscGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
    osc.connect(oscGain).connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.1);
  }

  function playHiHat() {
    const ctx = ensureCtx();
    const bufferSize = ctx.sampleRate * 0.05;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);
    const filter = ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 5000;
    noise.connect(filter).connect(gain).connect(ctx.destination);
    noise.start(ctx.currentTime);
  }

  function playClap() {
    const ctx = ensureCtx();
    const bufferSize = ctx.sampleRate * 0.15;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      const env = i < bufferSize * 0.1 ? 1 : Math.pow(1 - (i - bufferSize * 0.1) / (bufferSize * 0.9), 2);
      data[i] = (Math.random() * 2 - 1) * env;
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.5, ctx.currentTime);
    const bandpass = ctx.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.frequency.value = 2000;
    bandpass.Q.value = 0.5;
    noise.connect(bandpass).connect(gain).connect(ctx.destination);
    noise.start(ctx.currentTime);
  }

  function playTom() {
    const ctx = ensureCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(200, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.3);
    gain.gain.setValueAtTime(0.8, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
    osc.connect(gain).connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.3);
  }

  function playRim() {
    const ctx = ensureCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);
    osc.connect(gain).connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.05);
  }

  function playShaker() {
    const ctx = ensureCtx();
    const bufferSize = ctx.sampleRate * 0.08;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    const hp = ctx.createBiquadFilter();
    hp.type = 'highpass';
    hp.frequency.value = 8000;
    noise.connect(hp).connect(gain).connect(ctx.destination);
    noise.start(ctx.currentTime);
  }

  function playBell() {
    const ctx = ensureCtx();
    const osc = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = 800;
    osc2.type = 'sine';
    osc2.frequency.value = 1200;
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6);
    osc.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc2.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.6);
    osc2.stop(ctx.currentTime + 0.6);
  }

  // ═══ UI ═══════════════════════════════════════════

  function build(container) {
    container.innerHTML = '';
    container.classList.add('rhythm-machine');

    // Pad grid
    const padGrid = document.createElement('div');
    padGrid.className = 'pad-grid';

    SOUNDS.forEach((sound, i) => {
      const pad = document.createElement('button');
      pad.className = 'rhythm-pad';
      pad.setAttribute('data-index', i);
      pad.style.setProperty('--pad-color', sound.color);
      pad.innerHTML = `<span class="pad-name">${sound.name}</span><span class="pad-key">${sound.key}</span>`;
      pad.addEventListener('pointerdown', () => triggerPad(i, pad));
      padGrid.appendChild(pad);
      pads.push(pad);
    });

    container.appendChild(padGrid);

    // Sequencer
    const seqWrap = document.createElement('div');
    seqWrap.className = 'sequencer-wrap';

    const seqControls = document.createElement('div');
    seqControls.className = 'seq-controls';

    const playBtn = document.createElement('button');
    playBtn.className = 'seq-btn glass-btn';
    playBtn.innerHTML = '<span class="play-icon">▶</span> Play';
    playBtn.addEventListener('click', () => toggleSequencer(playBtn));

    const clearBtn = document.createElement('button');
    clearBtn.className = 'seq-btn glass-btn';
    clearBtn.textContent = 'Clear';
    clearBtn.addEventListener('click', () => clearGrid(playBtn));

    seqControls.appendChild(playBtn);
    seqControls.appendChild(clearBtn);
    seqWrap.appendChild(seqControls);

    const seqGrid = document.createElement('div');
    seqGrid.className = 'seq-grid';

    SOUNDS.forEach((sound, row) => {
      const label = document.createElement('div');
      label.className = 'seq-label';
      label.textContent = sound.name;
      seqGrid.appendChild(label);

      grid[row] = [];
      for (let col = 0; col < STEPS; col++) {
        const cell = document.createElement('button');
        cell.className = 'seq-cell';
        if (col % 4 === 0) cell.classList.add('seq-cell-beat');
        cell.setAttribute('data-row', row);
        cell.setAttribute('data-col', col);
        cell.style.setProperty('--pad-color', sound.color);
        cell.addEventListener('click', () => toggleCell(row, col, cell));
        seqGrid.appendChild(cell);
        grid[row].push({ active: false, el: cell });
      }
    });

    seqWrap.appendChild(seqGrid);
    container.appendChild(seqWrap);

    // Keyboard support
    document.addEventListener('keydown', onKeyDown);
  }

  function triggerPad(index, padEl) {
    SOUNDS[index].fn();
    padEl.classList.add('pad-hit');
    setTimeout(() => padEl.classList.remove('pad-hit'), 200);
  }

  function onKeyDown(e) {
    if (e.repeat) return;
    const key = e.key.toUpperCase();
    const idx = SOUNDS.findIndex(s => s.key === key);
    if (idx !== -1) triggerPad(idx, pads[idx]);
  }

  function toggleCell(row, col, cell) {
    grid[row][col].active = !grid[row][col].active;
    cell.classList.toggle('seq-active', grid[row][col].active);
  }

  function toggleSequencer(btn) {
    if (isPlaying) {
      stopSequencer();
      btn.innerHTML = '<span class="play-icon">▶</span> Play';
    } else {
      startSequencer();
      btn.innerHTML = '<span class="play-icon">⏸</span> Pause';
    }
  }

  function startSequencer() {
    isPlaying = true;
    currentStep = 0;
    const stepTime = (60 / BPM) * 1000 / 4;
    sequencerInterval = setInterval(() => {
      // clear previous step highlights
      for (let row = 0; row < SOUNDS.length; row++) {
        grid[row].forEach(cell => cell.el.classList.remove('seq-playing'));
      }
      // play current step
      for (let row = 0; row < SOUNDS.length; row++) {
        grid[row][currentStep].el.classList.add('seq-playing');
        if (grid[row][currentStep].active) {
          SOUNDS[row].fn();
        }
      }
      currentStep = (currentStep + 1) % STEPS;
    }, stepTime);
  }

  function stopSequencer() {
    isPlaying = false;
    clearInterval(sequencerInterval);
    for (let row = 0; row < SOUNDS.length; row++) {
      grid[row].forEach(cell => cell.el.classList.remove('seq-playing'));
    }
  }

  function clearGrid(playBtn) {
    stopSequencer();
    playBtn.innerHTML = '<span class="play-icon">▶</span> Play';
    for (let row = 0; row < SOUNDS.length; row++) {
      grid[row].forEach(cell => {
        cell.active = false;
        cell.el.classList.remove('seq-active', 'seq-playing');
      });
    }
  }

  function init(container) {
    if (!container) return;
    build(container);
  }

  return { init };
})();
