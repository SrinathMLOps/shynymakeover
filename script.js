
  // gallery photos (embedded so they always load, no external files needed)
  const gallerySlides = [
    {src:'assets/p1.jpg', alt:'Bridal close-up makeup look', cap:'Bridal Close-up'},
    {src:'assets/p7.jpg', alt:'Traditional bridal look with maang tikka and layered necklaces', cap:'Traditional Bridal Look'},
    {src:'assets/p8.jpg', alt:'Traditional braided bridal hairstyle', cap:'Traditional Braid'},
    {src:'assets/p4.jpg', alt:'Bridal back embroidery and hairstyle detail', cap:'Reception Saree'},
    {src:'assets/p5.jpg', alt:'Bride in silk saree with traditional jewellery', cap:'Silk Saree Look'},
    {src:'assets/p6.jpg', alt:'Curled hairstyle with floral hair clip', cap:'Curls & Floral Clip'},
    {src:'assets/p9.jpg', alt:'Half Saree Function look with traditional styling', cap:'Half Saree Function'},
    {src:'assets/p10.jpg', alt:'Bridesmaid makeup with elegant gold saree', cap:'Bridesmaid Makeup'},
    {src:'assets/p11.jpg', alt:'Puberty ceremony traditional look with jewelry and saree', cap:'Puberty Ceremony'},
  ];
  const track = document.getElementById('marqueeTrack');
  if (track){
    const build = (hidden) => gallerySlides.map(s => `<div class="marquee-card"${hidden ? ' aria-hidden="true"' : ''}><div class="slide-frame"><img src="${s.src}" alt="${hidden ? '' : s.alt}" loading="lazy"><span class="cap">${s.cap}</span></div></div>`).join('');
    track.innerHTML = build(false) + build(true);
  }

  // mobile menu
  const menuBtn = document.getElementById('menuBtn');
  const navLinks = document.getElementById('navLinks');
  menuBtn.addEventListener('click', () => navLinks.classList.toggle('open'));
  navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));

  // Prevent body scroll when menu is open (mobile optimization)
  document.addEventListener('touchmove', (e) => {
    if (navLinks.classList.contains('open')) {
      e.preventDefault();
    }
  }, { passive: false });

  // services tabs
  const tabBtns = document.querySelectorAll('.tab-btn');
  const panels = document.querySelectorAll('.tab-panel');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      document.querySelector(`.tab-panel[data-panel="${btn.dataset.tab}"]`).classList.add('active');
    });
  });

  // custom mouse cursor: dot + two trailing dots + lagging ring, only on mouse-capable devices
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches){
    const dot = document.getElementById('cursorDot');
    const trail1 = document.getElementById('cursorTrail1');
    const trail2 = document.getElementById('cursorTrail2');
    const ring = document.getElementById('cursorRing');
    let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
    let t1X = mouseX, t1Y = mouseY;
    let t2X = mouseX, t2Y = mouseY;
    let ringX = mouseX, ringY = mouseY;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.left = mouseX + 'px';
      dot.style.top = mouseY + 'px';
    });

    function animateCursor(){
      t1X += (mouseX - t1X) * 0.28;
      t1Y += (mouseY - t1Y) * 0.28;
      trail1.style.left = t1X + 'px';
      trail1.style.top = t1Y + 'px';

      t2X += (t1X - t2X) * 0.22;
      t2Y += (t1Y - t2Y) * 0.22;
      trail2.style.left = t2X + 'px';
      trail2.style.top = t2Y + 'px';

      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      ring.style.left = ringX + 'px';
      ring.style.top = ringY + 'px';

      requestAnimationFrame(animateCursor);
    }
    animateCursor();

    document.querySelectorAll('a, button, .slide-frame, .tab-btn').forEach(el => {
      el.addEventListener('mouseenter', () => ring.classList.add('grow'));
      el.addEventListener('mouseleave', () => ring.classList.remove('grow'));
    });
  }

  // ---------- original ambient background music (generated in-browser, no audio file needed) ----------
  (function(){
    const toggleBtn = document.getElementById('musicToggle');
    let ctx = null, masterGain = null, muted = false, resumed = false;

    function buildEngine(){
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 2400;
      masterGain = ctx.createGain();
      masterGain.gain.value = 0.0001;
      filter.connect(masterGain);
      masterGain.connect(ctx.destination);

      // slow-moving 4-chord pad progression (Cmaj7 - Am7 - Fmaj7 - G), gliding between chords
      const chords = [
        [261.63, 329.63, 392.00, 493.88], // C maj7 — C E G B
        [220.00, 261.63, 329.63, 392.00], // A min7 — A C E G
        [174.61, 220.00, 261.63, 329.63], // F maj7 — F A C E
        [196.00, 246.94, 293.66, 392.00], // G       — G B D G
      ];
      let chordIndex = 0;
      const padOscs = chords[0].map((f, i) => {
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.value = f;
        const g = ctx.createGain();
        g.gain.value = 0;
        osc.connect(g);
        g.connect(filter);
        osc.start();
        const swell = () => {
          const now = ctx.currentTime;
          g.gain.cancelScheduledValues(now);
          g.gain.setValueAtTime(g.gain.value, now);
          g.gain.linearRampToValueAtTime(0.045, now + 4 + i * 0.3);
          g.gain.linearRampToValueAtTime(0.0, now + 8 + i * 0.3);
        };
        swell();
        setInterval(swell, 8000);
        return osc;
      });
      // glide to the next chord every 8 seconds for a slowly evolving, lush harmony
      setInterval(() => {
        chordIndex = (chordIndex + 1) % chords.length;
        const next = chords[chordIndex];
        padOscs.forEach((osc, i) => {
          osc.frequency.setTargetAtTime(next[i], ctx.currentTime, 1.4);
        });
      }, 8000);

      // a longer, gently rising-and-falling melodic phrase (diatonic to C major)
      const melody = [
        392.00, 440.00, 493.88, 440.00, 392.00, 329.63, 293.66, 261.63,
        293.66, 329.63, 392.00, 440.00, 523.25, 440.00, 392.00, 329.63
      ];
      let step = 0;
      const delay = ctx.createDelay();
      delay.delayTime.value = 0.5;
      const feedback = ctx.createGain();
      feedback.gain.value = 0.32;
      delay.connect(feedback);
      feedback.connect(delay);
      delay.connect(filter);

      const pluck = () => {
        const freq = melody[step % melody.length];
        const beat = step % melody.length;
        step++;
        const osc = ctx.createOscillator();
        osc.type = 'triangle';
        osc.frequency.value = freq;
        const g = ctx.createGain();
        const now = ctx.currentTime;
        g.gain.setValueAtTime(0.0001, now);
        g.gain.exponentialRampToValueAtTime(0.15, now + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, now + 1.3);
        osc.connect(g);
        g.connect(filter);
        g.connect(delay);
        osc.start(now);
        osc.stop(now + 1.4);

        // a soft high shimmer bell every fourth note, like distant wind chimes
        if (beat % 4 === 0){
          const bell = ctx.createOscillator();
          bell.type = 'sine';
          bell.frequency.value = freq * 2;
          const bg = ctx.createGain();
          bg.gain.setValueAtTime(0.0001, now);
          bg.gain.exponentialRampToValueAtTime(0.05, now + 0.04);
          bg.gain.exponentialRampToValueAtTime(0.0001, now + 2.2);
          bell.connect(bg);
          bg.connect(filter);
          bg.connect(delay);
          bell.start(now);
          bell.stop(now + 2.3);
        }
      };
      pluck();
      setInterval(pluck, 700);

      // fade the whole mix in gently once audible
      masterGain.gain.linearRampToValueAtTime(0.8, ctx.currentTime + 2.5);
    }

    function setIcon(playing){
      toggleBtn.classList.toggle('playing', playing);
      toggleBtn.setAttribute('aria-pressed', playing ? 'true' : 'false');
      toggleBtn.setAttribute('aria-label', playing ? 'Stop background music' : 'Play background music');
    }

    // build the music engine immediately — no click needed to "start" it on our side
    buildEngine();
    setIcon(true);

    // browsers require a user gesture before sound is actually audible;
    // resume the instant any interaction happens, with no prompt or dialog
    function tryResume(){
      if (resumed || muted) return;
      if (ctx.state === 'suspended'){
        ctx.resume().then(() => { resumed = true; cleanup(); });
      } else {
        resumed = true;
        cleanup();
      }
    }
    function cleanup(){
      ['click','touchstart','keydown','pointerdown','scroll','mousemove'].forEach(evt => {
        window.removeEventListener(evt, tryResume);
      });
    }
    ['click','touchstart','keydown','pointerdown','scroll','mousemove'].forEach(evt => {
      window.addEventListener(evt, tryResume, { passive:true });
    });
    tryResume(); // in case the browser allows it right away

    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (muted){
        muted = false;
        if (ctx.state === 'suspended') ctx.resume();
        masterGain.gain.linearRampToValueAtTime(0.8, ctx.currentTime + 1);
        setIcon(true);
      } else {
        muted = true;
        masterGain.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + 0.6);
        setIcon(false);
      }
    });
  })();
