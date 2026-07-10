var HeaderModule = (function () {
  'use strict';

  function init() {
    var header = document.querySelector('.header');
    var toggleBtn = document.querySelector('.header__toggle');
    var navMenu = document.querySelector('.header__nav');

    if (!header) return;

    window.addEventListener('scroll', function () {
      var scroll = window.pageYOffset || document.documentElement.scrollTop;
      header.classList.toggle('header--scrolled', scroll > 80);
    }, { passive: true });

    if (toggleBtn && navMenu) {
      toggleBtn.addEventListener('click', function () {
        var isOpen = navMenu.classList.toggle('header__nav--open');
        toggleBtn.classList.toggle('header__toggle--active');
        toggleBtn.setAttribute('aria-expanded', isOpen);
      });

      document.querySelectorAll('.header__nav-link').forEach(function (link) {
        link.addEventListener('click', function () {
          navMenu.classList.remove('header__nav--open');
          toggleBtn.classList.remove('header__toggle--active');
          toggleBtn.setAttribute('aria-expanded', 'false');
        });
      });
    }
  }

  return { init: init };
})();
