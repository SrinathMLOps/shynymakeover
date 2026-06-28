// Gallery Setup
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
    `<div class="marquee-card"${hidden ? ' aria-hidden="true"' : ''}><div class="slide-frame"><img src="${s.src}" alt="${hidden ? '' : s.alt}" loading="lazy"><span class="cap">${s.cap}</span></div></div>`
  ).join('');
  track.innerHTML = build(false) + build(true);
}

// Mobile Menu
const menuBtn = document.getElementById('menuBtn');
const navLinks = document.getElementById('navLinks');
if (menuBtn) {
  menuBtn.addEventListener('click', () => navLinks.classList.toggle('open'));
  navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));
}

// Services Tabs
const tabBtns = document.querySelectorAll('.tab-btn');
const panels = document.querySelectorAll('.tab-panel');
tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    tabBtns.forEach(b => b.classList.remove('active'));
    panels.forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    document.querySelector(`.tab-panel[data-panel="${btn.dataset.tab}"]`)?.classList.add('active');
  });
});

// Custom Cursor (Desktop Only)
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

// ===== MUSIC PLAYER - AUTOPLAY WITH SOUND =====
(function() {
  let ctx = null;
  let masterGain = null;
  let oscillators = [];
  let isPlaying = false;
  let isMuted = false; // Start unmuted (with sound)
  const btn = document.getElementById('musicToggle');
  
  if (!btn) return;

  function initAudioContext() {
    try {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      return true;
    } catch (e) {
      console.log('AudioContext error:', e);
      return false;
    }
  }

  function playSound() {
    if (isPlaying) return;
    
    if (!ctx) {
      if (!initAudioContext()) return;
    }
    
    if (ctx.state === 'suspended') {
      ctx.resume().then(() => {
        playSound();
      }).catch(() => {});
      return;
    }

    try {
      isPlaying = true;
      updateButton();

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 2400;
      
      masterGain = ctx.createGain();
      // Start at full volume if not muted, silent if muted
      masterGain.gain.setValueAtTime(isMuted ? 0.0001 : 0.6, ctx.currentTime);
      
      filter.connect(masterGain);
      masterGain.connect(ctx.destination);

      // Chords (pad)
      const chords = [
        [261.63, 329.63, 392, 493.88],
        [220, 261.63, 329.63, 392],
        [174.61, 220, 261.63, 329.63],
        [196, 246.94, 293.66, 392],
      ];

      chords[0].forEach((freq) => {
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        const g = ctx.createGain();
        g.gain.setValueAtTime(0, ctx.currentTime);
        osc.connect(g);
        g.connect(filter);
        osc.start(ctx.currentTime);
        oscillators.push(osc);

        const swell = () => {
          if (!isPlaying) return;
          const now = ctx.currentTime;
          g.gain.cancelScheduledValues(now);
          g.gain.setValueAtTime(g.gain.value, now);
          g.gain.linearRampToValueAtTime(0.04, now + 3);
          g.gain.linearRampToValueAtTime(0, now + 7);
        };
        swell();
        const swellInterval = setInterval(() => {
          if (!isPlaying) clearInterval(swellInterval);
          else swell();
        }, 7000);
      });

      // Melody
      const melody = [392, 440, 493.88, 440, 392, 329.63, 293.66, 261.63, 293.66, 329.63, 392, 440, 523.25, 440, 392, 329.63];
      let step = 0;

      const playNote = () => {
        if (!isPlaying) return;
        
        const freq = melody[step % melody.length];
        step++;

        try {
          const osc = ctx.createOscillator();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, ctx.currentTime);
          const g = ctx.createGain();
          const now = ctx.currentTime;
          g.gain.setValueAtTime(0.1, now);
          g.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);
          osc.connect(g);
          g.connect(filter);
          osc.start(now);
          osc.stop(now + 1.2);
        } catch (e) {}
        
        if (isPlaying) {
          setTimeout(playNote, 700);
        }
      };

      playNote();
    } catch (e) {
      console.log('Play error:', e);
      stopSound();
    }
  }

  function stopSound() {
    isPlaying = false;
    updateButton();
    
    oscillators.forEach(o => {
      try { 
        o.stop(ctx.currentTime);
      } catch (e) {}
    });
    oscillators = [];
  }

  function updateButton() {
    if (isPlaying && !isMuted) {
      btn.classList.add('playing');
      btn.setAttribute('aria-pressed', 'true');
    } else {
      btn.classList.remove('playing');
      btn.setAttribute('aria-pressed', 'false');
    }
  }

  // Initialize - start autoplay with sound after page loads
  setTimeout(() => {
    if (initAudioContext()) {
      playSound(); // Start playing with sound
      updateButton();
    }
  }, 1000);

  // Button click - toggle mute/unmute
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!ctx) {
      initAudioContext();
    }
    
    if (!isPlaying) {
      // Start playing if not already
      isMuted = false;
      playSound();
    } else {
      // Toggle mute
      isMuted = !isMuted;
      
      if (isMuted && masterGain) {
        // Mute - fade out
        masterGain.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + 0.5);
      } else if (masterGain) {
        // Unmute - fade in
        masterGain.gain.linearRampToValueAtTime(0.6, ctx.currentTime + 1);
      }
    }
    
    updateButton();
  });

  // Resume on interaction for iOS
  const resumeAudio = () => {
    if (ctx && ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }
  };

  document.addEventListener('touchstart', resumeAudio, { once: true, passive: true });
  document.addEventListener('click', resumeAudio, { once: true });
})();
