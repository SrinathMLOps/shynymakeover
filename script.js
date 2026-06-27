// Gallery carousel
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
if (track) {
  const build = (hidden) => gallerySlides.map(s => 
    `<div class="marquee-card"${hidden ? ' aria-hidden="true"' : ''}>
      <div class="slide-frame">
        <img src="${s.src}" alt="${hidden ? '' : s.alt}" loading="lazy">
        <span class="cap">${s.cap}</span>
      </div>
    </div>`
  ).join('');
  track.innerHTML = build(false) + build(true);
  
  // Force iOS animation restart
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  if (isIOS) {
    setTimeout(() => {
      track.style.animation = 'none';
      setTimeout(() => {
        track.style.animation = '';
      }, 100);
    }, 500);
  }
}

// Mobile menu
const menuBtn = document.getElementById('menuBtn');
const navLinks = document.getElementById('navLinks');
if (menuBtn && navLinks) {
  menuBtn.addEventListener('click', () => navLinks.classList.toggle('open'));
  navLinks.querySelectorAll('a').forEach(a => 
    a.addEventListener('click', () => navLinks.classList.remove('open'))
  );
}

// Services tabs
const tabBtns = document.querySelectorAll('.tab-btn');
const panels = document.querySelectorAll('.tab-panel');
tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    tabBtns.forEach(b => b.classList.remove('active'));
    panels.forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    const panel = document.querySelector(`.tab-panel[data-panel="${btn.dataset.tab}"]`);
    if (panel) panel.classList.add('active');
  });
});

// Custom cursor (desktop only)
if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
  const dot = document.getElementById('cursorDot');
  const trail1 = document.getElementById('cursorTrail1');
  const trail2 = document.getElementById('cursorTrail2');
  const ring = document.getElementById('cursorRing');
  
  if (dot && trail1 && trail2 && ring) {
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

    function animateCursor() {
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
}

// MUSIC - iOS optimized version
(function() {
  const toggleBtn = document.getElementById('musicToggle');
  let ctx = null;
  let masterGain = null;
  let muted = false;
  let audioStarted = false;
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

  function createAudioContext() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) {
        console.log('AudioContext not supported');
        return null;
      }
      const audioCtx = new AudioContext();
      // Resume for iOS
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      return audioCtx;
    } catch (e) {
      console.log('AudioContext error:', e);
      return null;
    }
  }

  function startAudio() {
    if (audioStarted || !ctx) return;
    audioStarted = true;

    try {
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 2400;
      
      masterGain = ctx.createGain();
      masterGain.gain.value = 0.0001;
      filter.connect(masterGain);
      masterGain.connect(ctx.destination);

      // Pad synth
      const chords = [
        [261.63, 329.63, 392.00, 493.88],
        [220.00, 261.63, 329.63, 392.00],
        [174.61, 220.00, 261.63, 329.63],
        [196.00, 246.94, 293.66, 392.00],
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
        osc.start(ctx.currentTime);
        
        const swell = () => {
          const now = ctx.currentTime;
          g.gain.cancelScheduledValues(now);
          g.gain.setValueAtTime(0, now);
          g.gain.linearRampToValueAtTime(0.045, now + 4 + i * 0.3);
          g.gain.linearRampToValueAtTime(0, now + 8 + i * 0.3);
        };
        swell();
        setInterval(swell, 8000);
        return osc;
      });

      setInterval(() => {
        chordIndex = (chordIndex + 1) % chords.length;
        const next = chords[chordIndex];
        padOscs.forEach((osc, i) => {
          osc.frequency.setTargetAtTime(next[i], ctx.currentTime, 1.4);
        });
      }, 8000);

      // Melody
      const melody = [392, 440, 493.88, 440, 392, 329.63, 293.66, 261.63, 293.66, 329.63, 392, 440, 523.25, 440, 392, 329.63];
      let step = 0;
      const delay = ctx.createDelay();
      delay.delayTime.value = 0.5;
      const feedback = ctx.createGain();
      feedback.gain.value = 0.32;
      delay.connect(feedback);
      feedback.connect(delay);
      delay.connect(filter);

      const pluck = () => {
        if (!audioStarted) return;
        const freq = melody[step % melody.length];
        const beat = step % melody.length;
        step++;
        
        try {
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

          if (beat % 4 === 0) {
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
        } catch (e) {
          console.log('Pluck error:', e);
        }
      };
      
      pluck();
      setInterval(pluck, 700);

      // Fade in
      if (masterGain) {
        masterGain.gain.linearRampToValueAtTime(0.8, ctx.currentTime + 2.5);
      }
    } catch (e) {
      console.log('Audio setup error:', e);
    }
  }

  function updateIcon(playing) {
    if (!toggleBtn) return;
    toggleBtn.classList.toggle('playing', playing);
    toggleBtn.setAttribute('aria-pressed', playing ? 'true' : 'false');
    toggleBtn.setAttribute('aria-label', playing ? 'Stop music' : 'Play music');
  }

  function tryResume() {
    if (!ctx) {
      ctx = createAudioContext();
      if (!ctx) return;
    }

    if (ctx.state === 'suspended') {
      ctx.resume().then(() => {
        startAudio();
        updateIcon(!muted);
      }).catch(e => console.log('Resume error:', e));
    } else if (!audioStarted) {
      startAudio();
      updateIcon(!muted);
    }
  }

  // Initialize with iOS detection
  setTimeout(() => {
    ctx = createAudioContext();
    if (ctx) {
      if (isIOS) {
        // iOS requires user gesture - wait for interaction
        const events = ['touchstart', 'click'];
        const handler = () => {
          tryResume();
          events.forEach(e => document.removeEventListener(e, handler));
        };
        events.forEach(e => document.addEventListener(e, handler, { once: true }));
      } else {
        // Android can start immediately
        if (ctx.state === 'suspended') {
          const handler = () => {
            tryResume();
            document.removeEventListener('click', handler);
          };
          document.addEventListener('click', handler, { once: true });
        } else {
          startAudio();
        }
      }
    }
  }, 500);

  updateIcon(!muted);

  // Toggle button
  if (toggleBtn) {
    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();
      
      if (!ctx) {
        ctx = createAudioContext();
      }
      
      if (!audioStarted && ctx) {
        if (ctx.state === 'suspended') {
          ctx.resume().then(() => {
            startAudio();
            muted = false;
            updateIcon(!muted);
          }).catch(e => console.log('Resume error:', e));
        } else {
          startAudio();
          muted = false;
          updateIcon(!muted);
        }
      } else if (masterGain && ctx) {
        muted = !muted;
        if (muted) {
          masterGain.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + 0.6);
        } else {
          masterGain.gain.linearRampToValueAtTime(0.8, ctx.currentTime + 1);
        }
        updateIcon(!muted);
      }
    });
  }
})();
