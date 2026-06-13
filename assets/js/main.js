/* ==========================================================================
   Marines — main.js
   Minimal deferred JavaScript for:
   1. Mobile navigation toggle
   2. Scroll-triggered animations (IntersectionObserver)
   3. Active navigation highlighting
   4. Animated stat counters
   ========================================================================== */

(function () {
  'use strict';

  /* -----------------------------------------------------------------------
     1. MOBILE NAVIGATION TOGGLE
     ----------------------------------------------------------------------- */
  const hamburger = document.getElementById('nav-toggle');
  const mobileMenu = document.getElementById('nav-mobile');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', function () {
      const isOpen = hamburger.getAttribute('aria-expanded') === 'true';
      hamburger.setAttribute('aria-expanded', String(!isOpen));
      mobileMenu.classList.toggle('is-open');
    });

    // Close mobile menu on link click
    mobileMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        hamburger.setAttribute('aria-expanded', 'false');
        mobileMenu.classList.remove('is-open');
      });
    });
  }

  /* -----------------------------------------------------------------------
     2. SCROLL-TRIGGERED ANIMATIONS
     ----------------------------------------------------------------------- */
  var animatedElements = document.querySelectorAll('.animate-on-scroll');

  if (animatedElements.length > 0 && 'IntersectionObserver' in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    animatedElements.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    // Fallback: show all immediately
    animatedElements.forEach(function (el) {
      el.classList.add('is-visible');
    });
  }

  /* -----------------------------------------------------------------------
     3. ACTIVE NAVIGATION HIGHLIGHTING
     ----------------------------------------------------------------------- */
  var sections = document.querySelectorAll('section[id]');
  var navLinks = document.querySelectorAll('.nav__links a[href^="#"]');

  function updateActiveNav() {
    var scrollPos = window.scrollY + 120;

    sections.forEach(function (section) {
      var top = section.offsetTop;
      var height = section.offsetHeight;
      var id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(function (link) {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + id) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });
  updateActiveNav();

  /* -----------------------------------------------------------------------
     4. ANIMATED STAT COUNTERS
     ----------------------------------------------------------------------- */
  var statValues = document.querySelectorAll('.stat__value');

  if (statValues.length > 0 && 'IntersectionObserver' in window) {
    var statsObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            statsObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    statValues.forEach(function (el) {
      statsObserver.observe(el);
    });
  }

  function animateCounter(el) {
    var text = el.textContent.trim();
    // Extract leading number and keep the rest as suffix (e.g., "24/7" → 24, "/7")
    var match = text.match(/^(\d+)(.*)/);
    if (!match) return;

    var target = parseInt(match[1], 10);
    var suffix = match[2];

    if (isNaN(target)) return;

    var duration = 1200;
    var startTime = null;

    function step(currentTime) {
      if (!startTime) startTime = currentTime;
      var progress = Math.min((currentTime - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      var current = Math.round(eased * target);

      el.textContent = current + suffix;

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }

    requestAnimationFrame(step);
  }

  /* -----------------------------------------------------------------------
     5. NAV SCROLL SHADOW
     ----------------------------------------------------------------------- */
  var nav = document.querySelector('.nav');

  if (nav) {
    function updateNavShadow() {
      if (window.scrollY > 10) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    }

    window.addEventListener('scroll', updateNavShadow, { passive: true });
    updateNavShadow();
  }
})();
