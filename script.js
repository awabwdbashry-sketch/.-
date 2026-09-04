/* =====================================================
   جنة النخيل — Luxury Resort JavaScript
   ===================================================== */

'use strict';

/* ===== HERO SLIDER ===== */
(function () {
  const slides = document.querySelectorAll('.hero-slide');
  const dots   = document.querySelectorAll('#sliderDots .dot');
  const prevBtn = document.getElementById('heroPrev');
  const nextBtn = document.getElementById('heroNext');
  let current = 0;
  let timer   = null;
  const INTERVAL = 5500;

  function goTo(index) {
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = (index + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
  }

  function startAuto() {
    timer = setInterval(() => goTo(current + 1), INTERVAL);
  }

  function resetAuto() {
    clearInterval(timer);
    startAuto();
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => { goTo(current - 1); resetAuto(); });
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', () => { goTo(current + 1); resetAuto(); });
  }

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      goTo(parseInt(dot.dataset.index));
      resetAuto();
    });
  });

  // Touch/swipe support for hero slider
  let touchStartX = 0;
  const heroEl = document.querySelector('.hero');
  if (heroEl) {
    heroEl.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    heroEl.addEventListener('touchend', e => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) { goTo(diff > 0 ? current + 1 : current - 1); resetAuto(); }
    });
  }

  startAuto();
})();


/* ===== STICKY NAVBAR ===== */
(function () {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  let lastScroll = 0;

  function onScroll() {
    const y = window.scrollY;
    if (y > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    lastScroll = y;
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();


/* ===== ACTIVE NAV LINK ON SCROLL ===== */
(function () {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function updateActive() {
    let current = '';
    const scrollY = window.scrollY + 120;

    sections.forEach(sec => {
      if (scrollY >= sec.offsetTop) current = sec.id;
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', updateActive, { passive: true });
  updateActive();
})();


/* ===== MOBILE MENU ===== */
(function () {
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  // Create overlay element
  const overlay = document.createElement('div');
  overlay.className = 'nav-overlay';
  document.body.appendChild(overlay);

  function openMenu() {
    navLinks.classList.add('open');
    hamburger.classList.add('open');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    navLinks.classList.remove('open');
    hamburger.classList.remove('open');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (hamburger) {
    hamburger.addEventListener('click', () => {
      if (navLinks.classList.contains('open')) closeMenu();
      else openMenu();
    });
  }

  overlay.addEventListener('click', closeMenu);

  // Close on nav link click
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', closeMenu);
  });
})();


/* ===== SMOOTH SCROLL ===== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 72;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});


/* ===== SCROLL REVEAL ===== */
(function () {
  const reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;

  const obs = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger children inside grids
        const delay = Math.min(i * 0.05, 0.4);
        entry.target.style.transitionDelay = delay + 's';
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  reveals.forEach(el => obs.observe(el));

  // Stagger siblings in grids
  document.querySelectorAll('.rooms-grid, .apt-grid, .rest-grid, .facilities-grid, .activities-grid, .contact-info').forEach(grid => {
    Array.from(grid.children).forEach((child, idx) => {
      if (child.classList.contains('reveal')) {
        child.style.transitionDelay = (idx * 0.09) + 's';
      }
    });
  });
})();


/* ===== ANIMATED COUNTERS ===== */
(function () {
  const stats = document.querySelectorAll('.stat-number[data-target]');
  if (!stats.length) return;

  function formatNum(n, target) {
    if (target >= 1000) {
      return (n / 1000).toFixed(n >= target ? 0 : 1) + 'K';
    }
    return Math.ceil(n).toString();
  }

  function animateCounter(el) {
    const target = parseInt(el.dataset.target);
    const duration = 2200;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Easing: ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = eased * target;
      el.textContent = formatNum(value, target);
      if (progress < 1) requestAnimationFrame(update);
      else el.textContent = formatNum(target, target);
    }

    requestAnimationFrame(update);
  }

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  stats.forEach(el => obs.observe(el));
})();


/* ===== TESTIMONIALS SLIDER ===== */
(function () {
  const slider = document.getElementById('testimonialsSlider');
  const prevBtn = document.getElementById('testPrev');
  const nextBtn = document.getElementById('testNext');
  const dotsWrap = document.getElementById('testDots');
  if (!slider) return;

  const cards = slider.querySelectorAll('.testimonial-card');
  let current = 0;
  let autoTimer = null;
  const INTERVAL = 5000;

  // Build dots
  cards.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'test-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', 'انتقال للتعليق ' + (i + 1));
    dot.addEventListener('click', () => { goTo(i); resetAuto(); });
    dotsWrap.appendChild(dot);
  });

  function getDots() { return dotsWrap.querySelectorAll('.test-dot'); }

  function goTo(index) {
    const len = cards.length;
    current = ((index % len) + len) % len;
    slider.style.transform = `translateX(${current * 100}%)`;
    getDots().forEach((d, i) => d.classList.toggle('active', i === current));
  }

  function startAuto() {
    autoTimer = setInterval(() => goTo(current + 1), INTERVAL);
  }

  function resetAuto() {
    clearInterval(autoTimer);
    startAuto();
  }

  if (prevBtn) prevBtn.addEventListener('click', () => { goTo(current - 1); resetAuto(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { goTo(current + 1); resetAuto(); });

  // Touch
  let touchStart = 0;
  slider.addEventListener('touchstart', e => { touchStart = e.touches[0].clientX; }, { passive: true });
  slider.addEventListener('touchend', e => {
    const diff = touchStart - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) { goTo(diff > 0 ? current + 1 : current - 1); resetAuto(); }
  });

  startAuto();
})();


/* ===== GALLERY LIGHTBOX ===== */
const galleryImages = [];

(function () {
  const items = document.querySelectorAll('.gallery-item');
  items.forEach(item => {
    const img = item.querySelector('img');
    const cap = item.querySelector('.gallery-caption');
    galleryImages.push({
      src: img ? img.src : '',
      alt: img ? img.alt : '',
      caption: cap ? cap.textContent : ''
    });
  });
})();

let currentLightboxIndex = 0;

function openLightbox(el) {
  const lb   = document.getElementById('lightbox');
  const lbImg = document.getElementById('lightboxImg');
  const lbCap = document.getElementById('lightboxCaption');
  if (!lb || !lbImg) return;

  const items = document.querySelectorAll('.gallery-item');
  let idx = 0;
  items.forEach((item, i) => { if (item === el) idx = i; });
  currentLightboxIndex = idx;

  lbImg.src = galleryImages[idx].src;
  lbImg.alt = galleryImages[idx].alt;
  if (lbCap) lbCap.textContent = galleryImages[idx].caption;

  lb.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  const lb = document.getElementById('lightbox');
  if (lb) lb.classList.remove('active');
  document.body.style.overflow = '';
}

function changeLightbox(dir) {
  const len = galleryImages.length;
  currentLightboxIndex = ((currentLightboxIndex + dir) + len) % len;
  const lbImg = document.getElementById('lightboxImg');
  const lbCap = document.getElementById('lightboxCaption');
  if (lbImg) {
    lbImg.src = galleryImages[currentLightboxIndex].src;
    lbImg.alt = galleryImages[currentLightboxIndex].alt;
  }
  if (lbCap) lbCap.textContent = galleryImages[currentLightboxIndex].caption;
}

// Close on ESC / keyboard arrows
document.addEventListener('keydown', e => {
  const lb = document.getElementById('lightbox');
  if (!lb || !lb.classList.contains('active')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft')  changeLightbox(1);
  if (e.key === 'ArrowRight') changeLightbox(-1);
});


/* ===== BOOKING FORM VALIDATION ===== */
(function () {
  const form = document.getElementById('bookingForm');
  if (!form) return;

  function showErr(id, msg) {
    const el = document.getElementById(id);
    if (el) el.textContent = msg;
  }

  function clearErrs() {
    ['checkinErr','checkoutErr','guestsErr','roomErr','nameErr','emailErr'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.textContent = '';
    });
    form.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
  }

  function addError(fieldId, errId, msg) {
    const field = document.getElementById(fieldId);
    if (field) field.classList.add('error');
    showErr(errId, msg);
    return false;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    clearErrs();

    const checkin   = document.getElementById('checkin');
    const checkout  = document.getElementById('checkout');
    const guests    = document.getElementById('guests');
    const roomType  = document.getElementById('roomType');
    const guestName = document.getElementById('guestName');
    const guestEmail= document.getElementById('guestEmail');

    let valid = true;
    const today = new Date(); today.setHours(0,0,0,0);

    if (!checkin.value) {
      addError('checkin','checkinErr','يرجى تحديد تاريخ الوصول'); valid = false;
    } else if (new Date(checkin.value) < today) {
      addError('checkin','checkinErr','يجب أن يكون تاريخ الوصول في المستقبل'); valid = false;
    }

    if (!checkout.value) {
      addError('checkout','checkoutErr','يرجى تحديد تاريخ المغادرة'); valid = false;
    } else if (checkin.value && new Date(checkout.value) <= new Date(checkin.value)) {
      addError('checkout','checkoutErr','تاريخ المغادرة يجب أن يكون بعد تاريخ الوصول'); valid = false;
    }

    if (!guests.value) {
      addError('guests','guestsErr','يرجى تحديد عدد الضيوف'); valid = false;
    }

    if (!roomType.value) {
      addError('roomType','roomErr','يرجى اختيار نوع الإقامة'); valid = false;
    }

    if (!guestName.value.trim() || guestName.value.trim().length < 3) {
      addError('guestName','nameErr','يرجى إدخال الاسم الكامل (3 أحرف على الأقل)'); valid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!guestEmail.value.trim() || !emailRegex.test(guestEmail.value.trim())) {
      addError('guestEmail','emailErr','يرجى إدخال بريد إلكتروني صحيح'); valid = false;
    }

    if (valid) {
      // Simulate submission
      const btn = form.querySelector('.btn-submit');
      btn.disabled = true;
      btn.innerHTML = '<span>جاري الإرسال...</span>';

      setTimeout(() => {
        const success = document.getElementById('formSuccess');
        if (success) success.style.display = 'block';
        btn.innerHTML = '<span>تحقق من الإتاحة</span><span class="btn-arrow">←</span>';
        btn.disabled = false;
        form.reset();

        // Scroll to success message
        success.scrollIntoView({ behavior: 'smooth', block: 'center' });

        // Hide after 6 seconds
        setTimeout(() => { if (success) success.style.display = 'none'; }, 6000);
      }, 1800);
    }
  });
})();


/* ===== SCROLL TO TOP ===== */
(function () {
  const btn = document.getElementById('scrollTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) btn.classList.add('visible');
    else btn.classList.remove('visible');
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();


/* ===== NEWSLETTER SUBSCRIPTION ===== */
function subscribeNewsletter() {
  const input = document.getElementById('newsletterEmail');
  if (!input) return;

  const email = input.value.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email || !emailRegex.test(email)) {
    input.style.borderColor = '#ef4444';
    input.placeholder = 'بريد إلكتروني غير صحيح';
    setTimeout(() => {
      input.style.borderColor = '';
      input.placeholder = 'بريدك الإلكتروني';
    }, 2500);
    return;
  }

  input.value = '';
  input.placeholder = '✅ تم الاشتراك بنجاح!';
  input.style.borderColor = '#22c55e';
  setTimeout(() => {
    input.placeholder = 'بريدك الإلكتروني';
    input.style.borderColor = '';
  }, 3000);
}


/* ===== PARALLAX EFFECT (subtle) ===== */
(function () {
  const statsBg = document.querySelector('.stats-bg');
  const bookingBg = document.querySelector('.booking-bg');

  function onScroll() {
    const y = window.scrollY;

    if (statsBg) {
      const rect = statsBg.parentElement.getBoundingClientRect();
      const offset = rect.top * 0.25;
      statsBg.style.transform = `translateY(${offset}px)`;
    }
  }

  // Only run on non-mobile for performance
  if (window.innerWidth > 768) {
    window.addEventListener('scroll', onScroll, { passive: true });
  }
})();


/* ===== HOVER EFFECT: Room card price highlight ===== */
document.querySelectorAll('.room-card').forEach(card => {
  card.addEventListener('mouseenter', () => {
    const price = card.querySelector('.room-price');
    if (price) price.style.color = '#2A9D8F';
  });
  card.addEventListener('mouseleave', () => {
    const price = card.querySelector('.room-price');
    if (price) price.style.color = '';
  });
});


/* ===== IMAGE LAZY LOAD FALLBACK ===== */
document.querySelectorAll('img[loading="lazy"]').forEach(img => {
  img.addEventListener('error', function () {
    this.style.background = '#E5E7EB';
    this.style.minHeight = '200px';
    this.alt = 'الصورة غير متاحة';
  });
});


/* ===== BOOKING FORM: Min date setup ===== */
(function () {
  const checkin  = document.getElementById('checkin');
  const checkout = document.getElementById('checkout');
  if (!checkin || !checkout) return;

  const today = new Date().toISOString().split('T')[0];
  checkin.min  = today;
  checkout.min = today;

  checkin.addEventListener('change', () => {
    if (checkin.value) {
      const next = new Date(checkin.value);
      next.setDate(next.getDate() + 1);
      checkout.min = next.toISOString().split('T')[0];
      if (checkout.value && checkout.value <= checkin.value) {
        checkout.value = next.toISOString().split('T')[0];
      }
    }
  });
})();


/* ===== TYPING ANIMATION FOR HERO (enhancement) ===== */
(function () {
  // Subtle pulse on the hero badge every 4 seconds
  const badges = document.querySelectorAll('.hero-badge');
  badges.forEach(badge => {
    setInterval(() => {
      badge.style.transform = 'scale(1.05)';
      badge.style.transition = 'transform 0.3s ease';
      setTimeout(() => {
        badge.style.transform = 'scale(1)';
      }, 300);
    }, 4000);
  });
})();


/* ===== ROOMS FILTER TABS (optional enhancement) ===== */
(function () {
  // Reveal stagger: re-assign delays for rooms and apts
  function setStaggerDelays(gridSelector) {
    const grid = document.querySelector(gridSelector);
    if (!grid) return;
    Array.from(grid.children).forEach((child, idx) => {
      child.style.transitionDelay = (idx * 0.07) + 's';
    });
  }

  setStaggerDelays('.rooms-grid');
  setStaggerDelays('.apt-grid');
  setStaggerDelays('.rest-grid');
  setStaggerDelays('.facilities-grid');
})();


/* ===== PRELOADER (optional) ===== */
(function () {
  window.addEventListener('load', () => {
    document.body.classList.add('loaded');
  });
})();


/* ===== CONSOLE BRANDING ===== */
console.log('%c🌴 جنة النخيل — Luxury Resort & Spa', 'color:#2A9D8F;font-size:1.4rem;font-weight:bold;');
console.log('%cموقع رسمي • 5 نجوم • تصميم احترافي', 'color:#DDB892;font-size:0.9rem;');
