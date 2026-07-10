var Loader = (function () {
  'use strict';

  var partials = [
    { id: 'header', url: 'partials/header.html' },
    { id: 'hero', url: 'partials/hero.html' },
    { id: 'about', url: 'partials/about.html' },
    { id: 'products', url: 'partials/products.html' },
    { id: 'advantages', url: 'partials/advantages.html' },
    { id: 'gallery', url: 'partials/gallery.html' },
    { id: 'testimonials', url: 'partials/testimonials.html' },
    { id: 'faq', url: 'partials/faq.html' },
    { id: 'contact', url: 'partials/contact.html' },
    { id: 'footer', url: 'partials/footer.html' }
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
