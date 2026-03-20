/* ================================================================
   MARIA TEJASWI | PORTFOLIO — script.js
   ================================================================

   TABLE OF CONTENTS
   -----------------
   1.  Loading Screen          — hides loading overlay after page loads
   2.  Particle Canvas         — animated dot network on the background
   3.  Custom Cursor           — dot + glow that tracks the mouse

    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    const prefersReducedMotion =
      window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const count = window.innerWidth < 768 ? 42 : 68;
    const particles = [];

    const spawnParticle = (startAtBottom = false) => ({
      x: Math.random() * w,
      y: startAtBottom ? h + Math.random() * h * 0.35 : Math.random() * h,
      size: Math.random() * 2.4 + 1.1,
      speed: Math.random() * 0.8 + 0.25,
      drift: (Math.random() - 0.5) * 0.45,
      alpha: Math.random() * 0.45 + 0.25,
      twinkle: Math.random() * 0.01 + 0.005,
      phase: Math.random() * Math.PI * 2,
    });

    for (let i = 0; i < count; i++) {
      particles.push(spawnParticle());
    }

    function draw(time = 0) {
      ctx.clearRect(0, 0, w, h);

      particles.forEach((p) => {
        if (!prefersReducedMotion) {
          p.y -= p.speed;
          p.x += p.drift + Math.sin(time * 0.001 + p.phase) * 0.08;
        }

        if (p.y < -p.size * 2 || p.x < -20 || p.x > w + 20) {
          Object.assign(p, spawnParticle(true));
        }

        const pulse = 0.65 + Math.sin(time * p.twinkle + p.phase) * 0.35;
        const alpha = p.alpha * pulse;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 1.8, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(148, 87, 255, ${alpha * 0.18})`;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(196, 149, 255, ${alpha})`;
        ctx.fill();
      });

      if (!prefersReducedMotion) {
        requestAnimationFrame(draw);
      }
    }

    draw();

    window.addEventListener("resize", () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      particles.forEach((p) => {
        p.x = Math.min(p.x, w);
        p.y = Math.min(p.y, h);
      });
    });
   ================================================================ */
function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const prefersReducedMotion =
    window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const DPR_CAP = 1.5;
  const dpr = Math.min(window.devicePixelRatio || 1, DPR_CAP);
  let w = window.innerWidth;
  let h = window.innerHeight;

  function resize() {
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize();
  window.addEventListener('resize', resize);

  const count = Math.max(48, Math.min(120, Math.floor((w * h) / 18000)));
  const particles = new Array(count);

  function rand(min, max) {
    return Math.random() * (max - min) + min;
  }

  function resetParticle(index, spawnFromBottom) {
    const life = rand(5000, 13000); // random animation duration (ms)
    const travel = rand(h * 0.35, h * 0.78);
    const p = particles[index] || {};

    p.baseX = rand(0, w);
    p.startY = spawnFromBottom ? h + rand(6, 80) : rand(0, h);
    p.size = rand(1.2, 3.4);
    p.age = spawnFromBottom ? 0 : rand(0, life);
    p.life = life;
    p.travel = travel;
    p.baseAlpha = rand(0.34, 0.85);
    p.driftAmp = rand(6, 22);
    p.driftFreq = rand(0.8, 2.2);
    p.phase = rand(0, Math.PI * 2);
    p.twinkle = rand(0.0015, 0.0045);
    p.tint = Math.random() < 0.78 ? 'violet' : 'white';

    particles[index] = p;
  }

  for (let i = 0; i < particles.length; i++) {
    resetParticle(i, false);
  }

  let lastTime = performance.now();

  function draw(now) {
    const dt = Math.min(now - lastTime, 32);
    lastTime = now;
    ctx.clearRect(0, 0, w, h);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      if (!prefersReducedMotion) {
        p.age += dt;
      }

      if (p.age >= p.life) {
        resetParticle(i, true);
        continue;
      }

      const t = p.age / p.life;
      const y = p.startY - p.travel * t;
      const x = p.baseX + Math.sin(t * Math.PI * 2 * p.driftFreq + p.phase) * p.driftAmp;

      if (y < -40) {
        resetParticle(i, true);
        continue;
      }

      const fade = (1 - t) * (0.9 + 0.28 * Math.sin(now * p.twinkle + p.phase));
      const alpha = p.baseAlpha * Math.max(0, fade);

      if (p.tint === 'violet') {
        ctx.fillStyle = `rgba(176, 126, 255, ${alpha * 0.35})`;
      } else {
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.32})`;
      }
      ctx.beginPath();
      ctx.arc(x, y, p.size * 2.35, 0, Math.PI * 2);
      ctx.fill();

      if (p.tint === 'violet') {
        ctx.fillStyle = `rgba(221, 198, 255, ${alpha * 1.1})`;
      } else {
        ctx.fillStyle = `rgba(245, 243, 255, ${alpha * 1.05})`;
      }
      ctx.beginPath();
      ctx.arc(x, y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }

    if (!prefersReducedMotion) {
      requestAnimationFrame(draw);
    }
  }

  draw(lastTime);
}


/* ================================================================
   3. CUSTOM CURSOR
   - #cursor-dot  : follows the mouse instantly (no lag)
   - #cursor-glow : follows with smooth easing (lags behind slightly)
   Both elements are <div>s positioned via transform in style.css.
   ================================================================ */
function initCursor() {
  const dot  = document.getElementById('cursor-dot');
  const glow = document.getElementById('cursor-glow');

  // Current mouse position
  let mouseX = 0, mouseY = 0;
  // Glow's smoothed position (starts at 0,0 and catches up)
  let glowX  = 0, glowY  = 0;

  // Update raw mouse position on every move
  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    // Dot follows the mouse exactly (no transition needed)
    dot.style.transform = `translate(${mouseX - 4}px, ${mouseY - 4}px)`;
  });

  // Smooth glow via lerp (linear interpolation) in rAF loop
  function animateGlow() {
    // Move glow 8% of the remaining distance each frame → easing effect
    glowX += (mouseX - glowX) * 0.08;
    glowY += (mouseY - glowY) * 0.08;
    glow.style.transform = `translate(${glowX - 150}px, ${glowY - 150}px)`;
    requestAnimationFrame(animateGlow);
  }
  animateGlow();
}


/* ================================================================
   4. SCROLL PROGRESS BAR
   Updates the width of #scroll-progress-bar (0%–100%) based on
   how far the user has scrolled down the page.
   ================================================================ */
function initScrollProgressBar() {
  const bar = document.getElementById('scroll-progress-bar');

  window.addEventListener('scroll', () => {
    const scrollTop  = window.scrollY;
    const docHeight  = document.documentElement.scrollHeight - window.innerHeight;
    const percentage = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width  = percentage + '%';
  }, { passive: true }); // passive: true = better scroll performance
}


/* ================================================================
   5. NAVBAR SCROLL EFFECT
   Adds the .scrolled class to <nav> once the user scrolls past
   30px. The CSS .scrolled rule applies the glassmorphism style.
   ================================================================ */
function initNavbarScroll() {
  const navbar = document.getElementById('navbar');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 30);
  }, { passive: true });
}


/* ================================================================
   6. ACTIVE NAV LINK
   Uses IntersectionObserver to detect which section is currently
   in view and adds the .active class to its matching nav button.
   ================================================================ */
function initActiveNavLink() {
  // IDs of all sections we track
  const sectionIds = ['hero', 'about', 'skills', 'projects', 'experience', 'achievements', 'contact'];

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      // Remove .active from all links
      document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));

      // Add .active to the link matching the visible section
      const activeLink = document.querySelector(`.nav-link[data-section="${entry.target.id}"]`);
      if (activeLink) activeLink.classList.add('active');
    });
  }, {
    // Trigger when 40% of the section enters the viewport from either side
    rootMargin: '-40% 0px -55% 0px',
  });

  sectionIds.forEach(id => {
    const el = document.getElementById(id);
    if (el) observer.observe(el);
  });
}


/* ================================================================
   7. MOBILE MENU TOGGLE
   Called by onclick on the hamburger button in index.html.
   Opens/closes the mobile dropdown menu.
   ================================================================ */
function toggleMobileMenu() {
  const menu = document.getElementById('mobile-menu');
  menu.classList.toggle('open');
}


/* ================================================================
   8. SMOOTH SCROLL HELPER
   Used by onclick attributes throughout index.html so every
   "scroll to section" call goes through one consistent function.
   ================================================================ */
function smoothScrollTo(sectionId) {
  const el = document.getElementById(sectionId);
  if (el) el.scrollIntoView({ behavior: 'smooth' });

  // Also close mobile menu if it was open
  document.getElementById('mobile-menu').classList.remove('open');
}


/* ================================================================
   9. SCROLL ANIMATIONS
   Watches every element with .animate-fade-up, .animate-slide-left,
   or .animate-slide-right. When the element enters the viewport it
   gets the .visible class — the CSS transition then plays.
   ================================================================ */
function initScrollAnimations() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Once played, stop watching (animation won't repeat)
        observer.unobserve(entry.target);
      }
    });
  }, {
    rootMargin: '-8% 0px -8% 0px', // trigger slightly inside the viewport
  });

  // Select all animatable elements
  const animatables = document.querySelectorAll(
    '.animate-fade-up, .animate-slide-left, .animate-slide-right'
  );
  animatables.forEach(el => observer.observe(el));
}


/* ================================================================
   10. TIMELINE LINE GROW
   The vertical line in the Education timeline starts at height 0
   and grows to full height when the About section becomes visible.
   ================================================================ */
function initTimelineLine() {
  const line    = document.getElementById('timeline-line');
  const section = document.getElementById('about');
  if (!line || !section) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Animate to full height — CSS transition does the rest
        line.style.height = 'calc(100% - 16px)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.25 });

  observer.observe(section);
}


/* ================================================================
   11. TYPEWRITER EFFECT
   Cycles through an array of role strings, typing them character
   by character and deleting them before moving to the next one.

   Phases:
     'typing'  — adds characters until the string is complete
     'pausing' — waits 1.8 s before starting to delete
     'deleting' — removes characters from the end
   ================================================================ */
function initTypewriter() {
  const roles = [
    'Full Stack Developer',
    'Software Developer',
    'MERN Stack Engineer',
  ];

  const textEl = document.getElementById('typewriter-text');
  if (!textEl) return;

  let roleIndex = 0;    // which role string we're currently on
  let charIndex = 0;    // how many characters are currently displayed
  let phase     = 'typing'; // current animation phase

  function tick() {
    const currentRole = roles[roleIndex];

    if (phase === 'typing') {
      // Add one character
      charIndex++;
      textEl.textContent = currentRole.slice(0, charIndex);

      if (charIndex === currentRole.length) {
        // Finished typing → pause before deleting
        phase = 'pausing';
        setTimeout(tick, 1800);
      } else {
        setTimeout(tick, 80); // type speed: 80 ms per character
      }

    } else if (phase === 'pausing') {
      // Just waiting — switch to deleting
      phase = 'deleting';
      tick();

    } else if (phase === 'deleting') {
      // Remove one character
      charIndex--;
      textEl.textContent = currentRole.slice(0, charIndex);

      if (charIndex === 0) {
        // Finished deleting → move to next role
        roleIndex = (roleIndex + 1) % roles.length;
        phase = 'typing';
        setTimeout(tick, 300); // brief pause before typing next role
      } else {
        setTimeout(tick, 45); // delete speed: 45 ms per character
      }
    }
  }

  tick(); // kick off the animation
}


/* ================================================================
   12. COUNTER ANIMATION
   Each .ach-card has a data-target attribute (the final number).
   When the achievements section scrolls into view, all counters
   animate from 0 up to their target value over 2 seconds using
   an ease-in-out curve.

   HTML attributes used:
     data-target  — final number  (e.g. 100, 7.95, 30)
     data-float   — "true" if the number has decimal places
   ================================================================ */
function initCounters() {
  const achGrid = document.getElementById('ach-grid');
  if (!achGrid) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      // Animate every counter inside the grid
      achGrid.querySelectorAll('.ach-card').forEach(card => {
        const target    = parseFloat(card.dataset.target);
        const isFloat   = card.dataset.float === 'true';
        const counterEl = card.querySelector('.counter');
        if (!counterEl) return;

        const DURATION = 2000; // ms
        let startTime  = null;

        function step(timestamp) {
          if (!startTime) startTime = timestamp;

          const elapsed  = timestamp - startTime;
          const progress = Math.min(elapsed / DURATION, 1);

          // Ease-in-out formula
          const eased = progress < 0.5
            ? 2 * progress * progress
            : 1 - Math.pow(-2 * progress + 2, 2) / 2;

          const currentValue = target * eased;

          // Display with or without decimal places
          counterEl.textContent = isFloat
            ? currentValue.toFixed(2)
            : Math.floor(currentValue);

          if (progress < 1) {
            requestAnimationFrame(step);
          } else {
            // Snap to exact final value
            counterEl.textContent = isFloat ? target.toFixed(2) : target;
          }
        }

        requestAnimationFrame(step);
      });

      observer.unobserve(entry.target); // run once
    });
  }, { threshold: 0.3 });

  observer.observe(achGrid);
}


/* ================================================================
   13. CONTACT FORM VALIDATION
   Called by the onclick on the submit button in index.html.
   Validates all fields, shows inline error messages, and on
   success shows a confirmation message for 4 seconds.
   ================================================================ */
async function submitContactForm() {
  // Grab field values
  const name    = document.getElementById('form-name').value.trim();
  const email   = document.getElementById('form-email').value.trim();
  const subject = document.getElementById('form-subject').value.trim();
  const message = document.getElementById('form-message').value.trim();

  let isValid = true;

  // --- Helper: show or clear an error message ---
  function setError(fieldId, errorId, condition, message) {
    const field = document.getElementById(fieldId);
    const error = document.getElementById(errorId);

    if (condition) {
      // Show error
      error.textContent = message;
      field.classList.add('invalid');
      isValid = false;
    } else {
      // Clear error
      error.textContent = '';
      field.classList.remove('invalid');
    }
  }

  // --- Validate each field ---
  setError('form-name', 'err-name', !name, 'Name is required.');

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  setError('form-email', 'err-email', !emailRegex.test(email), 'Please enter a valid email address.');

  setError('form-subject', 'err-subject', !subject, 'Subject is required.');

  setError('form-message', 'err-message', message.length < 10, 'Message must be at least 10 characters.');

  // --- Stop here if validation failed ---
  if (!isValid) return;

  const btn     = document.getElementById('submit-btn');
  const btnText = document.getElementById('submit-btn-text');
  const originalText = '✉ Send Message';

  // Prevent duplicate submissions while request is in-flight.
  btn.disabled = true;
  btnText.textContent = 'Sending...';

  try {
    const response = await fetch('https://formspree.io/f/mreydbqo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        name,
        email,
        subject,
        message,
        _subject: `Portfolio Contact: ${subject}`,
      }),
    });

    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(result.message || 'Unable to send message.');
    }

    btn.classList.add('sent');
    btnText.textContent = '✓ Message Sent!';

    // Clear all fields after successful delivery.
    document.getElementById('form-name').value    = '';
    document.getElementById('form-email').value   = '';
    document.getElementById('form-subject').value = '';
    document.getElementById('form-message').value = '';

    setTimeout(() => {
      btn.classList.remove('sent');
      btnText.textContent = originalText;
    }, 4000);
  } catch (error) {
    btn.classList.remove('sent');
    btnText.textContent = 'Failed - Try Again';
    if (error && error.message) {
      console.error('Contact form error:', error.message);
    }

    setTimeout(() => {
      btnText.textContent = originalText;
    }, 3000);
  } finally {
    btn.disabled = false;
  }
}


/* ================================================================
   14. LOADING SCREEN
   Hides the full-screen loading overlay after the page is ready.
   ================================================================ */
function initLoadingScreen() {
  const loadingScreen = document.getElementById('loading-screen');
  if (!loadingScreen) return;

  window.setTimeout(() => {
    loadingScreen.classList.add('hidden');
    // Remove node after fade-out so it never blocks interactions.
    window.setTimeout(() => loadingScreen.remove(), 700);
  }, 900);
}


/* ================================================================
   15. APP BOOTSTRAP
   Initializes all UI behaviors once DOM is available.
   ================================================================ */
function initAll() {
  initLoadingScreen();
  initParticles();
  initCursor();
  initScrollProgressBar();
  initNavbarScroll();
  initActiveNavLink();
  initScrollAnimations();
  initTimelineLine();
  initTypewriter();
  initCounters();
}

document.addEventListener('DOMContentLoaded', initAll);
