// ========== GALLERY CAROUSEL ==========
document.addEventListener('DOMContentLoaded', function() {
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
    let html = '';
    // First set
    gallerySlides.forEach(s => {
      html += `<div class="marquee-card"><div class="slide-frame"><img src="${s.src}" alt="${s.alt}" loading="lazy"><span class="cap">${s.cap}</span></div></div>`;
    });
    // Duplicate set for infinite scroll
    gallerySlides.forEach(s => {
      html += `<div class="marquee-card" aria-hidden="true"><div class="slide-frame"><img src="${s.src}" alt="" loading="lazy"><span class="cap">${s.cap}</span></div></div>`;
    });
    track.innerHTML = html;
  }

  // ========== MOBILE MENU ==========
  const menuBtn = document.getElementById('menuBtn');
  const navLinks = document.getElementById('navLinks');
  
  if (menuBtn && navLinks) {
    menuBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      navLinks.classList.toggle('open');
    });
    
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', function() {
        navLinks.classList.remove('open');
      });
    });
  }

  // ========== SERVICES TABS ==========
  const tabBtns = document.querySelectorAll('.tab-btn');
  const panels = document.querySelectorAll('.tab-panel');
  
  tabBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const tabName = btn.dataset.tab;
      
      // Remove active from all
      tabBtns.forEach(b => b.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));
      
      // Add active to current
      btn.classList.add('active');
      const panel = document.querySelector(`.tab-panel[data-panel="${tabName}"]`);
      if (panel) {
        panel.classList.add('active');
      }
    });
  });

  // ========== CUSTOM CURSOR ==========
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

      document.addEventListener('mousemove', function(e) {
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
        el.addEventListener('mouseenter', function() { ring.classList.add('grow'); });
        el.addEventListener('mouseleave', function() { ring.classList.remove('grow'); });
      });
    }
  }
});

// ========== MUSIC PLAYER - UNIVERSAL COMPATIBILITY ==========
(function initMusic() {
  const musicBtn = document.getElementById('musicToggle');
  if (!musicBtn) return;

  let audioContext = null;
  let isPlaying = false;
  let isMuted = false;
  let oscillators = [];

  function updateButton() {
    if (isPlaying && !isMuted) {
      musicBtn.classList.add('playing');
      musicBtn.setAttribute('aria-pressed', 'true');
    } else {
      musicBtn.classList.remove('playing');
      musicBtn.setAttribute('aria-pressed', 'false');
    }
  }

  function createContext() {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      return ctx;
    } catch (e) {
      console.error('AudioContext not available:', e);
      return null;
    }
  }

  function stopAllOscillators() {
    oscillators.forEach(osc => {
      try {
        osc.stop();
      } catch (e) {}
    });
    oscillators = [];
  }

  function startMusic() {
    if (!audioContext) return;
    if (audioContext.state === 'suspended') {
      audioContext.resume().catch(() => {});
    }

    try {
      stopAllOscillators();

      const filter = audioContext.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 2400;

      const masterGain = audioContext.createGain();
      masterGain.gain.setValueAtTime(0.0001, audioContext.currentTime);
      masterGain.gain.linearRampToValueAtTime(0.6, audioContext.currentTime + 2);
      
      filter.connect(masterGain);
      masterGain.connect(audioContext.destination);

      // Create pad chords
      const chords = [
        [261.63, 329.63, 392.00, 493.88],
        [220.00, 261.63, 329.63, 392.00],
        [174.61, 220.00, 261.63, 329.63],
        [196.00, 246.94, 293.66, 392.00],
      ];

      chords[0].forEach((freq, i) => {
        const osc = audioContext.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, audioContext.currentTime);
        const gain = audioContext.createGain();
        gain.gain.setValueAtTime(0, audioContext.currentTime);
        osc.connect(gain);
        gain.connect(filter);
        osc.start(audioContext.currentTime);
        oscillators.push(osc);
      });

      // Melody
      const melody = [392, 440, 493.88, 440, 392, 329.63, 293.66, 261.63, 293.66, 329.63, 392, 440, 523.25, 440, 392, 329.63];
      let step = 0;

      const playNote = () => {
        if (!isPlaying || isMuted) return;
        
        const freq = melody[step % melody.length];
        step++;

        const osc = audioContext.createOscillator();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, audioContext.currentTime);
        
        const gain = audioContext.createGain();
        const now = audioContext.currentTime;
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.3);
        
        osc.connect(gain);
        gain.connect(filter);
        osc.start(now);
        osc.stop(now + 1.3);
        oscillators.push(osc);

        setTimeout(playNote, 700);
      };

      playNote();
      isPlaying = true;
      updateButton();
    } catch (e) {
      console.error('Music start error:', e);
    }
  }

  function stopMusic() {
    stopAllOscillators();
    isPlaying = false;
    updateButton();
  }

  // Initialize on page load
  setTimeout(() => {
    audioContext = createContext();
    updateButton();
  }, 100);

  // Button click handler
  musicBtn.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();

    if (!audioContext) {
      audioContext = createContext();
    }

    if (!isPlaying) {
      isMuted = false;
      startMusic();
    } else {
      isMuted = !isMuted;
      if (isMuted) {
        stopMusic();
      } else {
        startMusic();
      }
    }
  });

  // Resume audio context on first user interaction for iOS
  const resumeAudio = () => {
    if (audioContext && audioContext.state === 'suspended') {
      audioContext.resume().catch(() => {});
    }
    document.removeEventListener('touchstart', resumeAudio);
    document.removeEventListener('click', resumeAudio);
  };

  document.addEventListener('touchstart', resumeAudio, { once: true, passive: true });
  document.addEventListener('click', resumeAudio, { once: true });
})();
