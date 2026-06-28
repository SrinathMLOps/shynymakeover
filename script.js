// Gallery Setup
const gallerySlides = [
  // Braid and Bun - 14 images
  {src:'assets/braid_and_bun/braid_bun_1.jpg?v=2', alt:'Elegant braided bun hairstyle', cap:''},
  {src:'assets/braid_and_bun/braid_bun_2.jpg?v=2', alt:'Traditional juda with flowers', cap:''},
  {src:'assets/braid_and_bun/braid_bun_3.jpg?v=2', alt:'Contemporary braided hairstyle', cap:''},
  {src:'assets/braid_and_bun/braid_bun_4.jpg?v=2', alt:'Bridal bun with accessories', cap:''},
  {src:'assets/braid_and_bun/braid_bun_5.jpg?v=2', alt:'Embellished braided updo', cap:''},
  {src:'assets/braid_and_bun/braid_bun_6.jpg?v=2', alt:'Side braid traditional style', cap:''},
  {src:'assets/braid_and_bun/braid_bun_7.jpg?v=2', alt:'Braided hairstyle with jewels', cap:''},
  {src:'assets/braid_and_bun/braid_bun_8.jpg?v=2', alt:'Elegant updo hairstyle', cap:''},
  {src:'assets/braid_and_bun/braid_bun_9.jpg?v=2', alt:'Bridal braided look', cap:''},
  {src:'assets/braid_and_bun/braid_bun_10.jpg?v=2', alt:'Traditional bun styling', cap:''},
  {src:'assets/braid_and_bun/braid_bun_11.jpg?v=2', alt:'Festival braid hairstyle', cap:''},
  {src:'assets/braid_and_bun/braid_bun_12.jpg?v=2', alt:'Tiered bun with flowers', cap:''},
  {src:'assets/braid_and_bun/braid_bun_13.jpg?v=2', alt:'Crown braid styling', cap:''},
  {src:'assets/braid_and_bun/braid_bun_14.jpg?v=2', alt:'Twisted bun hairstyle', cap:''},
  
  // Makeup - 10 images
  {src:'assets/makeup/makeup_1.jpg?v=2', alt:'Bold bridal eye makeup', cap:''},
  {src:'assets/makeup/makeup_2.jpg?v=2', alt:'Soft glam makeup', cap:''},
  {src:'assets/makeup/makeup_3.jpg?v=2', alt:'HD airbrush finish', cap:''},
  {src:'assets/makeup/makeup_4.jpg?v=2', alt:'South Indian bridal makeup', cap:''},
  {src:'assets/makeup/makeup_5.jpg?v=2', alt:'Reception glam', cap:''},
  {src:'assets/makeup/makeup_6.jpg?v=2', alt:'Traditional makeup look', cap:''},
  {src:'assets/makeup/makeup_7.jpg?v=2', alt:'Party makeup glam', cap:''},
  {src:'assets/makeup/makeup_8.jpg?v=2', alt:'Sangeet makeup', cap:''},
  {src:'assets/makeup/makeup_9.jpg?v=2', alt:'Bridal close-up', cap:''},
  {src:'assets/makeup/makeup_10.jpg?v=2', alt:'Mehendi ceremony makeup', cap:''},
  
  // Kids Grooming - 16 images
  {src:'assets/kids_grooming/kids_grooming_1.jpg?v=2', alt:'Kids cute hairstyle', cap:''},
  {src:'assets/kids_grooming/kids_grooming_2.jpg?v=2', alt:'Child hair with accessories', cap:''},
  {src:'assets/kids_grooming/kids_grooming_3.jpg?v=2', alt:'Young bride look', cap:''},
  {src:'assets/kids_grooming/kids_grooming_4.jpg?v=2', alt:'Kids traditional styling', cap:''},
  {src:'assets/kids_grooming/kids_grooming_5.jpg?v=2', alt:'Child makeup', cap:''},
  {src:'assets/kids_grooming/kids_grooming_6.jpg?v=2', alt:'Kids bridal look', cap:''},
  {src:'assets/kids_grooming/kids_grooming_7.jpg?v=2', alt:'Child flower hairstyle', cap:''},
  {src:'assets/kids_grooming/kids_grooming_8.jpg?v=2', alt:'Kids fancy hairstyle', cap:''},
  {src:'assets/kids_grooming/kids_grooming_9.jpg?v=2', alt:'Child party look', cap:''},
  {src:'assets/kids_grooming/kids_grooming_10.jpg?v=2', alt:'Kids ceremony look', cap:''},
  {src:'assets/kids_grooming/kids_grooming_11.jpg?v=2', alt:'Child hairstyle design', cap:''},
  {src:'assets/kids_grooming/kids_grooming_12.jpg?v=2', alt:'Kids elegant look', cap:''},
  {src:'assets/kids_grooming/kids_grooming_13.jpg?v=2', alt:'Child makeup and hair', cap:''},
  {src:'assets/kids_grooming/kids_grooming_14.jpg?v=2', alt:'Kids wedding look', cap:''},
  {src:'assets/kids_grooming/kids_grooming_15.jpg?v=2', alt:'Child traditional look', cap:''},
  {src:'assets/kids_grooming/kids_grooming_16.jpg?v=2', alt:'Kids special occasion', cap:''},
  
  // Original single bridal image
  {src:'assets/p11.jpg?v=2', alt:'Puberty ceremony look', cap:''},
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

// ===== MUSIC PLAYER - FULL AUTOPLAY WITH SOUND =====
(function() {
  let ctx = null;
  let masterGain = null;
  let oscillators = [];
  let isPlaying = false;
  let isMuted = false;
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
      ctx.resume().then(playSound).catch(() => {});
      return;
    }

    try {
      isPlaying = true;
      updateButton();

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 2400;
      
      masterGain = ctx.createGain();
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

  // Trigger autoplay on first user interaction
  const autoPlayOnce = () => {
    if (!isPlaying && initAudioContext()) {
      playSound();
    }
    document.removeEventListener('click', autoPlayOnce);
    document.removeEventListener('touchstart', autoPlayOnce);
  };

  // Start on any click/touch anywhere on page (required by browser policy)
  document.addEventListener('click', autoPlayOnce, { once: true });
  document.addEventListener('touchstart', autoPlayOnce, { once: true, passive: true });

  // Also try on DOMContentLoaded and after 2 seconds
  window.addEventListener('load', () => {
    setTimeout(() => {
      if (!isPlaying && initAudioContext()) {
        playSound();
      }
    }, 500);
  });

  // Button click - toggle mute/unmute
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!ctx) {
      initAudioContext();
    }
    
    if (!isPlaying) {
      isMuted = false;
      playSound();
    } else {
      isMuted = !isMuted;
      
      if (isMuted && masterGain) {
        masterGain.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + 0.5);
      } else if (masterGain) {
        masterGain.gain.linearRampToValueAtTime(0.6, ctx.currentTime + 1);
      }
    }
    
    updateButton();
  });
})();


// ===== LOAD STORED REVIEWS INTO TESTIMONIALS =====
(function() {
  // Delay to ensure DOM is fully ready
  setTimeout(() => {
    const testiTrack = document.querySelector('.testi-track');
    if (!testiTrack) {
      console.log('Testimonials track not found');
      return;
    }

    console.log('Starting review loader...');

    // Load reviews from localStorage
    const reviews = JSON.parse(localStorage.getItem('shyniReviews')) || [];
    
    console.log('Found', reviews.length, 'reviews in localStorage');
    
    if (reviews.length > 0) {
      console.log('Loading reviews:', reviews);
      
      // Get existing cards (only original ones, not duplicates)
      const allCards = Array.from(testiTrack.querySelectorAll('.testi-card'));
      const visibleCards = allCards.filter(card => !card.hasAttribute('aria-hidden'));
      const hiddenCards = allCards.filter(card => card.hasAttribute('aria-hidden'));
      
      console.log('Visible cards:', visibleCards.length, 'Hidden cards:', hiddenCards.length);
      
      // Create review cards HTML for visible set
      const reviewHTMLs = reviews.map(r => {
        const stars = '★'.repeat(r.rating) + '☆'.repeat(5 - r.rating);
        return `<div class="testi-card"><div class="stars">${stars}</div><p>"${r.review}"</p><div class="who"><strong>${r.name}</strong>${r.city}</div></div>`;
      });

      // Add new reviews to visible set
      if (visibleCards.length > 0) {
        const lastVisibleCard = visibleCards[visibleCards.length - 1];
        reviewHTMLs.forEach(html => {
          const tempDiv = document.createElement('div');
          tempDiv.innerHTML = html;
          lastVisibleCard.parentNode.insertBefore(tempDiv.firstChild, lastVisibleCard.nextSibling);
        });
        console.log('Added reviews to visible set');
      }

      // Create review cards HTML for hidden duplicate set
      const hiddenReviewHTMLs = reviews.map(r => {
        const stars = '★'.repeat(r.rating) + '☆'.repeat(5 - r.rating);
        return `<div class="testi-card" aria-hidden="true"><div class="stars">${stars}</div><p>"${r.review}"</p><div class="who"><strong>${r.name}</strong>${r.city}</div></div>`;
      });

      // Add to hidden duplicate set
      hiddenReviewHTMLs.forEach(html => {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;
        testiTrack.appendChild(tempDiv.firstChild);
      });
      console.log('Added reviews to hidden duplicate set');

      // Recalculate animation duration
      const newCardCount = testiTrack.querySelectorAll('.testi-card').length;
      const cardWidth = 340 + 14; // card width + gap
      const estimatedWidth = (newCardCount / 2) * cardWidth;
      const newDuration = (estimatedWidth / 200) * 46;
      
      console.log('New total cards:', newCardCount, 'New duration:', newDuration + 's');
      testiTrack.style.animationDuration = newDuration + 's';
      console.log('Animation duration updated');
    } else {
      console.log('No reviews found in localStorage');
    }
  }, 150);
})();
