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
    } else {
      elements.forEach(function (el) {
        el.classList.add('animate--visible');
      });
    }

    initParallax();
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

  return { init: init };
})();
