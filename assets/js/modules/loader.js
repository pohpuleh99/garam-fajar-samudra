var Loader = (function () {
  'use strict';

  var partials = [
    { id: 'header', url: 'partials/header.html' },
    { id: 'hero', url: 'partials/hero.html' },
    { id: 'about', url: 'partials/about.html?v=20260715-2' },
    { id: 'products', url: 'partials/products.html?v=20260715-2' },
    { id: 'advantages', url: 'partials/advantages.html' },
    { id: 'gallery', url: 'partials/gallery.html?v=20260715-2' },
    { id: 'testimonials', url: 'partials/testimonials.html' },
    { id: 'faq', url: 'partials/faq.html?v=20260715-2' },
    { id: 'contact', url: 'partials/contact.html?v=20260715-2' },
    { id: 'footer', url: 'partials/footer.html?v=20260715-2' }
  ];

  function inject(id, html) {
    var el = document.getElementById(id);
    if (el) {
      el.outerHTML = html;
    }
  }

  function loadAll(callback) {
    var loaded = 0;
    var total = partials.length;

    partials.forEach(function (p) {
      fetch(p.url)
        .then(function (res) { return res.text(); })
        .then(function (html) {
          inject(p.id, html);
          loaded++;
          if (loaded >= total && callback) {
            callback();
          }
        })
        .catch(function () {
          loaded++;
          if (loaded >= total && callback) {
            callback();
          }
        });
    });
  }

  return { loadAll: loadAll };
})();
