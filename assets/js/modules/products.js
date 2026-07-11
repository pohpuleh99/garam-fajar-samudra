var Products = (function () {
  'use strict';

  var data = [
    {
      name: 'Garam Krosok',
      subtitle: 'Tradisional',
      image: 'assets/images/product-1.svg',
      description: 'Garam tradisional khas pesisir Blitar. Tekstur kasar, kaya mineral alami, cocok untuk konsumsi sehari-hari dan industri.',
      price: 'Rp 5.000 / kg'
    },
    {
      name: 'White Salt',
      subtitle: 'Premium',
      image: 'assets/images/product-2.svg',
      description: 'Garam putih premium dengan kristal bersih dan halus. Ideal untuk restoran, hotel, dan kebutuhan kuliner kelas atas.',
      price: 'Rp 12.000 / kg'
    },
    {
      name: 'Blue Salt',
      subtitle: 'Inovatif',
      image: 'assets/images/product-3.svg',
      description: 'Garam fungsional dengan ekstrak alami. Memberikan cita rasa unik dan kaya manfaat untuk hidangan spesial.',
      price: 'Rp 18.000 / kg'
    },
    {
      name: 'Yellow Salt',
      subtitle: 'Fungsional',
      image: 'assets/images/product-4.svg',
      description: 'Garam khusus untuk sektor perikanan dan peternakan. Membantu meningkatkan kualitas hasil budidaya secara alami.',
      price: 'Rp 15.000 / kg'
    }
  ];

  function render() {
    var grid = document.getElementById('productGrid');
    if (!grid) return;

    grid.innerHTML = '';

    var staggerClasses = ['stagger-1', 'stagger-2', 'stagger-3', 'stagger-4'];

    data.forEach(function (product, index) {
      var card = document.createElement('div');
      card.className = 'product-card animate ' + (staggerClasses[index] || '');
      card.setAttribute('role', 'listitem');
      card.innerHTML =
        '<div class="product-card__media">' +
          '<img class="product-card__image" src="' + product.image + '" alt="' + product.name + ' - ' + product.subtitle + '" loading="lazy">' +
          '<span class="product-card__subtitle">' + product.subtitle + '</span>' +
        '</div>' +
        '<div class="product-card__body">' +
          '<h3 class="product-card__title">' + product.name + '</h3>' +
          '<p class="product-card__description">' + product.description + '</p>' +
          '<span class="product-card__price">' + product.price + '</span>' +
        '</div>';
      grid.appendChild(card);
    });
  }

  return { render: render };
})();
