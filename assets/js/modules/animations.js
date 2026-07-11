var Animations = (function () {
  'use strict';

  function init() {
    var elements = document.querySelectorAll('.animate');

    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate--visible');
            observer.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
      });

      elements.forEach(function (el) {
        observer.observe(el);
      });

      var waveObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            waveObserver.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.05,
        rootMargin: '0px 0px -10% 0px'
      });

      document.querySelectorAll('.wave').forEach(function (el) {
        waveObserver.observe(el);
      });
    } else {
      elements.forEach(function (el) {
        el.classList.add('animate--visible');
      });
      document.querySelectorAll('.wave').forEach(function (el) {
        el.classList.add('is-visible');
      });
    }

    initParallax();
    initWaveParallax();
  }

  function initParallax() {
    var heroBg = document.querySelector('.hero__bg');
    if (!heroBg) return;

    var ticking = false;
    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(function () {
          var scrollY = window.pageYOffset;
          var speed = 0.35;
          heroBg.style.transform = 'translateY(' + (scrollY * speed) + 'px)';
          ticking = false;
        });
        ticking = true;
      }
    });
  }

  function initWaveParallax() {
    var waves = document.querySelectorAll('.wave');
    if (!waves.length) return;

    var ticking = false;
    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(function () {
          var vh = window.innerHeight;
          waves.forEach(function (wave) {
            var rect = wave.getBoundingClientRect();
            var center = rect.top + rect.height / 2;
            var delta = (center - vh / 2) / vh;
            var offset = delta * -28;
            wave.style.transform = 'translateY(' + offset.toFixed(2) + 'px)';
          });
          ticking = false;
        });
        ticking = true;
      }
    });
  }

  return { init: init };
})();
