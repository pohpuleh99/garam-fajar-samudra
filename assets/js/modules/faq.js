var FAQ = (function () {
  'use strict';

  function init() {
    var items = document.querySelectorAll('.faq-item');

    items.forEach(function (item) {
      var question = item.querySelector('.faq-item__question');
      if (!question) return;

      question.addEventListener('click', function () {
        var isOpen = item.classList.contains('faq-item--open');

        items.forEach(function (other) {
          other.classList.remove('faq-item--open');
          var q = other.querySelector('.faq-item__question');
          if (q) q.setAttribute('aria-expanded', 'false');
        });

        if (!isOpen) {
          item.classList.add('faq-item--open');
          question.setAttribute('aria-expanded', 'true');
        }
      });
    });
  }

  return { init: init };
})();
